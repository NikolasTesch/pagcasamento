"use client";

import { useState } from "react";
import { X, CreditCard, Send } from "lucide-react";

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
  const [messageSent, setMessageSent] = useState(false);
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
    setAmount(!isNaN(num) && num > 0 ? num : 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!guestName.trim()) {
      setError("Por favor, informe seu nome.");
      return;
    }
    if (amount <= 0) {
      setError("Por favor, selecione ou digite um valor válido.");
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
          guestMessage: "",
          amount: Number(amount),
        }),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message || "Erro ao processar presente.");

      setPaymentUrl(resData.paymentUrl);
      setIsSimulated(!!resData.simulated);
      setStep("payment");
    } catch (err: any) {
      setError(err.message || "Não foi possível gerar o Pix.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!guestMessage.trim()) return;
    try {
      await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giftId: gift.id,
          guestName: guestName.trim(),
          guestMessage: guestMessage.trim(),
          amount: Number(amount),
          messageOnly: true,
        }),
      });
    } catch (_) {
      // Falha silenciosa — mensagem é um extra
    }
    setMessageSent(true);
  };

  const handleClose = () => {
    setStep("form");
    setGuestName("");
    setGuestMessage("");
    setMessageSent(false);
    setAmount(0);
    setCustomAmount("");
    setPaymentUrl("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-dark/50 backdrop-blur-sm">
      <div
        className="bg-white w-full max-w-md shadow-2xl overflow-hidden animate-slide-up flex flex-col font-sans"
        role="dialog"
        aria-modal="true"
      >
        {/* ── HEADER ── */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-elegant">
          <span className="text-text-mid text-[10px] tracking-[3px] uppercase">
            {step === "form" ? "Confirmar Presente" : "Pagamento Pix"}
          </span>
          <button
            onClick={handleClose}
            className="text-text-mid hover:text-text-dark transition p-1"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── IMAGEM DO PRESENTE ── */}
        <div
          className="h-[160px] relative flex flex-col justify-end p-5"
          style={{ background: "linear-gradient(180deg, #C8B8A0 0%, #8B7050 100%)" }}
        >
          <span className="font-serif text-[20px] text-white font-normal">{gift.name}</span>
        </div>

        {/* ── CONTEÚDO ── */}
        <div className="overflow-y-auto max-h-[65vh]">
          {step === "form" ? (
            /* ════════ STEP 1 — FORM ════════ */
            <form onSubmit={handleSubmit} className="flex flex-col">
              {/* Confirmação */}
              <div className="px-6 pt-6 pb-4 border-b border-elegant">
                <span className="text-brand text-[9px] tracking-[3px] uppercase block mb-3">
                  Confirmar Presente
                </span>
                <p className="text-text-dark text-[14px] leading-[1.6]">
                  Você está presenteando o casal com{" "}
                  <strong>{gift.name}</strong> no valor de:
                </p>
                <p className="font-serif text-[36px] text-brand font-normal mt-1">
                  R$ {gift.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Valor customizado (vaquinha) */}
              {isVaquinha && (
                <div className="px-6 py-4 border-b border-elegant space-y-3">
                  <span className="text-brand text-[9px] tracking-[3px] uppercase block">
                    Valor da Contribuição
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {presets.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handlePresetSelect(val)}
                        className={`py-2 text-[11px] tracking-wider border transition ${
                          amount === val && !customAmount
                            ? "bg-text-dark border-text-dark text-white"
                            : "border-elegant text-text-mid hover:border-brand hover:text-brand"
                        }`}
                      >
                        R$ {val}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    step="any"
                    placeholder="Outro valor (R$)"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-elegant text-[13px] outline-none focus:border-brand transition"
                  />
                </div>
              )}

              {/* Nome */}
              <div className="px-6 py-4 border-b border-elegant">
                <span className="text-brand text-[9px] tracking-[3px] uppercase block mb-2">
                  Seu Nome *
                </span>
                <input
                  type="text"
                  required
                  placeholder="Ex: João e Maria"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 border border-elegant text-[13px] outline-none focus:border-brand transition"
                />
              </div>

              {error && (
                <p className="px-6 pt-3 text-xs text-red-500">{error}</p>
              )}

              {/* Botão */}
              <div className="px-6 py-5 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-text-dark text-white text-[13px] tracking-wider hover:bg-brand transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? "Gerando Pix..." : "✓  Confirmar e Gerar Pix"}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full h-12 border border-elegant text-text-mid text-[13px] hover:border-brand hover:text-brand transition cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>

          ) : (
            /* ════════ STEP 2 — PAYMENT ════════ */
            <div className="flex flex-col">
              {/* Resumo do pagamento */}
              <div className="px-6 pt-6 pb-4 border-b border-elegant">
                <span className="text-brand text-[9px] tracking-[3px] uppercase block mb-3">
                  Resumo
                </span>
                <div className="space-y-2">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-text-mid">Presente:</span>
                    <span className="text-text-dark font-medium">{gift.name}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-text-mid">De:</span>
                    <span className="text-text-dark font-medium">{guestName}</span>
                  </div>
                  <div className="flex justify-between items-center text-[15px] pt-2 border-t border-elegant mt-2">
                    <span className="text-text-mid">Valor:</span>
                    <span className="font-serif text-[22px] text-brand">{`R$ ${amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}</span>
                  </div>
                </div>
              </div>

              {/* Botão de pagamento */}
              <div className="px-6 py-5 border-b border-elegant space-y-3">
                <a
                  href={paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 bg-text-dark text-white text-[13px] tracking-wider hover:bg-brand transition flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  {isSimulated ? "Pagar (Modo Teste)" : "Ir para Pagamento Pix"}
                </a>
              </div>

              {/* Mensagem ao casal — inline na tela de pagamento */}
              <div className="px-6 py-5 border-b border-elegant">
                <span className="text-brand text-[9px] tracking-[3px] uppercase block mb-3">
                  Deixar uma mensagem ao casal
                </span>

                {messageSent ? (
                  <p className="text-[13px] text-text-mid italic">
                    ✓ Mensagem enviada com carinho 💛
                  </p>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      rows={3}
                      placeholder="Escreva uma mensagem especial para os noivos..."
                      value={guestMessage}
                      onChange={(e) => setGuestMessage(e.target.value)}
                      className="w-full px-4 py-3 border border-elegant text-[13px] outline-none focus:border-brand transition resize-none"
                    />
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!guestMessage.trim()}
                      className="w-full h-11 border border-elegant text-text-dark text-[12px] tracking-wider hover:bg-bg-warm disabled:opacity-40 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> 💬  Enviar Mensagem
                    </button>
                  </div>
                )}
              </div>

              {/* Voltar */}
              <div className="px-6 py-5 flex justify-center">
                <button
                  onClick={onSuccess}
                  className="text-brand text-[13px] tracking-wider hover:text-brand-hover transition cursor-pointer"
                >
                  ← Voltar à lista
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
