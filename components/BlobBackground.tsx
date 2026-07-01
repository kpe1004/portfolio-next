"use client";
import { useEffect, useRef } from "react";

// Entry : staggered — blob1(left) t=0, blob3(lower-left) t+350ms, blob2(right) t+700ms
// Exit  : each blob exits the same side it entered (left↔left, right↔right)
// Drift : firefly — multi-sine at φ/√2/√3 ratios, clearly visible speed

export default function BlobBackground() {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const rafRef        = useRef<number>(0);
  const hasEnteredRef = useRef(false);
  const entry1Ref     = useRef(0);   // blob 1  left  — starts first
  const entry3Ref     = useRef(0);   // blob 3  lower-left — +350 ms
  const entry2Ref     = useRef(0);   // blob 2  right — +700 ms
  const scrollYRef    = useRef(0);
  const scrollLerpRef = useRef(0);

  useEffect(() => {
    const section = document.querySelector("#info");
    if (!section) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !hasEnteredRef.current && window.scrollY > 80) {
          hasEnteredRef.current = true;
          entry1Ref.current = 1.2;                                     // left — now
          setTimeout(() => { entry3Ref.current = 1.2; }, 350);        // lower-left — 350 ms
          setTimeout(() => { entry2Ref.current = 1.2; }, 700);        // right — 700 ms
          observer.disconnect();
        }
      },
      { threshold: 0.20 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => { scrollYRef.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;

    const draw = () => {
      const w = (canvas.width  = canvas.offsetWidth);
      const h = (canvas.height = canvas.offsetHeight);
      ctx.clearRect(0, 0, w, h);

      scrollLerpRef.current += (scrollYRef.current - scrollLerpRef.current) * 0.04;

      if (!hasEnteredRef.current) { t++; rafRef.current = requestAnimationFrame(draw); return; }

      // Decay each blob's entry independently
      if (entry1Ref.current > 0.002) entry1Ref.current *= 0.983; else entry1Ref.current = 0;
      if (entry2Ref.current > 0.002) entry2Ref.current *= 0.983; else entry2Ref.current = 0;
      if (entry3Ref.current > 0.002) entry3Ref.current *= 0.983; else entry3Ref.current = 0;

      // heroFade: 0 = in hero, 1 = in sections
      const heroFade = Math.min(1, Math.max(0,
        (scrollLerpRef.current - h * 0.60) / (h * 0.40)
      ));

      // Alpha based on first blob's progress (sets the mood, stays at max once in)
      const alpha = (1 - Math.min(entry1Ref.current / 1.2, 1)) * 0.62 * heroFade;
      if (alpha < 0.005) { t++; rafRef.current = requestAnimationFrame(draw); return; }

      // Per-blob entry offsets (1→0 as each flies in)
      const off1 = entry1Ref.current / 1.2;
      const off2 = entry2Ref.current / 1.2;
      const off3 = entry3Ref.current / 1.2;

      // Staggered EXIT — last-in first-out, mirrors the entry order
      // blob2(right) exits first  → heroFade 1.0 → 0.60
      // blob3(lower) exits second → heroFade 0.70 → 0.30
      // blob1(left)  exits last   → heroFade 0.40 → 0.00
      const exit2Off = 1 - Math.min(1, Math.max(0, (heroFade - 0.60) / 0.40));
      const exit3Off = 1 - Math.min(1, Math.max(0, (heroFade - 0.30) / 0.40));
      const exit1Off = 1 - Math.min(1, Math.max(0,  heroFade          / 0.40));

      // ── Firefly drift (multi-sine, irrational ratios, visible speed) ──
      const ta = t * 0.012;
      const d1x = Math.sin(ta * 1.000) * w * 0.06 + Math.sin(ta * 1.618) * w * 0.030;
      const d1y = Math.cos(ta * 0.721) * h * 0.08 + Math.cos(ta * 1.414) * h * 0.040;

      const d2x = Math.cos(ta * 0.850 + 1.0) * w * 0.05 + Math.cos(ta * 1.382 + 0.5) * w * 0.025;
      const d2y = Math.sin(ta * 0.900 + 0.5) * h * 0.07 + Math.sin(ta * 1.272)        * h * 0.035;

      const d3x = Math.sin(ta * 1.150 + 2.0) * w * 0.055 + Math.sin(ta * 1.732 + 1.5) * w * 0.022;
      const d3y = Math.cos(ta * 0.650 + 1.5) * h * 0.075 + Math.cos(ta * 1.618 + 0.8) * h * 0.030;

      // Natural resting centers + drift
      const bx1 = w * 0.18 + d1x,  by1 = h * 0.40 + d1y;
      const bx2 = w * 0.78 + d2x,  by2 = h * 0.50 + d2y;
      const bx3 = w * 0.24 + d3x,  by3 = h * 0.65 + d3y;

      // Final positions — each blob uses its own entry + exit offset
      const b1x = bx1 - w * (off1 + exit1Off) * 0.95;
      const b1y = by1;
      const b2x = bx2 + w * (off2 + exit2Off) * 0.95;
      const b2y = by2;
      const b3x = bx3 - w * (off3 + exit3Off) * 0.72;
      const b3y = by3;

      // ── Draw ──────────────────────────────────────────────────
      const g1 = ctx.createRadialGradient(b1x, b1y, 0, b1x, b1y, w * 0.50);
      g1.addColorStop(0.00, `rgba(30, 86, 255, ${(alpha * 0.88).toFixed(3)})`);
      g1.addColorStop(0.28, `rgba(44, 59, 206, ${(alpha * 0.56).toFixed(3)})`);
      g1.addColorStop(0.65, `rgba(20, 30, 120, ${(alpha * 0.24).toFixed(3)})`);
      g1.addColorStop(1.00, "rgba(5, 5, 16, 0.000)");
      ctx.fillStyle = g1; ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(b2x, b2y, 0, b2x, b2y, w * 0.44);
      g2.addColorStop(0.00, `rgba(74, 108, 247, ${(alpha * 0.80).toFixed(3)})`);
      g2.addColorStop(0.32, `rgba(44, 59, 206, ${(alpha * 0.50).toFixed(3)})`);
      g2.addColorStop(0.68, `rgba(20, 20, 90,  ${(alpha * 0.20).toFixed(3)})`);
      g2.addColorStop(1.00, "rgba(5, 5, 16, 0.000)");
      ctx.fillStyle = g2; ctx.fillRect(0, 0, w, h);

      const g3 = ctx.createRadialGradient(b3x, b3y, 0, b3x, b3y, w * 0.32);
      g3.addColorStop(0.00, `rgba(100, 50, 255, ${(alpha * 0.62).toFixed(3)})`);
      g3.addColorStop(0.40, `rgba(60, 40, 180,  ${(alpha * 0.32).toFixed(3)})`);
      g3.addColorStop(1.00, "rgba(5, 5, 16, 0.000)");
      ctx.fillStyle = g3; ctx.fillRect(0, 0, w, h);

      t++;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        width:         "100%",
        height:        "100%",
        zIndex:        1,
        pointerEvents: "none",
        mixBlendMode:  "screen",
      }}
    />
  );
}
