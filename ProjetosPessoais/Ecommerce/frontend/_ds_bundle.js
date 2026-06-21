/* @ds-bundle: {"format":3,"namespace":"CRYSDesignSystem_98581f","components":[{"name":"ResinBlob","sourcePath":"components/brand/ResinBlob.jsx"},{"name":"PriceChip","sourcePath":"components/commerce/PriceChip.jsx"},{"name":"ProductCard","sourcePath":"components/commerce/ProductCard.jsx"},{"name":"StrainTag","sourcePath":"components/commerce/StrainTag.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/core/Icon.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"}],"sourceHashes":{"components/brand/ResinBlob.jsx":"c351c433c586","components/commerce/PriceChip.jsx":"70725ba5d3c4","components/commerce/ProductCard.jsx":"5eaa4b797cd4","components/commerce/StrainTag.jsx":"2165ecc1de3d","components/core/Badge.jsx":"4ead2f9ab022","components/core/Button.jsx":"55f3735466dc","components/core/Icon.jsx":"9dfed33fbf5a","components/core/Input.jsx":"373f053d3408","components/navigation/NavBar.jsx":"c79787f2dd79","ui_kits/storefront/CartDrawer.jsx":"09127209f1c3","ui_kits/storefront/Home.jsx":"e1ea9d719d85","ui_kits/storefront/ProductDetail.jsx":"fc439713580c","ui_kits/storefront/data.js":"2a02aa949ef5"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CRYSDesignSystem_98581f = window.CRYSDesignSystem_98581f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/ResinBlob.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ResinBlob — the signature CRYS. brand motif: a molten amber sphere with a
 * cool iridescent halo. Decorative; place behind hero content.
 */
