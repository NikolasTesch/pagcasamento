export type GalleryImage = {
  src: string;
  alt: string;
};

export const GALLERY_IMAGES: GalleryImage[] = [
  { src: "/images/couple-1.webp", alt: "Katharyna & Leonardo - Nossos Momentos" },
  { src: "/images/couple-2.webp", alt: "Katharyna & Leonardo - Abraçados" },
  { src: "/images/couple-3.webp", alt: "Katharyna & Leonardo - Sorrindo" },
  { src: "/images/couple-4.webp", alt: "Katharyna & Leonardo - Cumplicidade" },
  { src: "/images/couple-5.webp", alt: "Katharyna & Leonardo - Amor" },
  { src: "/images/couple-6.webp", alt: "Katharyna & Leonardo - Juntos" },
  { src: "/images/couple-7.webp", alt: "Katharyna & Leonardo - Felicidade" },
  { src: "/images/couple-8.webp", alt: "Katharyna & Leonardo - Carinho" },
  { src: "/images/couple-9.webp", alt: "Katharyna & Leonardo - Celebrando" },
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
