import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import LoadingScreen from "@/components/LoadingScreen";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://katharynaeleonardo.com.br"),
  title: "Katharyna & Leonardo | Nosso Casamento",
  description: "Seja bem-vindo ao nosso site de casamento! Conheça nossa história, confira os detalhes do evento e nos presenteie de forma simples com nossa lista de presentes e vaquinha Pix.",
  keywords: "casamento, Katharyna, Leonardo, lista de presentes, Pix, vaquinha, casamento 2026",
  authors: [{ name: "Katharyna & Leonardo" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Katharyna & Leonardo | Nosso Casamento",
    description: "Confira nossa história, detalhes do evento e lista de presentes Pix com vaquinha.",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-bg-light text-text-dark selection:bg-brand selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: "Casamento Katharyna & Leonardo",
              startDate: "2026-10-11T15:30",
              endDate: "2026-10-12T00:00",
              location: {
                "@type": "Place",
                name: "Sítio São Bento",
                address: "Teixeira de Freitas - BA",
              },
              description: "Casamento de Katharyna e Leonardo",
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            }),
          }}
        />
        <LoadingScreen />
        {children}
        <WhatsAppButton />
        <BackToTop />
      </body>
    </html>
  );
}