function ResinBlob({
  size = 480,
  glow = true,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    "aria-hidden": "true",
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      background: "radial-gradient(closest-side at 40% 40%, var(--amber-honey) 0%, rgba(245,166,35,0.95) 45%, rgba(200,118,26,0.8) 75%, rgba(122,62,15,0.6) 100%)",
      boxShadow: glow ? "var(--shadow-molten)" : "none",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { ResinBlob });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/ResinBlob.jsx", error: String((e && e.message) || e) }); }

// components/commerce/PriceChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PriceChip — boxed price tile. Mono amber price on a raised surface.
 * Optional small "unit" caption (e.g. per gram).
 */
function PriceChip({
  price = "R$ 89,90",
  unit,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "inline-flex",
      flexDirection: "column",
      gap: 2,
      padding: "8px 12px",
      borderRadius: "var(--radius-sm)",
      background: "var(--resin-black-raised)",
      boxSizing: "border-box",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: "var(--weight-bold)",
      fontSize: 20,
      lineHeight: "100%",
      color: "var(--accent-primary)",
      whiteSpace: "nowrap"
    }
  }, price), unit ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      lineHeight: "100%",
      color: "var(--text-muted)",
      whiteSpace: "nowrap"
    }
  }, unit) : null);
}
Object.assign(__ds_scope, { PriceChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/PriceChip.jsx", error: String((e && e.message) || e) }); }

// components/commerce/StrainTag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STRAINS = {
  indica: {
    label: "Indica",
    dot: "var(--strain-indica)",
    bg: "rgba(42,31,74,0.9)"
  },
  sativa: {
    label: "Sativa",
    dot: "var(--strain-sativa)",
    bg: "rgba(59,42,15,0.9)"
  },
  hybrid: {
    label: "Hybrid",
    dot: "var(--strain-hybrid)",
    bg: "rgba(14,42,26,0.9)"
  }
};

/**
 * StrainTag — small pill identifying a cannabis strain class + THC reading.
 * Colored dot + strain label (in the strain's accent) + mono THC value.
 */
function StrainTag({
  type = "indica",
  thc = "THC 28%",
  style,
  ...rest
}) {
  const s = STRAINS[type] || STRAINS.indica;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "5px 10px",
      borderRadius: "var(--radius-pill)",
      background: s.bg,
      boxSizing: "border-box",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: s.dot,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: "var(--weight-semibold)",
      fontSize: 11,
      lineHeight: "100%",
      color: s.dot
    }
  }, s.label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      fontFamily: "var(--font-body)",
      fontSize: 11
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: "var(--weight-regular)",
      fontSize: 11,
      lineHeight: "100%",
      color: "var(--text-primary)",
      whiteSpace: "nowrap"
    }
  }, thc));
}
Object.assign(__ds_scope, { StrainTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/StrainTag.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — tiny pill counter (cart count, notifications).
 * Default amber tone with dark text; "frost" tone for neutral counts.
 */
function Badge({
  children,
  tone = "amber",
  style,
  ...rest
}) {
  const tones = {
    amber: {
      background: "var(--amber-core)",
      color: "var(--resin-black-base)"
    },
    frost: {
      background: "rgba(184,240,206,0.16)",
      color: "var(--trichome-frost)"
    },
    violet: {
      background: "var(--iridescent-violet)",
      color: "var(--resin-black-base)"
    }
  };
  const t = tones[tone] || tones.amber;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 16,
      height: 16,
      padding: "0 5px",
      borderRadius: "var(--radius-pill)",
      fontFamily: "var(--font-mono)",
      fontWeight: "var(--weight-bold)",
      fontSize: 9,
      lineHeight: "100%",
      boxSizing: "border-box",
      ...t,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — CRYS. pill button.
 * Variants: primary (molten amber), secondary (glass + frost hairline), ghost (text only).
 * Sizes: sm / md / lg.  All radii are full pill.
 */
function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  iconLeft = null,
  iconRight = null,
  children,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "7px 14px",
      fontSize: 13,
      height: 30,
      gap: 6
    },
    md: {
      padding: "10px 16px",
      fontSize: 15,
      height: 38,
      gap: 6
    },
    lg: {
      padding: "14px 24px",
      fontSize: 16,
      height: 50,
      gap: 8
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: "var(--amber-core)",
      color: "var(--text-on-amber)",
      boxShadow: "none"
    },
    secondary: {
      background: "var(--resin-black-elevated)",
      color: "var(--text-primary)",
      boxShadow: "var(--inset-frost-strong)"
    },
    ghost: {
      background: "transparent",
      color: "var(--text-primary)",
      boxShadow: "none"
    }
  };
  const v = variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    style: {
      display: "inline-flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      border: "none",
      borderRadius: "var(--radius-pill)",
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-bold)",
      fontSize: s.fontSize,
      lineHeight: "100%",
      letterSpacing: "0.01em",
      whiteSpace: "nowrap",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
      transition: "filter .18s ease, transform .12s ease, box-shadow .18s ease",
      ...v,
      ...style
    },
    onMouseEnter: e => {
      if (disabled) return;
      if (variant === "primary") e.currentTarget.style.filter = "brightness(1.08)";
      if (variant === "secondary") e.currentTarget.style.boxShadow = "var(--inset-frost-strong), var(--shadow-card)";
      if (variant === "ghost") e.currentTarget.style.background = "rgba(184,240,206,0.06)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.filter = "none";
      e.currentTarget.style.background = v.background;
      e.currentTarget.style.boxShadow = v.boxShadow;
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = "scale(0.97)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "scale(1)";
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/commerce/ProductCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ProductCard — the core storefront tile. Image slot, strain tag, name,
 * THC/CBD data row, price chip + add-to-cart button.
 * Hover lifts the frost hairline and adds a molten amber glow.
 */
function ProductCard({
  name = "Rosin Premium",
  strain = "indica",
  thc = "THC 28%",
  data = "THC 26% · CBD 0.8% · 3.5g",
  price = "R$ 89,90",
  image = null,
  onAdd,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: 280,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: 20,
      borderRadius: "var(--radius-lg)",
      background: hover ? "rgba(26,33,37,0.95)" : "rgba(26,33,37,0.8)",
      boxShadow: hover ? "var(--inset-frost-strong), var(--shadow-card)" : "var(--inset-frost)",
      boxSizing: "border-box",
      transition: "box-shadow .25s ease, background .25s ease, transform .25s ease",
      transform: hover ? "translateY(-2px)" : "none",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: 160,
      borderRadius: "var(--radius-md)",
      background: image ? `center/cover no-repeat url(${image})` : "rgba(14,59,42,0.6)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StrainTag, {
    type: strain,
    thc: thc
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-bold)",
      fontSize: 18,
      lineHeight: "100%",
      color: "var(--text-primary)"
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      lineHeight: "100%",
      color: "var(--text-muted)"
    }
  }, data), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PriceChip, {
    price: price
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "sm",
    onClick: onAdd
  }, "Adicionar")));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Icon — thin wrapper over a curated set of Lucide icons (MIT).
 * Single-color, 1.75 stroke, currentColor. Pass `name`, `size`, `color`.
 */
