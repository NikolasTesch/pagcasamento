import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

// Configuração da fonte Montserrat (Sans-serif para corpo e botões)
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

// Configuração da fonte Cormorant Garamond (Serif para títulos editoriais)
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Metadados SEO refinados para o site de casamento
export const metadata: Metadata = {
  title: "Katharyna & Leonardo | Nosso Casamento",
  description: "Seja bem-vindo ao nosso site de casamento! Conheça nossa história, confira os detalhes do evento e nos presenteie de forma simples com nossa lista de presentes e vaquinha Pix.",
  keywords: "casamento, Katharyna, Leonardo, lista de presentes, Pix, vaquinha, casamento 2026",
  authors: [{ name: "Katharyna & Leonardo" }],
  openGraph: {
    title: "Katharyna & Leonardo | Nosso Casamento",
    description: "Confira nossa história, detalhes do evento e lista de presentes Pix com vaquinha.",
    type: "website",
    locale: "pt_BR",
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
      className={`${montserrat.variable} ${cormorant.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-bg-light text-text-dark selection:bg-brand selection:text-white">
        {children}
      </body>
    </html>
  );
}
