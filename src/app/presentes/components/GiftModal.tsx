"use client";

import { useState } from "react";
import { X, Heart, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";

interface Gift {
  id: string;
  name: string;
  description: string;
  value: number;
  imageUrl: string;
  category: string;
  is_crowdfunding?: boolean;
  amount_collected?: number;
  is_purchased?: boolean;
}

interface GiftModalProps {
  gift: Gift | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GiftModal({ gift, isOpen, onClose, onSuccess }: GiftModalProps) {
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [isSimulated, setIsSimulated] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "payment">("form");

  if (!isOpen || !gift) return null;

  const isVaquinha = !!gift.is_crowdfunding;
  const presets = [50, 100, 200, 500];

  // Define o valor padrão ao abrir
  if (amount === 0 && !isVaquinha) {
    setAmount(gift.value);
  }

  const handlePresetSelect = (val: number) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
    } else {
      setAmount(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!guestName.trim()) {
      setError("Por favor, informe seu nome.");
      return;
    }

    if (amount <= 0) {
      setError("Por favor, selecione ou digite um valor válido de contribuição.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giftId: gift.id,
          guestName: guestName.trim(),
          guestMessage: guestMessage.trim(),
          amount: Number(amount),
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Erro ao processar presente.");
      }

      setPaymentUrl(resData.paymentUrl);
      setIsSimulated(!!resData.simulated);
      setStep("payment");
    } catch (err: any) {
      setError(err.message || "Não foi possível gerar o Pix de pagamento.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reseta estados
    setStep("form");
    setGuestName("");
    setGuestMessage("");
    setAmount(0);
    setCustomAmount("");
    setPaymentUrl("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-dark/40 backdrop-blur-sm transition duration-300">
      <div 
        className="bg-white border border-elegant w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-elegant bg-bg-light/50">
          <h3 className="font-serif text-xl font-light text-text-dark flex items-center gap-2">
            <Heart className="w-4 h-4 text-brand fill-brand/20" /> Presentear Casal
          </h3>
          <button 
            onClick={handleClose} 
            className="text-text-muted hover:text-text-dark p-1.5 rounded-full hover:bg-bg-warm/55 transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTAINER SCROLL */}
        <div className="overflow-y-auto max-h-[80vh] p-6">
          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* IMAGEM E NOME DO PRESENTE */}
              <div className="flex items-center gap-4 bg-bg-light/30 border border-elegant p-4 rounded-xl">
                <img 
                  src={gift.imageUrl} 
                  alt={gift.name} 
                  className="w-16 h-16 object-cover rounded-lg border border-elegant shadow-sm bg-white" 
                />
                <div>
                  <span className="text-[10px] uppercase tracking-widest bg-brand/10 text-brand px-2 py-0.5 rounded-full font-semibold">
                    {gift.category}
                  </span>
                  <h4 className="font-serif text-base font-semibold text-text-dark mt-1">{gift.name}</h4>
                  {!isVaquinha && (
                    <p className="text-sm text-text-muted mt-0.5">Valor unitário: R$ {gift.value.toFixed(2)}</p>
                  )}
                </div>
              </div>

              {/* VALOR DA CONTRIBUIÇÃO (SE FOR VAQUINHA) */}
              {isVaquinha ? (
                <div className="space-y-3">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-text-muted">
                    Selecione o valor da sua contribuição 💰
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {presets.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handlePresetSelect(val)}
                        className={`py-2.5 rounded-lg border text-xs font-semibold tracking-wider transition ${
                          amount === val && !customAmount
                            ? "bg-brand border-brand text-white shadow-md"
                            : "border-elegant bg-white hover:bg-bg-light text-text-dark"
                        }`}
                      >
                        R$ {val}
                      </button>
                    ))}
                  </div>
                  <div className="relative mt-2">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-muted">
                      Outro Valor (R$):
                    </span>
                    <input
                      type="number"
                      step="any"
                      placeholder="Digite o valor desejado"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="w-full pl-36 pr-4 py-3 rounded-xl border border-elegant focus:border-brand focus:ring-1 focus:ring-brand text-sm transition outline-none font-semibold"
                    />
                  </div>
                  {amount > 0 && (
                    <div className="text-right text-xs text-text-muted">
                      Sua contribuição será de:{" "}
                      <span className="font-bold text-[#2D6A4F] text-sm">R$ {amount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center border-b border-elegant pb-3">
                  <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">Valor total Pix:</span>
                  <span className="font-bold text-lg text-[#2D6A4F]">R$ {gift.value.toFixed(2)}</span>
                </div>
              )}

              {/* FORMULÁRIO DO CONVIDADO */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-text-muted mb-1.5">
                    Seu Nome (ou nome da família) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João e Maria"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-elegant focus:border-brand focus:ring-1 focus:ring-brand text-sm transition outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-text-muted mb-1.5">
                    Mensagem de Carinho aos Noivos
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Deixe uma mensagem especial para nós..."
                    value={guestMessage}
                    onChange={(e) => setGuestMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-elegant focus:border-brand focus:ring-1 focus:ring-brand text-sm transition outline-none resize-none"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white py-4 rounded-xl font-semibold tracking-wider text-xs uppercase transition shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? "Gerando link Pix..." : "Confirmar e Gerar Pix 🎁"}
              </button>
            </form>
          ) : (
            // STEP PAYMENT
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-[#2D6A4F]/10 text-[#2D6A4F] rounded-full flex items-center justify-center mx-auto mb-4 animate-fade-in">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-semibold text-text-dark">Link Pix Gerado com Sucesso!</h4>
                <p className="text-xs text-text-muted px-4">
                  O Pix é gerado de forma segura via **InfinitePay com Taxa Zero**. 100% da sua contribuição irá diretamente para os noivos!
                </p>
              </div>

              <div className="bg-bg-light border border-elegant rounded-xl p-4 max-w-sm mx-auto text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Presente:</span>
                  <span className="font-semibold text-text-dark">{gift.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">De:</span>
                  <span className="font-semibold text-text-dark">{guestName}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold pt-2 border-t border-elegant/50">
                  <span>Valor:</span>
                  <span className="text-[#2D6A4F] font-bold text-base">R$ {amount.toFixed(2)}</span>
                </div>
              </div>

              {/* PAYMENT CALL TO ACTION */}
              <div className="space-y-3 px-4">
                <a
                  href={paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white py-4 rounded-xl font-semibold tracking-wider text-xs uppercase transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" /> 
                  {isSimulated ? "Pagar Pix Simulado (Modo Teste) 💳" : "Ir para Pagamento Pix (Taxa Zero) 💳"}
                </a>
                
                <p className="text-[10px] text-text-muted">
                  Ao clicar no botão, uma nova aba se abrirá com a tela de pagamento segura Pix da InfinitePay.
                </p>
              </div>

              <div className="border-t border-elegant/50 pt-4 max-w-sm mx-auto">
                <button
                  onClick={onSuccess}
                  className="text-xs font-semibold text-brand hover:text-brand-hover tracking-wider uppercase inline-flex items-center gap-1 cursor-pointer"
                >
                  Já efetuei o pagamento e quero voltar →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