const PATHS = {
  cart: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "21",
    r: "1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "21",
    r: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
  })),
  search: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 21-4.3-4.3"
  })),
  menu: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "4",
    x2: "20",
    y1: "6",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "4",
    x2: "20",
    y1: "12",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "4",
    x2: "20",
    y1: "18",
    y2: "18"
  })),
  user: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "7",
    r: "4"
  })),
  leaf: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"
  })),
  x: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m6 6 12 12"
  })),
  chevronDown: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  })),
  plus: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14"
  })),
  minus: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  })),
  star: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
  })),
  truck: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 18H9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "18",
    r: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "18",
    r: "2"
  })),
  shield: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
  })),
  heart: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
  }))
};
function Icon({
  name = "leaf",
  size = 24,
  color = "currentColor",
  strokeWidth = 1.75,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: "block",
      flexShrink: 0,
      ...style
    },
    "aria-hidden": "true"
  }, rest), PATHS[name] || PATHS.leaf);
}
const ICON_NAMES = Object.keys(PATHS);
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — frosted-glass text field. Optional leading icon.
 * Focus lifts the frost hairline to the violet focus state.
 */
function Input({
  icon = null,
  style,
  onFocus,
  onBlur,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      height: 44,
      padding: "0 16px",
      borderRadius: "var(--radius-md)",
      background: "var(--resin-black-elevated)",
      boxShadow: focus ? "inset 0 0 0 1px var(--state-focus)" : "var(--inset-frost)",
      transition: "box-shadow .18s ease",
      boxSizing: "border-box",
      ...style
    }
  }, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      display: "flex"
    }
  }, icon) : null, /*#__PURE__*/React.createElement("input", _extends({
    onFocus: e => {
      setFocus(true);
      onFocus && onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      onBlur && onBlur(e);
    },
    style: {
      flex: 1,
      minWidth: 0,
      background: "none",
      border: "none",
      outline: "none",
      fontFamily: "var(--font-body)",
      fontSize: 14,
      color: "var(--text-primary)"
    }
  }, rest)));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * NavBar — frosted-glass top navigation. Wordmark, center links, cart with badge.
 * Sticky glass: translucent resin surface + blur + frost hairline underline.
 */
