"use client";
import { useEffect, useRef, useState } from "react";

const MARQUEE_ITEMS = [
  "BRANDING",
  "·",
  "DESIGN",
  "·",
  "PHOTO DIRECTOR",
  "·",
  "AI GENERATION",
  "·",
  "MOTION",
  "·",
  "VISUAL ART",
  "·",
];

// duplicate for seamless loop
const MARQUEE = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

export default function HeroSection({ visible }: { visible: boolean }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const heroRef           = useRef<HTMLElement>(null);

  // mouse parallax
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      setMouse({
        x: (e.clientX - cx) / cx,
        y: (e.clientY - cy) / cy,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden"
    >
      {/* ── animated background gradient ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(44,59,206,0.13) 0%, rgba(74,40,160,0.09) 40%, transparent 70%)",
          transform: `translate(${mouse.x * -18}px, ${mouse.y * -12}px)`,
          transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      />

      {/* ── top spacer for nav ── */}
      <div />

      {/* ── main text ── */}
      <div className="relative z-10 px-8 md:px-12 mt-[12vh]">
        {/* year label */}
        <p
          className="text-[0.6rem] tracking-[0.28em] uppercase text-white/20 mb-8"
          style={{
            opacity:    visible ? 1 : 0,
            transform:  visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
          }}
        >
          2016 – 2026
        </p>

        {/* headline with parallax */}
        <div
          style={{
            transform: `translate(${mouse.x * 8}px, ${mouse.y * 6}px)`,
            transition: "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        >
          <h1
            className="font-light text-white leading-[0.95] tracking-tight"
            style={{ fontSize: "clamp(3.2rem, 10vw, 9rem)" }}
          >
            {["끝임없이", "GO!하는"].map((word, i) => (
              <span
                key={word}
                className="block overflow-hidden"
              >
                <span
                  className="block"
                  style={{
                    opacity:    visible ? 1 : 0,
                    transform:  visible ? "translateY(0)" : "translateY(100%)",
                    transition: `opacity 0.8s ease ${0.4 + i * 0.12}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${0.4 + i * 0.12}s`,
                  }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <div className="overflow-hidden">
            <p
              className="mt-3 text-[0.82rem] tracking-[0.08em] text-white/35"
              style={{
                opacity:    visible ? 1 : 0,
                transform:  visible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.7s ease 0.75s, transform 0.7s ease 0.75s",
              }}
            >
              디자이너 고평은입니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── scroll cue ── */}
      <div
        className="relative z-10 px-8 md:px-12 mb-6 flex items-center gap-4"
        style={{
          opacity:    visible ? 1 : 0,
          transition: "opacity 0.8s ease 1.2s",
        }}
      >
        <span className="text-[0.55rem] tracking-[0.25em] uppercase text-white/20">
          scroll
        </span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      {/* ── marquee strip ── */}
      <div
        className="relative z-10 border-t border-white/[0.05] overflow-hidden py-3"
        style={{
          opacity:    visible ? 1 : 0,
          transition: "opacity 0.8s ease 1s",
        }}
      >
        <div
          className="flex gap-8 whitespace-nowrap"
          style={{ animation: "marquee 22s linear infinite" }}
        >
          {MARQUEE.map((item, i) => (
            <span
              key={i}
              className={`text-[0.6rem] tracking-[0.22em] shrink-0 ${
                item === "·" ? "text-white/15" : "text-white/22"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
