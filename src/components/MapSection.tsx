"use client";

import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";

const IFRAME_SRC = "https://maps.google.com/maps?q=-17.5395,-39.7435&z=15&output=embed";
const MAPS_URL = "https://goo.gl/maps/pK5RkuVjvB13S3eM6";
const WAZE_URL = "https://www.waze.com/ul?ll=-17.5395,-39.7435&navigate=yes";

export default function MapSection() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="bg-bg-light py-12 md:py-20 px-4 md:px-20 border-t border-elegant">
      <div className="flex flex-col items-center text-center mb-8 md:mb-12">
        <span className="text-text-mid text-[10px] tracking-[4px] uppercase mb-3">
          Localização
        </span>
        <h2 className="font-serif text-[28px] md:text-[44px] leading-tight text-text-dark font-normal">
          Onde será a festa
        </h2>
        <div className="w-[50px] h-px bg-brand mt-4" />
      </div>

      <div className="map-iframe-container max-w-[900px] mx-auto">
        {!loaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#F5F0E8] rounded-sm">
            <MapPin size={40} className="text-brand/30" />
            <span className="text-text-muted/50 text-[11px] tracking-[2px] uppercase">
              Carregando mapa…
            </span>
          </div>
        )}
        <iframe
          src={IFRAME_SRC}
          className={`w-full h-full transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Sítio São Bento - Localização"
        />
      </div>

      <div className="map-buttons mt-6">
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-brand/30 text-text-dark text-[11px] tracking-[2px] px-5 py-2.5 hover:bg-brand hover:text-white hover:border-brand transition-all duration-300 rounded-sm"
        >
          <MapPin size={15} />
          Abrir no Google Maps
        </a>
        <a
          href={WAZE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-brand/30 text-text-dark text-[11px] tracking-[2px] px-5 py-2.5 hover:bg-brand hover:text-white hover:border-brand transition-all duration-300 rounded-sm"
        >
          <Navigation size={15} />
          Abrir no Waze
        </a>
      </div>
    </section>
  );
}
