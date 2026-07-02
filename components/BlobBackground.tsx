"use client";
import { useEffect, useRef } from "react";

// Each blob has its own visibility value (0=off-screen, 1=on-screen).
// IntersectionObserver on #info fires both on enter and exit.
// Staggered entry  : blob1(left) now → blob3(lower-left) +350ms → blob2(right) +700ms
// Staggered exit   : blob2(right) now → blob3 +250ms → blob1(left) +500ms
// Smooth transitions via per-frame lerp

export default function BlobBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  // Per-blob: vis = current visibility (0–1), tgt = target
  const vis1 = useRef(0); const tgt1 = useRef(0);
  const vis2 = useRef(0); const tgt2 = useRef(0);
  const vis3 = useRef(0); const tgt3 = useRef(0);

  const timerIds = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const section = document.querySelector("#info");
    if (!section) return;

    const clearTimers = () => {
      timerIds.current.forEach(clearTimeout);
      timerIds.current = [];
    };

    const observer = new IntersectionObserver(
      ([e]) => {
        clearTimers();
        if (e.isIntersecting) {
          // Staggered entry — left first, lower-left, right last
          tgt1.current = 1;
          timerIds.current.push(setTimeout(() => { tgt3.current = 1; }, 350));
          timerIds.current.push(setTimeout(() => { tgt2.current = 1; }, 700));
        } else {
          // Staggered exit — right first (last-in first-out), left last
          tgt2.current = 0;
          timerIds.current.push(setTimeout(() => { tgt3.current = 0; }, 250));
          timerIds.current.push(setTimeout(() => { tgt1.current = 0; }, 500));
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => { observer.disconnect(); clearTimers(); };
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

      // Lerp toward targets (0.045 ≈ ~1.2 s full transition at 60 fps)
      vis1.current += (tgt1.current - vis1.current) * 0.045;
      vis2.current += (tgt2.current - vis2.current) * 0.045;
      vis3.current += (tgt3.current - vis3.current) * 0.045;

      // Skip draw if everything invisible
      if (vis1.current < 0.005 && vis2.current < 0.005 && vis3.current < 0.005) {
        t++;
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // Per-blob alpha & side-offset
      const a1 = vis1.current * 0.62;
      const a2 = vis2.current * 0.62;
      const a3 = vis3.current * 0.62;
      const off1 = 1 - vis1.current; // 0=on-screen, 1=off-screen
      const off2 = 1 - vis2.current;
      const off3 = 1 - vis3.current;

      // Firefly drift — multi-sine at φ / √2 / √3 ratios
      const ta = t * 0.012;
      const d1x = Math.sin(ta * 1.000) * w * 0.060 + Math.sin(ta * 1.618) * w * 0.030;
      const d1y = Math.cos(ta * 0.721) * h * 0.080 + Math.cos(ta * 1.414) * h * 0.040;
      const d2x = Math.cos(ta * 0.850 + 1.0) * w * 0.050 + Math.cos(ta * 1.382 + 0.5) * w * 0.025;
      const d2y = Math.sin(ta * 0.900 + 0.5) * h * 0.070 + Math.sin(ta * 1.272)        * h * 0.035;
      const d3x = Math.sin(ta * 1.150 + 2.0) * w * 0.055 + Math.sin(ta * 1.732 + 1.5) * w * 0.022;
      const d3y = Math.cos(ta * 0.650 + 1.5) * h * 0.075 + Math.cos(ta * 1.618 + 0.8) * h * 0.030;

      // Natural centers + drift
      const bx1 = w * 0.18 + d1x,  by1 = h * 0.40 + d1y;
      const bx2 = w * 0.78 + d2x,  by2 = h * 0.50 + d2y;
      const bx3 = w * 0.24 + d3x,  by3 = h * 0.65 + d3y;

      // blob1 & blob3 exit LEFT, blob2 exits RIGHT
      const b1x = bx1 - w * off1 * 0.95;
      const b1y = by1;
      const b2x = bx2 + w * off2 * 0.95;
      const b2y = by2;
      const b3x = bx3 - w * off3 * 0.72;
      const b3y = by3;

      // ── Draw ────────────────────────────────────────────────
      const g1 = ctx.createRadialGradient(b1x, b1y, 0, b1x, b1y, w * 0.50);
      g1.addColorStop(0.00, `rgba(30, 86, 255, ${(a1 * 0.88).toFixed(3)})`);
      g1.addColorStop(0.28, `rgba(44, 59, 206, ${(a1 * 0.56).toFixed(3)})`);
      g1.addColorStop(0.65, `rgba(20, 30, 120, ${(a1 * 0.24).toFixed(3)})`);
      g1.addColorStop(1.00, "rgba(5, 5, 16, 0.000)");
      ctx.fillStyle = g1; ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(b2x, b2y, 0, b2x, b2y, w * 0.44);
      g2.addColorStop(0.00, `rgba(74, 108, 247, ${(a2 * 0.80).toFixed(3)})`);
      g2.addColorStop(0.32, `rgba(44, 59, 206, ${(a2 * 0.50).toFixed(3)})`);
      g2.addColorStop(0.68, `rgba(20, 20, 90,  ${(a2 * 0.20).toFixed(3)})`);
      g2.addColorStop(1.00, "rgba(5, 5, 16, 0.000)");
      ctx.fillStyle = g2; ctx.fillRect(0, 0, w, h);

      const g3 = ctx.createRadialGradient(b3x, b3y, 0, b3x, b3y, w * 0.32);
      g3.addColorStop(0.00, `rgba(100, 50, 255, ${(a3 * 0.62).toFixed(3)})`);
      g3.addColorStop(0.40, `rgba(60, 40, 180,  ${(a3 * 0.32).toFixed(3)})`);
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
