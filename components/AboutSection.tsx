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
              last update. 2026
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
              border: "1px solid rgba(255,255,255,0.06)",
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

      {/* Detailed info section */}
      <div id="infodetail" style={{ padding: "10vh 4rem 20vh", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8vw", maxWidth: "1000px" }}>
          {/* Left */}
          <div>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.2rem,2.5vw,2rem)", fontWeight: 300, lineHeight: 1.4, marginBottom: "2rem", color: "#f0f0f0" }}>
              끝임없이 GO!하는<br />
              <strong style={{ fontWeight: 600 }}>디자이너 고평은</strong>입니다.
            </h2>
            <dl style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                ["Name", "PYEONGEUN KO"],
                ["Birth", "1993 / 10 / 4"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: "2.5rem" }}>
                  <dt style={{ fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", width: "3.5rem", flexShrink: 0, paddingTop: "0.2rem" }}>
                    {k}
                  </dt>
                  <dd style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {[
              {
                title: "Education",
                items: ["정명정보고등학교 e-비즈니스과 졸업", "경인여자대학교 광고영상디자인과 졸업"],
              },
              {
                title: "Contacts",
                items: ["010.4173.2140", "rhvuddms1004@gmail.com"],
              },
            ].map(({ title, items }) => (
              <div key={title}>
                <h3 style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: "1rem" }}>{title}</h3>
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {items.map((item) => (
                    <li key={item} style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", listStyle: "none" }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: "1rem" }}>Experience</h3>
              <ul style={{ display: "flex", flexDirection: "column", gap: "1rem", listStyle: "none" }}>
                {[
                  ["경인여대 광고영상디자인과", "총무과대표 1년"],
                  ["딤커뮤니케이션", "코카콜라 SNS 콘텐츠 이미지제작, 영상편집"],
                  ["스티밍", "브랜드 콘텐츠 이미지제작, 홈페이지 구축 디자인"],
                  ["디엠성형외과", "병원 내 인쇄물 제작, 웹디자인, 영상편집"],
                  ["이노브모바일", "롯데백화점 웹디자인, 영상편집"],
                  ["스핀즈&위고", "캐릭터 디자인 의류 콜라보 제작"],
                  ["크리센트", "브랜드 콘텐츠 이미지 제작"],
                  ["헤이즐로드", "브랜딩 기획 및 온/오프라인 디자인"],
                ].map(([co, desc]) => (
                  <li key={co}>
                    <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "rgba(255,255,255,0.72)" }}>{co}</p>
                    <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginTop: "0.2rem" }}>{desc}</p>
                  </li>
                ))}
              </ul>
            </div>
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
