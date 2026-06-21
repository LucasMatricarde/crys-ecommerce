---
name: crys-design
description: Use this skill to generate well-branded interfaces and assets for CRYS. (Crystalline & Molten — a premium cannabis ecommerce brand), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Quick map:
- `styles.css` — global entry; `@import`s fonts + all token files. Link this one file.
- `tokens/` — colors, typography, spacing/radius, fonts (Syne · Inter · Space Mono via Google Fonts).
- `components/` — React primitives: `core/` (Button, Badge, Input, Icon), `commerce/` (StrainTag, PriceChip, ProductCard), `navigation/` (NavBar), `brand/` (ResinBlob). Each has a `.d.ts` + `.prompt.md`.
- `ui_kits/storefront/` — interactive storefront recreation.
- `guidelines/` — foundation specimen cards (colors, type, spacing, brand).

Brand in one line: **dark-first, resin-black surfaces; molten amber as the action color; oil-slick iridescent (violet/magenta/cyan) accents; Syne display + Inter body + Space Mono data.** Portuguese (pt-BR) copy. Mood = "Crystalline & Molten."
