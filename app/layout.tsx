import type { Metadata } from "next";
import { Inter, Great_Vibes } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script-var",
});

export const metadata: Metadata = {
  title: "Portfolio — Pyeongeun Ko",
  description: "Motion Designer & Visual Artist",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${inter.variable} ${greatVibes.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
