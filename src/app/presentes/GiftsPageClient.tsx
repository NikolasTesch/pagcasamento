"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Heart, Users } from "lucide-react";
import GiftModal from "./components/GiftModal";

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

interface GiftsPageClientProps {
  initialGifts: Gift[];
}

export default function GiftsPageClient({ initialGifts }: GiftsPageClientProps) {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");

  const searchParams = useSearchParams();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successGiftName, setSuccessGiftName] = useState("");

  useEffect(() => {
    const status = searchParams.get("status");
    const giftId = searchParams.get("giftId");
    if (status === "success" && giftId) {
      const gift = initialGifts.find((g) => g.id === giftId);
      if (gift) {
        setSuccessGiftName(gift.name);
        setShowSuccessToast(true);
        const timer = setTimeout(() => setShowSuccessToast(false), 10000);
        return () => clearTimeout(timer);
      }
    }
  }, [searchParams, initialGifts]);

  const categories = ["Todos", ...Array.from(new Set(initialGifts.map((g) => g.category)))];
  const filteredGifts =
    activeCategory === "Todos"
      ? initialGifts
      : initialGifts.filter((g) => g.category === activeCategory);

  const handleOpenModal = (gift: Gift) => {
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  const handleSuccessClose = () => {
    setIsModalOpen(false);
    window.location.href = "/presentes";
  };

  return (
    <div className="flex-grow flex flex-col bg-bg-light font-sans min-h-screen">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-elegant px-6 md:px-20 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8 md:gap-10">
          <Link href="/" className="text-text-mid text-[13px] tracking-[1.5px] hover:text-brand transition">
            Início
          </Link>
          <a href="#" className="text-text-mid text-[13px] tracking-[1.5px] hover:text-brand transition">
            Nossa História
          </a>
          <span className="text-text-dark text-[13px] tracking-[1.5px]">Presentes</span>
        </div>

        <span className="font-serif text-[22px] tracking-[6px] text-text-dark absolute left-1/2 -translate-x-1/2">
          K &amp; L
        </span>

        <Link
          href="/"
          className="text-brand text-[12px] tracking-[1px] hover:text-brand-hover transition"
        >
          ← Voltar ao início
        </Link>
      </nav>

      {/* ── TOAST DE SUCESSO ── */}
      {showSuccessToast && (
        <div className="bg-bg-warm border-b border-elegant px-6 py-4 text-center relative animate-fade-in z-20">
          <div className="max-w-2xl mx-auto flex items-center justify-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand shrink-0" />
            <p className="text-[13px] text-text-dark">
              Muito obrigado pelo carinho! O presente{" "}
              <span className="font-semibold">"{successGiftName}"</span> foi registrado.
            </p>
          </div>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-mid hover:text-text-dark text-xs p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── CABEÇALHO DA PÁGINA ── */}
      <header className="bg-bg-warm flex flex-col items-center justify-center gap-4 py-16 px-6">
        <span className="text-brand text-[10px] tracking-[4px] uppercase">Presentes</span>
        <h1 className="font-serif text-[44px] md:text-[52px] text-text-dark font-normal">
          Lista de Presentes
        </h1>
        <p className="text-text-mid text-[14px] leading-[1.6] text-center max-w-[560px]">
          Escolha um presente com carinho. O pagamento é feito via Pix, de forma simples e segura.
        </p>
      </header>

      {/* ── CONTEÚDO ── */}
      <main className="flex-grow px-6 md:px-20 py-16">

        {/* FILTROS */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-[11px] tracking-[1.5px] uppercase transition ${
                activeCategory === cat
                  ? "bg-text-dark text-white"
                  : "bg-white border border-elegant text-text-mid hover:border-brand hover:text-brand"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID DE PRESENTES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1280px] mx-auto">
          {filteredGifts.map((gift) => {
            const isFullyPaid = !!gift.is_purchased;
            const isVaquinha = !!gift.is_crowdfunding;
            const collected = Number(gift.amount_collected || 0);
            const totalValue = Number(gift.value || 0);
            const pct = Math.min(Math.round((collected / totalValue) * 100), 100);

            return (
              <div
                key={gift.id}
                className="bg-white border border-elegant flex flex-col relative overflow-hidden group"
              >
                {/* IMAGEM */}
                <div className="relative h-[220px] overflow-hidden bg-[#D4C4A8]">
                  <Image
                    src={gift.imageUrl}
                    alt={gift.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Mais desejado badge */}
                  {gift.id === initialGifts[0]?.id && !isFullyPaid && (
                    <div className="absolute top-4 left-4 bg-brand px-3.5 py-1.5">
                      <span className="text-white text-[10px] tracking-[1px]">⭐ Mais desejado</span>
                    </div>
                  )}

                  {/* Overlay presenteado */}
                  {isFullyPaid && !isVaquinha && (
                    <div className="absolute inset-0 bg-text-dark/60 flex flex-col items-center justify-center gap-2">
                      <span className="text-white text-2xl">✓</span>
                      <span className="text-white text-[11px] tracking-[3px] uppercase">Presenteado</span>
                    </div>
                  )}
                </div>

                {/* DETALHES */}
                <div className="p-5 flex flex-col gap-1.5">
                  <h3 className="font-serif text-[18px] text-text-dark font-normal">{gift.name}</h3>
                  <p className="text-text-mid text-[13px] leading-[1.5] line-clamp-2">
                    {gift.description}
                  </p>
                </div>

                {/* BARRA DE PROGRESSO (vaquinha) */}
                {isVaquinha && (
                  <div className="px-5 pb-2 space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-text-mid">Arrecadado: R$ {collected.toFixed(0)}</span>
                      <span className="text-brand font-semibold">{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-bg-warm overflow-hidden">
                      <div
                        className="h-full bg-brand transition-all duration-1000"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-text-mid tracking-wider">
                      Meta: R$ {totalValue.toFixed(0)}
                    </p>
                  </div>
                )}

                {/* RODAPÉ DO CARD */}
                <div className="px-5 pb-5 flex items-center justify-between mt-auto pt-2">
                  <span className="font-serif text-[20px] text-brand font-normal">
                    {isVaquinha ? `R$ ${totalValue.toFixed(0)}` : `R$ ${totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  </span>

                  {isFullyPaid && !isVaquinha ? (
                    <span className="text-brand text-[12px]">Presenteado 💛</span>
                  ) : (
                    <button
                      onClick={() => handleOpenModal(gift)}
                      className="bg-text-dark text-white text-[12px] tracking-[1px] px-5 py-2.5 hover:bg-brand transition cursor-pointer"
                    >
                      Presentear
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ── MODAL ── */}
      <GiftModal
        gift={selectedGift}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccessClose}
      />

      {/* ── FOOTER ── */}
      <footer className="h-20 bg-bg-dark flex items-center justify-center mt-16">
        <span className="text-text-mid text-[12px] tracking-[2px]">
          K &amp; L · 11.10.2026 · com muito amor
        </span>
      </footer>
    </div>
  );
}
