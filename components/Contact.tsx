export default function Contact() {
  return (
    <footer id="contact" className="border-t border-white/[0.05] px-10 md:px-14 py-20">
      <div className="relative">
        {/* glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 30% 50%, rgba(44,59,206,0.09) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-12 mb-16">
          <div>
            <h3 className="text-[0.65rem] tracking-[0.2em] uppercase text-white/25 mb-5">
              About
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">고 평 은</p>
            <p className="text-sm text-white/70">PYEONGEUN KO</p>
            <p className="mt-3 text-[0.72rem] text-white/35 leading-relaxed">
              모션 디자이너 &amp; 비주얼 아티스트.<br />
              영상과 이미지로 이야기를 전달합니다.
            </p>
          </div>

          <div>
            <h3 className="text-[0.65rem] tracking-[0.2em] uppercase text-white/25 mb-5">
              Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="tel:+821041732140"
                  className="text-[0.78rem] text-white/45 hover:text-white/80 transition-colors duration-200"
                >
                  +82 10.4173.2140
                </a>
              </li>
              <li>
                <a
                  href="mailto:rhvuddms1004@gmail.com"
                  className="text-[0.78rem] text-white/45 hover:text-white/80 transition-colors duration-200"
                >
                  rhvuddms1004@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[0.65rem] tracking-[0.2em] uppercase text-white/25 mb-5">
              Focus
            </h3>
            <ul className="space-y-1.5">
              {["Photoshop", "Illustrator", "Premiere Pro", "After Effects"].map((t) => (
                <li key={t} className="text-[0.78rem] text-white/45">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/[0.05] pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <span className="text-[0.62rem] tracking-[0.15em] text-white/20">
            © 2024 Pyeongeun Ko. All rights reserved.
          </span>
          <a
            href="#hero"
            style={{ fontFamily: "var(--font-script-var)" }}
            className="text-xl text-white/30 hover:text-white/60 transition-colors duration-200"
          >
            P.
          </a>
        </div>
      </div>
    </footer>
  );
}
