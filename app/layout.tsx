import type { Metadata } from "next";
import { Inter, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Darul Uloom Faizan-E-Ashraf | Islamic Education in Nagaur, Rajasthan",
  description:
    "Darul Uloom Faizan-E-Ashraf is a premier Islamic educational institution in Nagaur, Rajasthan, offering Darse Nizami, Hifzul Quran, girls' education, and modern schooling since 1997.",
  keywords: [
    "Darul Uloom",
    "Faizan-E-Ashraf",
    "Islamic school Nagaur",
    "Darse Nizami",
    "Hifzul Quran",
    "madrasa Rajasthan",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
