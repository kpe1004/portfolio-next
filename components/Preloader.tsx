"use client";
import { useEffect, useRef, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount]     = useState(0);
  const [phase, setPhase]     = useState<"in" | "hold" | "exit">("in");
  const rafRef                = useRef<number>(0);

  useEffect(() => {
    const DURATION = 2400; // ms to count 0→100
    const start    = performance.now();

    const tick = (now: number) => {
      const t      = Math.min((now - start) / DURATION, 1);
      // ease-out quart
      const eased  = 1 - Math.pow(1 - t, 4);
      setCount(Math.floor(eased * 100));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCount(100);
        // brief hold, then exit
        setTimeout(() => {
          setPhase("exit");
          // wait for CSS transition to finish, then call onComplete
          setTimeout(onComplete, 900);
        }, 350);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  if (phase === "exit") {
    // split the screen into two halves that slide away
    return (
      <>
        <div
          className="fixed inset-x-0 top-0 z-[9999]"
          style={{
            height: "50vh",
            background: "#0a0a0a",
            transform: "translateY(-100%)",
            transition: "transform 0.85s cubic-bezier(0.76,0,0.24,1)",
          }}
        />
        <div
          className="fixed inset-x-0 bottom-0 z-[9999]"
          style={{
            height: "50vh",
            background: "#0a0a0a",
            transform: "translateY(100%)",
            transition: "transform 0.85s cubic-bezier(0.76,0,0.24,1)",
          }}
        />
      </>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* counter */}
      <div className="relative flex items-end gap-1">
        <span
          className="font-light text-white leading-none tabular-nums"
          style={{ fontSize: "clamp(5rem, 14vw, 11rem)", letterSpacing: "-0.03em" }}
        >
          {String(count).padStart(2, "0")}
        </span>
        <span className="text-white/20 text-2xl mb-3">%</span>
      </div>

      {/* name */}
      <p
        className="mt-5 text-[0.6rem] tracking-[0.4em] uppercase text-white/20"
        style={{
          opacity: count > 10 ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        Pyeongeun Ko &mdash; Designer
      </p>

      {/* progress line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5">
        <div
          className="h-full bg-white/25 transition-all"
          style={{
            width: `${count}%`,
            transition: "width 0.05s linear",
          }}
        />
      </div>
    </div>
  );
}
