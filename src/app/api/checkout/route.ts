import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function POST(req: Request) {
  try {
    const { giftId, guestName, guestMessage, amount } = await req.json();

    if (!giftId || !guestName || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, message: "Dados incompletos ou inválidos." },
        { status: 400 }
      );
    }

    // ── Valida presente no Firestore ──────────────────────────────────────────
    const giftDocRef = db.collection("gifts").doc(giftId);
    const giftDoc = await giftDocRef.get();

    if (!giftDoc.exists) {
      return NextResponse.json(
        { success: false, message: "Presente não encontrado no catálogo." },
        { status: 404 }
      );
    }

    const giftData = giftDoc.data();

    if (giftData?.is_purchased && !giftData?.is_crowdfunding) {
      return NextResponse.json(
        { success: false, message: "Este presente já foi comprado por outro convidado!" },
        { status: 400 }
      );
    }

    // ── Registra intenção de pagamento ────────────────────────────────────────
    const pendingRef = db.collection("pending_contributions").doc();
    const order_nsu = pendingRef.id;

    await pendingRef.set({
      id: order_nsu,
      gift_id: giftId,
      gift_name: giftData?.name,
      guest_name: guestName,
      guest_message: guestMessage || "",
      amount: Number(amount),
      status: "pending",
      created_at: new Date(),
    });

    // ── Cria cobrança PIX no Mercado Pago ─────────────────────────────────────
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken) {
      console.error("[Checkout] MERCADOPAGO_ACCESS_TOKEN não configurado.");
      return NextResponse.json(
        { success: false, message: "Configuração de pagamento ausente no servidor." },
        { status: 500 }
      );
    }

    const mpPayload = {
      transaction_amount: Number(amount),
      description: `Casamento: ${giftData?.name} (De: ${guestName})`,
      payment_method_id: "pix",
      external_reference: order_nsu,
      payer: {
        email: "convidado@casamento.com.br",
        first_name: guestName.split(" ")[0] || "Convidado",
        last_name: guestName.split(" ").slice(1).join(" ") || "Casamento",
      },
    };

    const mpResponse = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Idempotency-Key": order_nsu,
      },
      body: JSON.stringify(mpPayload),
    });

    if (!mpResponse.ok) {
      const errorText = await mpResponse.text();
      console.error("[Checkout] Erro na API do Mercado Pago:", errorText);
      return NextResponse.json(
        { success: false, message: "Não foi possível gerar o PIX. Tente novamente." },
        { status: 502 }
      );
    }

    const mpData = await mpResponse.json();

    const pixCode = mpData?.point_of_interaction?.transaction_data?.qr_code;
    const mpPaymentId = mpData?.id;

    if (!pixCode) {
      console.error("[Checkout] Mercado Pago não retornou qr_code:", JSON.stringify(mpData));
      return NextResponse.json(
        { success: false, message: "PIX não retornado pelo Mercado Pago." },
        { status: 502 }
      );
    }

    // Salva o ID do pagamento MP no pending para o webhook encontrar depois
    await pendingRef.update({ mp_payment_id: String(mpPaymentId) });

    return NextResponse.json({
      success: true,
      pixCode,
      order_nsu,
      message: "PIX gerado com sucesso!",
    });
  } catch (error: any) {
    console.error("[Checkout] Erro interno:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor ao criar PIX." },
      { status: 500 }
    );
  }
}
