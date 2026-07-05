# CRYS. — Crystalline & Molten · Design System

A design system for **CRYS.**, a premium **cannabis ecommerce** brand. The aesthetic is "Crystalline & Molten": dark, resin-black surfaces lit by a **molten amber** glow, with **oil-slick iridescent** (violet/magenta/cyan) accents and frosted-trichome hairlines. Copy is **Brazilian Portuguese (pt-BR)**. Tagline: *"Resina viva. Pura arte."*

This system lets a design agent produce on-brand storefronts, product pages, marketing, and assets for CRYS.

## Sources
- **Figma:** "Cannabis DS — Crystalline & Molten" (attached, mounted as a virtual filesystem) — the source of truth for tokens, components, and the hero. Pages: Button, Strain-Tag, Price-Chip, Product-Card, Nav-Bar, Hero-Showcase, Foundations.
- **GitHub:** [`LucasMatricarde/Ecommerce`](https://github.com/LucasMatricarde/Ecommerce) — attached but currently **empty** (README only, 11 bytes). No code was available to import; all visuals derive from the Figma file. Explore the repo further if it gains content.
- **Reference uploads** (`assets/reference/`): `color-palette.png`, `type-scale.png`, `angular-three-handoff.png` (a motion/3D handoff note — see Animation below).

---

## Index (manifest)
- `styles.css` — global entry point. **Link this one file.** Imports only.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css` (spacing + radius + shadow), `fonts.css`.
- `components/`
  - `core/` — **Button**, **Badge**, **Input**, **Icon**
  - `commerce/` — **StrainTag**, **PriceChip**, **ProductCard**
  - `navigation/` — **NavBar**
  - `brand/` — **ResinBlob** (signature motif)
- `ui_kits/storefront/` — interactive storefront (Home, Product Detail, Cart drawer).
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `assets/reference/` — original palette/type/handoff images.
- `SKILL.md` — portable Agent-Skill wrapper.

---

## CONTENT FUNDAMENTALS

**Language.** All UI copy is **Brazilian Portuguese**. Examples in the file: *"Adicionar"*, *"Ver mais"*, *"Saiba mais"*, *"Extrações artesanais de cannabis."*, *"Pureza, potência e design que você merece."*

**Voice.** Confident, artisanal, design-forward — closer to a specialty coffee or natural-wine brand than a dispensary. Cannabis is treated as **craft**: words like *resina, extração, artesanal, pureza, potência, curado*. Short, declarative. Often two-beat slogans: *"Resina viva. Pura arte."*

**Person.** Speaks to *você* (you) — direct but warm ("design que você merece"). Brand refers to itself implicitly, rarely "nós".

**Casing.** Headlines in sentence case (not ALL CAPS) — caps are reserved for the **wordmark CRYS.** and small tracked **labels** (e.g. uppercase mono microcopy). Strain names and product names are Title Case ("Rosin Premium", "Ice Hash 6★").

**Numbers & data.** Potency and weights are first-class content, always in **Space Mono**: `THC 26% · CBD 0.8% · 3.5g`, prices `R$ 89,90` (comma decimal, BRL). The mono face signals "lab-tested, precise."

**Emoji.** Not used. The closest thing is the occasional **★** in product names (e.g. "Ice Hash 6★") and the `·` middot as a separator. No emoji in UI.

**Vibe.** Premium, nocturnal, slightly psychedelic. Compliance-aware (footer carries an 18+ notice). Never clinical, never "stoner-cliché."

---

## VISUAL FOUNDATIONS

**Color.** Dark-first. Five families (all in `tokens/colors.css`):
- **Resin Black** neutrals/surfaces — `base #07090A → surface #0B0F0C → elevated #12171A → raised #1A2125`. The page is near-black; cards sit a few steps up.
- **Live Resin Amber** (primary action) — `honey #FFD89B · core #F5A623 · deep #C8761A · burnt #7A3E0F`. Amber is the only "loud" color: CTAs, prices, the wordmark.
- **Trichome Green** (botanical) — `deep #0E3B2A · core #1F8A4C · frost #B8F0CE · ice #E8F8EF`. Used for hairlines (frost at low alpha), hybrid strain, image-slot tint.
- **Oil-Slick Iridescent** — `violet #7B5CFF · magenta #E94FA1 · cyan #2FE6D6`. Strain accents (violet=indica), focus rings, ambient glows. Used sparingly, at low alpha for background tints.
- **Neutral Ink** — text `primary #F4FBF6`, `muted #8A9A90`.

**Type.** `tokens/typography.css`.
- **Display & headings — Syne** (ExtraBold 800 for display/H1, Bold 700 H2, SemiBold 600 H3). Tight tracking (−0.02em on display). Geometric, slightly quirky — the brand's personality.
- **Body — Inter** (Regular/SemiBold). *Note:* the Figma handoff says the intended production body face is **Satoshi** (Fontshare); Figma fell back to Inter. We ship **Inter** — see Caveats.
- **Data/mono — Space Mono** (Regular 400, Bold 700) for prices, THC/CBD, microcopy.

**Spacing.** 4px base; scale 4·8·12·16·24·32·48·64·96·128 named `--spacing-1…-32`.

**Radii.** `sm 8` (chips, price tile) · `md 16` (image slot, input) · `lg 24` (cards, panels) · `pill 999` (buttons, tags, badges). Buttons and tags are **always full-pill**.

**Backgrounds.** Solid resin-black, layered with **soft radial glows** — a violet→magenta tint behind the hero, and the signature **molten resin blob** (amber radial gradient with a violet+amber outer glow). No photos-as-background in the kit; product imagery sits in green-tinted **image slots**. No repeating patterns or hand-drawn textures.

**Cards.** Raised surface (`rgba(26,33,37,.8)`), `radius-lg (24)`, **inset frost hairline** (`inset 0 0 0 1px rgba(184,240,206,.14)`) instead of a hard border. On hover the hairline strengthens (`.35` alpha) **and** an amber glow appears (`0 0 24px rgba(245,166,35,.3)`), plus a 2px lift.

**Borders.** Almost never solid 1px lines — instead **inset frosted hairlines** via `box-shadow` (trichome-frost at 8–35% alpha). Dividers use `1px solid var(--border-frost)`.

**Shadows / elevation.** Two systems: (1) **frost hairlines** (inset, define edges); (2) **molten glow** (outer amber/violet blur, for the hero blob and card hover). Plain drop shadow (`--shadow-drop`) only for overlays like the cart drawer. No soft gray material shadows.

**Transparency & blur.** The **NavBar** is frosted glass: `rgba(11,15,12,.85)` + `backdrop-filter: blur(24px)` + frost hairline underline. Cart overlay uses a dim + slight blur. Glows are always low-alpha gradients.

**Hover states.** Primary button → brightness +8%. Secondary → hairline strengthens + amber glow. Ghost / nav link → text lifts muted→primary, subtle frost wash. Cards → lift + glow.

**Press states.** Buttons scale to `0.97` (springy), no color change.

**Animation.** Per the `angular-three-handoff.png` note, the production hero is intended to be motion-rich: a glassy 3D **resin blob** (Three.js / angular-three) that "melts/drips" on scroll (GSAP + Lenis), product-card **tilt** (vanilla-tilt), and a GLSL/Vanta psychedelic background. All gated on `prefers-reduced-motion` (freeze blob, disable tilt). In this static system we approximate the blob with CSS radial gradients. Easing leans springy/organic (cubic-bezier(.2,.8,.2,1)); transitions are quick (.12–.3s). No bounce on text, no infinite decorative loops.

**Imagery vibe.** Warm, glowing, amber-forward; products shown as molten/translucent extracts on dark grounds. Cool iridescent halos for contrast. Never bright/clinical white.

---

## ICONOGRAPHY

The Figma file draws icons as simple line glyphs (e.g. the nav cart). This system standardizes on **[Lucide](https://lucide.dev)** (MIT) — thin **1.75** stroke, `currentColor`, 24px grid — matching that line-icon language. A curated subset is inlined in `components/core/Icon.jsx` (`cart, search, menu, user, leaf, x, chevronDown, plus, minus, star, truck, shield, heart`); add more Lucide paths as needed, keeping the 1.75 stroke. Render with `<Icon name="cart" size={24} />`.

- **Emoji:** not used as icons.
- **Unicode:** `·` (middot) as a separator and `★` in product names — that's it.
- **No** multicolor/filled icon sets; no PNG icons. Logo is the **typographic wordmark "CRYS."** (Syne ExtraBold, amber), not a glyph.

---

## Usage

Consumers link the single global stylesheet and read components from the compiled bundle:

```html
<link rel="stylesheet" href="styles.css" />
<script src="_ds_bundle.js"></script>
<script>
  const { Button, ProductCard, NavBar } = window.CRYSDesignSystem_98581f;
</script>
```

(The `window` namespace is generated; confirm via the design-system tooling.) See each component's `.prompt.md` for usage snippets, and `ui_kits/storefront/` for a full composition.

---

## Caveats
- **Body font:** the handoff specifies **Satoshi** for body; it isn't on Google Fonts, so we ship **Inter** (the Figma fallback). Swap in Satoshi for production.
- **GitHub repo empty:** `LucasMatricarde/Ecommerce` had no code, so nothing was imported from it.
- **Icons substituted:** Lucide stands in for the file's hand-drawn line icons (same weight/style).
- **Motion approximated:** the 3D resin blob + scroll melt are CSS approximations of the angular-three/GSAP intent.

---

## Storefront SPA (Inc 5 — Vite + React + TypeScript)

The live storefront app lives at this directory root (`index.html` + `src/`). It is a
Vite + React + TypeScript SPA wired to the CRYS gateway — replacing the old CDN/Babel
prototype in `ui_kits/storefront/`. It reuses the design-system tokens above
(`styles.css` is imported by `src/main.tsx`).

### Run

```bash
# 1. Backend up (gateway on :8080)
cd ../backend/infra && docker compose up -d --build
curl http://localhost:8080/actuator/health   # confirm UP

# 2. Frontend
cd ../../frontend
cp .env.example .env          # VITE_API_BASE_URL=http://localhost:8080/api
npm install
npm run dev                   # http://localhost:5173
```

Other scripts: `npm run build` (typecheck + production build), `npm test` (Vitest),
`npm run typecheck`.

### What it does

- **Catalog** (`/`, `/product/:slug`) — live `GET /api/catalog/products` with strain-type
  filter + pagination; loading/empty/error states.
- **Auth** (`/login`) — **demo-only**, passwordless: mints a JWT via `POST /api/auth/token`,
  stored in `localStorage`, attached as `Authorization: Bearer` by an axios interceptor.
  A `401` clears the session and redirects to login.
- **Checkout** (`/checkout`, guarded) — `POST /api/orders` → `202 PENDING`, then routes to tracking.
- **Order tracking** (`/orders/:id`, guarded) — polls `GET /api/order-views/{id}` every ~1.5s,
  renders status + reason + timeline, stops on `CONFIRMED`/`CANCELLED`, and tolerates an early
  `404` (read-model projection lag) by continuing to poll.

### Demo flows

- `rosin-premium` qty 1 → **CONFIRMED**
- `shatter-cristal` → **CANCELLED** (no stock)
- `rosin-premium` qty 60 → **CANCELLED** (payment decline + compensation)

### Live end-to-end test

`npm run test:e2e` drives the real SPA in a headless browser against the live gateway
(Playwright). Prerequisites: backend up (`backend/infra` docker compose) and the dev server
running (`npm run dev`). On first run, install the browser once: `npx playwright install chromium`.
Covers catalog browse, the happy path to `CONFIRMED`, both cancellation reasons, and the auth
guard / `401` session-clear. See `e2e-live.mjs`.

### Demo-auth security note

The token sits in `localStorage` (XSS-exposed) and the login is passwordless — this is a
**portfolio demo only**, not production auth. A real build would use an httpOnly cookie and a
genuine identity provider. See `src/auth/tokenStore.ts`.
