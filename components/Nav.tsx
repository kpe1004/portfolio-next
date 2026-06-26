"use client";
import { useEffect, useState } from "react";

const links = [
  { id: "works",   label: "Works"  },
  { id: "skills",  label: "Skills" },
  { id: "career",  label: "Career" },
  { id: "contact", label: "Contact"},
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-10 md:px-14 transition-all duration-300 ${
        scrolled
          ? "py-4 bg-[#0c0c1a]/80 backdrop-blur-2xl border-b border-white/[0.07]"
          : "py-7"
      }`}
    >
      <a
        href="#hero"
        style={{ fontFamily: "var(--font-script-var)" }}
        className="text-[2rem] leading-none opacity-90 hover:opacity-100 transition-opacity"
      >
        P.
      </a>

      <ul className="hidden md:flex gap-10 list-none m-0 p-0">
        {links.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="text-[0.7rem] tracking-[0.18em] uppercase text-white/50 hover:text-white transition-colors duration-200"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
