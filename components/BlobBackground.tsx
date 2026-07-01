"use client";
import { useEffect, useRef } from "react";

// Design:
// 1. First section entry  → full fly-in from sides (entryRef 1.2→0, ~3 s)
// 2. Alpha = (1 - entry/1.2) * 0.62  → ramps 0→0.62, then STAYS at 0.62 forever
// 3. Scroll drives an orbital drift (driftX / driftY) so blobs move as you scroll
// 4. Subsequent section entries → small sway, NO alpha reset (blobs stay visible)

export default function BlobBackground() {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const rafRef        = useRef<number>(0);
  const isActiveRef   = useRef(false);   // true after first section entered
  const entryRef      = useRef(0);       // 1.2 → 0 (fly-in offset, first entry only)
  const swayRef       = useRef(0);       // 0 → 0.28 small pulse on re-entry, decays
  const scrollYRef    = useRef(0);
  const scrollLerpRef = useRef(0);

  // Section IntersectionObserver
  useEffect(() => {
    const targets = document.querySelectorAll(
      "#info, #works, #skills, #infodetail, #contact"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          if (!isActiveRef.current) {
            // First ever section entry — full fly-in
            isActiveRef.current = true;
            entryRef.current    = 1.2;
          } else {
            // Already active — gentle sway from sides, don't reset alpha
            swayRef.current = Math.min(swayRef.current + 0.28, 0.42);
          }
        });
      },
      { threshold: 0.1 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Track scroll Y for drift
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

    const draw = () => {
      const w = (canvas.width  = canvas.offsetWidth);
      const h = (canvas.height = canvas.offsetHeight);
      ctx.clearRect(0, 0, w, h);

      // Skip until first section entered
      if (!isActiveRef.current) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // ── Decay ────────────────────────────────────────────────
      // Entry: slow (~3 s). Once 0, NEVER resets → alpha stays at max
      if (entryRef.current > 0.002) entryRef.current *= 0.972;
      else entryRef.current = 0;

      // Sway: medium (~1 s)
      if (swayRef.current > 0.003) swayRef.current *= 0.94;
      else swayRef.current = 0;

      // Smooth scroll lerp
      scrollLerpRef.current += (scrollYRef.current - scrollLerpRef.current) * 0.04;

      // ── Alpha ─────────────────────────────────────────────────
      // Ramps from 0 (entry=1.2) → 0.62 (entry=0), then stays at 0.62 permanently
      const entryProgress = 1 - Math.min(entryRef.current / 1.2, 1); // 0→1
      const alpha = entryProgress * 0.62;

      // ── Side offsets ──────────────────────────────────────────
      // Entry: large (blobs fly in from off-screen)
      // Sway: small (gentle pulse from sides on section change)
      const entryOff = entryRef.current / 1.2; // 1→0
      const swayOff  = swayRef.current * 0.5;  // 0→0.21
      const off      = entryOff + swayOff;

      // ── Scroll-driven drift ───────────────────────────────────
      // As you scroll, blobs orbit slowly — they "follow" the scroll
      const phase  = scrollLerpRef.current * 0.00088;
      const driftX = Math.sin(phase * 0.65) * w * 0.06;
      const driftY = Math.sin(phase * 0.45) * h * 0.13;

      // ── Blob 1 — left side ───────────────────────────────────
      const b1x = w * 0.22 + driftX - w * off * 0.95;
      const b1y = h * 0.42 + driftY;
      const g1  = ctx.createRadialGradient(b1x, b1y, 0, b1x, b1y, w * 0.50);
      g1.addColorStop(0.00, `rgba(30, 86, 255, ${(alpha * 0.88).toFixed(3)})`);
      g1.addColorStop(0.28, `rgba(44, 59, 206, ${(alpha * 0.56).toFixed(3)})`);
      g1.addColorStop(0.65, `rgba(20, 30, 120, ${(alpha * 0.24).toFixed(3)})`);
      g1.addColorStop(1.00, "rgba(5, 5, 16, 0.000)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      // ── Blob 2 — right side ──────────────────────────────────
      const b2x = w * 0.78 - driftX + w * off * 0.95;
      const b2y = h * 0.56 - driftY * 0.6;
      const g2  = ctx.createRadialGradient(b2x, b2y, 0, b2x, b2y, w * 0.44);
      g2.addColorStop(0.00, `rgba(74, 108, 247, ${(alpha * 0.80).toFixed(3)})`);
      g2.addColorStop(0.32, `rgba(44, 59, 206, ${(alpha * 0.50).toFixed(3)})`);
      g2.addColorStop(0.68, `rgba(20, 20, 90,  ${(alpha * 0.20).toFixed(3)})`);
      g2.addColorStop(1.00, "rgba(5, 5, 16, 0.000)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // ── Blob 3 — violet, lower-left ──────────────────────────
      const b3x = w * 0.30 + driftX * 0.5 - w * off * 0.68;
      const b3y = h * 0.65 + driftY * 0.45;
      const g3  = ctx.createRadialGradient(b3x, b3y, 0, b3x, b3y, w * 0.32);
      g3.addColorStop(0.00, `rgba(100, 50, 255, ${(alpha * 0.62).toFixed(3)})`);
      g3.addColorStop(0.40, `rgba(60, 40, 180,  ${(alpha * 0.32).toFixed(3)})`);
      g3.addColorStop(1.00, "rgba(5, 5, 16, 0.000)");
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, w, h);

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
