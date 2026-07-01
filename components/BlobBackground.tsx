"use client";
import { useEffect, useRef } from "react";

// triggerRef: 1.2 = just fired (blobs off-screen), decays → 0 (blobs at natural pos)
// alpha follows sin(π * progress) so it peaks mid-flight and fades at rest

export default function BlobBackground() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const triggerRef = useRef(0);

  // Observe each section — reset trigger on every new entry
  useEffect(() => {
    const targets = document.querySelectorAll("#info, #works, #skills, #infodetail, #contact");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) triggerRef.current = 1.2;
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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

      // Decay (0.95^60fps ≈ fades over ~1.6 s)
      if (triggerRef.current > 0.004) {
        triggerRef.current *= 0.955;
      } else {
        triggerRef.current = 0;
      }

      const tr = triggerRef.current;

      if (tr > 0.004) {
        // progress: 0 (just triggered) → 1 (settled/invisible)
        const progress  = 1 - tr / 1.2;
        // alpha peaks in the middle of the flight
        const alpha     = Math.sin(Math.PI * progress);
        // offsetFrac: 1 (off-screen) → 0 (natural position)
        const offsetFrac = tr / 1.2;

        // slow ambient drift so natural position isn't static
        const drift = Math.sin(t * 0.0008) * 0.04;

        // Blob 1 — comes from left side
        const n1x = w * (0.22 + drift);
        const n1y = h * 0.45;
        const b1x = n1x - w * offsetFrac * 1.1;
        const b1y = n1y;
        const r1  = w * 0.48;
        const g1  = ctx.createRadialGradient(b1x, b1y, 0, b1x, b1y, r1);
        g1.addColorStop(0.00, `rgba(30, 86, 255, ${(alpha * 0.78).toFixed(3)})`);
        g1.addColorStop(0.28, `rgba(44, 59, 206, ${(alpha * 0.50).toFixed(3)})`);
        g1.addColorStop(0.65, `rgba(20, 30, 120, ${(alpha * 0.20).toFixed(3)})`);
        g1.addColorStop(1.00, "rgba(5, 5, 16, 0.000)");
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, w, h);

        // Blob 2 — comes from right side
        const n2x = w * (0.78 - drift);
        const n2y = h * 0.52;
        const b2x = n2x + w * offsetFrac * 1.1;
        const b2y = n2y;
        const r2  = w * 0.42;
        const g2  = ctx.createRadialGradient(b2x, b2y, 0, b2x, b2y, r2);
        g2.addColorStop(0.00, `rgba(74, 108, 247, ${(alpha * 0.72).toFixed(3)})`);
        g2.addColorStop(0.32, `rgba(44, 59, 206, ${(alpha * 0.44).toFixed(3)})`);
        g2.addColorStop(0.68, `rgba(20, 20, 90,  ${(alpha * 0.16).toFixed(3)})`);
        g2.addColorStop(1.00, "rgba(5, 5, 16, 0.000)");
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, w, h);

        // Blob 3 (violet accent) — comes from left, slightly lower
        const n3x = w * (0.35 + drift * 0.5);
        const n3y = h * 0.62;
        const b3x = n3x - w * offsetFrac * 0.75;
        const b3y = n3y;
        const r3  = w * 0.30;
        const g3  = ctx.createRadialGradient(b3x, b3y, 0, b3x, b3y, r3);
        g3.addColorStop(0.00, `rgba(100, 50, 255, ${(alpha * 0.55).toFixed(3)})`);
        g3.addColorStop(0.40, `rgba(60, 40, 180,  ${(alpha * 0.28).toFixed(3)})`);
        g3.addColorStop(1.00, "rgba(5, 5, 16, 0.000)");
        ctx.fillStyle = g3;
        ctx.fillRect(0, 0, w, h);
      }

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
        position:       "fixed",
        top:            0,
        left:           0,
        width:          "100%",
        height:         "100%",
        zIndex:         1,
        pointerEvents:  "none",
        mixBlendMode:   "screen",  // dark canvas pixels = invisible; blue glows = additive light
      }}
    />
  );
}
