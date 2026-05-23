import { NextResponse } from "next/server";
import { db, isFirebaseConfigured } from "@/lib/firebase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const order_nsu = searchParams.get("order_nsu");

    if (!order_nsu) {
      return new NextResponse("<h1>Erro: NSU do pedido em falta.</h1>", {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    let giftId = "";
    let giftName = "Presente de Casamento";
    let guestName = "Convidado";
    let amount = 0;
    
    // Verifica se estamos em modo de simulação com banco ativo ou modo de bypass/demo sem banco
    const isDemoMode = !isFirebaseConfigured || order_nsu.startsWith("demo-nsu-");

    if (isDemoMode) {
      // Carrega informações diretamente dos parâmetros da URL no modo de demonstração
      giftId = searchParams.get("giftId") || "gift-001";
      giftName = searchParams.get("giftName") || "Presente Simbólico";
      guestName = searchParams.get("guestName") || "Convidado de Teste";
      amount = Number(searchParams.get("amount") || 100);
    } else {
      // Busca o pedido pendente real no Firestore
      const pendingDoc = await db.collection("pending_contributions").doc(order_nsu).get();

      if (!pendingDoc.exists) {
        return new NextResponse("<h1>Erro: Transação pendente não encontrada.</h1>", {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      const pendingData = pendingDoc.data();
      giftId = pendingData?.gift_id || "";
      giftName = pendingData?.gift_name || "";
      guestName = pendingData?.guest_name || "";
      amount = Number(pendingData?.amount || 0);
    }

    // Renders a beautiful visual simulator page in HTML with Tailwind CSS
    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simulador de Pagamento Pix - InfinitePay</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Montserrat', sans-serif; }
        </style>
      </head>
      <body class="bg-[#FAF9F6] text-[#2A2A2A] min-h-screen flex flex-col justify-between">
        <header class="bg-white border-b border-[#E8E2D9] py-4 px-6 shadow-sm">
          <div class="max-w-4xl mx-auto flex justify-between items-center">
            <h1 class="text-sm font-semibold tracking-wider text-[#B8A18E]">INFINITEPAY PIX SIMULATOR</h1>
            <span class="text-xs bg-[#B8A18E]/20 text-[#B8A18E] px-2.5 py-1 rounded-full font-semibold">MODO TESTE</span>
          </div>
        </header>

        <main class="flex-grow flex items-center justify-center p-6">
          <div class="bg-white border border-[#E8E2D9] rounded-2xl shadow-lg p-8 max-w-md w-full animate-fade-in">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-[#B8A18E]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#B8A18E]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 class="text-xl font-bold tracking-tight">Simulação de Pagamento</h2>
              <p class="text-sm text-[#6A6660] mt-1">Simule o pagamento Pix sem taxas reais</p>
            </div>

            <div class="border-t border-b border-[#E8E2D9] py-4 my-4 space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-[#6A6660]">Presente:</span>
                <span class="font-semibold text-right max-w-[200px] truncate">${giftName}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-[#6A6660]">Convidado:</span>
                <span class="font-semibold text-right truncate max-w-[200px]">${guestName}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-[#6A6660]">ID da Transação:</span>
                <span class="font-mono text-xs">${order_nsu}</span>
              </div>
              <div class="flex justify-between items-center text-lg font-semibold pt-2 border-t border-[#E8E2D9]/50">
                <span>Valor:</span>
                <span class="text-[#2D6A4F] font-bold">R$ ${amount.toFixed(2)}</span>
              </div>
            </div>

            <div class="mt-6 space-y-3">
              <button onclick="paySimulated()" id="pay-btn" class="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white py-3.5 px-4 rounded-xl font-semibold shadow-md transition duration-300 flex items-center justify-center space-x-2">
                <span>Confirmar Pagamento Simulado</span>
              </button>
              
              <button onclick="cancelSimulated()" class="w-full border border-[#E8E2D9] hover:bg-red-50 text-red-600 py-3 px-4 rounded-xl font-semibold transition duration-300">
                Cancelar e Voltar
              </button>
            </div>
          </div>
        </main>

        <footer class="bg-white border-t border-[#E8E2D9] py-4 px-6 text-center text-xs text-[#6A6660]">
          <p>© 2026 Katharyna & Leonardo. Desenvolvido para fins de teste Pix com Taxa Zero via InfinitePay.</p>
        </footer>

        <script>
          async function paySimulated() {
            const payBtn = document.getElementById('pay-btn');
            payBtn.disabled = true;
            payBtn.innerText = 'Processando...';

            const isDemo = ${isDemoMode};

            if (isDemo) {
              console.log('[Simulator] Em modo de Demonstração, pulamos o webhook real e redirecionamos diretamente.');
              // No modo de demonstração puro (sem Firebase), apenas redireciona simulando o sucesso!
              window.location.href = '/presentes?status=success&giftId=${giftId}';
              return;
            }

            try {
              // Dispara uma simulação de POST de webhook para nossa rota de webhook real (quando Firebase está conectado)
              const response = await fetch('/api/webhooks/infinitepay', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-webhook-secret': '${process.env.WEBHOOK_SECRET_TOKEN || "token_secreto_para_validar_webhook_aqui"}'
                },
                body: JSON.stringify({
                  order_nsu: '${order_nsu}',
                  status: 'approved',
                  amount: ${Math.round(amount * 100)},
                  transaction_nsu: 'SIM-TX-' + Math.floor(Math.random() * 1000000),
                  metadata: {}
                })
              });

              if (response.ok) {
                window.location.href = '/presentes?status=success&giftId=${giftId}';
              } else {
                alert('Erro ao disparar webhook de simulação. Verifique as configurações de rede ou logs do servidor.');
                payBtn.disabled = false;
                payBtn.innerText = 'Confirmar Pagamento Simulado';
              }
            } catch (err) {
              console.error(err);
              alert('Erro de conexão ao simular o pagamento.');
              payBtn.disabled = false;
              payBtn.innerText = 'Confirmar Pagamento Simulado';
            }
          }

          function cancelSimulated() {
            window.location.href = '/presentes';
          }
        </script>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error: any) {
    return new NextResponse(`<h1>Erro interno: ${error.message}</h1>`, {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}
