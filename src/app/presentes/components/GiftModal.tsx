"use client";

import { useState, useEffect, useRef } from "react";
import { X, Copy, Check, Send } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

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
  const [pixCode, setPixCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "payment">("form");

  const touchStartY = useRef<number>(0);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    if (gift) {
      setAmount(gift.is_crowdfunding ? 0 : gift.value);
    }
  }, [gift]);

  if (!isOpen || !gift) return null;

  const isVaquinha = !!gift.is_crowdfunding;
  const presets = [50, 100, 200, 500];

  const handlePresetSelect = (val: number) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmount(val);
    const num = parseFloat(val);
    setAmount(!isNaN(num) && num > 0 ? num : 0);
  };

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // fallback para navegadores sem clipboard API
      const el = document.createElement("textarea");
      el.value = pixCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
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

      setPixCode(resData.pixCode);
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
      // Falha silenciosa
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
    setPixCode("");
    setCopied(false);
    setError("");
    setDragOffset(0);
    onClose();
  };

  const handleDragStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleDragMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) setDragOffset(delta); // só para baixo
  };

  const handleDragEnd = () => {
    if (dragOffset > 120) {
      handleClose();
    } else {
      setDragOffset(0);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-text-dark/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="bg-white w-full sm:max-w-md shadow-2xl overflow-hidden animate-slide-up flex flex-col font-sans rounded-t-2xl sm:rounded-none"
        role="dialog"
        aria-modal="true"
        style={{ transform: `translateY(${dragOffset}px)`, transition: dragOffset === 0 ? "transform 0.3s ease" : "none" }}
      >
        {/* Handle visual — apenas mobile (arraste para fechar) */}
        <div
          className="flex justify-center pt-3 pb-1 sm:hidden cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <div className="w-10 h-1 bg-elegant rounded-full" />
        </div>

        {/* ── HEADER ── */}
        <div className="flex justify-between items-center px-6 py-3 sm:py-4 border-b border-elegant">
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
          className="h-[120px] sm:h-[160px] relative flex flex-col justify-end p-5"
          style={{ background: "linear-gradient(180deg, #C8B8A0 0%, #8B7050 100%)" }}
        >
          <span className="font-serif text-[18px] sm:text-[20px] text-white font-normal">{gift.name}</span>
        </div>

        {/* ── CONTEÚDO ── */}
        <div className="overflow-y-auto max-h-[calc(100svh-220px)] sm:max-h-[65vh]">
          {step === "form" ? (
            /* ════════ STEP 1 — FORM ════════ */
            <form onSubmit={handleSubmit} className="flex flex-col">
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

              {error && <p className="px-6 pt-3 text-xs text-red-500">{error}</p>}

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
            /* ════════ STEP 2 — PIX INLINE ════════ */
            <div className="flex flex-col">
              {/* Resumo */}
              <div className="px-6 pt-6 pb-4 border-b border-elegant">
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-text-mid">Presente:</span>
                  <span className="text-text-dark font-medium">{gift.name}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-text-mid">De:</span>
                  <span className="text-text-dark font-medium">{guestName}</span>
                </div>
                <div className="flex justify-between items-center text-[15px] pt-2 border-t border-elegant mt-2">
                  <span className="text-text-mid">Valor:</span>
                  <span className="font-serif text-[22px] text-brand">
                    R$ {amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* QR Code */}
              <div className="px-6 py-4 sm:py-6 border-b border-elegant flex flex-col items-center gap-3 sm:gap-4">
                <div className="p-3 border border-elegant">
                  <QRCodeSVG
                    value={pixCode}
                    size={180}
                    level="M"
                    includeMargin={false}
                  />
                </div>

                <p className="text-[12px] text-text-mid text-center leading-relaxed">
                  Abra o app do seu banco, escolha{" "}
                  <strong>Pagar com Pix → QR Code</strong> e aponte a câmera.
                </p>
              </div>

              {/* Copia e Cola */}
              <div className="px-6 py-5 border-b border-elegant">
                <span className="text-brand text-[9px] tracking-[3px] uppercase block mb-3">
                  Ou use Pix Copia e Cola
                </span>
                <div className="flex items-start gap-2">
                  <p className="flex-1 text-[10px] text-text-mid font-mono bg-bg-warm px-3 py-2 break-all select-all max-h-20 overflow-y-auto">
                    {pixCode}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="flex-shrink-0 h-9 px-4 border border-elegant text-text-mid text-[11px] tracking-wider hover:border-brand hover:text-brand transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-600">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-text-mid mt-2">
                  Cole no campo PIX do seu banco e confirme o pagamento.
                </p>
              </div>

              {/* Mensagem ao casal */}
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
