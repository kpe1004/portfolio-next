"use client";
import { useState } from "react";
import TopNav       from "@/components/TopNav";
import Preloader    from "@/components/Preloader";
import HeroSection  from "@/components/HeroSection";
import WorkSection  from "@/components/WorkSection";
import InfoSection  from "@/components/InfoSection";
import ContactSection from "@/components/ContactSection";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <CustomCursor />
      <Preloader onComplete={() => setReady(true)} />

      {/* Nav slides down when ready */}
      <div
        style={{
          opacity:    ready ? 1 : 0,
          transform:  ready ? "translateY(0)" : "translateY(-16px)",
          transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
        }}
      >
        <TopNav />
      </div>

      <main
        style={{
          opacity:    ready ? 1 : 0,
          transition: "opacity 0.5s ease 0.05s",
        }}
      >
        {/* hero is full-screen, no pt offset — nav overlays it */}
        <HeroSection visible={ready} />

        {/* offset for fixed nav on subsequent sections */}
        <div className="pt-[88px]">
          <WorkSection />
          <InfoSection />
          <ContactSection />
        </div>
      </main>
    </>
  );
}
