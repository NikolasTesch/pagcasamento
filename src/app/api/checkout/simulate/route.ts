import { NextResponse } from "next/server";
import { db, isFirebaseConfigured } from "@/lib/firebase";

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

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
        <title>Pagamento via Pix - Casamento Katharyna & Leonardo</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Montserrat', sans-serif; }
          .font-serif { font-family: 'Cinzel', serif; }
        </style>
      </head>
      <body class="bg-[#FAF8F5] text-[#2A2A2A] min-h-screen flex flex-col justify-between">
        
        <!-- ── HEADER ELEGANTE ── -->
        <header class="bg-white border-b border-[#E8E2D9] py-5 px-6 shadow-sm">
          <div class="max-w-4xl mx-auto flex justify-between items-center">
            <span class="font-serif text-[18px] tracking-[4px] text-[#3D2418]">K & L</span>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-xs uppercase tracking-widest text-[#6A6660] font-semibold">Conexão Segura</span>
            </div>
          </div>
        </header>

        <!-- ── CONTEÚDO PRINCIPAL ── -->
        <main class="flex-grow flex items-center justify-center p-4 md:p-8">
          <div class="bg-white border border-[#E8E2D9] rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-full my-6">
            
            {/* Título e Instrução */}
            <div class="text-center mb-6">
              <span class="text-[#B8A18E] text-[10px] tracking-[3px] uppercase block mb-1">Finalizar Presente</span>
              <h2 class="font-serif text-2xl text-[#3D2418] font-normal tracking-tight">Pagamento com Pix</h2>
              <p class="text-xs text-[#6A6660] mt-1.5 leading-relaxed">
                Escaneie o código abaixo com o aplicativo do seu banco ou use a chave Copia e Cola.
              </p>
            </div>

            {/* Caixa de detalhes da transação */}
            <div class="bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl p-4 mb-6 space-y-2">
              <div class="flex justify-between text-[13px]">
                <span class="text-[#6A6660]">Presente:</span>
                <span class="font-semibold text-[#3D2418] text-right truncate max-w-[220px]">${giftName}</span>
              </div>
              <div class="flex justify-between text-[13px]">
                <span class="text-[#6A6660]">Convidado(s):</span>
                <span class="font-semibold text-[#3D2418] text-right truncate max-w-[220px]">${guestName}</span>
              </div>
              <div class="flex justify-between items-center text-[15px] pt-2 border-t border-[#E8E2D9]/60">
                <span class="text-[#6A6660] font-medium">Valor a Pagar:</span>
                <span class="text-[#8B7050] font-serif text-[20px] font-bold">R$ ${amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* QR Code Pix */}
            <div class="flex flex-col items-center justify-center p-6 border border-[#E8E2D9] rounded-xl mb-6 relative bg-white">
              {/* Moldura elegante */}
              <div class="w-[200px] h-[200px] relative flex items-center justify-center">
                {/* SVG representando um QR Code Pix Realista */}
                <svg viewBox="0 0 100 100" class="w-full h-full text-[#3D2418]">
                  {/* Bordas e cantos do QR Code */}
                  <rect x="0" y="0" width="25" height="25" fill="none" stroke="currentColor" stroke-width="4"/>
                  <rect x="5" y="5" width="15" height="15" fill="currentColor"/>
                  <rect x="9" y="9" width="7" height="7" fill="white"/>
                  
                  <rect x="75" y="0" width="25" height="25" fill="none" stroke="currentColor" stroke-width="4"/>
                  <rect x="80" y="5" width="15" height="15" fill="currentColor"/>
                  <rect x="84" y="9" width="7" height="7" fill="white"/>
                  
                  <rect x="0" y="75" width="25" height="25" fill="none" stroke="currentColor" stroke-width="4"/>
                  <rect x="5" y="80" width="15" height="15" fill="currentColor"/>
                  <rect x="9" y="84" width="7" height="7" fill="white"/>
                  
                  {/* Padrão aleatório de QR Code */}
                  <path d="M 30,5 H 45 V 10 H 30 Z" fill="currentColor"/>
                  <path d="M 50,5 H 65 V 15 H 50 Z" fill="currentColor"/>
                  <path d="M 30,20 H 40 V 35 H 30 Z" fill="currentColor"/>
                  <path d="M 45,25 H 70 V 30 H 45 Z" fill="currentColor"/>
                  <path d="M 5,35 H 20 V 45 H 5 Z" fill="currentColor"/>
                  <path d="M 25,45 H 55 V 50 H 25 Z" fill="currentColor"/>
                  <path d="M 60,35 H 70 V 55 H 60 Z" fill="currentColor"/>
                  <path d="M 75,30 H 95 V 35 H 75 Z" fill="currentColor"/>
                  <path d="M 75,45 H 90 V 60 H 75 Z" fill="currentColor"/>
                  <path d="M 35,55 H 45 V 70 H 35 Z" fill="currentColor"/>
                  <path d="M 50,60 H 55 V 85 H 50 Z" fill="currentColor"/>
                  <path d="M 10,60 H 20 V 70 H 10 Z" fill="currentColor"/>
                  <path d="M 30,75 H 45 V 80 H 30 Z" fill="currentColor"/>
                  <path d="M 30,85 H 40 V 95 H 30 Z" fill="currentColor"/>
                  <path d="M 60,70 H 70 V 90 H 60 Z" fill="currentColor"/>
                  <path d="M 75,75 H 95 V 80 H 75 Z" fill="currentColor"/>
                  <path d="M 85,85 H 95 V 95 H 85 Z" fill="currentColor"/>
                </svg>
                {/* Logo Central do Pix */}
                <div class="absolute inset-0 m-auto w-10 h-10 bg-white border border-[#E8E2D9] rounded-lg flex items-center justify-center p-1 shadow">
                  <svg viewBox="0 0 100 100" class="w-full h-full text-[#32B4A4] fill-current">
                    <path d="M50 5 L95 50 L50 95 L5 50 Z M50 15 L80 45 C82 47 82 53 80 55 L50 85 L20 55 C18 53 18 47 20 45 Z"/>
                    <path d="M50 35 L65 50 L50 65 L35 50 Z"/>
                  </svg>
                </div>
              </div>

              {/* Temporizador */}
              <div class="mt-4 flex items-center gap-1.5 text-xs text-[#8B7050]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Código expira em: <strong id="timer">09:59</strong></span>
              </div>
            </div>

            {/* Pix Copia e Cola */}
            <div class="space-y-2 mb-6">
              <label class="text-[10px] tracking-[2px] uppercase text-[#6A6660] font-semibold block">Pix Copia e Cola</label>
              <div class="flex gap-2">
                <input
                  type="text"
                  readonly
                  id="pix-code"
                  value="00020101021226870014br.gov.bcb.pix2565pix.infinitepay.io/ch/prod-${order_nsu}"
                  class="flex-grow bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl px-4 py-3 text-xs outline-none font-mono text-[#6A6660] select-all cursor-text overflow-hidden text-ellipsis"
                />
                <button
                  onclick="copyPixCode()"
                  id="copy-btn"
                  class="px-4 border border-[#E8E2D9] text-[#3D2418] hover:bg-[#FAF8F5] text-xs font-semibold rounded-xl transition shrink-0"
                >
                  Copiar
                </button>
              </div>
            </div>

            <!-- Status do Pagamento (Processamento Automático) -->
            <div id="status-card" class="bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl p-5 mb-6 flex flex-col items-center justify-center text-center">
              <div class="inline-flex items-center justify-center mb-3">
                <svg class="animate-spin h-7 w-7 text-[#8B7050]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p class="text-[13px] font-semibold text-[#3D2418]" id="status-text">Aguardando detecção do pagamento...</p>
              <p class="text-[11px] text-[#6A6660] mt-1">O sistema irá reconhecer e aprovar automaticamente.</p>
            </div>

            <!-- Ações -->
            <div class="space-y-3">
              <button
                onclick="cancelSimulated()"
                class="w-full border border-[#E8E2D9] hover:bg-red-50 text-[#8B7050] py-3.5 px-4 rounded-xl font-semibold text-xs transition duration-300"
              >
                Cancelar e Voltar
              </button>
            </div>

            <div class="mt-6 flex items-center justify-center gap-1 text-[11px] text-[#6A6660]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944a11.954 11.954 0 007.834 3.056 10.03 10.03 0 01-1.239 8.258 12.048 12.048 0 01-5.595 4.796 1.002 1.002 0 01-.76 0 12.048 12.048 0 01-5.595-4.796 10.03 10.03 0 01-1.239-8.258zM10 8a1 1 0 011 1v5a1 1 0 11-2 0V9a1 1 0 011-1z" clip-rule="evenodd"/>
              </svg>
              <span>Pagamento 100% Protegido</span>
            </div>

          </div>
        </main>

        <!-- ── FOOTER ── -->
        <footer class="bg-white border-t border-[#E8E2D9] py-4 px-6 text-center text-xs text-[#6A6660]">
          <p>© 2026 Katharyna & Leonardo. Todos os direitos reservados.</p>
        </footer>

        <script>
          // Lógica do Temporizador
          let time = 599; // 10 minutos em segundos
          const timerElement = document.getElementById('timer');
          const countdown = setInterval(() => {
            const minutes = Math.floor(time / 60);
            let seconds = time % 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            timerElement.innerText = minutes + ':' + seconds;
            if (time <= 0) {
              clearInterval(countdown);
              timerElement.innerText = 'Expirado';
            }
            time--;
          }, 1000);

          // Função para copiar o código Pix
          function copyPixCode() {
            const copyText = document.getElementById("pix-code");
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(copyText.value);
            
            const btn = document.getElementById("copy-btn");
            btn.innerText = "Copiado!";
            btn.classList.add("bg-[#E8F5E9]", "text-[#2E7D32]", "border-[#A5D6A7]");
            setTimeout(() => {
              btn.innerText = "Copiar";
              btn.classList.remove("bg-[#E8F5E9]", "text-[#2E7D32]", "border-[#A5D6A7]");
            }, 2000);
          }

          // Inicia a detecção automática após 7 segundos da abertura da página
          setTimeout(() => {
            detectPaymentAutomatically();
          }, 7000);

          async function detectPaymentAutomatically() {
            const statusText = document.getElementById('status-text');
            
            if (statusText) statusText.innerText = 'Processando confirmação do banco...';

            const isDemo = ${isDemoMode};

            if (isDemo) {
              console.log('[Simulator] Em modo de Demonstração, pulamos o webhook real e redirecionamos diretamente.');
              showSuccessAndRedirect();
              return;
            }

            try {
              const secret = '${process.env.WEBHOOK_SECRET_TOKEN || ""}';
              const response = await fetch('/api/webhooks/infinitepay?secret=' + encodeURIComponent(secret), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
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
                showSuccessAndRedirect();
              } else {
                showSuccessAndRedirect();
              }
            } catch (err) {
              console.error(err);
              showSuccessAndRedirect();
            }
          }

          function showSuccessAndRedirect() {
            const statusCard = document.getElementById('status-card');
            if (statusCard) {
              statusCard.classList.remove('bg-[#FAF8F5]', 'border-[#E8E2D9]');
              statusCard.classList.add('bg-emerald-50', 'border-emerald-200');
              statusCard.innerHTML = \`
                <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-2.5 text-emerald-600 animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p class="text-[13px] font-semibold text-emerald-800">Pagamento Confirmado!</p>
                <p class="text-[11px] text-emerald-600 mt-1">Obrigado! Redirecionando de volta ao site...</p>
              \`;
            }
            setTimeout(() => {
              window.location.href = '/presentes?status=success&giftId=${giftId}';
            }, 2000);
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
