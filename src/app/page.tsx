import Link from "next/link";
import { Calendar, Clock, MapPin, Heart } from "lucide-react";

export default function HomePage() {
  const coupleName = "Katharyna & Leonardo";
  const weddingDate = "2026-10-11";
  const weddingTime = "15:30";
  const venue = {
    name: "Sítio São Bento",
    address: "Seguir pela estrada em direção ao Levanta-te. O espaço fica a aproximadamente 5 km após o Baleeiro, seguindo sempre em frente.",
    mapsUrl: "https://goo.gl/maps/pK5RkuVjvB13S3eM6?g_st=aw",
  };
  const message = "Ficamos extremamente felizes em contar com a sua presença neste dia tão especial para nós! Se desejar nos presentear, criamos uma lista de presentes simbólicos onde você pode realizar o pagamento via Pix de forma simples.";

  // Formata a data para extenso
  const dateObj = new Date(weddingDate + "T12:00:00");
  const dateFormatted = dateObj.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const dateCapitalized = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);
  const [firstName, secondName] = coupleName.split("&").map((s) => s.trim());

  return (
    <div className="flex-grow flex flex-col bg-bg-light">
      {/* NAVBAR GLASSMORPHISM */}
      <nav className="sticky top-0 z-50 bg-bg-light/80 backdrop-blur-md border-b border-elegant py-4 px-6 md:px-12 transition duration-300">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-serif text-lg tracking-widest hover:text-brand transition">
            K <span className="text-brand">&</span> L
          </Link>
          <div className="flex items-center space-x-6 text-xs uppercase tracking-widest font-medium">
            <Link href="/" className="text-brand font-semibold">
              Início
            </Link>
            <a href="#evento" className="hover:text-brand transition text-text-muted">
              O Evento
            </a>
            <Link href="/presentes" className="hover:text-brand transition text-text-muted">
              Presentes
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION WITH GORGEOUS GRADIENT & PHOTO */}
      <header className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-bg-warm">
        {/* Imagem de Fundo Parallax-style */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: "url('/images/casal.jpg')" }}
        />
        {/* Overlay elegante e quente */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-light via-text-dark/40 to-text-dark/20" />

        {/* Conteúdo do Hero com entrada suave */}
        <div className="relative z-10 text-center text-white px-6 max-w-3xl animate-slide-up flex flex-col items-center">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand mb-4 flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 fill-brand stroke-brand" /> Convidamos você para o nosso
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight leading-none mb-6 drop-shadow-md text-bg-light">
            {firstName}
            <span className="block font-serif italic text-3xl md:text-4xl text-brand my-2 font-normal">&amp;</span>
            {secondName}
          </h1>
          <div className="w-12 h-[1px] bg-brand my-4" />
          <p className="text-sm md:text-base tracking-[0.2em] font-light uppercase text-bg-warm mb-8 drop-shadow">
            {dateCapitalized}
          </p>
          <Link 
            href="/presentes" 
            className="bg-brand hover:bg-brand-hover text-white text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition duration-300 transform"
          >
            Lista de Presentes 🎁
          </Link>
        </div>
      </header>

      {/* DETALHES DO EVENTO SECTION */}
      <section id="evento" className="py-20 px-6 md:px-12 bg-white scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">Os Detalhes</span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-tight mt-2 text-text-dark">
              Quando &amp; Onde
            </h2>
            <div className="w-8 h-[1.5px] bg-brand mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* CARD 1: DATA */}
            <div className="group border border-elegant p-8 rounded-2xl text-center hover:shadow-xl hover:border-brand/40 transition duration-500 bg-bg-light/30">
              <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-text-muted mb-2">Data</h3>
              <p className="font-serif text-lg text-text-dark font-medium leading-snug">
                {dateCapitalized}
              </p>
            </div>

            {/* CARD 2: HORARIO */}
            <div className="group border border-elegant p-8 rounded-2xl text-center hover:shadow-xl hover:border-brand/40 transition duration-500 bg-bg-light/30">
              <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-text-muted mb-2">Horário</h3>
              <p className="font-serif text-lg text-text-dark font-medium">
                {weddingTime} Horas
              </p>
            </div>

            {/* CARD 3: LOCAL */}
            <div className="group border border-elegant p-8 rounded-2xl text-center hover:shadow-xl hover:border-brand/40 transition duration-500 bg-bg-light/30 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-text-muted mb-2">Local</h3>
                <p className="font-serif text-lg text-text-dark font-medium mb-1">{venue.name}</p>
                <p className="text-xs text-text-muted leading-relaxed mb-4 px-2">{venue.address}</p>
              </div>
              {venue.mapsUrl && (
                <a 
                  href={venue.mapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs font-semibold text-brand group-hover:text-brand-hover tracking-wider uppercase inline-flex items-center justify-center gap-1 mt-2 hover:underline transition"
                >
                  Ver no Google Maps →
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MENSAGEM AOS CONVIDADOS SECTION */}
      <section className="py-24 px-6 md:px-12 bg-bg-warm/50 border-t border-b border-elegant text-center relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand/5 rounded-full blur-3xl" />

        <div className="max-w-2xl mx-auto relative z-10">
          <span className="font-serif text-brand text-5xl block h-6 leading-none -mb-2">“</span>
          <p className="font-serif italic text-lg md:text-xl text-text-dark leading-relaxed font-light mb-6 px-4">
            {message}
          </p>
          <span className="font-serif text-brand text-5xl block h-6 leading-none mt-2">”</span>
          <div className="w-8 h-[1px] bg-brand/50 mx-auto mt-6" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 bg-white border-t border-elegant text-center">
        <div className="max-w-4xl mx-auto">
          <p className="font-serif text-xl italic font-light tracking-wide text-brand mb-2">
            {firstName} &amp; {secondName}
          </p>
          <p className="text-xs text-text-muted tracking-widest uppercase">
            {weddingDate.split("-")[0]} · Feito com amor 💕
          </p>
        </div>
      </footer>
    </div>
  );
}
