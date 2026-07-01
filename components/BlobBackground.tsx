"use client";
import { useEffect, useRef } from "react";

// Behavior:
// - Triggered ONCE when #info first appears (scrollY > 80)
// - Blobs emerge FROM the photo area (right side, x ≈ 105-110% vw)
// - Slow entry ~4 s (entryRef decay 0.983)
// - Firefly movement: multiple sinusoids at golden-ratio/√2/√3 frequencies → organic, non-repeating
// - Scrolling back to hero → blobs retreat INTO the photo area (same path, reversed)
// - Alpha stays at 0.60 once entry complete — never disappears while in sections

export default function BlobBackground() {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const rafRef        = useRef<number>(0);
  const hasEnteredRef = useRef(false);
  const entryRef      = useRef(0);        // 1.2 → 0  (one-time fly-in from photo area)
  const scrollYRef    = useRef(0);
  const scrollLerpRef = useRef(0);

  // Trigger once when Info section is clearly visible
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

      // Smooth scroll
      scrollLerpRef.current += (scrollYRef.current - scrollLerpRef.current) * 0.04;

      if (!hasEnteredRef.current) { t++; rafRef.current = requestAnimationFrame(draw); return; }

      // ── Entry decay — slow (~4 s) ─────────────────────────────
      if (entryRef.current > 0.002) entryRef.current *= 0.983;
      else entryRef.current = 0;

      // ── Hero fade ─────────────────────────────────────────────
      // 0 = in hero viewport, 1 = fully in sections
      const heroFade = Math.min(1, Math.max(0,
        (scrollLerpRef.current - h * 0.60) / (h * 0.40)
      ));

      // ── Alpha (never resets to 0 once entry done) ─────────────
      const entryProgress = 1 - Math.min(entryRef.current / 1.2, 1);
      const alpha = entryProgress * 0.62 * heroFade;

      if (alpha < 0.005) { t++; rafRef.current = requestAnimationFrame(draw); return; }

      // ── Side offset: entry from photo, exit back to photo ─────
      const entryOff = entryRef.current / 1.2;  // 1 → 0 (one-time)
      const exitOff  = 1 - heroFade;             // 0 → 1 when returning to hero
      const off      = Math.max(entryOff, exitOff);

      // ── Firefly movement ──────────────────────────────────────
      // Multiple sinusoids at irrational ratios (φ=1.618, √2=1.414, √3=1.732)
      // → smooth, organic, non-repeating wandering even when scroll is still
      const ta = t * 0.0038;

      const d1x = Math.sin(ta * 1.000) * w * 0.055 + Math.sin(ta * 1.618) * w * 0.028;
      const d1y = Math.cos(ta * 0.721) * h * 0.068 + Math.cos(ta * 1.414) * h * 0.032;

      const d2x = Math.cos(ta * 0.850 + 1.0) * w * 0.050 + Math.cos(ta * 1.382 + 0.5) * w * 0.024;
      const d2y = Math.sin(ta * 0.900 + 0.5) * h * 0.062 + Math.sin(ta * 1.272)         * h * 0.028;

      const d3x = Math.sin(ta * 1.150 + 2.0) * w * 0.044 + Math.sin(ta * 1.732 + 1.5) * w * 0.020;
      const d3y = Math.cos(ta * 0.650 + 1.5) * h * 0.056 + Math.cos(ta * 1.618 + 0.8) * h * 0.025;

      // ── Natural resting centers ────────────────────────────────
      const n1x = w * 0.18, n1y = h * 0.42;
      const n2x = w * 0.78, n2y = h * 0.52;
      const n3x = w * 0.26, n3y = h * 0.65;

      // ── Photo area: where blobs come from / return to ─────────
      // Right side, slightly off-screen → visually feels like photo emitting light
      const p1x = w * 1.06, p1y = h * 0.36;
      const p2x = w * 1.10, p2y = h * 0.46;
      const p3x = w * 1.03, p3y = h * 0.58;

      // ── Final positions ───────────────────────────────────────
      // off=0: natural + drift   off=1: converged at photo area
      const b1x = n1x + d1x + (p1x - n1x) * off;
      const b1y = n1y + d1y + (p1y - n1y) * off;
      const b2x = n2x + d2x + (p2x - n2x) * off;
      const b2y = n2y + d2y + (p2y - n2y) * off;
      const b3x = n3x + d3x + (p3x - n3x) * off;
      const b3y = n3y + d3y + (p3y - n3y) * off;

      // ── Draw ─────────────────────────────────────────────────
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
