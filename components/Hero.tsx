"use client";
import { useEffect, useRef, useState } from "react";
import ChrHover from "./ChrHover";

const NAV_LINKS = [
  { label: "Info",    href: "#info"    },
  { label: "Work",    href: "#works"   },
  { label: "Contact", href: "#contact" },
];

const CAT_LINKS = [
  { label: "Branding",       href: "#" },
  { label: "Design",         href: "#" },
  { label: "Photo Director", href: "#" },
  { label: "AI Generation",  href: "#" },
];

interface HeroProps {
  visible: boolean;
}

export default function Hero({ visible }: HeroProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const mouseRef   = useRef({ x: 0.5, y: 0.5 });        // raw mouse (0-1)
  const mouseLerp  = useRef({ x: 0.5, y: 0.5 });        // smoothed for canvas
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 }); // for tagline parallax

  // Canvas: atmospheric gradient + film grain
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Grain tile — regenerate each few frames for "moving" grain
    const GRAIN_SIZE = 256;
    const grainCanvas = document.createElement("canvas");
    grainCanvas.width  = GRAIN_SIZE;
    grainCanvas.height = GRAIN_SIZE;
    const gc = grainCanvas.getContext("2d")!;
    const grainData = gc.createImageData(GRAIN_SIZE, GRAIN_SIZE);

    function refreshGrain() {
      const d = grainData.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 22; // film grain opacity
      }
      gc.putImageData(grainData, 0, 0);
    }
    refreshGrain();

    let t = 0;
    let grainFrame = 0;
    let pat: CanvasPattern | null = null;

    const draw = () => {
      const w = (canvas.width  = canvas.offsetWidth);
      const h = (canvas.height = canvas.offsetHeight);

      // Refresh grain every 2 frames → animated film grain
      grainFrame++;
      if (grainFrame % 2 === 0) {
        refreshGrain();
        pat = ctx.createPattern(grainCanvas, "repeat");
      }

      // ─── Near-black base ───────────────────────────────────
      ctx.fillStyle = "#050510";
      ctx.fillRect(0, 0, w, h);

      // Smooth mouse lerp (factor 0.04 = 부드럽고 느리게 따라옴)
      mouseLerp.current.x += (mouseRef.current.x - mouseLerp.current.x) * 0.04;
      mouseLerp.current.y += (mouseRef.current.y - mouseLerp.current.y) * 0.04;
      const mx = mouseLerp.current.x - 0.5; // -0.5 ~ +0.5
      const my = mouseLerp.current.y - 0.5;

      // Time angles — each blob orbits at its own frequency
      const a1 = t * 0.0022;
      const a2 = t * 0.0017;
      const a3 = t * 0.0030;

      // ── Blob 1: 마우스에 가장 많이 반응 (인력 0.22) ──────────
      const b1x = w * (0.40 + 0.28 * Math.sin(a1) + mx * 0.22);
      const b1y = h * (0.22 + 0.16 * Math.cos(a1 * 1.4) + my * 0.18);
      const g1  = ctx.createRadialGradient(b1x, b1y, 0, b1x, b1y, w * 0.62);
      g1.addColorStop(0.00, "rgba( 30,  86, 255, 0.92)");
      g1.addColorStop(0.18, "rgba( 44,  59, 206, 0.68)");
      g1.addColorStop(0.45, "rgba( 20,  30, 120, 0.32)");
      g1.addColorStop(0.80, "rgba(  8,   8,  40, 0.10)");
      g1.addColorStop(1.00, "rgba(  5,   5,  16, 0.00)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      // ── Blob 2: 반대 방향으로 약하게 반응 (반발 느낌) ──────────
      const b2x = w * (0.65 + 0.24 * Math.cos(a2) - mx * 0.14);
      const b2y = h * (0.28 + 0.18 * Math.sin(a2 * 1.2) + my * 0.12);
      const g2  = ctx.createRadialGradient(b2x, b2y, 0, b2x, b2y, w * 0.50);
      g2.addColorStop(0.00, "rgba( 74, 108, 247, 0.88)");
      g2.addColorStop(0.25, "rgba( 44,  59, 206, 0.58)");
      g2.addColorStop(0.60, "rgba( 20,  20,  90, 0.24)");
      g2.addColorStop(1.00, "rgba(  5,   5,  16, 0.00)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // ── Blob 3: violet — 커서 직접 추적 (가장 민감) ─────────
      const b3r = w * (0.36 + 0.08 * Math.sin(a3 * 0.8));
      const b3x = w * (0.50 + 0.22 * Math.cos(a3 + 1.0) + mx * 0.30);
      const b3y = h * (0.18 + 0.14 * Math.sin(a3 * 1.1) + my * 0.26);
      const g3  = ctx.createRadialGradient(b3x, b3y, 0, b3x, b3y, b3r);
      g3.addColorStop(0.00, "rgba(100,  50, 255, 0.72)");
      g3.addColorStop(0.30, "rgba( 60,  40, 180, 0.42)");
      g3.addColorStop(0.70, "rgba( 20,  15,  70, 0.16)");
      g3.addColorStop(1.00, "rgba(  5,   5,  16, 0.00)");
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, w, h);

      // ── Blob 4: 작고 빠른 커서 하이라이트 ───────────────────
      const a4   = t * 0.0052;
      const b4x  = w * (0.45 + 0.16 * Math.sin(a4 + 0.5) + mx * 0.18);
      const b4y  = h * (0.30 + 0.12 * Math.cos(a4 * 1.7) + my * 0.16);
      const g4   = ctx.createRadialGradient(b4x, b4y, 0, b4x, b4y, w * 0.26);
      g4.addColorStop(0.00, "rgba(140, 180, 255, 0.60)");
      g4.addColorStop(0.40, "rgba( 74, 108, 247, 0.28)");
      g4.addColorStop(1.00, "rgba(  5,   5,  16, 0.00)");
      ctx.fillStyle = g4;
      ctx.fillRect(0, 0, w, h);

      // ── Bottom fade → #0a0a0a (Work 섹션 배경색과 일치) ──────
      const fade = ctx.createLinearGradient(0, h * 0.42, 0, h);
      fade.addColorStop(0.0, "rgba(10,10,10,0.00)");
      fade.addColorStop(0.7, "rgba(10,10,10,0.85)");
      fade.addColorStop(1.0, "rgba(10,10,10,1.00)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, w, h);

      // ── Film grain overlay ──────────────────────────────────
      if (pat) {
        ctx.fillStyle = pat;
        ctx.fillRect(0, 0, w, h);
      }

      t++;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Mouse parallax + canvas influence
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = e.clientY / window.innerHeight;
      mouseRef.current = { x: nx, y: ny };
      setMouse({ x: nx, y: ny });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const taglineStyle: React.CSSProperties = {
    clipPath:  visible ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
    opacity:   visible ? 1 : 0,
    transform: `translate(${(mouse.x - 0.5) * -6}px, ${(mouse.y - 0.5) * -4}px)`,
    transition: visible
      ? "clip-path 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s, opacity 0.5s ease 0.3s, transform 0.5s ease"
      : "clip-path 0s, opacity 0s, transform 0.5s ease",
  };

  const lineStyle: React.CSSProperties = {
    transform:  visible ? "scaleX(1)" : "scaleX(0)",
    opacity:    visible ? 1 : 0,
    transition: visible
      ? "transform 1s cubic-bezier(0.22,1,0.36,1) 0.8s, opacity 0.5s ease 0.8s"
      : "none",
  };

  const barStyle: React.CSSProperties = {
    clipPath:  visible ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
    opacity:   visible ? 1 : 0,
    transition: visible
      ? "clip-path 0.8s cubic-bezier(0.22,1,0.36,1) 1s, opacity 0.5s ease 1s"
      : "none",
  };

  const nameStyle: React.CSSProperties = {
    opacity:   visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(30px)",
    transition: visible
      ? "opacity 1s ease 0.6s, transform 1s cubic-bezier(0.22,1,0.36,1) 0.6s"
      : "none",
  };

  return (
    <div className="scroll-wrap">
      <section className="hero" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease" }}>
        {/* Animated grain + gradient canvas */}
        <canvas ref={canvasRef} className="hero-canvas" />

        {/* Bottom fade → Work 섹션 배경(#0a0a0a)과 무경계 연결 */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "55%",
          background: "linear-gradient(to bottom, transparent 0%, #0a0a0a 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }} />

        <div className="hero-content">
          {/* Tagline — top left */}
          <div className="hero-tagline" style={taglineStyle}>
            Non-stop <span className="other-accent">Designer</span>,<br />
            Connecting the World Through Branding.
          </div>

          {/* Large name display — bottom area */}
          <div className="hero-name-row" style={nameStyle}>
            <span className="hero-name-the">the</span>
            <span className="hero-name-portfolio">
              Portfolio<span style={{ color: "var(--blue-bright)" }}>.</span>
            </span>
          </div>

          {/* Bottom line */}
          <div className="hero-line" style={lineStyle} />

          {/* Hero bar */}
          <div className="hero-bar" style={barStyle}>
            <div className="hero-bar-left">
              <ChrHover text="last update. 2026" />
            </div>

            <nav className="hero-bar-center">
              {CAT_LINKS.map((c, i) => (
                <span key={c.label} style={{ display: "inline-flex", alignItems: "center", gap: "1.5rem" }}>
                  <ChrHover text={c.label} as="a" href={c.href} />
                  {i < CAT_LINKS.length - 1 && <span className="sep">/</span>}
                </span>
              ))}
            </nav>

            <nav className="hero-bar-right">
              {NAV_LINKS.map((n) => (
                <ChrHover key={n.label} text={n.label} as="a" href={n.href} />
              ))}
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}
