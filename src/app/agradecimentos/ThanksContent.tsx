"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import GalleryLightbox from "@/components/GalleryLightbox";
import { couple, GALLERY_IMAGES } from "@/data/couple";

export default function ThanksContent() {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

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
    <div className="flex-grow flex flex-col bg-bg-light font-sans">
      {/* ── NAVBAR ── */}
      <Navbar
        items={[
          { label: "Início", href: "/" },
          { label: "Nossa História", href: "/#historia" },
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

      {/* ── HERO DE AGRADECIMENTOS ── */}
      <section className="relative bg-bg-warm overflow-hidden">
        {/* Imagem de fundo decorativa */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 40px, var(--color-brand) 40px, var(--color-brand) 41px)",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 py-20 md:py-28 max-w-3xl mx-auto">
          <span className="text-text-mid text-[11px] tracking-[4px] uppercase mb-4">
            {couple.firstName} & {couple.secondName}
          </span>

          <h1 className="thanks-title font-serif text-[42px] md:text-[64px] leading-[1.1] text-text-dark font-normal mb-6">
            Agradecimentos
          </h1>

          <div className="w-[60px] h-px bg-brand mb-8" />

          <p className="text-text-mid text-[15px] md:text-[17px] leading-[1.9] max-w-[640px]">
            Queridos familiares e amigos,
          </p>

          <p className="text-text-mid text-[15px] md:text-[17px] leading-[1.9] max-w-[640px] mt-4">
            Nosso dia foi tão especial porque cada um de vocês esteve presente,
            torcendo, vibrando e celebrando conosco. Cada abraço, cada olhar,
            cada palavra de carinho ficará guardado para sempre em nossos
            corações.
          </p>

          <p className="text-text-mid text-[15px] md:text-[17px] leading-[1.9] max-w-[640px] mt-4">
            Obrigado por fazerem parte da nossa história e por tornarem este
            momento único e inesquecível. Que a alegria desse dia continue
            iluminando nossos caminhos.
          </p>

          <p className="text-text-mid text-[15px] md:text-[17px] leading-[1.9] max-w-[640px] mt-4">
            Com todo o nosso amor,
            <br />
            <span className="font-serif text-brand text-[18px] md:text-[20px] italic">
              {couple.firstName} & {couple.secondName}
            </span>
          </p>
        </div>
      </section>

      {/* ── GALERIA DE FOTOS ── */}
      <ScrollReveal delay={200}>
      <section className="bg-bg-light py-12 md:py-20 px-4 md:px-20">
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <span className="text-text-mid text-[10px] tracking-[4px] uppercase mb-3">Galeria</span>
          <h2 className="font-serif text-[28px] md:text-[44px] leading-tight text-text-dark font-normal">
            Momentos Especiais
          </h2>
          <div className="w-[50px] h-px bg-brand mt-4" />
        </div>

        {/* Grid Editorial Otimizado para Fotos Verticais (Aspect Ratio 3:4) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-[1140px] mx-auto">
          {/* Foto 1 (Destaque 2 colunas no Mobile / 1 coluna no Desktop 3x3) */}
          <div
            onClick={() => openLightbox(0)}
            className="col-span-2 md:col-span-1 relative aspect-[3/4] group overflow-hidden cursor-pointer bg-bg-warm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-brand/10"
          >
            <Image
              src="/images/couple-1.webp"
              alt="Katharyna & Leonardo - Nossos Momentos"
              fill
              className="object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 sm:pb-6">
              <span className="bg-white/95 text-text-dark text-[10px] sm:text-[11px] font-medium tracking-[2px] px-4 sm:px-5 py-2 sm:py-2.5 uppercase rounded-full shadow-md backdrop-blur-sm">Visualizar</span>
            </div>
          </div>

          {/* Foto 2 */}
          <div
            onClick={() => openLightbox(1)}
            className="col-span-1 relative aspect-[3/4] group overflow-hidden cursor-pointer bg-bg-warm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-brand/10"
          >
            <Image
              src="/images/couple-2.webp"
              alt="Katharyna & Leonardo - Abraçados"
              fill
              className="object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <span className="bg-white/95 text-text-dark text-[10px] font-medium tracking-[2px] px-4 py-2 uppercase rounded-full shadow-md backdrop-blur-sm">Visualizar</span>
            </div>
          </div>

          {/* Foto 3 */}
          <div
            onClick={() => openLightbox(2)}
            className="col-span-1 relative aspect-[3/4] group overflow-hidden cursor-pointer bg-bg-warm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-brand/10"
          >
            <Image
              src="/images/couple-3.webp"
              alt="Katharyna & Leonardo - Sorrindo"
              fill
              className="object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <span className="bg-white/95 text-text-dark text-[10px] font-medium tracking-[2px] px-4 py-2 uppercase rounded-full shadow-md backdrop-blur-sm">Visualizar</span>
            </div>
          </div>

          {/* Foto 4 */}
          <div
            onClick={() => openLightbox(3)}
            className="col-span-1 relative aspect-[3/4] group overflow-hidden cursor-pointer bg-bg-warm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-brand/10"
          >
            <Image
              src="/images/couple-4.webp"
              alt="Katharyna & Leonardo - Cumplicidade"
              fill
              className="object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <span className="bg-white/95 text-text-dark text-[10px] font-medium tracking-[2px] px-4 py-2 uppercase rounded-full shadow-md backdrop-blur-sm">Visualizar</span>
            </div>
          </div>

          {/* Foto 5 */}
          <div
            onClick={() => openLightbox(4)}
            className="col-span-1 relative aspect-[3/4] group overflow-hidden cursor-pointer bg-bg-warm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-brand/10"
          >
            <Image
              src="/images/couple-5.webp"
              alt="Katharyna & Leonardo - Amor"
              fill
              className="object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <span className="bg-white/95 text-text-dark text-[10px] font-medium tracking-[2px] px-4 py-2 uppercase rounded-full shadow-md backdrop-blur-sm">Visualizar</span>
            </div>
          </div>

          {/* Foto 6 */}
          <div
            onClick={() => openLightbox(5)}
            className="col-span-1 relative aspect-[3/4] group overflow-hidden cursor-pointer bg-bg-warm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-brand/10"
          >
            <Image
              src="/images/couple-6.webp"
              alt="Katharyna & Leonardo - Juntos"
              fill
              className="object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <span className="bg-white/95 text-text-dark text-[10px] font-medium tracking-[2px] px-4 py-2 uppercase rounded-full shadow-md backdrop-blur-sm">Visualizar</span>
            </div>
          </div>

          {/* Foto 7 */}
          <div
            onClick={() => openLightbox(6)}
            className="col-span-1 relative aspect-[3/4] group overflow-hidden cursor-pointer bg-bg-warm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-brand/10"
          >
            <Image
              src="/images/couple-7.webp"
              alt="Katharyna & Leonardo - Felicidade"
              fill
              className="object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <span className="bg-white/95 text-text-dark text-[10px] font-medium tracking-[2px] px-4 py-2 uppercase rounded-full shadow-md backdrop-blur-sm">Visualizar</span>
            </div>
          </div>

          {/* Foto 8 */}
          <div
            onClick={() => openLightbox(7)}
            className="col-span-1 relative aspect-[3/4] group overflow-hidden cursor-pointer bg-bg-warm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-brand/10"
          >
            <Image
              src="/images/couple-8.webp"
              alt="Katharyna & Leonardo - Carinho"
              fill
              className="object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <span className="bg-white/95 text-text-dark text-[10px] font-medium tracking-[2px] px-4 py-2 uppercase rounded-full shadow-md backdrop-blur-sm">Visualizar</span>
            </div>
          </div>

          {/* Foto 9 (Na mesma linha da Foto 8 no Mobile e Desktop, sem buraco) */}
          <div
            onClick={() => openLightbox(8)}
            className="col-span-1 relative aspect-[3/4] group overflow-hidden cursor-pointer bg-bg-warm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-brand/10"
          >
            <Image
              src="/images/couple-9.webp"
              alt="Katharyna & Leonardo - Celebrando"
              fill
              className="object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <span className="bg-white/95 text-text-dark text-[10px] font-medium tracking-[2px] px-4 py-2 uppercase rounded-full shadow-md backdrop-blur-sm">Visualizar</span>
            </div>
          </div>
        </div>

        {/* Card Editorial de Citação abaixo da Galeria */}
        <div className="mt-8 md:mt-12 max-w-[760px] mx-auto bg-bg-warm border border-brand/20 p-6 md:p-8 flex flex-col justify-center items-center text-center rounded-lg shadow-sm">
          <span className="font-serif text-[24px] sm:text-[28px] md:text-[32px] tracking-[4px] text-brand mb-2">K & L</span>
          <p className="text-text-mid text-[12px] sm:text-[13px] md:text-[14px] leading-relaxed italic max-w-[480px]">
            &quot;Não sei se o mundo é bom, mas ele ficou melhor quando você chegou e perguntou: Tem lugar pra mim?&quot;
          </p>
          <span className="text-[10px] sm:text-[11px] uppercase font-semibold text-brand tracking-[2px] mt-2.5">
            – Nando Reis
          </span>
          <div className="w-10 h-[1px] bg-brand mt-3 sm:mt-4" />
        </div>
      </section>
      </ScrollReveal>

      {/* ── VOLTAR AO INÍCIO ── */}
      <ScrollReveal delay={400}>
      <section className="bg-bg-warm flex flex-col items-center justify-center gap-6 md:gap-8 py-14 md:py-24 px-6">
        <h2 className="font-serif text-[28px] md:text-[36px] leading-[1.2] text-text-dark text-center font-normal max-w-[600px]">
          Que este seja apenas<br />o começo da nossa eternidade
        </h2>

        <div className="w-[50px] h-px bg-brand" />

        <Link
          href="/"
          className="bg-brand text-white text-[11px] tracking-[2.5px] px-10 md:px-12 py-4 hover:bg-brand-hover transition"
        >
          VOLTAR AO INÍCIO
        </Link>
      </section>
      </ScrollReveal>

      {/* ── FOOTER ── */}
      <Footer initials={couple.initials} date={couple.dateFooter} />

      {/* ── LIGHTBOX ── */}
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
