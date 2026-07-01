"use client";
import { useState, useCallback } from "react";
import Preloader          from "@/components/Preloader";
import Hero               from "@/components/Hero";
import AboutSection       from "@/components/AboutSection";
import ProjectList        from "@/components/ProjectList";
import SkillsSection      from "@/components/SkillsSection";
import InfoDetailSection  from "@/components/InfoDetailSection";
import ContactSection     from "@/components/ContactSection";
import CustomCursor       from "@/components/CustomCursor";
import BlobBackground     from "@/components/BlobBackground";

export default function Home() {
  const [ready, setReady] = useState(false);

  const handleComplete = useCallback(() => setReady(true), []);

  return (
    <>
      <CustomCursor />
      <Preloader onComplete={handleComplete} />

      {/* Fixed blob canvas — fires on each section entry, blends as light over all sections */}
      <BlobBackground />

      <main
        style={{
          opacity:    ready ? 1 : 0,
          transition: ready ? "opacity 0s" : "none",
        }}
      >
        <Hero visible={ready} />
        <AboutSection />
        <ProjectList />
        <SkillsSection />
        <InfoDetailSection />
        <ContactSection />
      </main>
    </>
  );
}
