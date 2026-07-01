"use client";
import { useEffect, useRef } from "react";

// Behavior:
// - Hero section: completely invisible
// - First time scrolling into #info: blobs fly in from sides slowly (~3 s)
// - After that: blobs STAY at 0.60 alpha forever — they never disappear again
// - Scroll drives gentle orbital drift so blobs feel alive and "following"
// - Scrolling back into hero: blobs fade out; scrolling back down: fade in again

export default function BlobBackground() {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const rafRef        = useRef<number>(0);
  const hasEnteredRef = useRef(false);  // true after first #info entry (never resets)
  const entryRef      = useRef(0);      // 1.2→0 fly-in offset (one-time only)
  const scrollYRef    = useRef(0);
  const scrollLerpRef = useRef(0);

  // Trigger ONCE when #info first scrolls into view past the hero
  useEffect(() => {
    const section = document.querySelector("#info");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasEnteredRef.current && window.scrollY > 80) {
          hasEnteredRef.current = true;
          entryRef.current      = 1.2;   // start fly-in
          observer.disconnect();          // never re-trigger
        }
      },
      { threshold: 0.20 }  // 20% of section visible = clearly past hero
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

      // Smooth scroll lerp (always running)
      scrollLerpRef.current += (scrollYRef.current - scrollLerpRef.current) * 0.04;

      // Nothing to draw until first entry
      if (!hasEnteredRef.current) {
        t++;
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // ── Decay entry offset (slow ~3 s) ────────────────────────
      if (entryRef.current > 0.002) entryRef.current *= 0.972;
      else entryRef.current = 0;

      // ── Hero-proximity ────────────────────────────────────────
      // heroFade: 0 = in hero, 1 = past hero (fully visible)
      // Fade starts at 60 % of viewport height, complete at 100 %
      const heroFade = Math.min(
        1,
        Math.max(0, (scrollLerpRef.current - h * 0.60) / (h * 0.40))
      );

      // ── Alpha ─────────────────────────────────────────────────
      const entryProgress = 1 - Math.min(entryRef.current / 1.2, 1);
      const alpha = entryProgress * 0.60 * heroFade;

      if (alpha < 0.005) {
        t++;
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // ── Position offsets ──────────────────────────────────────
      // entryOff: 1→0 fly-in (one-time, when first entering)
      // exitOff : 0→1 fly-out (when scrolling back into hero)
      // Combined they push blobs off-screen to left / right
      const entryOff = entryRef.current / 1.2;
      const exitOff  = 1 - heroFade;            // 0 when in sections, 1 when in hero
      const sideOff  = entryOff + exitOff;      // total push away from center

      // ── Autonomous drift (always moving) ─────────────────────
      // ta = 0.004 → one full cycle ≈ 26 s at 60 fps (gentle but clearly visible)
      const ta = t * 0.0040;

      // ── Scroll-driven extra motion ────────────────────────────
      const sp = scrollLerpRef.current * 0.00062;

      // ── Blob positions ────────────────────────────────────────
      // Each blob has its own phase offset so they drift independently

      // Blob 1 — left, blue  (pushed left by sideOff)
      const b1x = w * 0.20 + Math.sin(ta * 1.00)       * w * 0.10 - w * sideOff * 0.95;
      const b1y = h * 0.42 + Math.cos(ta * 0.70)       * h * 0.12 + Math.sin(sp) * h * 0.10;

      // Blob 2 — right, indigo  (pushed right by sideOff)
      const b2x = w * 0.80 + Math.cos(ta * 0.85 + 1.0) * w * 0.09 + w * sideOff * 0.95;
      const b2y = h * 0.55 + Math.sin(ta * 0.90 + 0.5) * h * 0.11 + Math.cos(sp * 0.75) * h * 0.08;

      // Blob 3 — lower-left, violet  (pushed left, slightly less)
      const b3x = w * 0.28 + Math.sin(ta * 1.15 + 2.0) * w * 0.08 - w * sideOff * 0.68;
      const b3y = h * 0.65 + Math.cos(ta * 0.65 + 1.5) * h * 0.09 + Math.sin(sp * 0.9 + 1) * h * 0.07;

      // ── Draw ──────────────────────────────────────────────────
      const g1 = ctx.createRadialGradient(b1x, b1y, 0, b1x, b1y, w * 0.50);
      g1.addColorStop(0.00, `rgba(30, 86, 255, ${(alpha * 0.88).toFixed(3)})`);
      g1.addColorStop(0.28, `rgba(44, 59, 206, ${(alpha * 0.56).toFixed(3)})`);
      g1.addColorStop(0.65, `rgba(20, 30, 120, ${(alpha * 0.24).toFixed(3)})`);
      g1.addColorStop(1.00, "rgba(5, 5, 16, 0.000)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(b2x, b2y, 0, b2x, b2y, w * 0.44);
      g2.addColorStop(0.00, `rgba(74, 108, 247, ${(alpha * 0.80).toFixed(3)})`);
      g2.addColorStop(0.32, `rgba(44, 59, 206, ${(alpha * 0.50).toFixed(3)})`);
      g2.addColorStop(0.68, `rgba(20, 20, 90,  ${(alpha * 0.20).toFixed(3)})`);
      g2.addColorStop(1.00, "rgba(5, 5, 16, 0.000)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      const g3 = ctx.createRadialGradient(b3x, b3y, 0, b3x, b3y, w * 0.32);
      g3.addColorStop(0.00, `rgba(100, 50, 255, ${(alpha * 0.62).toFixed(3)})`);
      g3.addColorStop(0.40, `rgba(60, 40, 180,  ${(alpha * 0.32).toFixed(3)})`);
      g3.addColorStop(1.00, "rgba(5, 5, 16, 0.000)");
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, w, h);

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
