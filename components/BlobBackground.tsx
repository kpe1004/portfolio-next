"use client";
import { useEffect, useRef } from "react";

// triggerRef  : 1.2 → 0  (section entry fly-in, slow decay ~3 s)
// scrollImpRef: 0 → 0.35 (per-scroll sway, decays when still)
// Combined: blobs fly in slowly on entry, then pulse from sides while scrolling

export default function BlobBackground() {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const rafRef        = useRef<number>(0);
  const triggerRef    = useRef(0);
  const scrollImpRef  = useRef(0);
  const prevScrollRef = useRef(0);

  // Section entry — reset trigger
  useEffect(() => {
    const targets = document.querySelectorAll("#info, #works, #skills, #infodetail, #contact");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) triggerRef.current = 1.2;
        });
      },
      { threshold: 0.1 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Scroll impulse — blobs sway from sides while scrolling
  useEffect(() => {
    const onScroll = () => {
      const curr  = window.scrollY;
      const delta = Math.abs(curr - prevScrollRef.current);
      if (delta > 1) {
        scrollImpRef.current = Math.min(scrollImpRef.current + delta * 0.005, 0.38);
      }
      prevScrollRef.current = curr;
    };
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

      // Fly-in: slow decay so blobs glide in over ~3 s
      if (triggerRef.current > 0.003) triggerRef.current *= 0.972;
      else triggerRef.current = 0;

      // Scroll sway: medium decay — stays bright while scrolling, fades when still
      if (scrollImpRef.current > 0.003) scrollImpRef.current *= 0.94;
      else scrollImpRef.current = 0;

      const tr = triggerRef.current;   // 0–1.2
      const si = scrollImpRef.current; // 0–0.38

      if (tr < 0.003 && si < 0.003) {
        t++;
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // Alpha: fly-in peaks mid-flight (sin curve); scroll sway is linear
      const progress = tr > 0 ? 1 - tr / 1.2 : 1;
      const flyAlpha  = Math.sin(Math.PI * progress) * 0.72;
      const swayAlpha = si * 1.6;
      const alpha     = Math.max(flyAlpha, swayAlpha);

      // Side offset: larger = further off-screen
      const flyOff  = tr / 1.2;       // 1 → 0  (far side → natural)
      const swayOff = si * 0.45;      // 0 → 0.17 (gentle pulse from sides)
      const off     = flyOff + swayOff;

      const drift = Math.sin(t * 0.0007) * 0.025;

      // ── Blob 1 — from left ───────────────────────────────────
      const b1x = w * (0.24 + drift) - w * off * 0.95;
      const b1y = h * 0.44;
      const g1  = ctx.createRadialGradient(b1x, b1y, 0, b1x, b1y, w * 0.50);
      const a1  = (v: number) => (alpha * v).toFixed(3);
      g1.addColorStop(0.00, `rgba(30, 86, 255, ${a1(0.82)})`);
      g1.addColorStop(0.28, `rgba(44, 59, 206, ${a1(0.54)})`);
      g1.addColorStop(0.65, `rgba(20, 30, 120, ${a1(0.22)})`);
      g1.addColorStop(1.00, "rgba(5, 5, 16, 0.000)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      // ── Blob 2 — from right ──────────────────────────────────
      const b2x = w * (0.76 - drift) + w * off * 0.95;
      const b2y = h * 0.54;
      const g2  = ctx.createRadialGradient(b2x, b2y, 0, b2x, b2y, w * 0.44);
      const a2  = (v: number) => (alpha * v).toFixed(3);
      g2.addColorStop(0.00, `rgba(74, 108, 247, ${a2(0.76)})`);
      g2.addColorStop(0.32, `rgba(44, 59, 206, ${a2(0.48)})`);
      g2.addColorStop(0.68, `rgba(20, 20, 90,  ${a2(0.18)})`);
      g2.addColorStop(1.00, "rgba(5, 5, 16, 0.000)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // ── Blob 3 — violet accent from left-lower ───────────────
      const b3x = w * (0.32 + drift * 0.6) - w * off * 0.68;
      const b3y = h * 0.63;
      const g3  = ctx.createRadialGradient(b3x, b3y, 0, b3x, b3y, w * 0.32);
      const a3  = (v: number) => (alpha * v).toFixed(3);
      g3.addColorStop(0.00, `rgba(100, 50, 255, ${a3(0.58)})`);
      g3.addColorStop(0.40, `rgba(60, 40, 180,  ${a3(0.30)})`);
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
