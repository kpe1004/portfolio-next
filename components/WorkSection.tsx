"use client";
import { useInView } from "@/hooks/useInView";

const WORKS = [
  {
    id: 1,
    title: "브랜드 아이덴티티",
    sub: "Brand Identity",
    category: "BRANDING",
    year: "2024",
    bg: "radial-gradient(ellipse at 30% 40%, #2c3bce 0%, #0a0a1a 65%)",
  },
  {
    id: 2,
    title: "모션 그래픽",
    sub: "Motion Graphics",
    category: "MOTION",
    year: "2024",
    bg: "radial-gradient(ellipse at 70% 30%, #4a28a0 0%, #0a0a1a 65%)",
  },
  {
    id: 3,
    title: "SNS 콘텐츠",
    sub: "Social Content",
    category: "DESIGN",
    year: "2023",
    bg: "radial-gradient(ellipse at 20% 70%, #1a3a5c 0%, #0a0a1a 65%)",
  },
  {
    id: 4,
    title: "웹 디자인",
    sub: "Web Design",
    category: "DESIGN",
    year: "2023",
    bg: "radial-gradient(ellipse at 80% 60%, #3b1a5c 0%, #0a0a1a 65%)",
  },
  {
    id: 5,
    title: "캐릭터 디자인",
    sub: "Character Design",
    category: "ILLUSTRATION",
    year: "2022",
    bg: "radial-gradient(ellipse at 50% 30%, #5c1a3b 0%, #0a0a1a 65%)",
  },
  {
    id: 6,
    title: "에디토리얼",
    sub: "Editorial Layout",
    category: "PRINT",
    year: "2022",
    bg: "radial-gradient(ellipse at 30% 60%, #1a3a2c 0%, #0a0a1a 65%)",
  },
  {
    id: 7,
    title: "포토 디렉팅",
    sub: "Photo Direction",
    category: "PHOTO",
    year: "2022",
    bg: "radial-gradient(ellipse at 60% 70%, #3b2c1a 0%, #0a0a1a 65%)",
  },
  {
    id: 8,
    title: "AI 아트",
    sub: "AI Generation",
    category: "AI",
    year: "2023",
    bg: "radial-gradient(ellipse at 40% 40%, #2a1a5c 20%, #5c1a4a 60%, #0a0a1a 100%)",
  },
];

export default function WorkSection() {
  const { ref, inView } = useInView<HTMLElement>(0.05);

  return (
    <section
      id="works"
      ref={ref}
      className="px-8 md:px-12 py-20"
    >
      {/* section label */}
      <div
        className={`flex items-baseline gap-4 mb-10 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <span className="text-[0.62rem] tracking-[0.28em] uppercase text-white/25">
          works/
        </span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {WORKS.map((w, i) => (
          <div
            key={w.id}
            className={`group relative overflow-hidden cursor-pointer transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: inView ? `${i * 60}ms` : "0ms",
              aspectRatio: "16/9",
              borderRadius: "4px",
            }}
          >
            {/* gradient background (placeholder) */}
            <div
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]"
              style={{ background: w.bg }}
            />

            {/* subtle grain */}
            <div
              className="absolute inset-0 opacity-[0.035] mix-blend-screen"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />

            {/* category tag */}
            <span
              className="absolute top-4 left-4 text-[0.55rem] tracking-[0.22em] text-white/35"
            >
              {w.category}
            </span>
            <span
              className="absolute top-4 right-4 text-[0.55rem] tracking-[0.15em] text-white/20"
            >
              {w.year}
            </span>

            {/* title overlay — appears on hover */}
            <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400">
              <p className="text-xs font-medium text-white leading-snug">{w.title}</p>
              <p className="text-[0.62rem] text-white/40 mt-0.5">{w.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
