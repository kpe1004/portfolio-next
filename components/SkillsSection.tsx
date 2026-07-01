"use client";
import { useEffect, useRef, useState } from "react";

const SKILL_GROUPS = [
  {
    label: "Brand Design",
    tags: ["Visual Identity", "Brand Strategy", "Logo Design", "Typography", "Color Theory"],
  },
  {
    label: "Digital Design",
    tags: ["Web Design", "UI/UX", "SNS Contents", "Figma", "Adobe XD"],
  },
  {
    label: "Motion & Video",
    tags: ["Video Editing", "Motion Graphics", "After Effects", "Premiere Pro"],
  },
  {
    label: "AI Generation",
    tags: ["Midjourney", "Stable Diffusion", "DALL-E", "AI Workflow"],
  },
  {
    label: "Photography",
    tags: ["Photo Director", "Retouching", "Lightroom", "Photoshop"],
  },
];

export default function SkillsSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="skills">
      <div className="skills-inner">
        {/* Sticky left */}
        <div className="skills-left">
          <p className="skills-subtitle">Capabilities</p>
          <h2
            className="skills-text"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.8s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            다양한 분야에서<br />
            <span style={{ color: "var(--blue-bright)" }}>경험</span>을 쌓아왔습니다.
          </h2>

          {/* Blue accent line */}
          <div style={{
            width: "2.5rem", height: "2px", background: "var(--blue)",
            opacity: visible ? 1 : 0,
            transform: visible ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "opacity 0.8s ease 0.3s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s",
          }} />
        </div>

        {/* Right: accordion */}
        <div className="skills-right">
          {SKILL_GROUPS.map((group, i) => (
            <div key={group.label} className={`skill-group${openIdx === i ? " open" : ""}`}>
              <button
                className="skill-header"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                aria-expanded={openIdx === i}
              >
                <span>{group.label}</span>
                <span className="skill-header-icon">+</span>
              </button>
              <div className="skill-body">
                <div className="skill-tags">
                  {group.tags.map((tag) => (
                    <span key={tag} className="skill-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
