import TopNav from "@/components/TopNav";
import WorkSection from "@/components/WorkSection";
import InfoSection from "@/components/InfoSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <TopNav />
      {/* offset for fixed nav height (main row 52px + category row 36px) */}
      <main className="pt-[88px]">
        <WorkSection />
        <InfoSection />
        <ContactSection />
      </main>
    </>
  );
}
