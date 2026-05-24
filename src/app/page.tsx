"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const GALLERY_IMAGES = [
  { src: "/images/hero-1.png", alt: "Katharyna & Leonardo - Momentos" },
  { src: "/images/hero-2.png", alt: "Katharyna & Leonardo - Abraçados" },
  { src: "/images/hero-3.png", alt: "Katharyna & Leonardo - Sorrindo" },
  { src: "/images/story-1.png", alt: "Katharyna & Leonardo - Cumplicidade" },
  { src: "/images/story-3.png", alt: "Katharyna & Leonardo - Amor" },
  { src: "/images/story-2.png", alt: "Katharyna & Leonardo - Juntos" },
  { src: "/images/casal.png", alt: "Katharyna & Leonardo - Felicidade" },
];

const couple = {
  firstName: "Katharyna",
  secondName: "Leonardo",
  initials: "K & L",
  date: "11 de Outubro, 2026",
  dateShort: "11 · 10 · 2026",
  dateFooter: "11.10.2026",
  time: "15h30 — Cerimônia",
  venueName: "Sítio São Bento",
  venueCity: "TX-BA",
  venueAddress:
    "Teixeira de Freitas - BA",
  mapsUrl: "https://goo.gl/maps/pK5RkuVjvB13S3eM6?g_st=aw",
  message:
    "Ficamos extremamente felizes em contar com a sua presença neste dia tão especial para nós! Se desejar nos presentear, criamos uma lista de presentes simbólicos onde você pode realizar o pagamento via Pix de forma simples.",
};

