"use client";
import { useEffect, useRef, useState } from "react";
import ChrHover from "./ChrHover";

export default function AboutSection() {
  const photoRef = useRef<HTMLImageElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const photo = photoRef.current;
    if (!photo) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) photo.classList.add("visible");
      },
      { threshold: 0.15 }
    );
    observer.observe(photo);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="info" ref={sectionRef} style={{ position: "relative" }}>
      <div className="about">
        {/* Main large text */}
        <div className="about-text">
          <WordReveal visible={visible} delay={0}>
            감각적인 비주얼로,<br />
            <span className="other-accent">새로운 브랜드 경험</span>을 전합니다.
          </WordReveal>
        </div>

        {/* Sub text */}
        <div className="about-sub">
          <WordReveal visible={visible} delay={0.3}>
            변화하는 트렌드 속, 시대와 소통하고 기록하며<br />
            그 흐름과 함께 성장하는 디자이너 고평은 입니다.
          </WordReveal>
        </div>

        {/* Info link button */}
        <div className="about-btn">
          <ChrHover text="About Me" as="a" href="#infodetail" />
        </div>

        {/* Version / update */}
        <div className="about-version">
          <WordReveal visible={visible} delay={0.5}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5em", justifyContent: "flex-end" }}>
              <svg style={{ width: "1.1em", height: "1.1em" }} viewBox="0 0 84 85" fill="currentColor">
                <path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z"/>
              </svg>
              Explore the Works
            </span>
          </WordReveal>
        </div>

        {/* Photo */}
        <div className="about-photo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={photoRef}
            className="about-photo"
            src="/profile-placeholder.jpg"
            alt="Pyeongeun Ko"
            width={780}
            height={936}
            onError={(e) => {
              // fallback gradient if no photo
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Gradient placeholder shown when no photo */}
          <div
            style={{
              width: "min(55vw, 780px)",
              aspectRatio: "5/6",
              borderRadius: "280px 0 0 280px",
              background: "linear-gradient(135deg, rgba(44,59,206,0.25) 0%, rgba(74,40,160,0.15) 50%, rgba(10,10,10,0.8) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.7,
            }}
          >
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
              Photo
            </span>
          </div>
        </div>
      </div>

    </section>
  );
}

function WordReveal({ children, visible, delay = 0 }: { children: React.ReactNode; visible: boolean; delay?: number }) {
  return (
    <span
      style={{
        display: "block",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: visible
          ? `opacity 0.8s ease ${delay}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s`
          : "none",
      }}
    >
      {children}
    </span>
  );
}
