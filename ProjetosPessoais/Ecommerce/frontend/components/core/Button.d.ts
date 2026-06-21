import React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * CRYS. pill button — molten amber primary, frosted-glass secondary, text-only ghost.
 *
 * @startingPoint section="Core" subtitle="Pill button — amber / glass / ghost" viewport="360x120"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Default "primary". */
  variant?: ButtonVariant;
  /** Size. Default "md". */
  size?: ButtonSize;
  /** Disabled state. */
  disabled?: boolean;
  /** Optional leading icon node. */
  iconLeft?: React.ReactNode;
  /** Optional trailing icon node. */
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
export default Button;