export default function HomePage() {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  // Lightbox Handlers
  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
    document.body.style.overflow = "";
  };

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((prev) => (prev !== null && prev < GALLERY_IMAGES.length - 1 ? prev + 1 : 0));
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : GALLERY_IMAGES.length - 1));
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchStartY.current = e.changedTouches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    // Só swipe horizontal quando o movimento X for dominante
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) nextImage();
      else prevImage();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex]);

  return (
    <div className="flex-grow flex flex-col bg-bg-light font-sans">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-elegant px-5 md:px-20 h-16 md:h-20 flex items-center justify-between">
        {/* Desktop: links à esquerda */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-text-mid text-[13px] tracking-[1.5px] hover:text-brand transition">
            Início
          </Link>
          <a href="#historia" className="text-text-mid text-[13px] tracking-[1.5px] hover:text-brand transition">
            Nossa História
          </a>
          <Link href="/presentes" className="text-text-mid text-[13px] tracking-[1.5px] hover:text-brand transition">
            Presentes
          </Link>
        </div>

        {/* Mobile: espaçador para equilibrar o logo centralizado */}
        <div className="md:hidden w-14" />

        <span className="font-serif text-[20px] md:text-[22px] tracking-[5px] md:tracking-[6px] text-text-dark absolute left-1/2 -translate-x-1/2">
          {couple.initials}
        </span>

        <Link
          href="/presentes"
          className="bg-text-dark text-white text-[10px] md:text-[11px] tracking-[1.5px] md:tracking-[2px] px-4 md:px-7 py-2.5 md:py-3 hover:bg-brand transition whitespace-nowrap"
        >
          <span className="md:hidden">PRESENTES</span>
          <span className="hidden md:inline">LISTA DE PRESENTES</span>
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className="flex flex-col md:flex-row md:h-[700px]">
        {/* Coluna de texto */}
        <div className="md:w-[580px] shrink-0 bg-bg-light flex flex-col justify-center gap-5 md:gap-7 px-6 md:px-20 py-10 md:py-0">
          <span className="text-brand text-[11px] tracking-[4px] uppercase">Casamento</span>

          <h1 className="font-serif text-[44px] md:text-[72px] leading-[1.05] text-text-dark font-normal">
            {couple.firstName}
            <br />
            <span>&amp; {couple.secondName}</span>
          </h1>

          <p className="text-text-mid text-[14px] md:text-[15px] leading-[1.7]">
            Uma história de amor que começa aqui,
            <br className="hidden md:block" />
            para durar uma vida inteira.
          </p>

          <div className="flex items-center gap-4">
            <div className="w-10 h-px bg-brand" />
            <span className="text-brand text-[12px] tracking-[3px]">{couple.dateShort}</span>
            <div className="w-10 h-px bg-brand" />
          </div>

          <Link
            href="/presentes"
            className="self-start bg-brand text-white text-[11px] tracking-[2.5px] px-8 md:px-9 py-4 md:py-[15px] hover:bg-brand-hover transition"
          >
            VER LISTA DE PRESENTES
          </Link>
        </div>

        {/* Mosaico de fotos */}
        <div className="flex-1 flex gap-[3px] min-h-[280px] md:min-h-0">
          <div 
            onClick={() => openLightbox(0)}
            className="flex-1 relative bg-[#C9B8A0] overflow-hidden group cursor-pointer"
          >
            <Image
              src="/images/hero-1.png"
              alt={`${couple.firstName} e ${couple.secondName}`}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 30vw"
              priority
            />
            <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="bg-white/95 text-text-dark text-[10px] tracking-[2px] px-3.5 py-2 uppercase rounded-sm shadow-sm backdrop-blur-[2px]">Ampliar</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-[3px]">
            <div 
              onClick={() => openLightbox(1)}
              className="flex-1 relative bg-[#DDD0BE] overflow-hidden group cursor-pointer"
            >
              <Image
                src="/images/hero-2.png"
                alt={`${couple.firstName} e ${couple.secondName}`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white/95 text-text-dark text-[10px] tracking-[2px] px-3.5 py-2 uppercase rounded-sm shadow-sm backdrop-blur-[2px]">Ampliar</span>
              </div>
            </div>
            <div 
              onClick={() => openLightbox(2)}
              className="flex-1 relative bg-[#B8A890] overflow-hidden group cursor-pointer"
            >
              <Image
                src="/images/hero-3.png"
                alt={`${couple.firstName} e ${couple.secondName}`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white/95 text-text-dark text-[10px] tracking-[2px] px-3.5 py-2 uppercase rounded-sm shadow-sm backdrop-blur-[2px]">Ampliar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DETALHES DO EVENTO ── */}
      <section className="bg-bg-dark py-10 md:h-[180px] flex flex-col md:flex-row items-center divide-y md:divide-y-0 divide-bg-dark-muted">
        <div className="flex-1 w-full flex flex-col items-center justify-center gap-3 py-8 md:py-0">
          <span className="text-brand text-[10px] tracking-[3px] uppercase">Data</span>
          <div className="w-[30px] h-px bg-brand" />
          <span className="text-white text-[15px] tracking-[0.5px]">{couple.date}</span>
        </div>

        <div className="hidden md:block w-px h-20 bg-bg-dark-muted" />

        <div className="flex-1 w-full flex flex-col items-center justify-center gap-3 py-8 md:py-0">
          <span className="text-brand text-[10px] tracking-[3px] uppercase">Local</span>
          <div className="w-[30px] h-px bg-brand" />
          <span className="text-white text-[15px] tracking-[0.5px]">
            {couple.venueName} · {couple.venueCity}
          </span>
          <a
            href={couple.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand text-[11px] tracking-[1px] hover:text-white transition"
          >
            Ver no Maps →
          </a>
        </div>

        <div className="hidden md:block w-px h-20 bg-bg-dark-muted" />

        <div className="flex-1 w-full flex flex-col items-center justify-center gap-3 py-8 md:py-0">
          <span className="text-brand text-[10px] tracking-[3px] uppercase">Horário</span>
          <div className="w-[30px] h-px bg-brand" />
          <span className="text-white text-[15px] tracking-[0.5px]">{couple.time}</span>
        </div>
      </section>

      {/* ── NOSSA HISTÓRIA ── */}
      <section id="historia" className="flex flex-col md:flex-row md:h-[620px]">
        {/* Mosaico de fotos */}
        <div className="md:w-[640px] shrink-0 flex gap-1 min-h-[300px] md:min-h-0">
          <div 
            onClick={() => openLightbox(3)}
            className="flex-1 relative bg-[#E2D4C2] overflow-hidden group cursor-pointer"
          >
            <Image
              src="/images/story-1.png"
              alt="Nossa história"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="bg-white/95 text-text-dark text-[10px] tracking-[2px] px-3.5 py-2 uppercase rounded-sm shadow-sm backdrop-blur-[2px]">Ampliar</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div 
              onClick={() => openLightbox(5)}
              className="flex-1 relative bg-[#BDA88C] overflow-hidden group cursor-pointer"
            >
              <Image
                src="/images/story-2.png"
                alt="Nossa história"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 18vw"
              />
              <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white/95 text-text-dark text-[10px] tracking-[2px] px-3.5 py-2 uppercase rounded-sm shadow-sm backdrop-blur-[2px]">Ampliar</span>
              </div>
            </div>
            <div 
              onClick={() => openLightbox(4)}
              className="flex-1 relative bg-[#D4C4A8] overflow-hidden group cursor-pointer"
            >
              <Image
                src="/images/story-3.png"
                alt="Nossa história"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 18vw"
              />
              <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white/95 text-text-dark text-[10px] tracking-[2px] px-3.5 py-2 uppercase rounded-sm shadow-sm backdrop-blur-[2px]">Ampliar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Texto */}
        <div className="flex-1 flex flex-col justify-center gap-5 md:gap-7 px-6 md:px-20 py-10 md:py-0">
          <span className="text-brand text-[10px] tracking-[4px] uppercase">Nossa História</span>

          <h2 className="font-serif text-[30px] md:text-[40px] leading-[1.2] text-text-dark font-normal">
            Uma história<br />escrita no destino
          </h2>

          <p className="text-text-mid text-[15px] leading-[1.8]">
            {couple.message}
          </p>

          <div className="w-[50px] h-px bg-brand" />
        </div>
      </section>

      {/* ── GALERIA DE FOTOS ── */}
      <section className="bg-bg-light py-12 md:py-20 px-4 md:px-20 border-t border-elegant">
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <span className="text-brand text-[10px] tracking-[4px] uppercase mb-3">Galeria</span>
          <h2 className="font-serif text-[28px] md:text-[44px] leading-tight text-text-dark font-normal">
            Nossos Momentos
          </h2>
          <div className="w-[50px] h-px bg-brand mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-[1200px] mx-auto">
          {/* Foto 1 (Grande) */}
          <div
            onClick={() => openLightbox(0)}
            className="col-span-2 md:col-span-2 md:row-span-2 relative group overflow-hidden cursor-pointer bg-bg-warm rounded-sm h-[260px] sm:h-[340px] md:h-[500px] shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <Image
              src="/images/hero-1.png"
              alt="Katharyna & Leonardo - Momentos"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="bg-white/95 text-text-dark text-[11px] tracking-[2px] px-4.5 py-2.5 uppercase rounded-sm shadow-sm backdrop-blur-[2px]">Visualizar</span>
            </div>
          </div>

          {/* Foto 2 */}
          <div
            onClick={() => openLightbox(1)}
            className="relative group overflow-hidden cursor-pointer bg-bg-warm rounded-sm h-[160px] sm:h-[200px] md:h-[242px] shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <Image
              src="/images/hero-2.png"
              alt="Katharyna & Leonardo - Momentos"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="bg-white/95 text-text-dark text-[11px] tracking-[2px] px-4.5 py-2.5 uppercase rounded-sm shadow-sm backdrop-blur-[2px]">Visualizar</span>
            </div>
          </div>

          {/* Foto 3 */}
          <div
            onClick={() => openLightbox(2)}
            className="relative group overflow-hidden cursor-pointer bg-bg-warm rounded-sm h-[160px] sm:h-[200px] md:h-[242px] shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <Image
              src="/images/hero-3.png"
              alt="Katharyna & Leonardo - Momentos"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="bg-white/95 text-text-dark text-[11px] tracking-[2px] px-4.5 py-2.5 uppercase rounded-sm shadow-sm backdrop-blur-[2px]">Visualizar</span>
            </div>
          </div>

          {/* Foto 4 */}
          <div
            onClick={() => openLightbox(3)}
            className="relative group overflow-hidden cursor-pointer bg-bg-warm rounded-sm h-[160px] sm:h-[200px] md:h-[242px] shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <Image
              src="/images/story-1.png"
              alt="Katharyna & Leonardo - Momentos"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="bg-white/95 text-text-dark text-[11px] tracking-[2px] px-4.5 py-2.5 uppercase rounded-sm shadow-sm backdrop-blur-[2px]">Visualizar</span>
            </div>
          </div>

          {/* Foto 5 */}
          <div
            onClick={() => openLightbox(4)}
            className="relative group overflow-hidden cursor-pointer bg-bg-warm rounded-sm h-[160px] sm:h-[200px] md:h-[242px] shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <Image
              src="/images/story-3.png"
              alt="Katharyna & Leonardo - Momentos"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="bg-white/95 text-text-dark text-[11px] tracking-[2px] px-4.5 py-2.5 uppercase rounded-sm shadow-sm backdrop-blur-[2px]">Visualizar</span>
            </div>
          </div>

          {/* Foto 6 (Larga) */}
          <div
            onClick={() => openLightbox(5)}
            className="col-span-2 relative group overflow-hidden cursor-pointer bg-bg-warm rounded-sm h-[160px] sm:h-[200px] md:h-[242px] shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <Image
              src="/images/story-2.png"
              alt="Katharyna & Leonardo - Momentos"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="bg-white/95 text-text-dark text-[11px] tracking-[2px] px-4.5 py-2.5 uppercase rounded-sm shadow-sm backdrop-blur-[2px]">Visualizar</span>
            </div>
          </div>

          {/* Foto 7 */}
          <div
            onClick={() => openLightbox(6)}
            className="relative group overflow-hidden cursor-pointer bg-bg-warm rounded-sm h-[160px] sm:h-[200px] md:h-[242px] shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <Image
              src="/images/casal.png"
              alt="Katharyna & Leonardo - Momentos"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="bg-white/95 text-text-dark text-[11px] tracking-[2px] px-4.5 py-2.5 uppercase rounded-sm shadow-sm backdrop-blur-[2px]">Visualizar</span>
            </div>
          </div>

          {/* Card Editorial */}
          <div className="bg-bg-warm border border-brand/20 p-4 md:p-6 flex flex-col justify-center items-center text-center rounded-sm h-[160px] sm:h-[200px] md:h-[242px] shadow-sm">
            <span className="font-serif text-[28px] tracking-[4px] text-brand mb-2">K & L</span>
            <p className="text-text-mid text-[12px] leading-relaxed italic max-w-[200px]">
              "O amor é a luz que ilumina o início de uma eternidade juntos."
            </p>
            <div className="w-8 h-[1px] bg-brand mt-4" />
          </div>
        </div>
      </section>

      {/* ── GIFT CTA ── */}
      <section className="bg-bg-warm flex flex-col items-center justify-center gap-6 md:gap-8 py-14 md:py-24 px-6">
        <span className="text-brand text-[10px] tracking-[4px] uppercase">Lista de Presentes</span>

        <h2 className="font-serif text-[28px] md:text-[44px] leading-[1.2] text-text-dark text-center font-normal max-w-[600px]">
          Presenteie o casal<br />com muito amor
        </h2>

        <p className="text-text-mid text-[14px] leading-[1.7] text-center max-w-[480px]">
          Escolha um presente especial e contribua via Pix de forma rápida, segura e com todo o carinho.
        </p>

        <Link
          href="/presentes"
          className="bg-brand text-white text-[11px] tracking-[2.5px] px-10 md:px-12 py-4 hover:bg-brand-hover transition"
        >
          VER TODOS OS PRESENTES
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="h-16 md:h-20 bg-bg-dark flex items-center justify-center">
        <span className="text-text-mid text-[12px] tracking-[2px]">
          {couple.initials} · {couple.dateFooter} · com muito amor
        </span>
      </footer>

      {/* ── LIGHTBOX MODAL ── */}
      {activeImageIndex !== null && (
        <div
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        >
          {/* Botão Fechar */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-[110] p-3 text-white/80 hover:text-white bg-black/25 hover:bg-black/55 rounded-full transition-all duration-300 hover:rotate-90 flex items-center justify-center cursor-pointer border border-white/10"
            aria-label="Fechar galeria"
          >
            <X size={22} />
          </button>

          {/* Botões laterais — ocultos no mobile (usa swipe) */}
          <button
            onClick={prevImage}
            className="hidden md:flex absolute left-8 z-[110] p-4 text-white/80 hover:text-white hover:scale-105 bg-black/25 hover:bg-black/55 rounded-full transition-all duration-300 items-center justify-center cursor-pointer border border-white/10"
            aria-label="Imagem anterior"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Imagem */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col items-center"
          >
            <div className="relative w-[92vw] h-[72vh] md:w-[75vw] md:h-[80vh]">
              <Image
                src={GALLERY_IMAGES[activeImageIndex].src}
                alt={GALLERY_IMAGES[activeImageIndex].alt}
                fill
                className="object-contain select-none"
                priority
              />
            </div>

            {/* Contador + dica de swipe no mobile */}
            <div className="flex flex-col items-center gap-1 mt-4">
              <span className="text-white/60 text-[12px] tracking-[3px] uppercase select-none font-sans">
                Foto {activeImageIndex + 1} de {GALLERY_IMAGES.length}
              </span>
              <span className="md:hidden text-white/35 text-[11px] tracking-[1.5px] select-none font-sans">
                ← deslize para navegar →
              </span>
            </div>
          </div>

          {/* Botão Próximo — oculto no mobile */}
          <button
            onClick={nextImage}
            className="hidden md:flex absolute right-8 z-[110] p-4 text-white/80 hover:text-white hover:scale-105 bg-black/25 hover:bg-black/55 rounded-full transition-all duration-300 items-center justify-center cursor-pointer border border-white/10"
            aria-label="Próxima imagem"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
}
