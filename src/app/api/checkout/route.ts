import { NextResponse } from "next/server";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import * as fs from "fs";
import * as path from "path";

// Código PIX simulado para modo demo/teste (formato EMV válido para gerar QR code)
const DEMO_PIX_CODE =
  "00020126580014br.gov.bcb.pix0136demo-pix-key-casamento@email.com5204000053039865802BR5925CASAMENTO DEMO PRESENTE6009SAO PAULO62070503***6304DEMO";

export async function POST(req: Request) {
  try {
    const { giftId, guestName, guestMessage, amount } = await req.json();

    if (!giftId || !guestName || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, message: "Dados incompletos ou inválidos." },
        { status: 400 }
      );
    }

    // ── MODO DEMO (sem Firebase) ──────────────────────────────────────────────
    if (!isFirebaseConfigured) {
      console.log("[Checkout API] Firebase não configurado. Ativando Modo Demo.");

      let giftName = "Presente Simbólico de Casamento";
      try {
        const configPath = path.join(process.cwd(), "backup-vanilla", "config.json");
        if (fs.existsSync(configPath)) {
          const fileData = fs.readFileSync(configPath, "utf-8");
          const config = JSON.parse(fileData);
          const matchedGift = config.gifts?.find((g: any) => g.id === giftId);
          if (matchedGift) giftName = matchedGift.name;
        }
      } catch (err) {
        console.warn("Não foi possível ler o nome do presente do config.json:", err);
      }

      return NextResponse.json({
        success: true,
        simulated: true,
        pixCode: DEMO_PIX_CODE,
        giftName,
        order_nsu: "demo-" + Date.now(),
        message: "PIX simulado gerado em Modo de Demonstração.",
      });
    }

    // ── BUSCA O PRESENTE NO FIRESTORE ────────────────────────────────────────
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

    // ── REGISTRA INTENÇÃO DE PAGAMENTO ───────────────────────────────────────
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

    const apiToken = process.env.INFINITEPAY_API_TOKEN;
    const isConfigured = apiToken && apiToken !== "seu_token_api_aqui" && apiToken !== "seu_bearer_token_aqui";

    // ── MODO TESTE (sem chaves da InfinitePay) ───────────────────────────────
    if (!isConfigured) {
      console.log(`[InfinitePay Simulator] Gerando PIX simulado para order_nsu: ${order_nsu}`);
      return NextResponse.json({
        success: true,
        simulated: true,
        pixCode: DEMO_PIX_CODE,
        giftName: giftData?.name,
        order_nsu,
        message: "PIX simulado gerado (Modo de Teste sem chaves API).",
      });
    }

    // ── INTEGRAÇÃO REAL — InfinitePay PIX Charges API ────────────────────────
    const priceInCents = Math.round(Number(amount) * 100);
    const requestUrl = new URL(req.url);
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `${requestUrl.protocol}//${requestUrl.host}`);

    const webhookSecret = process.env.WEBHOOK_SECRET_TOKEN || "";

    const pixPayload = {
      amount: priceInCents,
      payment_method: "pix",
      description: `Casamento: ${giftData?.name} (De: ${guestName})`,
      external_id: order_nsu,
      pix: {
        expiration_in_minutes: 1440, // 24h
      },
      customer: {
        name: guestName,
        email: "convidado@casamento.com.br",
      },
      notification_url: `${siteUrl}/api/webhooks/infinitepay?secret=${encodeURIComponent(webhookSecret)}`,
    };

    try {
      const response = await fetch("https://api.infinitepay.io/v2/charges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify(pixPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na API PIX da InfinitePay:", errorText);
        throw new Error(`API retornou status ${response.status}`);
      }

      const data = await response.json();

      // InfinitePay retorna o código EMV PIX em data.pix.qr_code
      const pixCode =
        data?.pix?.qr_code ||
        data?.pix_qr_code ||
        data?.payment?.pix?.qr_code;

      if (!pixCode) {
        console.error("InfinitePay não retornou pix.qr_code:", JSON.stringify(data));
        throw new Error("QR code PIX não retornado pela API.");
      }

      // Atualiza o pending_contribution com o ID da cobrança
      await pendingRef.update({ charge_id: data.id || data.charge_id || "" });

      return NextResponse.json({
        success: true,
        simulated: false,
        pixCode,
        giftName: giftData?.name,
        order_nsu,
        message: "PIX gerado com sucesso via InfinitePay!",
      });
    } catch (apiError: any) {
      console.error("Falha na API InfinitePay PIX, alternando para simulação:", apiError.message);
      return NextResponse.json({
        success: true,
        simulated: true,
        pixCode: DEMO_PIX_CODE,
        giftName: giftData?.name,
        order_nsu,
        message: "Erro na API InfinitePay, PIX simulado de segurança gerado.",
      });
    }
  } catch (error: any) {
    console.error("Erro ao processar checkout:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor ao criar PIX." },
      { status: 500 }
    );
  }
}
