import React from "react";

export type StrainType = "indica" | "sativa" | "hybrid";

/**
 * Strain classification pill — colored dot, strain label, mono THC reading.
 *
 * @startingPoint section="Commerce" subtitle="Strain pill — indica / sativa / hybrid" viewport="200x60"
 */
export interface StrainTagProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Strain class — sets dot + label color. Default "indica". */
  type?: StrainType;
  /** Potency reading, e.g. "THC 28%". */
  thc?: string;
}

export function StrainTag(props: StrainTagProps): JSX.Element;
export default StrainTag;
