import Link from "next/link";
import Image from "next/image";

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
  return (
    <div className="flex-grow flex flex-col bg-bg-light font-sans">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-elegant px-6 md:px-20 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8 md:gap-10">
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

        <span className="font-serif text-[22px] tracking-[6px] text-text-dark absolute left-1/2 -translate-x-1/2">
          {couple.initials}
        </span>

        <Link
          href="/presentes"
          className="bg-text-dark text-white text-[11px] tracking-[2px] px-5 md:px-7 py-3 hover:bg-brand transition"
        >
          LISTA DE PRESENTES
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className="flex flex-col md:flex-row md:h-[700px]">
        {/* Coluna de texto */}
        <div className="md:w-[580px] shrink-0 bg-bg-light flex flex-col justify-center gap-7 px-6 md:px-20 py-16 md:py-0">
          <span className="text-brand text-[11px] tracking-[4px] uppercase">Casamento</span>

          <h1 className="font-serif text-[56px] md:text-[72px] leading-[1.05] text-text-dark font-normal">
            {couple.firstName}
            <br />
            <span>&amp; {couple.secondName}</span>
          </h1>

          <p className="text-text-mid text-[15px] leading-[1.7]">
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
            className="self-start bg-brand text-white text-[11px] tracking-[2.5px] px-9 py-[15px] hover:bg-brand-hover transition"
          >
            VER LISTA DE PRESENTES
          </Link>
        </div>

        {/* Mosaico de fotos */}
        <div className="flex-1 flex gap-[3px] min-h-[300px] md:min-h-0">
          <div className="flex-1 relative bg-[#C9B8A0]">
            <Image
              src="/images/hero-1.png"
              alt={`${couple.firstName} e ${couple.secondName}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 30vw"
            />
          </div>
          <div className="flex-1 flex flex-col gap-[3px]">
            <div className="flex-1 relative bg-[#DDD0BE]">
              <Image
                src="/images/hero-2.png"
                alt={`${couple.firstName} e ${couple.secondName}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
            </div>
            <div className="flex-1 relative bg-[#B8A890]">
              <Image
                src="/images/hero-3.png"
                alt={`${couple.firstName} e ${couple.secondName}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
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
        <div className="md:w-[640px] shrink-0 flex gap-1 min-h-[280px] md:min-h-0">
          <div className="flex-1 relative bg-[#E2D4C2]">
            <Image
              src="/images/story-1.png"
              alt="Nossa história"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex-1 relative bg-[#BDA88C]">
              <Image
                src="/images/story-2.png"
                alt="Nossa história"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 18vw"
              />
            </div>
            <div className="flex-1 relative bg-[#D4C4A8]">
              <Image
                src="/images/story-3.png"
                alt="Nossa história"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 18vw"
              />
            </div>
          </div>
        </div>

        {/* Texto */}
        <div className="flex-1 flex flex-col justify-center gap-7 px-6 md:px-20 py-16 md:py-0">
          <span className="text-brand text-[10px] tracking-[4px] uppercase">Nossa História</span>

          <h2 className="font-serif text-[36px] md:text-[40px] leading-[1.2] text-text-dark font-normal">
            Uma história<br />escrita no destino
          </h2>

          <p className="text-text-mid text-[15px] leading-[1.8]">
            {couple.message}
          </p>

          <div className="w-[50px] h-px bg-brand" />
        </div>
      </section>

      {/* ── GIFT CTA ── */}
      <section className="bg-bg-warm flex flex-col items-center justify-center gap-8 py-24 px-6">
        <span className="text-brand text-[10px] tracking-[4px] uppercase">Lista de Presentes</span>

        <h2 className="font-serif text-[36px] md:text-[44px] leading-[1.2] text-text-dark text-center font-normal max-w-[600px]">
          Presenteie o casal<br />com muito amor
        </h2>

        <p className="text-text-mid text-[14px] leading-[1.7] text-center max-w-[480px]">
          Escolha um presente especial e contribua via Pix de forma rápida, segura e com todo o carinho.
        </p>

        <Link
          href="/presentes"
          className="bg-brand text-white text-[11px] tracking-[2.5px] px-12 py-4 hover:bg-brand-hover transition"
        >
          VER TODOS OS PRESENTES
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="h-20 bg-bg-dark flex items-center justify-center">
        <span className="text-text-mid text-[12px] tracking-[2px]">
          {couple.initials} · {couple.dateFooter} · com muito amor
        </span>
      </footer>
    </div>
  );
}
