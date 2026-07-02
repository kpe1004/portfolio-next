"use client";
import { useEffect, useRef } from "react";

// One-time staggered ENTRY when #info first becomes visible (never re-triggers)
// EXIT: tracks #info section visibility — blobs exit whenever section leaves viewport
//       (both when scrolling UP to hero AND when scrolling DOWN past section)

export default function BlobBackground() {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const rafRef         = useRef<number>(0);
  const hasEnteredRef  = useRef(false);
  const entry1Ref      = useRef(0);
  const entry3Ref      = useRef(0);
  const entry2Ref      = useRef(0);
  const inViewRef      = useRef(false); // raw boolean from observer
  const sectionVisRef  = useRef(0);    // lerped 0–1

  const timerIds = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const section = document.querySelector("#info");
    if (!section) return;

    // Observer A — one-time entry trigger
    const entryObserver = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !hasEnteredRef.current && window.scrollY > 80) {
          hasEnteredRef.current = true;
          entry1Ref.current = 1.2;
          timerIds.current.push(setTimeout(() => { entry3Ref.current = 1.2; }, 350));
          timerIds.current.push(setTimeout(() => { entry2Ref.current = 1.2; }, 700));
          entryObserver.disconnect();
        }
      },
      { threshold: 0.20 }
    );

    // Observer B — continuous visibility (drives exit zone in both directions)
    const visObserver = new IntersectionObserver(
      ([e]) => { inViewRef.current = e.isIntersecting; },
      { threshold: 0.05 }
    );

    entryObserver.observe(section);
    visObserver.observe(section);

    return () => {
      entryObserver.disconnect();
      visObserver.disconnect();
      timerIds.current.forEach(clearTimeout);
    };
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

      // Lerp section visibility (0.06 ≈ ~1 s transition at 60 fps)
      const visTarget = inViewRef.current ? 1 : 0;
      sectionVisRef.current += (visTarget - sectionVisRef.current) * 0.06;
      const sv = sectionVisRef.current; // 0 = section not in view, 1 = fully in view

      if (!hasEnteredRef.current || sv < 0.005) {
        t++;
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // Decay each blob's one-time entry offset
      if (entry1Ref.current > 0.002) entry1Ref.current *= 0.983; else entry1Ref.current = 0;
      if (entry2Ref.current > 0.002) entry2Ref.current *= 0.983; else entry2Ref.current = 0;
      if (entry3Ref.current > 0.002) entry3Ref.current *= 0.983; else entry3Ref.current = 0;

      // Alpha: entry ramp × section visibility
      const alpha = (1 - Math.min(entry1Ref.current / 1.2, 1)) * 0.62 * sv;
      if (alpha < 0.005) { t++; rafRef.current = requestAnimationFrame(draw); return; }

      // Entry offsets (1→0 as each blob flies in, one-time)
      const off1 = entry1Ref.current / 1.2;
      const off2 = entry2Ref.current / 1.2;
      const off3 = entry3Ref.current / 1.2;

      // Staggered exit offsets driven by sv (last-in first-out as sv drops 1→0)
      // blob2(right) exits first → sv 1.0→0.60
      // blob3(lower) exits next  → sv 0.70→0.30
      // blob1(left)  exits last  → sv 0.40→0.00
      const exit2Off = 1 - Math.min(1, Math.max(0, (sv - 0.60) / 0.40));
      const exit3Off = 1 - Math.min(1, Math.max(0, (sv - 0.30) / 0.40));
      const exit1Off = 1 - Math.min(1, Math.max(0,  sv         / 0.40));

      // Firefly drift
      const ta = t * 0.012;
      const d1x = Math.sin(ta * 1.000) * w * 0.060 + Math.sin(ta * 1.618) * w * 0.030;
      const d1y = Math.cos(ta * 0.721) * h * 0.080 + Math.cos(ta * 1.414) * h * 0.040;
      const d2x = Math.cos(ta * 0.850 + 1.0) * w * 0.050 + Math.cos(ta * 1.382 + 0.5) * w * 0.025;
      const d2y = Math.sin(ta * 0.900 + 0.5) * h * 0.070 + Math.sin(ta * 1.272)        * h * 0.035;
      const d3x = Math.sin(ta * 1.150 + 2.0) * w * 0.055 + Math.sin(ta * 1.732 + 1.5) * w * 0.022;
      const d3y = Math.cos(ta * 0.650 + 1.5) * h * 0.075 + Math.cos(ta * 1.618 + 0.8) * h * 0.030;

      const bx1 = w * 0.18 + d1x, by1 = h * 0.40 + d1y;
      const bx2 = w * 0.78 + d2x, by2 = h * 0.50 + d2y;
      const bx3 = w * 0.24 + d3x, by3 = h * 0.65 + d3y;

      const b1x = bx1 - w * (off1 + exit1Off) * 0.95;
      const b1y = by1;
      const b2x = bx2 + w * (off2 + exit2Off) * 0.95;
      const b2y = by2;
      const b3x = bx3 - w * (off3 + exit3Off) * 0.72;
      const b3y = by3;

      // Draw
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