function NavBar({
  brand = "CRYS.",
  links = ["Extrações", "Flores", "Kits", "Sobre"],
  active = "Extrações",
  cartCount = 2,
  onCart,
  onNavigate,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: 64,
      padding: "0 64px",
      background: "rgba(11,15,12,0.85)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      boxShadow: "var(--inset-frost)",
      boxSizing: "border-box",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-extrabold)",
      fontSize: 22,
      lineHeight: "100%",
      color: "var(--accent-primary)",
      letterSpacing: "-0.01em",
      cursor: "pointer"
    }
  }, brand), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 32
    }
  }, links.map(l => /*#__PURE__*/React.createElement("span", {
    key: l,
    onClick: () => onNavigate && onNavigate(l),
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: l === active ? "var(--weight-semibold)" : "var(--weight-regular)",
      fontSize: 14,
      lineHeight: "100%",
      color: l === active ? "var(--text-primary)" : "var(--text-muted)",
      cursor: "pointer",
      transition: "color .15s ease"
    },
    onMouseEnter: e => e.currentTarget.style.color = "var(--text-primary)",
    onMouseLeave: e => e.currentTarget.style.color = l === active ? "var(--text-primary)" : "var(--text-muted)"
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 20,
    color: "var(--text-primary)",
    style: {
      cursor: "pointer",
      opacity: 0.9
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onCart,
    "aria-label": "Carrinho",
    style: {
      position: "relative",
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "cart",
    size: 22,
    color: "var(--text-primary)",
    style: {
      opacity: 0.9
    }
  }), cartCount > 0 ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -6,
      right: -8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "amber"
  }, cartCount)) : null)));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/CartDrawer.jsx
try { (() => {
// CartDrawer.jsx — CRYS. slide-in cart
// Exposes window.CartDrawer
const {
  Button,
  Icon,
  StrainTag
} = window.CRYSDesignSystem_98581f;
function CartDrawer({
  open,
  items,
  onClose,
  onRemove
}) {
  const total = items.reduce((s, it) => s + it.priceN * it.qty, 0);
  const count = items.reduce((s, it) => s + it.qty, 0);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(7,9,10,0.6)",
      backdropFilter: "blur(2px)",
      opacity: open ? 1 : 0,
      pointerEvents: open ? "auto" : "none",
      transition: "opacity .25s ease",
      zIndex: 40
    }
  }), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: "fixed",
      top: 0,
      right: 0,
      height: "100%",
      width: 420,
      maxWidth: "90vw",
      background: "var(--resin-black-surface)",
      boxShadow: "var(--inset-frost), var(--shadow-drop)",
      transform: open ? "translateX(0)" : "translateX(100%)",
      transition: "transform .3s cubic-bezier(.2,.8,.2,1)",
      zIndex: 50,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "24px 24px 16px",
      borderBottom: "1px solid var(--border-frost)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 22,
      color: "var(--text-primary)",
      margin: 0
    }
  }, "Carrinho ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, "(", count, ")")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      display: "flex",
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 22,
    color: "var(--text-muted)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, items.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: "var(--text-muted)",
      fontFamily: "var(--font-body)",
      fontSize: 14,
      marginTop: 40
    }
  }, "Seu carrinho est\xE1 vazio.") : items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    style: {
      display: "flex",
      gap: 14,
      padding: 14,
      borderRadius: "var(--radius-md)",
      background: "var(--resin-black-raised)",
      boxShadow: "var(--inset-frost)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: "var(--radius-sm)",
      flexShrink: 0,
      background: "radial-gradient(closest-side at 40% 40%, var(--amber-honey), rgba(200,118,26,.8))"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 15,
      color: "var(--text-primary)"
    }
  }, it.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--text-muted)",
      margin: "4px 0 6px"
    }
  }, it.qty, " \xD7 ", it.price), /*#__PURE__*/React.createElement("div", {
    onClick: () => onRemove(it.id),
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      color: "var(--iridescent-magenta)",
      cursor: "pointer"
    }
  }, "remover")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 15,
      color: "var(--accent-primary)"
    }
  }, "R$ ", (it.priceN * it.qty).toFixed(2).replace(".", ","))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      borderTop: "1px solid var(--border-frost)",
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 14,
      color: "var(--text-muted)"
    }
  }, "Total"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 24,
      color: "var(--accent-primary)"
    }
  }, "R$ ", total.toFixed(2).replace(".", ","))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    disabled: items.length === 0,
    style: {
      width: "100%"
    }
  }, "Finalizar compra"))));
}
window.CartDrawer = CartDrawer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/CartDrawer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Home.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Home.jsx — CRYS. storefront landing: hero + product grid
// Exposes window.Home
const {
  ResinBlob,
  Button,
  ProductCard,
  StrainTag
} = window.CRYSDesignSystem_98581f;
function HeroSection({
  onShop
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      overflow: "hidden",
      padding: "96px 64px 64px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: -40,
      top: 40,
      width: 760,
      height: 600,
      borderRadius: "50%",
      background: "radial-gradient(400px 300px at 50% 50%, var(--tint-violet-12) 0%, var(--tint-magenta-06) 50%, transparent 100%)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 120,
      top: 70,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement(ResinBlob, {
    size: 420
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(StrainTag, {
    type: "hybrid",
    thc: "Lab tested"
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: 72,
      lineHeight: "80px",
      letterSpacing: "-0.02em",
      color: "var(--text-primary)",
      margin: 0
    }
  }, "Resina viva.", /*#__PURE__*/React.createElement("br", null), "Pura arte."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 18,
      lineHeight: "28px",
      color: "var(--text-muted)",
      margin: "20px 0 36px",
      maxWidth: 480
    }
  }, "Extra\xE7\xF5es artesanais de cannabis. Pureza, pot\xEAncia e design que voc\xEA merece."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: onShop
  }, "Explorar cat\xE1logo"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg"
  }, "Saiba mais"))));
}
function Home({
  products,
  onOpen,
  onAdd
}) {
  const [filter, setFilter] = React.useState("Todos");
  const cats = ["Todos", "Extrações", "Flores"];
  const shown = filter === "Todos" ? products : products.filter(p => p.cat === filter);
  const gridRef = React.useRef(null);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(HeroSection, {
    onShop: () => gridRef.current && window.scrollTo({
      top: gridRef.current.offsetTop - 80,
      behavior: "smooth"
    })
  }), /*#__PURE__*/React.createElement("section", {
    ref: gridRef,
    style: {
      padding: "24px 64px 96px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 32,
      letterSpacing: "-0.01em",
      color: "var(--text-primary)",
      margin: 0
    }
  }, "Cat\xE1logo"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, cats.map(c => /*#__PURE__*/React.createElement(Button, {
    key: c,
    variant: filter === c ? "primary" : "ghost",
    size: "sm",
    onClick: () => setFilter(c)
  }, c)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: 24
    }
  }, shown.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(ProductCard, _extends({}, p, {
    style: {
      width: "100%"
    },
    onAdd: () => onAdd(p)
  })), /*#__PURE__*/React.createElement("div", {
    onClick: () => onOpen(p),
    style: {
      marginTop: 8,
      textAlign: "center",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--text-muted)",
      cursor: "pointer"
    }
  }, "ver detalhes \u2192"))))));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/ProductDetail.jsx
