import React from "react";

export type IconName =
  | "cart" | "search" | "menu" | "user" | "leaf" | "x"
  | "chevronDown" | "plus" | "minus" | "star" | "truck" | "shield" | "heart";

/**
 * Curated Lucide icon (MIT). Single-color, currentColor, 1.75 stroke.
 */
export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Icon name. Default "leaf". */
  name?: IconName;
  /** Pixel size (width = height). Default 24. */
  size?: number;
  /** Stroke color. Default currentColor. */
  color?: string;
  /** Stroke width. Default 1.75. */
  strokeWidth?: number;
}

export function Icon(props: IconProps): JSX.Element;
export const ICON_NAMES: string[];
export default Icon;
