"use client";
import { useInView } from "@/hooks/useInView";

const EDUCATION = [
  "정명정보고등학교 e-비즈니스과 졸업",
  "경인여자대학교 광고영상디자인과 졸업",
];

const EXPERIENCE = [
  { name: "경인여대 광고영상디자인과", desc: "총무과대표 1년" },
  { name: "딤커뮤니케이션",            desc: "코카콜라 SNS 콘텐츠 이미지제작, 영상편집" },
  { name: "스티밍",                    desc: "브랜드 콘텐츠 이미지제작, 홈페이지 구축 디자인" },
  { name: "디엠성형외과",              desc: "병원 내 인쇄물 제작, 웹디자인, 영상편집" },
  { name: "이노브모바일",              desc: "롯데백화점 웹디자인, 영상편집" },
  { name: "스핀즈&위고",              desc: "캐릭터 디자인 의류 콜라보 제작" },
  { name: "크리센트",                  desc: "브랜드 콘텐츠 이미지 제작" },
  { name: "헤이즐로드",               desc: "브랜딩 기획 및 온/오프라인 디자인" },
];

export default function InfoSection() {
  const introRef = useInView<HTMLDivElement>(0.1);
  const bioRef   = useInView<HTMLDivElement>(0.1);

  return (
    <section id="info" className="border-t border-white/[0.05]">

      {/* ── Intro banner ── */}
      <div
        ref={introRef.ref}
        className="relative px-8 md:px-12 py-24 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #12112a 0%, #1a1030 40%, #0f0f1f 100%)",
        }}
      >
        {/* radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 15% 50%, rgba(74,40,160,0.25) 0%, transparent 65%)",
          }}
        />

        <div className="relative z-10 max-w-3xl">
          <div
            className={`transition-all duration-700 ${
              introRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <p
              className="text-[clamp(2.2rem,5vw,4rem)] leading-none mb-1"
              style={{ fontFamily: "var(--font-script-var)" }}
            >
              Let go!
            </p>
            <p className="text-sm text-white/35 tracking-widest mb-6">가보자고!</p>
          </div>

          <div
            className="h-px bg-white/[0.1] mb-8"
            style={{
              transform: introRef.inView ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s",
            }}
          />

          <p
            className={`text-[0.9rem] leading-[1.9] text-white/55 max-w-xl transition-all duration-700 delay-300 ${
              introRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            끊임없이 변화하는 트렌드의 중심에는 디자인이 있다고 생각합니다.
            그 안에서 트렌드와 함께 나아가는 디자이너가 되고자 합니다.
            시대의 흐름에 맞춰 끊임없이 소통하고 기록하고 배우는{" "}
            <strong className="text-white font-medium">디자이너 고평은</strong>입니다.
          </p>
        </div>
      </div>

      {/* ── Bio + Education / Experience ── */}
      <div
        ref={bioRef.ref}
        className="px-8 md:px-12 py-20"
      >
        {/* section label */}
        <div
          className={`flex items-baseline gap-4 mb-14 transition-all duration-700 ${
            bioRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="text-[0.62rem] tracking-[0.28em] uppercase text-white/25">
            info/
          </span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">

          {/* LEFT: identity */}
          <div
            className={`transition-all duration-700 ${
              bioRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: bioRef.inView ? "100ms" : "0ms" }}
          >
            <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-light leading-tight mb-1 text-white/90">
              끝임없이 GO!하는
            </h2>
            <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold leading-tight mb-8 text-white">
              디자이너 고평은입니다.
            </h2>

            <dl className="space-y-2">
              <div className="flex gap-6">
                <dt className="text-[0.62rem] tracking-[0.18em] uppercase text-white/25 w-16 shrink-0 pt-0.5">Name</dt>
                <dd className="text-sm text-white/70">PYEONGEUN KO</dd>
              </div>
              <div className="flex gap-6">
                <dt className="text-[0.62rem] tracking-[0.18em] uppercase text-white/25 w-16 shrink-0 pt-0.5">Birth</dt>
                <dd className="text-sm text-white/70">1993 / 10 / 4</dd>
              </div>
            </dl>
          </div>

          {/* RIGHT: education + contacts + experience */}
          <div
            className={`space-y-10 transition-all duration-700 ${
              bioRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: bioRef.inView ? "220ms" : "0ms" }}
          >
            {/* Education */}
            <div>
              <h3 className="text-[0.62rem] tracking-[0.25em] uppercase text-white/25 mb-4">
                Education
              </h3>
              <ul className="space-y-1.5">
                {EDUCATION.map((e) => (
                  <li key={e} className="text-[0.8rem] text-white/60 leading-relaxed">
                    {e}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h3 className="text-[0.62rem] tracking-[0.25em] uppercase text-white/25 mb-4">
                Contacts
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <a
                    href="tel:+821041732140"
                    className="text-[0.8rem] text-white/60 hover:text-white/90 transition-colors"
                  >
                    010.4173.2140
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:rhvuddms1004@gmail.com"
                    className="text-[0.8rem] text-white/60 hover:text-white/90 transition-colors"
                  >
                    rhvuddms1004@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Experience */}
            <div>
              <h3 className="text-[0.62rem] tracking-[0.25em] uppercase text-white/25 mb-4">
                Experience
              </h3>
              <ul className="space-y-4">
                {EXPERIENCE.map((exp) => (
                  <li key={exp.name}>
                    <p className="text-[0.82rem] font-medium text-white/80">{exp.name}</p>
                    <p className="text-[0.72rem] text-white/35 mt-0.5 leading-relaxed">{exp.desc}</p>
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
