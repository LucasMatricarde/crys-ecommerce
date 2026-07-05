import React from "react";

/**
 * Input — frosted-glass text field. Optional leading icon.
 * Focus lifts the frost hairline to the violet focus state.
 */
export function Input({ icon = null, style, onFocus, onBlur, ...rest }) {
  const [focus, setFocus] = React.useState(false);
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
        boxShadow: focus
          ? "inset 0 0 0 1px var(--state-focus)"
          : "var(--inset-frost)",
        transition: "box-shadow .18s ease",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {icon ? <span style={{ color: "var(--text-muted)", display: "flex" }}>{icon}</span> : null}
      <input
        onFocus={(e) => { setFocus(true); onFocus && onFocus(e); }}
        onBlur={(e) => { setFocus(false); onBlur && onBlur(e); }}
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
