import { useState } from "react";
import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  wrapperStyle?: CSSProperties;
}

/** Frosted-glass text field. Focus lifts the hairline to the violet focus state. */
export function Input({ icon = null, wrapperStyle, onFocus, onBlur, ...rest }: InputProps) {
  const [focus, setFocus] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        height: 44,
        padding: "0 16px",
        borderRadius: "var(--radius-md)",
        background: "var(--resin-black-elevated)",
        boxShadow: focus ? "inset 0 0 0 1px var(--state-focus)" : "var(--inset-frost)",
        transition: "box-shadow .18s ease",
        boxSizing: "border-box",
        ...wrapperStyle,
      }}
    >
      {icon ? <span style={{ color: "var(--text-muted)", display: "flex" }}>{icon}</span> : null}
      <input
        onFocus={(e) => {
          setFocus(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          onBlur?.(e);
        }}
        style={{
          flex: 1,
          minWidth: 0,
          background: "none",
          border: "none",
          outline: "none",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          color: "var(--text-primary)",
        }}
        {...rest}
      />
    </div>
  );
}

export default Input;
