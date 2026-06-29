"use client";
import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "designer" | "pyeongeun" | "ko" | "hold" | "expand" | "fade";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  // track approximate dot position for clip-path origin
  const dotRef = useRef<HTMLSpanElement>(null);
  const [dotOrigin, setDotOrigin] = useState({ x: 50, y: 58 }); // percent

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("designer"),  200);
    const t2 = setTimeout(() => setPhase("pyeongeun"), 950);
    const t3 = setTimeout(() => setPhase("ko"),       1750);
    const t4 = setTimeout(() => setPhase("hold"),     2600);
    const t5 = setTimeout(() => {
      // capture dot position just before expanding
      if (dotRef.current) {
        const r = dotRef.current.getBoundingClientRect();
        setDotOrigin({
          x: ((r.left + r.width / 2) / window.innerWidth)  * 100,
          y: ((r.top  + r.height/ 2) / window.innerHeight) * 100,
        });
      }
      setPhase("expand");
    }, 3400);
    const t6 = setTimeout(() => {
      onComplete(); // main page becomes visible behind overlay
    }, 5400);
    const t7 = setTimeout(() => setPhase("fade"), 5500);

    return () => [t1,t2,t3,t4,t5,t6,t7].forEach(clearTimeout);
  }, [onComplete]);

  const after = (...targets: Phase[]) =>
    targets.some((t) => {
      const order: Phase[] = ["designer","pyeongeun","ko","hold","expand","fade"];
      return order.indexOf(phase) >= order.indexOf(t);
    });

  // clip-path value for the expanding blue dot
  const ox = `${dotOrigin.x}%`;
  const oy = `${dotOrigin.y}%`;

  const clipPath = (() => {
    if (after("expand")) return `circle(160% at ${ox} ${oy})`;
    return `circle(0% at ${ox} ${oy})`;
  })();

  const overlayTransition = (() => {
    if (phase === "expand") return `clip-path 1.9s cubic-bezier(0.4,0,0.2,1)`;
    if (phase === "fade")   return `opacity 0.65s ease`;
    return "none";
  })();

  return (
    <>
      {/* Dark base */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "#050510",
        opacity: after("expand") ? 0 : 1,
        transition: after("expand") ? "opacity 0.3s ease" : "none",
        pointerEvents: "none",
      }} />

      {/* Expanding blue dot → fullscreen → fade */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 10002,
        background: "#2c3bce",
        clipPath,
        opacity: phase === "fade" ? 0 : 1,
        transition: overlayTransition,
        pointerEvents: "none",
      }} />

      {/* Text */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 10001,
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none",
        opacity: after("expand") ? 0 : 1,
        transition: after("expand") ? "opacity 0.2s ease" : "none",
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

          {/* "Designer" */}
          <WaveWord
            text="Designer"
            visible={after("designer")}
            fontClass="pre-label"
            charDelay={30}
          />

          {/* "Pyeongeun" */}
          <WaveWord
            text="Pyeongeun"
            visible={after("pyeongeun")}
            fontClass="pre-name"
            charDelay={42}
          />

          {/* "Ko." */}
          <WaveWord
            text="Ko"
            visible={after("ko")}
            fontClass="pre-name"
            charDelay={42}
            dotRef={dotRef}
          />
        </div>
      </div>
    </>
  );
}

interface WaveWordProps {
  text: string;
  visible: boolean;
  fontClass: string;
  charDelay: number;
  dotRef?: React.RefObject<HTMLSpanElement>;
}

function WaveWord({ text, visible, fontClass, charDelay, dotRef }: WaveWordProps) {
  return (
    <div
      className={fontClass}
      style={{ overflow: "hidden", display: "flex", alignItems: "baseline", paddingBottom: "0.08em" }}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{
            display: "inline-block", whiteSpace: "pre", willChange: "transform",
            transform: visible ? "translateY(0)" : "translateY(105%)",
            opacity: visible ? 1 : 0,
            transition: visible
              ? `transform 0.80s cubic-bezier(0.22,1,0.36,1) ${i * charDelay}ms,
                 opacity  0.55s ease ${i * charDelay}ms`
              : "none",
          }}
        >
          {char}
        </span>
      ))}

      {/* Blue dot — only on "Ko", seed of the expansion */}
      {dotRef && (
        <span
          ref={dotRef}
          className="pre-dot"
          style={{
            display: "inline-block", willChange: "transform",
            transform: visible ? "translateY(0)" : "translateY(105%)",
            opacity: visible ? 1 : 0,
            transition: visible
              ? `transform 0.80s cubic-bezier(0.22,1,0.36,1) ${text.length * charDelay + 60}ms,
                 opacity  0.55s ease ${text.length * charDelay + 60}ms`
              : "none",
          }}
        >
          .
        </span>
      )}
    </div>
  );
}
