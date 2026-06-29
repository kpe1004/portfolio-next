"use client";
import { useEffect, useRef, useState } from "react";
import ChrHover from "./ChrHover";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="contact-section">
      <p className="contact-label">Contact</p>

      <h2
        className="contact-big"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 1s ease, transform 1s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        함께{" "}
        <span className="other-accent">만들어요.</span>
      </h2>

      <div
        className="contact-links"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.8s ease 0.25s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.25s",
        }}
      >
        <a href="mailto:rhvuddms1004@gmail.com" className="contact-link">
          <span className="cl-label">Email</span>
          rhvuddms1004@gmail.com
        </a>
        <a href="tel:01041732140" className="contact-link">
          <span className="cl-label">Phone</span>
          010.4173.2140
        </a>
      </div>

      <footer className="contact-footer">
        <p className="contact-copy">
          © 2026 Pyeongeun Ko. All rights reserved.
        </p>
        <nav style={{ display: "flex", gap: "2rem" }}>
          {[
            { label: "Branding", href: "#" },
            { label: "Design", href: "#" },
            { label: "Photo", href: "#" },
          ].map((l) => (
            <ChrHover key={l.label} text={l.label} as="a" href={l.href} />
          ))}
        </nav>
      </footer>
    </section>
  );
}
