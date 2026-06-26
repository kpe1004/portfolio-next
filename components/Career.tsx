"use client";
import { useInView } from "@/hooks/useInView";

type Entry = {
  period: string;
  title: string;
  org: string;
  desc: string;
};

const EDUCATION: Entry[] = [
  {
    period: "2018 – 2022",
    title: "시각디자인 학사",
    org: "대학교 명칭",
    desc: "시각디자인 전공. 타이포그래피, 브랜딩, 영상 디자인을 중심으로 학습.",
  },
];

const EXPERIENCE: Entry[] = [
  {
    period: "2023 – 현재",
    title: "Motion Designer",
    org: "소속 회사 / 스튜디오",
    desc: "모션 그래픽, 광고 영상, 브랜드 아이덴티티 작업 등 다양한 크리에이티브 프로젝트 진행.",
  },
  {
    period: "2022 – 2023",
    title: "Visual Designer (Freelance)",
    org: "프리랜서",
    desc: "브랜드 아이덴티티 디자인, 영상 편집, 소셜 콘텐츠 제작 등 다수 클라이언트 작업.",
  },
];

function TimelineColumn({ title, entries, inView, delay = 0 }: { title: string; entries: Entry[]; inView: boolean; delay?: number }) {
  return (
    <div
      className={`transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
    >
      <h3 className="text-[0.65rem] tracking-[0.2em] uppercase text-white/30 mb-8">
        {title}
      </h3>
      <div className="relative pl-5 border-l border-white/[0.08] space-y-10">
        {entries.map((e, i) => (
          <div key={i} className="relative">
            {/* dot */}
            <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full border border-white/20 bg-[#0c0c1a]" />
            <p className="text-[0.62rem] tracking-[0.15em] uppercase text-white/25 mb-1.5">
              {e.period}
            </p>
            <h4 className="text-sm font-medium text-white/90 mb-0.5">{e.title}</h4>
            <p className="text-[0.72rem] text-white/40 mb-2">{e.org}</p>
            <p className="text-[0.72rem] text-white/30 leading-relaxed">{e.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Career() {
  const { ref, inView } = useInView();

  return (
    <section
      id="career"
      ref={ref as React.RefObject<HTMLElement>}
      className="px-10 md:px-14 py-28 border-t border-white/[0.05]"
    >
      {/* header */}
      <div
        className={`mb-14 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <span className="text-[0.65rem] tracking-[0.25em] uppercase text-white/30">
          Career
        </span>
        <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-light tracking-tight text-white/90">
          Experience &amp; Education
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <TimelineColumn title="Education" entries={EDUCATION} inView={inView} delay={100} />
        <TimelineColumn title="Experience" entries={EXPERIENCE} inView={inView} delay={250} />
      </div>
    </section>
  );
}
