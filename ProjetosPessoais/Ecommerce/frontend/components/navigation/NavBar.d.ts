import React from "react";

/**
 * Frosted-glass top navigation — wordmark, center links, cart with count badge.
 *
 * @startingPoint section="Navigation" subtitle="Frosted-glass storefront nav" viewport="1440x64"
 */
export interface NavBarProps extends React.HTMLAttributes<HTMLElement> {
  /** Wordmark text. Default "CRYS.". */
  brand?: string;
  /** Center nav link labels. */
  links?: string[];
  /** Which link is active (bold + primary ink). */
  active?: string;
  /** Cart item count for the badge (0 hides it). */
  cartCount?: number;
  /** Cart click handler. */
  onCart?: () => void;
  /** Link click handler — receives the label. */
  onNavigate?: (label: string) => void;
}

export function NavBar(props: NavBarProps): JSX.Element;
export default NavBar;
