import React from "react";

/**
 * Frosted-glass text input with optional leading icon; violet focus ring.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional leading icon node (e.g. <Icon name="search" size={18} />). */
  icon?: React.ReactNode;
}

export function Input(props: InputProps): JSX.Element;
export default Input;
