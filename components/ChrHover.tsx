"use client";

interface ChrHoverProps {
  text: string;
  as?: "span" | "a" | "div";
  href?: string;
  target?: string;
  className?: string;
}

export default function ChrHover({
  text,
  as: Tag = "span",
  href,
  target,
  className = "",
}: ChrHoverProps) {
  const chars = text.split("").map((char, i) => (
    <span
      key={i}
      className="ch-wrap"
      style={{ "--i": i } as React.CSSProperties}
    >
      <span className="ch-top">{char === " " ? " " : char}</span>
      <span className="ch-bot" aria-hidden="true">
        {char === " " ? " " : char}
      </span>
    </span>
  ));

  if (Tag === "a" && href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={`chr-hover ${className}`}
      >
        {chars}
      </a>
    );
  }

  return (
    <Tag className={`chr-hover ${className}`}>
      {chars}
    </Tag>
  );
}
