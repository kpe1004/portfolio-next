"use client";
import { useEffect, useRef, useState } from "react";

const PROJECTS = [
  { id:"01", title:"롯데백화점 럭셔리관", category:"Web Design",     year:"2025", color:"linear-gradient(135deg,#0d1117 0%,#1a2a6c 50%,#2c3bce 100%)" },
  { id:"02", title:"STIMMUNG 브랜딩",    category:"Branding",       year:"2024", color:"linear-gradient(135deg,#0a0a14 0%,#2c3bce 60%,#4a6cf7 100%)" },
  { id:"03", title:"롯데백화점 럭셔리관", category:"Design",          year:"2023", color:"linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#2c3bce 100%)" },
  { id:"04", title:"와썸맨X조지아",       category:"Photo Director", year:"2023", color:"linear-gradient(135deg,#000428 0%,#004e92 60%,#2c3bce 100%)" },
  { id:"05", title:"디엠성형외과",        category:"Branding",       year:"2022", color:"linear-gradient(135deg,#0a0a0a 0%,#1e3a8a 50%,#2c3bce 100%)" },
  { id:"06", title:"밀해담",             category:"Branding",       year:"2022", color:"linear-gradient(135deg,#1a1a2e 0%,#16213e 40%,#2c3bce 100%)" },
  { id:"07", title:"GREATBILLY",         category:"AI Generation",  year:"2025", color:"linear-gradient(135deg,#0d0d0d 0%,#2c3bce 40%,#7c3aed 100%)" },
  { id:"08", title:"장우손 떡볶이",       category:"Branding",       year:"2024", color:"linear-gradient(135deg,#0a0a14 0%,#1e3a8a 50%,#4a6cf7 100%)" },
  { id:"09", title:"LUCOMS",             category:"Design",          year:"2023", color:"linear-gradient(135deg,#050510 0%,#2c3bce 50%,#4a6cf7 100%)" },
  { id:"10", title:"SENSEMOM",           category:"Web Design",     year:"2022", color:"linear-gradient(135deg,#07071a 0%,#1a2a6c 50%,#2c3bce 100%)" },
  { id:"11", title:"WEGO&SPINNS",        category:"Photo Director", year:"2022", color:"linear-gradient(135deg,#0a0a0a 0%,#16213e 40%,#7c3aed 100%)" },
];

const LEFT  = PROJECTS.slice(0, 6);   // 01–06
const RIGHT = PROJECTS.slice(6);      // 07–11

