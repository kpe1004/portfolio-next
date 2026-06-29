"use client";
import { useState, useCallback } from "react";
import Preloader     from "@/components/Preloader";
import Hero          from "@/components/Hero";
import ProjectList   from "@/components/ProjectList";
import AboutSection  from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import CustomCursor  from "@/components/CustomCursor";

export default function Home() {
  const [ready, setReady] = useState(false);

  // useCallback prevents a new function reference on every render,
  // which would re-trigger the Preloader's useEffect each time.
  const handleComplete = useCallback(() => setReady(true), []);

  return (
    <>
      <CustomCursor />
      <Preloader onComplete={handleComplete} />

      {/* 메인 콘텐츠는 블루 오버레이 뒤에서 미리 존재
          — ready=true가 되는 시점(파란원이 꽉 찼을 때)부터 보임
          — 이후 블루 오버레이가 페이드아웃되며 자연스럽게 드러남 */}
      <main
        style={{
          opacity:    ready ? 1 : 0,
          transition: ready ? "opacity 0s" : "none", // 즉시 표시, 블루 오버레이가 페이드로 reveal
        }}
      >
        <Hero visible={ready} />
        <AboutSection />
        <ProjectList />
        <SkillsSection />
        <ContactSection />
      </main>
    </>
  );
}
