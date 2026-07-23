export type GalleryImage = {
  src: string;
  alt: string;
};

export const GALLERY_IMAGES: GalleryImage[] = [
  { src: "/images/hero-1.webp", alt: "Katharyna & Leonardo - Momentos" },
  { src: "/images/hero-2.webp", alt: "Katharyna & Leonardo - Abraçados" },
  { src: "/images/hero-3.webp", alt: "Katharyna & Leonardo - Sorrindo" },
  { src: "/images/story-1.webp", alt: "Katharyna & Leonardo - Cumplicidade" },
  { src: "/images/story-3.webp", alt: "Katharyna & Leonardo - Amor" },
  { src: "/images/story-2.webp", alt: "Katharyna & Leonardo - Juntos" },
  { src: "/images/casal.webp", alt: "Katharyna & Leonardo - Felicidade" },
];

export const couple = {
  firstName: "Katharyna",
  secondName: "Leonardo",
  initials: "K & L",
  date: "11 de Outubro, 2026",
  dateShort: "11 · 10 · 2026",
  dateFooter: "11.10.2026",
  time: "15h30 — Cerimônia",
  venueName: "Sítio São Bento",
  venueCity: "TX-BA",
  venueAddress: "Teixeira de Freitas - BA",
  mapsUrl: "https://goo.gl/maps/pK5RkuVjvB13S3eM6?g_st=aw",
  message:
    "Ficamos extremamente felizes em contar com a sua presença neste dia tão especial para nós! Se desejar nos presentear, criamos uma lista de presentes simbólicos onde você pode realizar o pagamento via Pix de forma simples.",
};

export const WEDDING_DATE = new Date("2026-10-11T00:00:00-03:00");
