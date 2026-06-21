import React from "react";

/**
 * Signature brand motif — molten amber sphere with iridescent halo. Decorative.
 *
 * @startingPoint section="Brand" subtitle="Molten resin blob motif" viewport="520x520"
 */
export interface ResinBlobProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Diameter in px. Default 480. */
  size?: number;
  /** Whether to render the violet + amber glow. Default true. */
  glow?: boolean;
}

export function ResinBlob(props: ResinBlobProps): JSX.Element;
export default ResinBlob;
