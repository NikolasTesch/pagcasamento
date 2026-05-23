import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import * as admin from "firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[Webhook InfinitePay] Payload recebido:", body);

    const { order_nsu, status, amount, transaction_nsu } = body;

    // 1. Validação de segurança híbrida
    // Verifica se há token válido no query parameter 'secret' ou nos cabeçalhos HTTP
    const { searchParams } = new URL(req.url);
    const tokenQuery = searchParams.get("secret");
    const tokenHeader = req.headers.get("x-webhook-secret") || req.headers.get("Authorization");
    const secretToken = process.env.WEBHOOK_SECRET_TOKEN || "token_secreto_para_validar_webhook_aqui";

    const isAuthorized = 
      (tokenHeader && (tokenHeader === secretToken || `Bearer ${secretToken}` === tokenHeader)) ||
      (tokenQuery && tokenQuery === secretToken);

    if (!isAuthorized) {
      console.warn("[Webhook InfinitePay] Alerta: Token de autenticação do webhook ausente ou inválido!");
      return NextResponse.json({ success: false, message: "Não autorizado." }, { status: 401 });
    }

    // 2. Validações básicas do corpo
    if (!order_nsu || !status || !transaction_nsu) {
      return NextResponse.json({ success: false, message: "Payload incompleto." }, { status: 400 });
    }

    // Apenas processa se for aprovado
    if (status !== "approved" && status !== "paid") {
      console.log(`[Webhook InfinitePay] Transação ${order_nsu} ignorada. Status: ${status}`);
      return NextResponse.json({ success: true, message: "Status ignorado." }, { status: 200 });
    }

    // 3. Idempotência: Verifica se este pagamento já foi processado anteriormente
    const contributionsRef = db.collection("contributions");
    const existingPaymentQuery = await contributionsRef.where("payment_id", "==", transaction_nsu).get();

    if (!existingPaymentQuery.empty) {
      console.log(`[Webhook InfinitePay] Transação duplicada ignorada (já processada): ${transaction_nsu}`);
      return NextResponse.json({ success: true, duplicated: true }, { status: 200 });
    }

    // 4. Busca o pedido pendente
    const pendingDocRef = db.collection("pending_contributions").doc(order_nsu);
    const pendingDoc = await pendingDocRef.get();

    if (!pendingDoc.exists) {
      console.error(`[Webhook InfinitePay] Erro: Transação pendente ${order_nsu} não encontrada no banco.`);
      return NextResponse.json({ success: false, message: "Transação não encontrada." }, { status: 404 });
    }

    const pendingData = pendingDoc.data();

    // 5. Inicia uma transação ou gravação em lote para consistência de dados
    const batch = db.batch();

    // Atualiza status do pedido pendente para concluído
    batch.update(pendingDocRef, { status: "completed", processed_at: new Date() });

    // Atualiza o presente correspondente
    const giftDocRef = db.collection("gifts").doc(pendingData?.gift_id);
    const giftDoc = await giftDocRef.get();

    if (!giftDoc.exists) {
      console.error(`[Webhook InfinitePay] Erro: Presente ${pendingData?.gift_id} não encontrado no catálogo.`);
      return NextResponse.json({ success: false, message: "Presente não encontrado." }, { status: 404 });
    }

    const giftData = giftDoc.data();
    const currentCollected = Number(giftData?.amount_collected || 0);
    const newCollected = currentCollected + Number(pendingData?.amount);
    const isCrowdfunding = !!giftData?.is_crowdfunding;
    const totalValue = Number(giftData?.value || 0);

    // Condição para marcar como comprado:
    // Se for vaquinha, marca como comprado se ultrapassou ou igualou o valor total
    // Se for presente comum, como é cota única, já marca como comprado direto
    const isFullyPaid = isCrowdfunding ? newCollected >= totalValue : true;

    batch.update(giftDocRef, {
      amount_collected: newCollected,
      is_purchased: isFullyPaid,
    });

    // Registra a contribuição confirmada
    const contributionDocRef = contributionsRef.doc();
    batch.set(contributionDocRef, {
      id: contributionDocRef.id,
      gift_id: pendingData?.gift_id,
      gift_name: pendingData?.gift_name,
      guest_name: pendingData?.guest_name,
      guest_message: pendingData?.guest_message,
      amount: Number(pendingData?.amount),
      payment_id: transaction_nsu,
      order_nsu: order_nsu,
      created_at: new Date(),
    });

    // Comita o lote de operações no Firestore
    await batch.commit();

    console.log(`[Webhook InfinitePay] Sucesso! Contribuição de R$ ${pendingData?.amount} processada para o presente ${pendingData?.gift_name}.`);

    return NextResponse.json({ success: true, message: "Webhook processado com sucesso!" }, { status: 200 });
  } catch (error: any) {
    console.error("[Webhook InfinitePay] Erro no processamento do webhook:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor ao processar webhook.", error: error.message },
      { status: 500 }
    );
  }
}
