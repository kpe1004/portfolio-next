"use client";
import { useEffect, useState } from "react";

const NAV = [
  { href: "#works",   label: "works/"   },
  { href: "#info",    label: "info/"    },
  { href: "#contact", label: "contact/" },
];

const CATEGORIES = [
  { label: "BRANDING",       href: "#" },
  { label: "DESIGN",         href: "#" },
  { label: "PHOTO DIRECTOR", href: "#" },
  { label: "AI GENERATION",  href: "#" },
];

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10,10,10,0.92)" : "rgba(10,10,10,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      }}
    >
      {/* ── Row 1: name · nav · version ── */}
      <div className="flex items-center justify-between px-8 md:px-12 h-[52px]">
        <a
          href="#"
          className="text-sm font-medium tracking-tight text-white/90 hover:text-white transition-colors"
        >
          Pyeongeun
        </a>

        <nav className="flex items-center gap-7">
          {NAV.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-[0.68rem] tracking-[0.18em] text-white/35 hover:text-white transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </nav>

        <span className="text-[0.6rem] tracking-[0.2em] text-white/18 hidden sm:block">
          last update. 2026
        </span>
      </div>

      {/* ── Row 2: category links ── */}
      <div
        className="flex items-center gap-6 md:gap-10 px-8 md:px-12 h-[36px]"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        {CATEGORIES.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="text-[0.58rem] tracking-[0.22em] text-white/22 hover:text-white/55 transition-colors duration-200 whitespace-nowrap"
          >
            {label}
          </a>
        ))}
      </div>
    </header>
  );
}
