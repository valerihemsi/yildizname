import type { Metadata } from "next";
import { Cormorant_Garamond, Cinzel } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-serif",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yıldızname — Harflerin Sırrı",
  description:
    "Ebced, ilm-i hurûf ve yıldızname geleneğinden ilham alan kişiselleştirilmiş sembolik yorum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${cinzel.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Footer />
      </body>
    </html>
  );
}
