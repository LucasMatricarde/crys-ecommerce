import React from "react";
import { StrainType } from "./StrainTag";

/**
 * Storefront product tile — image, strain tag, name, THC/CBD data row,
 * price chip and add-to-cart button. Hover lifts the frost hairline + amber glow.
 *
 * @startingPoint section="Commerce" subtitle="Storefront product tile" viewport="320x460"
 */
export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Product name (Syne). */
  name?: string;
  /** Strain class for the tag. Default "indica". */
  strain?: StrainType;
  /** THC reading shown in the strain tag. */
  thc?: string;
  /** Mono data row, e.g. "THC 26% · CBD 0.8% · 3.5g". */
  data?: string;
  /** Formatted price. */
  price?: string;
  /** Optional image URL for the slot; falls back to the green-tinted placeholder. */
  image?: string | null;
  /** Add-to-cart handler. */
  onAdd?: () => void;
}

export function ProductCard(props: ProductCardProps): JSX.Element;
export default ProductCard;
