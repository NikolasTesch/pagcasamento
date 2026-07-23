"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@/data/couple";

interface GalleryLightboxProps {
  images: GalleryImage[];
  activeIndex: number | null;
  onClose: () => void;
  onNext: (e?: React.MouseEvent) => void;
  onPrev: (e?: React.MouseEvent) => void;
}

export default function GalleryLightbox({
  images,
  activeIndex,
  onClose,
  onNext,
  onPrev,
}: GalleryLightboxProps) {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchStartY.current = e.changedTouches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) onNext();
      else onPrev();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, onClose, onNext, onPrev]);

  if (activeIndex === null) return null;

  return (
    <div
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
    >
      {/* Botão Fechar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-[110] p-3 text-white/80 hover:text-white bg-black/25 hover:bg-black/55 rounded-full transition-all duration-300 hover:rotate-90 flex items-center justify-center cursor-pointer border border-white/10"
        aria-label="Fechar galeria"
      >
        <X size={22} />
      </button>

      {/* Botão Anterior — oculto no mobile (usa swipe) */}
      <button
        onClick={onPrev}
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
            src={images[activeIndex].src}
            alt={images[activeIndex].alt}
            fill
            className="object-contain select-none"
            priority
          />
        </div>

        {/* Contador + dica de swipe no mobile */}
        <div className="flex flex-col items-center gap-1 mt-4">
          <span className="text-white/60 text-[12px] tracking-[3px] uppercase select-none font-sans">
            Foto {activeIndex + 1} de {images.length}
          </span>
          <span className="md:hidden text-white/35 text-[11px] tracking-[1.5px] select-none font-sans">
            ← deslize para navegar →
          </span>
        </div>
      </div>

      {/* Botão Próximo — oculto no mobile */}
      <button
        onClick={onNext}
        className="hidden md:flex absolute right-8 z-[110] p-4 text-white/80 hover:text-white hover:scale-105 bg-black/25 hover:bg-black/55 rounded-full transition-all duration-300 items-center justify-center cursor-pointer border border-white/10"
        aria-label="Próxima imagem"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
}
