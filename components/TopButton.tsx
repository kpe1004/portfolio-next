"use client";
import { useEffect, useState } from "react";

export default function TopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      style={{
        position:       "fixed",
        bottom:         "2.2rem",
        right:          "2.2rem",
        width:          "2.6rem",
        height:         "2.6rem",
        borderRadius:   "50%",
        border:         "1px solid rgba(74, 108, 247, 0.45)",
        background:     "rgba(8, 8, 22, 0.75)",
        backdropFilter: "blur(10px)",
        color:          "rgba(140, 180, 255, 0.9)",
        cursor:         "pointer",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        zIndex:         9990,
        opacity:        visible ? 1 : 0,
        transform:      visible ? "translateY(0) scale(1)" : "translateY(0.8rem) scale(0.85)",
        transition:     "opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.2s ease, background 0.2s ease",
        pointerEvents:  visible ? "auto" : "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(74, 108, 247, 0.9)";
        (e.currentTarget as HTMLButtonElement).style.background  = "rgba(20, 20, 60, 0.9)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(74, 108, 247, 0.45)";
        (e.currentTarget as HTMLButtonElement).style.background  = "rgba(8, 8, 22, 0.75)";
      }}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 10.5V2.5M2.5 6.5L6.5 2.5L10.5 6.5" />
      </svg>
    </button>
  );
}
