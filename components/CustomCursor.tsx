"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef    = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);
  const posRef    = useRef({ x: -100, y: -100 });
  const ringPos   = useRef({ x: -100, y: -100 });
  const rafRef    = useRef<number>(0);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // only show on non-touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // lerp loop for the ring
    const LERP = 0.12;
    const loop = () => {
      ringPos.current.x += (posRef.current.x - ringPos.current.x) * LERP;
      ringPos.current.y += (posRef.current.y - ringPos.current.y) * LERP;

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
    return null;
  }

  return (
    <>
      {/* dot — follows instantly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{
          width: hovered ? "6px" : "4px",
          height: hovered ? "6px" : "4px",
          background: "rgba(255,255,255,0.9)",
          borderRadius: "50%",
          marginLeft: hovered ? "-3px" : "-2px",
          marginTop: hovered ? "-3px" : "-2px",
          transition: "width 0.2s ease, height 0.2s ease, background 0.2s ease",
          opacity: visible ? 1 : 0,
        }}
      />

      {/* ring — follows with lag */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[99998]"
        style={{
          width: hovered ? "44px" : "30px",
          height: hovered ? "44px" : "30px",
          border: `1px solid rgba(255,255,255,${hovered ? 0.5 : 0.22})`,
          borderRadius: "50%",
          marginLeft: hovered ? "-22px" : "-15px",
          marginTop: hovered ? "-22px" : "-15px",
          transition: "width 0.3s ease, height 0.3s ease, border-color 0.3s ease, margin 0.3s ease",
          opacity: visible ? 1 : 0,
        }}
      />
    </>
  );
}
