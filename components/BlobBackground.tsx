"use client";
import { useEffect, useRef } from "react";

// Entry  : blob 1 & 3 from LEFT, blob 2 from RIGHT  (양쪽)
// Exit   : all blobs converge into photo area (right side)
// Drift  : firefly-style multi-sine at irrational ratios, clearly visible speed

export default function BlobBackground() {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const rafRef        = useRef<number>(0);
  const hasEnteredRef = useRef(false);
  const entryRef      = useRef(0);
  const scrollYRef    = useRef(0);
  const scrollLerpRef = useRef(0);

  useEffect(() => {
    const section = document.querySelector("#info");
    if (!section) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !hasEnteredRef.current && window.scrollY > 80) {
          hasEnteredRef.current = true;
          entryRef.current      = 1.2;
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

      // Entry: slow glide in (~4 s)
      if (entryRef.current > 0.002) entryRef.current *= 0.983;
      else entryRef.current = 0;

      // heroFade: 0 = in hero, 1 = in sections
      const heroFade = Math.min(1, Math.max(0,
        (scrollLerpRef.current - h * 0.60) / (h * 0.40)
      ));

      const entryProgress = 1 - Math.min(entryRef.current / 1.2, 1);
      const alpha = entryProgress * 0.62 * heroFade;
      if (alpha < 0.005) { t++; rafRef.current = requestAnimationFrame(draw); return; }

      const entryOff = entryRef.current / 1.2; // 1→0 (fly-in, one-time)
      const exitOff  = 1 - heroFade;           // 0→1 (fly-out when returning to hero)

      // ── Firefly drift ─────────────────────────────────────────
      // ta * 0.012 → ~8-10 s period: clearly visible but not jittery
      // Irrational multipliers (φ, √2, √3) = organic non-repeating path
      const ta = t * 0.012;

      const d1x = Math.sin(ta * 1.000) * w * 0.06 + Math.sin(ta * 1.618) * w * 0.03;
      const d1y = Math.cos(ta * 0.721) * h * 0.08 + Math.cos(ta * 1.414) * h * 0.04;

      const d2x = Math.cos(ta * 0.850 + 1.0) * w * 0.05 + Math.cos(ta * 1.382 + 0.5) * w * 0.025;
      const d2y = Math.sin(ta * 0.900 + 0.5) * h * 0.07 + Math.sin(ta * 1.272)        * h * 0.035;

      const d3x = Math.sin(ta * 1.150 + 2.0) * w * 0.055 + Math.sin(ta * 1.732 + 1.5) * w * 0.022;
      const d3y = Math.cos(ta * 0.650 + 1.5) * h * 0.075 + Math.cos(ta * 1.618 + 0.8) * h * 0.030;

      // Natural resting centers
      const n1x = w * 0.18, n1y = h * 0.40;
      const n2x = w * 0.78, n2y = h * 0.50;
      const n3x = w * 0.24, n3y = h * 0.65;

      // Photo area (exit target — right side, slightly off-screen)
      const p1x = w * 1.06, p1y = h * 0.36;
      const p2x = w * 1.10, p2y = h * 0.46;
      const p3x = w * 1.03, p3y = h * 0.58;

      // Base = natural + firefly drift
      const bx1 = n1x + d1x, by1 = n1y + d1y;
      const bx2 = n2x + d2x, by2 = n2y + d2y;
      const bx3 = n3x + d3x, by3 = n3y + d3y;

      // Entry: blob1 & blob3 from LEFT, blob2 from RIGHT
      // Exit : all go into photo area (right)
      const b1x = bx1 - w * entryOff * 0.95  + (p1x - bx1) * exitOff;
      const b1y = by1                          + (p1y - by1) * exitOff;

      const b2x = bx2 + w * entryOff * 0.95  + (p2x - bx2) * exitOff;
      const b2y = by2                          + (p2y - by2) * exitOff;

      const b3x = bx3 - w * entryOff * 0.72  + (p3x - bx3) * exitOff;
      const b3y = by3                          + (p3y - by3) * exitOff;

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
