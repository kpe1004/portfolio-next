"use client";
import { useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";

type Category = "all" | "video" | "gif" | "image";

const FILTERS: { key: Category; label: string }[] = [
  { key: "all",   label: "All"   },
  { key: "video", label: "Video" },
  { key: "gif",   label: "GIF"   },
  { key: "image", label: "Image" },
];

const PROJECTS = [
  {
    id: 1,
    title: "Brand Identity",
    year: "2024",
    category: "image" as Category,
    gradient: "from-blue-900/60 to-purple-900/40",
    tags: ["branding", "design"],
  },
  {
    id: 2,
    title: "Motion Reel",
    year: "2024",
    category: "video" as Category,
    gradient: "from-violet-900/60 to-blue-900/40",
    tags: ["motion", "reel"],
  },
  {
    id: 3,
    title: "Title Sequence",
    year: "2023",
    category: "video" as Category,
    gradient: "from-indigo-900/60 to-pink-900/30",
    tags: ["motion", "typography"],
  },
  {
    id: 4,
    title: "Character Animation",
    year: "2023",
    category: "gif" as Category,
    gradient: "from-purple-900/60 to-indigo-900/40",
    tags: ["animation", "illustration"],
  },
  {
    id: 5,
    title: "Editorial Design",
    year: "2022",
    category: "image" as Category,
    gradient: "from-blue-900/50 to-violet-900/50",
    tags: ["editorial", "layout"],
  },
  {
    id: 6,
    title: "Logo Animation",
    year: "2022",
    category: "gif" as Category,
    gradient: "from-violet-900/50 to-blue-900/60",
    tags: ["logo", "animation"],
  },
];

const TYPE_ICON: Record<string, string> = {
  video: "▶",
  gif:   "◌",
  image: "□",
};

export default function Projects() {
  const { ref, inView } = useInView();
  const [active, setActive] = useState<Category>("all");

  const filtered =
    active === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === active);

  return (
    <section
      id="works"
      ref={ref}
      className="px-10 md:px-14 py-28"
    >
      {/* header */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-14 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <span className="text-[0.65rem] tracking-[0.25em] uppercase text-white/30">
          Works
        </span>
        <div className="flex gap-1">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`px-4 py-1.5 text-[0.65rem] tracking-[0.15em] uppercase rounded-full border transition-all duration-200 ${
                active === key
                  ? "border-white/30 text-white bg-white/[0.07]"
                  : "border-white/[0.07] text-white/35 hover:text-white/60 hover:border-white/15"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p, i) => (
          <div
            key={p.id}
            className={`group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/[0.06] cursor-pointer transition-all duration-700 ${
              inView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: inView ? `${i * 80}ms` : "0ms" }}
          >
            {/* placeholder gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${p.gradient} transition-transform duration-500 group-hover:scale-105`}
            />

            {/* noise overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
              }}
            />

            {/* type icon */}
            <span className="absolute top-4 right-4 text-white/20 text-xs tracking-widest">
              {TYPE_ICON[p.category]}
            </span>

            {/* info overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-[0.65rem] tracking-[0.15em] uppercase text-white/40 mb-1">
                {p.category} · {p.year}
              </p>
              <h3 className="text-sm font-medium text-white">{p.title}</h3>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[0.6rem] tracking-widest uppercase text-white/30 border border-white/10 rounded-full px-2 py-0.5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
