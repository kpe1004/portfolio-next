"use client";
import { useInView } from "@/hooks/useInView";

export default function ContactSection() {
  const { ref, inView } = useInView<HTMLElement>(0.1);

  return (
    <section
      id="contact"
      ref={ref}
      className="border-t border-white/[0.05] px-8 md:px-12 py-24"
    >
      {/* label */}
      <div
        className={`flex items-baseline gap-4 mb-16 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <span className="text-[0.62rem] tracking-[0.28em] uppercase text-white/25">
          contact/
        </span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      {/* big CTA text */}
      <div
        className={`mb-16 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        style={{ transitionDelay: inView ? "120ms" : "0ms" }}
      >
        <h2 className="text-[clamp(2rem,6vw,5rem)] font-light leading-[1.1] tracking-tight text-white/85">
          함께 만들어요.
        </h2>
        <p className="mt-4 text-sm text-white/30 max-w-sm leading-relaxed">
          브랜딩, 디자인, 영상 등 다양한 프로젝트에 열려 있습니다.
          언제든지 연락해 주세요.
        </p>
      </div>

      {/* contact links */}
      <div
        className={`flex flex-col sm:flex-row gap-4 sm:gap-10 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        style={{ transitionDelay: inView ? "240ms" : "0ms" }}
      >
        <a
          href="mailto:rhvuddms1004@gmail.com"
          className="group flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors duration-200"
        >
          <span className="text-[0.58rem] tracking-[0.2em] uppercase text-white/20 group-hover:text-white/40 transition-colors">
            EMAIL
          </span>
          rhvuddms1004@gmail.com
        </a>
        <a
          href="tel:+821041732140"
          className="group flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors duration-200"
        >
          <span className="text-[0.58rem] tracking-[0.2em] uppercase text-white/20 group-hover:text-white/40 transition-colors">
            PHONE
          </span>
          010.4173.2140
        </a>
      </div>

      {/* footer */}
      <div
        className={`mt-24 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all duration-700 ${
          inView ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: inView ? "400ms" : "0ms" }}
      >
        <span className="text-[0.58rem] tracking-[0.15em] text-white/15">
          © 2026 Pyeongeun Ko. All rights reserved.
        </span>
        <a
          href="#"
          className="text-[0.62rem] tracking-[0.2em] uppercase text-white/15 hover:text-white/40 transition-colors"
        >
          Back to top ↑
        </a>
      </div>
    </section>
  );
}
