"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Calendar, Clock, MapPin, Maximize2, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import CountdownTimer from "@/components/CountdownTimer";
import ScrollReveal from "@/components/ScrollReveal";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";
import GalleryLightbox from "@/components/GalleryLightbox";
import FloralDecoration from "@/components/FloralDecoration";
import { couple, GALLERY_IMAGES } from "@/data/couple";

export default function HomeShell() {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);

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
      setActiveImageIndex((prev) =>
        prev !== null && prev < GALLERY_IMAGES.length - 1 ? prev + 1 : 0
      );
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((prev) =>
        prev !== null && prev > 0 ? prev - 1 : GALLERY_IMAGES.length - 1
      );
    }
  };

  return (
    <div className="relative flex-grow flex flex-col bg-bg-light font-sans">
      <FloralDecoration position="both" />

      <Navbar
        items={[
          { label: "Início", href: "/" },
          { label: "Nossa História", href: "/#historia" },
          { label: "O Convite", href: "/#convite" },
          { label: "Presentes", href: "/presentes" },
        ]}
        initials={couple.initials}
        rightSlot={
          <Link
            href="/presentes"
            className="bg-text-dark text-white text-[10px] md:text-[11px] tracking-[1.5px] md:tracking-[2px] px-4 md:px-7 py-2.5 md:py-3 hover:bg-brand transition whitespace-nowrap"
          >
            <span className="md:hidden">PRESENTES</span>
            <span className="hidden md:inline">LISTA DE PRESENTES</span>
          </Link>
        }
      />

      {/* ── HERO ── */}
      <section className="flex flex-col md:flex-row md:h-[700px]">
        <ScrollReveal delay={100} className="md:w-[580px] shrink-0 bg-bg-light flex flex-col justify-center gap-5 md:gap-7 px-6 md:px-20 py-10 md:py-0">
          <span className="text-text-mid text-[11px] tracking-[4px] uppercase">Casamento</span>

          <h1 className="font-script text-[44px] md:text-[72px] leading-[1.05] text-brand drop-shadow-sm">
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
            <span className="text-text-mid text-[12px] tracking-[3px]">{couple.dateShort}</span>
            <div className="w-10 h-px bg-brand" />
          </div>

          <Link
            href="/presentes"
            className="self-start bg-brand text-white text-[11px] tracking-[2.5px] px-8 md:px-9 py-4 md:py-[15px] hover:bg-brand-hover transition"
          >
            VER LISTA DE PRESENTES
          </Link>
        </ScrollReveal>

        {/* Mosaico de fotos */}
        <div className="flex-1 flex gap-[3px] min-h-[280px] md:min-h-0">
          <div
            onClick={() => openLightbox(0)}
            className="flex-1 relative bg-[#C9B8A0] overflow-hidden group cursor-pointer"
          >
            <Image
              src="/images/hero-1.webp"
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
                src="/images/hero-2.webp"
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
                src="/images/hero-3.webp"
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

      {/* ── COUNTDOWN ── */}
      <ScrollReveal delay={100}>
        <CountdownTimer />
      </ScrollReveal>

      {/* ── DETALHES DO EVENTO ── */}
      <ScrollReveal delay={200}>
      <section className="bg-bg-dark py-10 md:h-[180px] flex flex-col md:flex-row items-center divide-y md:divide-y-0 divide-bg-dark-muted">
        <div className="flex-1 w-full flex flex-col items-center justify-center gap-3 py-8 md:py-0">
          <span className="text-brand-light text-[10px] tracking-[3px] uppercase">Data</span>
          <div className="w-[30px] h-px bg-brand" />
          <span className="text-white text-[15px] tracking-[0.5px]">{couple.date}</span>
        </div>

        <div className="hidden md:block w-px h-20 bg-bg-dark-muted" />

        <div className="flex-1 w-full flex flex-col items-center justify-center gap-3 py-8 md:py-0">
          <span className="text-brand-light text-[10px] tracking-[3px] uppercase">Local</span>
          <div className="w-[30px] h-px bg-brand" />
          <span className="text-white text-[15px] tracking-[0.5px]">
            {couple.venueName} · {couple.venueCity}
          </span>
          <a
            href={couple.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-light text-[11px] tracking-[1px] hover:text-white transition"
          >
            Ver no Maps →
          </a>
        </div>

        <div className="hidden md:block w-px h-20 bg-bg-dark-muted" />

        <div className="flex-1 w-full flex flex-col items-center justify-center gap-3 py-8 md:py-0">
          <span className="text-brand-light text-[10px] tracking-[3px] uppercase">Horário</span>
          <div className="w-[30px] h-px bg-brand" />
          <span className="text-white text-[15px] tracking-[0.5px]">{couple.time}</span>
        </div>
      </section>
      </ScrollReveal>

      {/* ── MAPA ── */}
      <ScrollReveal delay={250}>
        <MapSection />
      </ScrollReveal>

      {/* ── NOSSA HISTÓRIA ── */}
      <ScrollReveal delay={300}>
      <section id="historia" className="flex flex-col md:flex-row md:h-[620px]">
        {/* Mosaico de fotos */}
        <div className="md:w-[640px] shrink-0 flex gap-1 min-h-[300px] md:min-h-0">
          <div
            onClick={() => openLightbox(3)}
            className="flex-1 relative bg-[#E2D4C2] overflow-hidden group cursor-pointer"
          >
            <Image
              src="/images/story-1.webp"
              alt="Nossa história"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="bg-white/95 text-text-dark text-[11px] tracking-[2px] px-4.5 py-2.5 uppercase rounded-sm shadow-sm backdrop-blur-[2px]">Ampliar</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div
              onClick={() => openLightbox(5)}
              className="flex-1 relative bg-[#BDA88C] overflow-hidden group cursor-pointer"
            >
              <Image
                src="/images/story-2.webp"
                alt="Nossa história"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 18vw"
              />
              <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white/95 text-text-dark text-[11px] tracking-[2px] px-4.5 py-2.5 uppercase rounded-sm shadow-sm backdrop-blur-[2px]">Ampliar</span>
              </div>
            </div>
            <div
              onClick={() => openLightbox(4)}
              className="flex-1 relative bg-[#D4C4A8] overflow-hidden group cursor-pointer"
            >
              <Image
                src="/images/story-3.webp"
                alt="Nossa história"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 18vw"
              />
              <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white/95 text-text-dark text-[11px] tracking-[2px] px-4.5 py-2.5 uppercase rounded-sm shadow-sm backdrop-blur-[2px]">Ampliar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Texto */}
        <div className="flex-1 flex flex-col justify-center gap-5 md:gap-7 px-6 md:px-20 py-10 md:py-0">
          <span className="text-text-mid text-[10px] tracking-[4px] uppercase">Nossa História</span>

          <h2 className="font-serif text-[30px] md:text-[40px] leading-[1.2] text-text-dark font-normal">
            Uma história<br />escrita no destino
          </h2>

          <p className="text-text-mid text-[15px] leading-[1.8]">
            {couple.message}
          </p>

          <div className="w-[50px] h-px bg-brand" />
        </div>
      </section>
      </ScrollReveal>

      {/* ── O CONVITE ── */}
      <ScrollReveal delay={350}>
      <section id="convite" className="bg-bg-warm/60 py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-20 border-t border-elegant overflow-hidden">
        <div className="max-w-[1140px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

            {/* LATERAL ESQUERDA: CONVITE INTEIRO COM ESTILO 3D INCLINADO */}
            <div className="w-full lg:w-[480px] shrink-0 flex flex-col items-center py-4 sm:py-8">
              <div className="relative group cursor-pointer w-full max-w-[340px] sm:max-w-[440px] lg:max-w-[460px] mx-auto [perspective:1200px]">
                
                {/* Cartão do Convite Inclinado em 3D que fica reto no Hover/Toque */}
                <div
                  onClick={() => {
                    setIsInvitationOpen(true);
                    document.body.style.overflow = "hidden";
                  }}
                  className="relative transition-all duration-700 ease-out transform-gpu rotate-[-5deg] sm:rotate-[-7deg] -skew-y-1 sm:-skew-y-2 group-hover:rotate-0 group-hover:skew-y-0 group-hover:scale-[1.04] active:rotate-0 active:skew-y-0 active:scale-[1.03] shadow-[0_15px_40px_-10px_rgba(61,55,46,0.18)] sm:shadow-[0_20px_50px_-10px_rgba(61,55,46,0.18)] group-hover:shadow-[0_30px_70px_-15px_rgba(184,151,54,0.28)] bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-brand/25"
                >
                  {/* Moldura interna */}
                  <div className="relative overflow-hidden rounded-xl border border-brand/15 bg-bg-light">
                    <Image
                      src="/images/convite.webp"
                      alt="Convite de Casamento Leonardo & Katharyna"
                      width={800}
                      height={1422}
                      className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 90vw, 460px"
                      priority
                    />

                    {/* Overlay interativo no hover */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white/95 text-text-dark text-[10px] sm:text-[11px] tracking-[2px] sm:tracking-[2.5px] px-3.5 sm:px-4 py-2 sm:py-2.5 uppercase rounded-full shadow-lg font-medium flex items-center gap-2 backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-300">
                        <Maximize2 className="w-3.5 h-3.5 text-brand" />
                        Ampliar Convite
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags / Badges Flutuantes (Otimizados para telas de Celular) */}
                <div className="absolute -top-3 left-0 sm:-top-5 sm:-left-5 z-10 pointer-events-none transition-all duration-700 ease-out group-hover:-translate-y-1.5 group-hover:translate-x-1">
                  <div className="bg-white/95 backdrop-blur-md text-text-dark text-[10px] sm:text-[12px] font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md border border-brand/20 flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                    <span className="tracking-wide">Convite Oficial</span>
                  </div>
                </div>

                <div className="absolute -top-3 right-0 sm:-top-4 sm:-right-5 z-10 pointer-events-none transition-all duration-700 ease-out group-hover:-translate-y-1.5 group-hover:-translate-x-1">
                  <div className="bg-white/95 backdrop-blur-md text-text-dark text-[10px] sm:text-[12px] font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md border border-brand/20 flex items-center gap-1.5 sm:gap-2">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand" />
                    <span>11 de Outubro</span>
                  </div>
                </div>

                <div className="absolute -bottom-3 left-0 sm:-bottom-4 sm:-left-5 z-10 pointer-events-none transition-all duration-700 ease-out group-hover:translate-y-1.5 group-hover:translate-x-1">
                  <div className="bg-white/95 backdrop-blur-md text-text-dark text-[10px] sm:text-[12px] font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md border border-brand/20 flex items-center gap-1.5 sm:gap-2">
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand" />
                    <span>Sítio São Bento</span>
                  </div>
                </div>

              </div>

              <p className="text-text-mid text-[11px] tracking-[2px] mt-6 text-center flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5 text-brand" />
                Toque para ampliar o convite
              </p>
            </div>

            {/* LATERAL DIREITA: TEXTO CTA */}
            <div className="w-full lg:flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left gap-5">
              <span className="text-brand text-[11px] tracking-[4px] uppercase font-semibold">
                Convite de Casamento
              </span>

              <h2 className="font-serif text-[30px] sm:text-[40px] lg:text-[46px] leading-[1.15] text-text-dark font-normal">
                Você faz parte da nossa história
              </h2>

              <div className="w-[60px] h-px bg-brand my-1" />

              <p className="text-text-mid text-[14px] sm:text-[16px] leading-[1.8] max-w-[540px]">
                Com imensa alegria, convidamos você para celebrar o nosso amor e testemunhar o início desta linda união. Sua presença tornará nosso dia ainda mais inesquecível!
              </p>

              {/* Card com Detalhes do Evento */}
              <div className="w-full max-w-[540px] bg-white/80 backdrop-blur-sm border border-brand/20 p-4 sm:p-5 rounded-lg shadow-sm flex flex-col gap-3.5 my-2">
                <div className="flex items-center gap-3.5 text-left">
                  <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-[2px] text-text-mid font-medium">Data</span>
                    <span className="text-[14px] sm:text-[15px] font-semibold text-text-dark">{couple.date}</span>
                  </div>
                </div>

                <div className="w-full h-px bg-brand/10" />

                <div className="flex items-center gap-3.5 text-left">
                  <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-[2px] text-text-mid font-medium">Horário</span>
                    <span className="text-[14px] sm:text-[15px] font-semibold text-text-dark">{couple.time}</span>
                  </div>
                </div>

                <div className="w-full h-px bg-brand/10" />

                <div className="flex items-center gap-3.5 text-left">
                  <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-[2px] text-text-mid font-medium">Local</span>
                    <span className="text-[14px] sm:text-[15px] font-semibold text-text-dark">{couple.venueName} · {couple.venueCity}</span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-[540px] pt-2">
                <a
                  href="https://wa.me/557398463518?text=Ol%C3%A1!%20Gostaria%20de%20confirmar%20minha%20presen%C3%A7a%20no%20casamento%20de%20Leonardo%20%26%20Katharyna!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 bg-brand text-white font-medium text-[11px] sm:text-[12px] tracking-[2px] uppercase px-6 py-4 rounded-sm hover:bg-brand-hover transition shadow-sm flex items-center justify-center gap-2 text-center"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  Confirmar Presença
                </a>

                <Link
                  href="/presentes"
                  className="w-full sm:w-auto flex-1 border border-brand text-brand font-medium text-[11px] sm:text-[12px] tracking-[2px] uppercase px-6 py-4 rounded-sm hover:bg-brand hover:text-white transition text-center"
                >
                  Lista de Presentes
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ── GALERIA DE FOTOS ── */}
      <ScrollReveal delay={400}>
      <section className="bg-bg-light py-12 md:py-20 px-4 md:px-20 border-t border-elegant">
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <span className="text-text-mid text-[10px] tracking-[4px] uppercase mb-3">Galeria</span>
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
              src="/images/hero-1.webp"
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
              src="/images/hero-2.webp"
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
              src="/images/hero-3.webp"
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
              src="/images/story-1.webp"
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
              src="/images/story-3.webp"
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
              src="/images/story-2.webp"
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
              src="/images/casal.webp"
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
      </ScrollReveal>

      {/* ── GIFT CTA ── */}
      <ScrollReveal delay={500}>
      <section className="bg-bg-warm flex flex-col items-center justify-center gap-6 md:gap-8 py-14 md:py-24 px-6">
        <span className="text-text-mid text-[10px] tracking-[4px] uppercase">Lista de Presentes</span>

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
      </ScrollReveal>

      {/* ── FOOTER ── */}
      <Footer initials={couple.initials} date={couple.dateFooter} />

      {/* ── INVITATION LIGHTBOX ── */}
      {isInvitationOpen && (
        <div
          onClick={() => {
            setIsInvitationOpen(false);
            document.body.style.overflow = "";
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        >
          <button
            onClick={() => {
              setIsInvitationOpen(false);
              document.body.style.overflow = "";
            }}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-[110] p-3 text-white/80 hover:text-white bg-black/25 hover:bg-black/55 rounded-full transition-all duration-300 hover:rotate-90 flex items-center justify-center cursor-pointer border border-white/10"
            aria-label="Fechar"
          >
            <X size={22} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-[92vw] h-[72vh] md:w-[75vw] md:h-[80vh]"
          >
            <Image
              src="/images/convite.webp"
              alt="Convite de Casamento"
              fill
              className="object-contain select-none"
              priority
            />
          </div>
        </div>
      )}

      {/* ── LIGHTBOX MODAL ── */}
      <GalleryLightbox
        images={GALLERY_IMAGES}
        activeIndex={activeImageIndex}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </div>
  );
}
