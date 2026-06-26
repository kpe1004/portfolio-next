export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 55%, rgba(44,59,206,0.18) 0%, rgba(74,40,160,0.12) 40%, transparent 70%)",
        }}
      />

      {/* year label */}
      <span className="absolute top-28 left-10 md:left-14 text-[0.65rem] tracking-[0.25em] uppercase text-white/30 fade-in delay-200">
        2016 – 2024
      </span>

      {/* main content */}
      <div className="relative z-10 text-center px-6">
        <h1
          className="fade-up text-[clamp(3.5rem,12vw,9rem)] font-light tracking-[-0.02em] leading-none text-white"
        >
          Portfolio
        </h1>
        <p
          className="fade-up delay-200 mt-5 text-[0.85rem] tracking-[0.3em] uppercase text-white/40"
          style={{ fontFamily: "var(--font-script-var)", fontSize: "clamp(1rem,2vw,1.4rem)", textTransform: "none", letterSpacing: "0.05em" }}
        >
          from. pyeongeun
        </p>
        <p className="fade-up delay-300 mt-3 text-[0.7rem] tracking-[0.22em] uppercase text-white/25">
          Motion Designer &amp; Visual Artist
        </p>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 fade-in delay-500">
        <span className="text-[0.6rem] tracking-[0.2em] uppercase text-white/25">scroll</span>
        <div
          className="w-px bg-gradient-to-b from-white/20 to-transparent"
          style={{ height: "48px" }}
        />
      </div>
    </section>
  );
}
