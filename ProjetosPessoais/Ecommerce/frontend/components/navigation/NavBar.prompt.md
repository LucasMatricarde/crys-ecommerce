**NavBar** — the storefront's frosted-glass top bar: amber wordmark, centered nav links, search + cart with a count badge. Sticky over dark content.

```jsx
<NavBar
  brand="CRYS."
  links={["Extrações", "Flores", "Kits", "Sobre"]}
  active="Extrações"
  cartCount={2}
  onCart={() => {}}
/>
```

Background is translucent resin black with `blur(24px)` and a frost hairline underline. Active link is primary ink + semibold; others are muted.
