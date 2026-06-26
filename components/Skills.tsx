"use client";
import { useInView } from "@/hooks/useInView";

const TOOLS = [
  {
    name: "Photoshop",
    abbr: "Ps",
    color: "#31A8FF",
    level: 95,
    desc: "Compositing · Retouching · Digital Art",
  },
  {
    name: "Illustrator",
    abbr: "Ai",
    color: "#FF9A00",
    level: 90,
    desc: "Vector Design · Illustration · Branding",
  },
  {
    name: "Premiere Pro",
    abbr: "Pr",
    color: "#9999FF",
    level: 88,
    desc: "Video Editing · Color Grading",
  },
  {
    name: "After Effects",
    abbr: "Ae",
    color: "#9999FF",
    level: 92,
    desc: "Motion Graphics · VFX · Animation",
  },
  {
    name: "Blender",
    abbr: "Bl",
    color: "#E87D0D",
    level: 70,
    desc: "3D Modeling · Rendering",
  },
  {
    name: "Figma",
    abbr: "Fg",
    color: "#F24E1E",
    level: 78,
    desc: "UI Design · Prototyping",
  },
];

export default function Skills() {
  const { ref, inView } = useInView();

  return (
    <section
      id="skills"
      ref={ref}
      className="px-10 md:px-14 py-28 border-t border-white/[0.05]"
    >
      {/* header */}
      <div
        className={`mb-14 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <span className="text-[0.65rem] tracking-[0.25em] uppercase text-white/30">
          Skills
        </span>
        <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-light tracking-tight text-white/90">
          Tools &amp; Techniques
        </h2>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((tool, i) => (
          <div
            key={tool.name}
            className={`group p-6 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-700 ${
              inView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: inView ? `${i * 80}ms` : "0ms" }}
          >
            {/* tool icon */}
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center text-sm font-semibold mb-4"
              style={{ backgroundColor: `${tool.color}18`, color: tool.color }}
            >
              {tool.abbr}
            </div>

            {/* name + desc */}
            <h3 className="text-sm font-medium text-white mb-1">{tool.name}</h3>
            <p className="text-[0.7rem] text-white/35 leading-relaxed mb-4">
              {tool.desc}
            </p>

            {/* level bar */}
            <div className="h-px w-full bg-white/[0.07] rounded overflow-hidden">
              <div
                className="h-full rounded transition-all duration-1000"
                style={{
                  width: inView ? `${tool.level}%` : "0%",
                  transitionDelay: inView ? `${i * 80 + 300}ms` : "0ms",
                  background: `linear-gradient(90deg, ${tool.color}80, ${tool.color}20)`,
                }}
              />
            </div>
            <p className="mt-1.5 text-right text-[0.6rem] text-white/20">
              {tool.level}%
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