export default function ProjectList() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [modalIdx,  setModalIdx]  = useState<number | null>(null);
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });

  const rafRef     = useRef<number>(0);
  const targetPos  = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  // Lerp cursor
  useEffect(() => {
    const onMove = (e: MouseEvent) => { targetPos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove, { passive: true });
    const lerp = () => {
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.1;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.1;
      setPreviewPos({ x: currentPos.current.x, y: currentPos.current.y });
      rafRef.current = requestAnimationFrame(lerp);
    };
    rafRef.current = requestAnimationFrame(lerp);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafRef.current); };
  }, []);

  // ESC to close modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModalIdx(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = modalIdx !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalIdx]);

  const hovered  = activeIdx !== null ? PROJECTS[activeIdx] : null;
  const modalP   = modalIdx  !== null ? PROJECTS[modalIdx]  : null;

  const renderRow = (p: typeof PROJECTS[0], globalIdx: number) => (
    <div
      key={p.id}
      onMouseEnter={() => setActiveIdx(globalIdx)}
      onMouseLeave={() => setActiveIdx(null)}
      onClick={() => setModalIdx(globalIdx)}
      style={{
        padding: "1.4rem 0",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        cursor: "pointer",
        transition: "opacity 0.3s ease",
        opacity: activeIdx === null || activeIdx === globalIdx ? 1 : 0.28,
        display: "flex", alignItems: "baseline", gap: "0.8rem",
      }}
    >
      <span style={{
        fontFamily: "var(--font-cormorant)",
        fontSize: "clamp(1.4rem, 2.8vw, 2.8rem)",
        fontWeight: 300,
        letterSpacing: "-0.02em",
        color: "#f0f0f0",
        lineHeight: 1.2,
      }}>
        {p.title}
      </span>
      <span style={{
        fontFamily: "var(--font-inter, Inter)",
        fontSize: "0.6rem", fontWeight: 600,
        letterSpacing: "0.1em",
        color: "rgba(255,255,255,0.22)",
        textTransform: "uppercase",
        flexShrink: 0,
      }}>
        {p.year}
      </span>
    </div>
  );

  return (
    <section id="works" ref={sectionRef} style={{ position: "relative", padding: "16vh 0 20vh", background: "#0a0a0a" }}>

      {/* Section title */}
      <div style={{ padding: "0 8vw 3rem" }}>
        <h2 style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "clamp(2.5rem, 5vw, 5rem)",
          fontWeight: 300, letterSpacing: "-0.02em",
          color: "#f0f0f0", lineHeight: 1,
        }}>
          Work
        </h2>
      </div>

      {/* 2-column grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        margin: "0 8vw",
      }}>
        {/* Left column */}
        <div style={{ borderRight: "1px solid rgba(255,255,255,0.07)", paddingRight: "5vw" }}>
          {LEFT.map((p, i) => renderRow(p, i))}
        </div>

        {/* Right column */}
        <div style={{ paddingLeft: "5vw" }}>
          {RIGHT.map((p, i) => renderRow(p, i + 6))}
        </div>
      </div>

      {/* Hover preview card */}
      <div
        style={{
          position: "fixed", top: 0, left: 0,
          pointerEvents: "none", zIndex: 30005,
          transform: `translate(${previewPos.x + 24}px, ${previewPos.y - 20}px)`,
          opacity: activeIdx !== null && modalIdx === null ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      >
        {hovered && (
          <div className="proj-card">
            <div className="proj-meta">
              <span className="proj-label">{hovered.category}</span>
              <span className="proj-label">{hovered.year}</span>
            </div>
            <div className="proj-card-img" style={{ background: hovered.color, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontFamily:"var(--font-cormorant)", fontSize:"0.85rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.06em" }}>
                {hovered.id}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal popup */}
      {modalP && (
        <div
          onClick={() => setModalIdx(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 50000,
            background: "rgba(5,5,16,0.88)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "2rem", animation: "fadeIn 0.3s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative", width: "100%", maxWidth: "820px",
              background: "#0e0e1e", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px", overflow: "hidden",
              animation: "slideUp 0.4s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <button
              onClick={() => setModalIdx(null)}
              style={{
                position: "absolute", top: "1.2rem", right: "1.2rem", zIndex: 10,
                background: "rgba(255,255,255,0.07)", border: "none",
                width: "2rem", height: "2rem", borderRadius: "50%",
                color: "rgba(255,255,255,0.6)", fontSize: "1.1rem",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ×
            </button>

            <div style={{
              width: "100%", aspectRatio: "16/9",
              background: modalP.color,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"clamp(1.5rem,4vw,3rem)", color:"rgba(255,255,255,0.2)" }}>
                {modalP.title}
              </span>
            </div>

            <div style={{ padding: "2rem 2rem 2.5rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1rem" }}>
                <div>
                  <p style={{ fontSize:"0.58rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.25)", marginBottom:"0.5rem" }}>
                    {modalP.category}
                  </p>
                  <h2 style={{ fontFamily:"var(--font-cormorant)", fontSize:"clamp(1.6rem,3.5vw,2.8rem)", fontWeight:300, letterSpacing:"-0.02em", color:"#f0f0f0", lineHeight:1.2 }}>
                    {modalP.title}
                  </h2>
                </div>
                <span style={{ fontFamily:"var(--font-grotesk)", fontSize:"0.7rem", color:"#4a6cf7", border:"1px solid rgba(74,108,247,0.35)", padding:"0.35em 0.8em", borderRadius:"2px", flexShrink:0, marginTop:"0.3rem" }}>
                  {modalP.year}
                </span>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.5rem", marginTop:"1.5rem" }}>
                {[1,2,3].map((n) => (
                  <div key={n} style={{
                    aspectRatio:"4/3", borderRadius:"4px",
                    background:"rgba(255,255,255,0.04)",
                    border:"1px dashed rgba(255,255,255,0.08)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    <span style={{ fontSize:"0.55rem", letterSpacing:"0.15em", color:"rgba(255,255,255,0.15)", textTransform:"uppercase" }}>
                      Image {n}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
