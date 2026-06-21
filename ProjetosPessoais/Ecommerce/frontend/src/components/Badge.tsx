import type { CSSProperties, ReactNode } from "react";

type Tone = "amber" | "frost" | "violet";

const TONES: Record<Tone, CSSProperties> = {
  amber: { background: "var(--amber-core)", color: "var(--resin-black-base)" },
  frost: { background: "rgba(184,240,206,0.16)", color: "var(--trichome-frost)" },
  violet: { background: "var(--iridescent-violet)", color: "var(--resin-black-base)" },
};

/** Tiny pill counter (cart count, notifications). */
export function Badge({
  children,
  tone = "amber",
  style,
}: {
  children: ReactNode;
  tone?: Tone;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 16,
        height: 16,
        padding: "0 5px",
        borderRadius: "var(--radius-pill)",
        fontFamily: "var(--font-mono)",
        fontWeight: "var(--weight-bold)" as unknown as number,
        fontSize: 9,
        lineHeight: "100%",
        boxSizing: "border-box",
        ...TONES[tone],
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export default Badge;
