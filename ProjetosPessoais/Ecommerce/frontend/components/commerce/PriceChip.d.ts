import React from "react";

/**
 * Boxed price tile — mono amber price on a raised surface, optional unit caption.
 *
 * @startingPoint section="Commerce" subtitle="Mono amber price tile" viewport="160x80"
 */
export interface PriceChipProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Formatted price string, e.g. "R$ 89,90". */
  price?: string;
  /** Optional caption under the price, e.g. "por grama". */
  unit?: string;
}

export function PriceChip(props: PriceChipProps): JSX.Element;
export default PriceChip;