try { (() => {
// ProductDetail.jsx — CRYS. product page
// Exposes window.ProductDetail
const {
  Button,
  StrainTag,
  PriceChip,
  Icon,
  Badge
} = window.CRYSDesignSystem_98581f;
function ProductDetail({
  product,
  onBack,
  onAdd
}) {
  const p = product;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "40px 64px 96px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onBack,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      cursor: "pointer",
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--text-muted)",
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronDown",
    size: 16,
    style: {
      transform: "rotate(90deg)"
    }
  }), " voltar ao cat\xE1logo"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.1fr 1fr",
      gap: 56,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      background: "rgba(14,59,42,0.6)",
      aspectRatio: "1 / 1",
      boxShadow: "var(--inset-frost)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(closest-side at 50% 40%, var(--tint-violet-12), transparent 70%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "50%",
      top: "46%",
      transform: "translate(-50%,-50%)",
      width: 220,
      height: 220,
      borderRadius: "50%",
      background: "radial-gradient(closest-side at 40% 40%, var(--amber-honey) 0%, rgba(245,166,35,.95) 45%, rgba(200,118,26,.8) 75%, rgba(122,62,15,.6) 100%)",
      boxShadow: "var(--shadow-molten)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement(StrainTag, {
    type: p.strain,
    thc: p.thc
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: 48,
      lineHeight: "52px",
      letterSpacing: "-0.02em",
      color: "var(--text-primary)",
      margin: 0
    }
  }, p.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 18,
      lineHeight: "28px",
      color: "var(--text-muted)",
      margin: 0
    }
  }, p.blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, p.data.split(" · ").map(d => /*#__PURE__*/React.createElement("span", {
    key: d,
    style: {
      padding: "6px 12px",
      borderRadius: "var(--radius-pill)",
      background: "var(--resin-black-elevated)",
      boxShadow: "var(--inset-frost)",
      color: "var(--text-primary)"
    }
  }, d))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(PriceChip, {
    price: p.price
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: () => onAdd(p),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "cart",
      size: 18
    })
  }, "Adicionar ao carrinho")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      marginTop: 16,
      paddingTop: 24,
      borderTop: "1px solid var(--border-frost)"
    }
  }, [["truck", "Entrega discreta em 24-48h"], ["shield", "Laudo de laboratório incluso"], ["leaf", "Cultivo orgânico, sem solventes"]].map(([ic, t]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontFamily: "var(--font-body)",
      fontSize: 14,
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 18,
    color: "var(--accent-secondary)"
  }), " ", t))))));
}
window.ProductDetail = ProductDetail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/ProductDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/data.js
try { (() => {
// Storefront sample catalog — CRYS. (Crystalline & Molten)
window.CRYS_PRODUCTS = [{
  id: "rosin-premium",
  name: "Rosin Premium",
  strain: "indica",
  thc: "THC 28%",
  data: "THC 26% · CBD 0.8% · 3.5g",
  price: "R$ 89,90",
  priceN: 89.9,
  cat: "Extrações",
  blurb: "Prensado a frio, sem solventes. Terpenos preservados em flor fresca congelada."
}, {
  id: "live-resin-sativa",
  name: "Live Resin",
  strain: "sativa",
  thc: "THC 24%",
  data: "THC 24% · CBD 1.2% · 1g",
  price: "R$ 149,00",
  priceN: 149,
  cat: "Extrações",
  blurb: "Extração de resina viva. Perfil terpênico cítrico e energético."
}, {
  id: "hash-hybrid",
  name: "Ice Hash 6★",
  strain: "hybrid",
  thc: "THC 22%",
  data: "THC 22% · CBD 0.6% · 2g",
  price: "R$ 119,00",
  priceN: 119,
  cat: "Extrações",
  blurb: "Hash de água gelada, peneira 6 estrelas. Derrete limpo, cinzas claras."
}, {
  id: "shatter-indica",
  name: "Shatter Glacial",
  strain: "indica",
  thc: "THC 31%",
  data: "THC 31% · CBD 0.3% · 1g",
  price: "R$ 159,00",
  priceN: 159,
  cat: "Extrações",
  blurb: "Translúcido como vidro. Potência máxima, relaxamento profundo."
}, {
  id: "flor-sativa",
  name: "Flor Aurora",
  strain: "sativa",
  thc: "THC 19%",
  data: "THC 19% · CBD 0.9% · 3.5g",
  price: "R$ 69,90",
  priceN: 69.9,
  cat: "Flores",
  blurb: "Flor cultivada indoor, cura lenta de 60 dias. Aroma tropical."
}, {
  id: "flor-hybrid",
  name: "Flor Híbrida 50/50",
  strain: "hybrid",
  thc: "THC 20%",
  data: "THC 20% · CBD 1.0% · 3.5g",
  price: "R$ 74,90",
  priceN: 74.9,
  cat: "Flores",
  blurb: "Equilíbrio perfeito entre corpo e mente. Cultivo orgânico."
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/data.js", error: String((e && e.message) || e) }); }

__ds_ns.ResinBlob = __ds_scope.ResinBlob;

__ds_ns.PriceChip = __ds_scope.PriceChip;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.StrainTag = __ds_scope.StrainTag;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.NavBar = __ds_scope.NavBar;

})();
