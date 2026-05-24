import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { createHmac, timingSafeEqual } from "crypto";

// Verifica a assinatura do webhook do Mercado Pago.
// Formato do header x-signature: "ts=1704908010,v1=abc123..."
// Template assinado: "id:{data.id};request-id:{x-request-id};ts:{ts};"
function verifyMercadoPagoSignature(
  paymentId: string,
  requestId: string | null,
  xSignature: string | null,
  secret: string
): boolean {
  if (!xSignature || !secret) return false;

  try {
    const parts = Object.fromEntries(
      xSignature.split(",").map((p) => p.split("=") as [string, string])
    );
    const ts = parts["ts"];
    const v1 = parts["v1"];

    if (!ts || !v1) return false;

    const manifest = `id:${paymentId};request-id:${requestId ?? ""};ts:${ts};`;
    const expected = createHmac("sha256", secret).update(manifest).digest("hex");

    return timingSafeEqual(Buffer.from(v1), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    let body: any;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, message: "Payload inválido." }, { status: 400 });
    }

    console.log("[Webhook MP] Payload recebido:", JSON.stringify(body));

    // Mercado Pago envia type="payment" e data.id com o ID do pagamento
    if (body?.type !== "payment" || !body?.data?.id) {
      return NextResponse.json({ success: true, message: "Notificação ignorada." }, { status: 200 });
    }

    const mpPaymentId = String(body.data.id);

    // ── Valida assinatura ─────────────────────────────────────────────────────
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET || "";
    const xSignature = req.headers.get("x-signature");
    const xRequestId = req.headers.get("x-request-id");

    if (webhookSecret) {
      const isValid = verifyMercadoPagoSignature(mpPaymentId, xRequestId, xSignature, webhookSecret);
      if (!isValid) {
        console.warn("[Webhook MP] Assinatura inválida para payment:", mpPaymentId);
        return NextResponse.json({ success: false, message: "Não autorizado." }, { status: 401 });
      }
    }

    // ── Busca detalhes do pagamento no Mercado Pago ───────────────────────────
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${mpPaymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!mpRes.ok) {
      console.error("[Webhook MP] Erro ao buscar pagamento:", mpPaymentId);
      return NextResponse.json({ success: false, message: "Erro ao consultar pagamento." }, { status: 502 });
    }

    const payment = await mpRes.json();

    if (payment.status !== "approved") {
      console.log(`[Webhook MP] Pagamento ${mpPaymentId} ignorado. Status: ${payment.status}`);
      return NextResponse.json({ success: true, message: "Status ignorado." }, { status: 200 });
    }

    const order_nsu: string = payment.external_reference;

    if (!order_nsu) {
      console.error("[Webhook MP] external_reference ausente no pagamento:", mpPaymentId);
      return NextResponse.json({ success: false, message: "Referência do pedido ausente." }, { status: 400 });
    }

    // ── Idempotência: evita processar o mesmo pagamento duas vezes ────────────
    const contributionsRef = db.collection("contributions");
    const duplicate = await contributionsRef.where("payment_id", "==", mpPaymentId).get();

    if (!duplicate.empty) {
      console.log(`[Webhook MP] Pagamento ${mpPaymentId} já processado. Ignorando.`);
      return NextResponse.json({ success: true, duplicated: true }, { status: 200 });
    }

    // ── Busca pedido pendente ─────────────────────────────────────────────────
    const pendingDocRef = db.collection("pending_contributions").doc(order_nsu);
    const pendingDoc = await pendingDocRef.get();

    if (!pendingDoc.exists) {
      console.error(`[Webhook MP] Pedido pendente ${order_nsu} não encontrado.`);
      return NextResponse.json({ success: false, message: "Pedido não encontrado." }, { status: 404 });
    }

    const pendingData = pendingDoc.data();

    // ── Atualiza Firestore em lote ────────────────────────────────────────────
    const batch = db.batch();

    batch.update(pendingDocRef, { status: "completed", processed_at: new Date() });

    const giftDocRef = db.collection("gifts").doc(pendingData?.gift_id);
    const giftDoc = await giftDocRef.get();

    if (!giftDoc.exists) {
      console.error(`[Webhook MP] Presente ${pendingData?.gift_id} não encontrado.`);
      return NextResponse.json({ success: false, message: "Presente não encontrado." }, { status: 404 });
    }

    const giftData = giftDoc.data();
    const currentCollected = Number(giftData?.amount_collected || 0);
    const newCollected = currentCollected + Number(pendingData?.amount);
    const isCrowdfunding = !!giftData?.is_crowdfunding;
    const isFullyPaid = isCrowdfunding ? newCollected >= Number(giftData?.value || 0) : true;

    batch.update(giftDocRef, {
      amount_collected: newCollected,
      is_purchased: isFullyPaid,
    });

    const contributionDocRef = contributionsRef.doc();
    batch.set(contributionDocRef, {
      id: contributionDocRef.id,
      gift_id: pendingData?.gift_id,
      gift_name: pendingData?.gift_name,
      guest_name: pendingData?.guest_name,
      guest_message: pendingData?.guest_message,
      amount: Number(pendingData?.amount),
      payment_id: mpPaymentId,
      order_nsu,
      created_at: new Date(),
    });

    await batch.commit();

    console.log(
      `[Webhook MP] Contribuição de R$ ${pendingData?.amount} confirmada para "${pendingData?.gift_name}" (De: ${pendingData?.guest_name}).`
    );

    return NextResponse.json({ success: true, message: "Webhook processado com sucesso!" }, { status: 200 });
  } catch (error: any) {
    console.error("[Webhook MP] Erro interno:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor.", error: error.message },
      { status: 500 }
    );
  }
}
