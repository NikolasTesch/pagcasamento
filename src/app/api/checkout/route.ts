import { NextResponse } from "next/server";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import * as fs from "fs";
import * as path from "path";

export async function POST(req: Request) {
  try {
    const { giftId, guestName, guestMessage, amount } = await req.json();

    // 1. Validações básicas
    if (!giftId || !guestName || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, message: "Dados incompletos ou inválidos." },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Bypass do banco de dados no modo de demonstração completo (se Firebase não estiver configurado)
    if (!isFirebaseConfigured) {
      console.log("[Checkout API] Firebase não configurado. Ativando Modo Demo com leitura do local config.json.");
      
      let giftName = "Presente Simbólico de Casamento";
      try {
        const configPath = path.join(process.cwd(), "backup-vanilla", "config.json");
        if (fs.existsSync(configPath)) {
          const fileData = fs.readFileSync(configPath, "utf-8");
          const config = JSON.parse(fileData);
          const matchedGift = config.gifts?.find((g: any) => g.id === giftId);
          if (matchedGift) {
            giftName = matchedGift.name;
          }
        }
      } catch (err) {
        console.warn("Não foi possível ler o nome do presente do config.json fallback:", err);
      }

      // Se for Lua de Mel ou Geladeira de cota alta adicionados na seed
      if (giftId === "gift-006") giftName = "Cotas para Viagem de Lua de Mel";
      if (giftId === "gift-007") giftName = "Geladeira Frost Free Inverse";

      const order_nsu = "demo-nsu-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
      
      return NextResponse.json({
        success: true,
        simulated: true,
        paymentUrl: `${siteUrl}/api/checkout/simulate?order_nsu=${order_nsu}&giftId=${giftId}&amount=${amount}&guestName=${encodeURIComponent(guestName)}&giftName=${encodeURIComponent(giftName)}`,
        order_nsu: order_nsu,
        message: "Link de checkout simulado gerado em Modo de Demonstração (Sem Firebase)!",
      });
    }

    // 2. Busca o presente no Firestore para validação (Modo Real com Firebase)
    const giftDocRef = db.collection("gifts").doc(giftId);
    const giftDoc = await giftDocRef.get();

    if (!giftDoc.exists) {
      return NextResponse.json(
        { success: false, message: "Presente não encontrado no catálogo." },
        { status: 404 }
      );
    }

    const giftData = giftDoc.data();

    // Se já foi comprado e não for do tipo vaquinha (crowdfunding), bloqueia
    if (giftData?.is_purchased && !giftData?.is_crowdfunding) {
      return NextResponse.json(
        { success: false, message: "Este presente já foi comprado por outro convidado!" },
        { status: 400 }
      );
    }

    // 3. Registra a intenção na coleção 'pending_contributions' para gerar o order_nsu (ID único da transação)
    const pendingRef = db.collection("pending_contributions").doc();
    const order_nsu = pendingRef.id;

    const pendingData = {
      id: order_nsu,
      gift_id: giftId,
      gift_name: giftData?.name,
      guest_name: guestName,
      guest_message: guestMessage || "",
      amount: Number(amount),
      status: "pending",
      created_at: new Date(),
    };

    await pendingRef.set(pendingData);

    const infinitePayTag = process.env.NEXT_PUBLIC_INFINITEPAY_TAG;
    const apiToken = process.env.INFINITEPAY_API_TOKEN;

    // 4. Modo Simulado / Teste (Se chaves da InfinitePay não estiverem configuradas no .env.local)
    const isConfigured = apiToken && apiToken !== "seu_token_api_aqui" && infinitePayTag && infinitePayTag !== "sua_tag_aqui";

    if (!isConfigured) {
      console.log(`[InfinitePay Simulator] Gerando link de simulação para order_nsu: ${order_nsu}`);
      const simulateUrl = `${siteUrl}/api/checkout/simulate?order_nsu=${order_nsu}`;
      
      return NextResponse.json({
        success: true,
        simulated: true,
        paymentUrl: simulateUrl,
        order_nsu: order_nsu,
        message: "Link de checkout simulado gerado com sucesso (Modo de Teste sem chaves API)!",
      });
    }

    // 5. Integração Real com InfinitePay Checkout API
    const priceInCents = Math.round(Number(amount) * 100);

    const payload = {
      handle: infinitePayTag,
      redirect_url: `${siteUrl}/presentes?status=success&giftId=${giftId}`,
      webhook_url: `${siteUrl}/api/webhooks/infinitepay`,
      order_nsu: order_nsu,
      items: [
        {
          quantity: 1,
          price: priceInCents,
          description: `Casamento: ${giftData?.name} (De: ${guestName})`,
        },
      ],
    };

    try {
      const response = await fetch("https://api.checkout.infinitepay.io/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiToken}`,
          "x-api-token": apiToken,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na API da InfinitePay:", errorText);
        throw new Error(`API retornou status ${response.status}`);
      }

      const responseData = await response.json();
      
      return NextResponse.json({
        success: true,
        simulated: false,
        paymentUrl: responseData.url,
        order_nsu: order_nsu,
        message: "Link de checkout real gerado via InfinitePay!",
      });
    } catch (apiError: any) {
      console.error("Falha ao se comunicar com a InfinitePay, alternando para simulação:", apiError.message);
      return NextResponse.json({
        success: true,
        simulated: true,
        paymentUrl: `${siteUrl}/api/checkout/simulate?order_nsu=${order_nsu}`,
        order_nsu: order_nsu,
        message: "Erro na API da InfinitePay, alternado para checkout simulado de segurança.",
      });
    }
  } catch (error: any) {
    console.error("Erro ao processar checkout:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor ao criar checkout." },
      { status: 500 }
    );
  }
}
