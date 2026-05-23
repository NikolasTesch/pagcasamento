"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart, Gift as GiftIcon, ArrowLeft, CheckCircle2, MessageCircle } from "lucide-react";
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
  
  // Mensagem de sucesso baseada na URL
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
        // Esconde o toast automaticamente após 10 segundos
        const timer = setTimeout(() => {
          setShowSuccessToast(false);
        }, 10000);
        return () => clearTimeout(timer);
      }
    }
  }, [searchParams, initialGifts]);

  // Lista única de categorias para filtros
  const categories = ["Todos", ...Array.from(new Set(initialGifts.map((g) => g.category)))];

  // Filtra os presentes de acordo com a categoria selecionada
  const filteredGifts = activeCategory === "Todos"
    ? initialGifts
    : initialGifts.filter((g) => g.category === activeCategory);

  const handleOpenModal = (gift: Gift) => {
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  const handleSuccessClose = () => {
    setIsModalOpen(false);
    // Limpa a URL e recarrega para atualizar os dados
    window.location.href = "/presentes";
  };

  return (
    <div className="flex-grow flex flex-col bg-bg-light min-h-screen">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-bg-light/80 backdrop-blur-md border-b border-elegant py-4 px-6 md:px-12 transition">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-serif text-lg tracking-widest hover:text-brand transition flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 text-text-muted" /> Voltar
          </Link>
          <span className="font-serif text-base tracking-widest text-text-dark uppercase">
            Lista de Presentes
          </span>
          <div className="w-6" /> {/* Espaçador */}
        </div>
      </nav>

      {/* TOAST DE SUCESSO APRIMORADO */}
      {showSuccessToast && (
        <div className="bg-[#2D6A4F]/10 border-b border-[#2D6A4F]/30 px-6 py-5 text-center relative animate-fade-in z-20">
          <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#2D6A4F] shrink-0" />
            <div className="text-left text-sm">
              <p className="font-bold text-[#2D6A4F] leading-tight">Muito obrigado pelo seu carinho!</p>
              <p className="text-xs text-text-dark mt-0.5">
                O seu presente para <span className="font-semibold">"{successGiftName}"</span> foi registrado no nosso sistema com sucesso!
              </p>
            </div>
            {/* LINK WHATSAPP OPCIONAL PARA ENVIAR MENSAGEM */}
            <a 
              href={`https://wa.me/5573999760129?text=Ol%C3%A1%20Katharyna%20e%20Leonardo!%20Acabei%20de%20enviar%20um%20presente%20de%20casamento%20para%20voc%C3%AAs%3A%20${encodeURIComponent(successGiftName)}.%20Que%20voc%C3%AAs%20sejam%20muito%20felizes!`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition md:ml-4 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Enviar no WhatsApp
            </a>
          </div>
          <button 
            onClick={() => setShowSuccessToast(false)} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark p-1 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-12">
        {/* TEXTO DE BOAS-VINDAS */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="text-[10px] uppercase tracking-widest bg-brand/10 text-brand px-3 py-1 rounded-full font-bold">
            Presentes Simbólicos
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-light tracking-tight text-text-dark">
            Ajude-nos a montar nossa casinha
          </h2>
          <p className="text-xs md:text-sm text-text-muted leading-relaxed">
            Criamos uma lista de presentes simbólicos. Ao escolher um presente, você fará uma contribuição Pix via **InfinitePay sem taxas** diretamente para a nossa conta. Você também pode contribuir com cotas de qualquer valor nos nossos itens de vaquinha!
          </p>
          <div className="w-8 h-[1.5px] bg-brand mx-auto mt-4" />
        </div>

        {/* FILTROS DE CATEGORIA */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition ${
                activeCategory === cat
                  ? "bg-brand text-white shadow-md"
                  : "bg-white border border-elegant hover:bg-bg-warm/30 text-text-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID DE PRESENTES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGifts.map((gift) => {
            const isFullyPaid = !!gift.is_purchased;
            const isVaquinha = !!gift.is_crowdfunding;
            const collected = Number(gift.amount_collected || 0);
            const totalValue = Number(gift.value || 0);
            // Calcula o percentual arrecadado para vaquinhas
            const pct = Math.min(Math.round((collected / totalValue) * 100), 100);

            return (
              <div 
                key={gift.id} 
                className={`group bg-white border border-elegant rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative ${
                  isFullyPaid && !isVaquinha ? "opacity-75" : ""
                }`}
              >
                {/* SELO DE CATEGORIA */}
                <span className="absolute top-4 left-4 z-10 text-[9px] uppercase tracking-widest bg-white/90 backdrop-blur-sm text-text-dark px-2.5 py-1 rounded-full font-bold shadow-sm border border-elegant">
                  {gift.category}
                </span>

                {/* IMAGEM DO CARD COM HOVER EFFECT */}
                <div className="relative aspect-video w-full overflow-hidden bg-bg-warm">
                  <img 
                    src={gift.imageUrl} 
                    alt={gift.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  
                  {/* OVERLAY COMPRADO */}
                  {isFullyPaid && !isVaquinha && (
                    <div className="absolute inset-0 bg-text-dark/40 backdrop-blur-xs flex items-center justify-center animate-fade-in">
                      <span className="bg-[#2D6A4F] text-white text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-2 rounded-full shadow-md flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> Presenteado!
                      </span>
                    </div>
                  )}
                </div>

                {/* DETALHES DO CARD */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-base font-semibold text-text-dark leading-tight">
                        {gift.name}
                      </h3>
                      {/* TIPO DE PRESENTE */}
                      {isVaquinha && (
                        <span className="text-[9px] uppercase font-bold bg-[#B8A18E]/25 text-[#A08A77] px-2 py-0.5 rounded-sm">
                          Vaquinha
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                      {gift.description}
                    </p>
                  </div>

                  {/* BARRA DE PROGRESSO OU VALOR UNITÁRIO */}
                  <div className="mt-6 pt-4 border-t border-elegant/50 space-y-3">
                    {isVaquinha ? (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-text-muted">Progresso:</span>
                          <span className="text-[#2D6A4F] font-bold">{pct}%</span>
                        </div>
                        {/* BARRA */}
                        <div className="w-full h-2.5 bg-bg-warm rounded-full overflow-hidden border border-elegant/50 shadow-inner">
                          <div 
                            className="h-full bg-gradient-to-r from-brand to-[#2D6A4F] rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-text-muted uppercase font-semibold tracking-wider pt-0.5">
                          <span>R$ {collected.toFixed(2)} arrecadados</span>
                          <span>Meta: R$ {totalValue.toFixed(2)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Valor unitário:</span>
                        <span className="font-bold text-[#2d6a4f] text-base">R$ {totalValue.toFixed(2)}</span>
                      </div>
                    )}

                    {/* BOTÃO PRESENTEAR */}
                    {isFullyPaid && !isVaquinha ? (
                      <button
                        disabled
                        className="w-full bg-[#E8E2D9] text-text-muted py-3 px-4 rounded-xl font-semibold tracking-wider text-xs uppercase cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        Já Presenteado 💝
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenModal(gift)}
                        className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white py-3 px-4 rounded-xl font-semibold tracking-wider text-xs uppercase transition shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 duration-200"
                      >
                        <GiftIcon className="w-3.5 h-3.5" /> Presentear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* MODAL DE PRESENTEAR */}
      <GiftModal 
        gift={selectedGift}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccessClose}
      />

      {/* FOOTER */}
      <footer className="py-12 px-6 bg-white border-t border-elegant text-center mt-12">
        <p className="font-serif text-lg italic text-brand mb-2">Katharyna &amp; Leonardo</p>
        <p className="text-[10px] text-text-muted tracking-widest uppercase">
          © 2026 · Feito com amor 💕
        </p>
      </footer>
    </div>
  );
}
