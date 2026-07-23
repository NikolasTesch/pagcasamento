"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Pular se já viu o splash nesta sessão
    try {
      if (sessionStorage.getItem("splashSeen")) {
        setIsVisible(false);
        return;
      }
    } catch {
      // sessionStorage pode não estar disponível (SSR / privacidade)
    }

    // Pular se usuário prefere animações reduzidas
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setIsVisible(false);
        return;
      }
    } catch {
      // fallback: mostra o splash normalmente
    }

    let dismissed = false;

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      setIsFading(true);
      // Após a transição de fade (500ms), esconde completamente
      setTimeout(() => {
        setIsVisible(false);
        try {
          sessionStorage.setItem("splashSeen", "true");
        } catch {
          // silent
        }
      }, 500);
    };

    // Auto-dismiss após 1.5s (reduzido de 2.5s)
    const timer = setTimeout(dismiss, 1500);

    // Ou quando o DOM estiver pronto (não espera imagens)
    if (document.readyState === "interactive" || document.readyState === "complete") {
      clearTimeout(timer);
      dismiss();
    } else {
      document.addEventListener("DOMContentLoaded", dismiss, { once: true });
    }

    return () => {
      clearTimeout(timer);
      document.removeEventListener("DOMContentLoaded", dismiss);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`loading-screen ${isFading ? "fade-out" : ""}`}>
      <div className="flex flex-col items-center justify-center gap-6 px-6 text-center">
        {/* Iniciais */}
        <h1 className="font-serif text-[64px] md:text-[80px] leading-none text-brand tracking-wide">
          K &amp; L
        </h1>

        {/* Divider decorativo */}
        <div className="w-16 h-px bg-brand/40" />

        {/* Frase romântica */}
        <p className="font-sans text-sm md:text-base text-text-mid max-w-xs leading-relaxed">
          Uma história de amor que começa aqui,
          <br />
          para durar uma vida inteira.
        </p>
      </div>
    </div>
  );
}
