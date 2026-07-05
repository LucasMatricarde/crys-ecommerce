**ProductCard** — the core storefront tile. Composes StrainTag, PriceChip and Button over an image slot. Use for product grids and listings.

```jsx
<ProductCard
  name="Rosin Premium"
  strain="indica"
  thc="THC 28%"
  data="THC 26% · CBD 0.8% · 3.5g"
  price="R$ 89,90"
  image="/assets/product.jpg"
  onAdd={() => {}}
/>
```

Hovering lifts the frosted hairline to `--border-frost-strong` and adds the amber `--shadow-card` glow. Omit `image` to show the green-tinted placeholder slot.
