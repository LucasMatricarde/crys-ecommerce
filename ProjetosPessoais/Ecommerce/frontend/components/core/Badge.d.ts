import React from "react";

export type BadgeTone = "amber" | "frost" | "violet";

/**
 * Tiny pill counter — cart counts, notification dots.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color tone. Default "amber". */
  tone?: BadgeTone;
  children?: React.ReactNode;
}

export function Badge(props: BadgeProps): JSX.Element;
export default Badge;
