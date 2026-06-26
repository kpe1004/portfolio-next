import type { Metadata } from "next";
import { Space_Grotesk, Great_Vibes } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-main",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script-var",
});

export const metadata: Metadata = {
  title: "Pyeongeun Ko — Designer",
  description: "Brand · Motion · Visual Designer based in Seoul",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${spaceGrotesk.variable} ${greatVibes.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
