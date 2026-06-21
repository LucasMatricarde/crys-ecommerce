import type { CSSProperties } from "react";

/** Signature CRYS. brand motif: molten amber sphere with iridescent halo. */
export function ResinBlob({ size = 480, glow = true, style }: { size?: number; glow?: boolean; style?: CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          "radial-gradient(closest-side at 40% 40%, var(--amber-honey) 0%, rgba(245,166,35,0.95) 45%, rgba(200,118,26,0.8) 75%, rgba(122,62,15,0.6) 100%)",
        boxShadow: glow ? "var(--shadow-molten)" : "none",
        ...style,
      }}
    />
  );
}

export default ResinBlob;
