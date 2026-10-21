# Redesign the Communium landing page in the style of agents.clientx.ai (keep red & white)

You are a senior frontend engineer and product designer working in this monorepo
(`apps/frontend` = Next.js 14 App Router + Tailwind 3.4 + shadcn-style HSL tokens + `motion` + lucide-react).

**Goal:** rebuild the public landing page `apps/frontend/src/app/page.tsx` so its structure, polish and
interaction quality match https://agents.clientx.ai/ — a clean, modern AI-SaaS look — while keeping
**our brand colors: logo red `#E4082C` (`--primary: 350 93% 46%`, Tailwind `communium-50…900`) on white**.
Copy the *design system and patterns* of clientx, never its content, logos, images or colors.

---

## Step 0 — Research first (no code yet)

1. Open https://agents.clientx.ai/ in the browser. Screenshot it at 1440px and 390px and scroll the whole page.
   Write down: font families and weights, type scale, container width, section padding, border radii,
   shadows, card borders, background treatments (grids, gradients, glows), hover states, scroll/entrance
   animations, marquee speed, sticky-nav behaviour.
2. Read these files before planning:
   - `apps/frontend/src/app/page.tsx` — current landing (Yu-Gi-Oh × Dofus "trading card" theme:
     `HeroCard`, `Gem`, `TierCard` with rarity frames, `ygo-btn-gold`, `ygo-card`, `fantasy-border`)
   - `apps/frontend/src/app/layout.tsx` — fonts (Nunito Sans, Alegreya, Alegreya SC, Noto Sans Arabic) and the global `<BackgroundDesign />`
   - `apps/frontend/src/styles/globals.css` and `communium-game.css` — tokens and the `ygo-*` / `rarity-*` / `gem-*` classes
   - `apps/frontend/tailwind.config.ts` — the `communium` red scale, easing tokens and animations
   - `apps/frontend/src/lib/i18n/{fr,en,ar,types}.ts` — all landing copy lives under `t.home`
   - `apps/frontend/src/lib/auth-client.tsx` — `SignInButton`, `SignUpButton`, `SignedIn`, `SignedOut`, `UserButton`
   - `communium_application_presentation.md` — the platform's real features (use this for copy)
3. Show me a short plan: sections → components → files. Wait for my OK before rewriting.

## Hard constraints

- **Scope = the landing page only.** The dashboard (`src/app/(dashboard)/**`) still uses the
  `ygo-*`, `rarity-*`, `gem-*`, `fantasy-*` classes and the game palette. **Do not delete or change them.**
  Put the new landing components in `src/components/landing/` and any landing-only CSS in a separate,
  scoped file or in Tailwind utilities.
- **Colors:** red `#E4082C` as the only accent. Use white surfaces, near-black/navy text (the existing `--foreground`)
  and neutral grays for borders and muted text. Use the existing `communium-50…900` scale for tints, badges, glows and
  gradients. Remove gold, sapphire, amethyst and emerald gem accents from the landing.
  Keep a green/red only for KPI delta badges. Check red-on-white text contrast meets WCAG AA (use `communium-600/700` for small red text).
- **No hard-coded hex values in components.** Use the tokens (`primary`, `communium-*`, `border`, `muted`…).
- **i18n:** every new string goes into `fr.ts`, `en.ts` **and** `ar.ts` (and `types.ts`) under `home`.
  French is the default. The Arabic version must work in **RTL**, so use logical properties (`ms-`, `me-`, `ps-`, `start-`, `end-`)
  and make the marquee run the right way in RTL.
- **Auth:** keep the existing `SignedOut → SignUpButton mode="modal"` / `SignedIn → /dashboard` logic on every CTA.
- **Dark mode** (`next-themes`, `.dark` tokens) must still look right. Red on a dark navy surface is fine there.
- Check whether the global `<BackgroundDesign />` clashes with the new look. If it does, hide it on `/` only, not globally.
- Reuse what's installed (`motion`, `lucide-react`, `@radix-ui/react-tabs`, `tailwindcss-animate`). Don't add heavy dependencies.
- Fonts: match clientx's modern sans look for the landing (e.g. a geometric/grotesk sans loaded with `next/font`
  and scoped to the landing wrapper). Keep `Noto Sans Arabic` for `ar`. Don't remove the Alegreya fonts the dashboard uses.

## Page structure (clientx pattern → Communium content)

1. **Sticky nav:** red logo (`/communium-logo-red.png`) + "The Communium" on the left, anchor links in the middle
   (Plateforme, IA, Marketplace, Adhésion), then `LanguageSwitcher`, "Se connecter" and a solid red "Demander l'adhésion" button.
   It turns translucent and blurred with a hairline border on scroll. On mobile it becomes a full-screen sheet.
2. **Hero:** an eyebrow pill ("N°1 du réseautage professionnel IA au Maroc"-style) and a big 3-beat headline
   (short punchy sentences, like "Un seul réseau. Toutes vos opportunités. Zéro friction."). Then a subtitle and 2 CTAs:
   a solid red primary and an outline secondary that anchors to `#plateforme`. Below them, a **product dashboard mockup built in HTML/CSS**
   (not an image) with a pulsing "Live" dot and 4 KPI tiles, each with a delta badge (members, mises en relation IA,
   transactions marketplace, profils vérifiés KYC). Add a soft red radial glow and a faint grid pattern behind it.
3. **Trust bar:** 3 compact stats: "Profils vérifiés CNIE", "0 MAD de frais cachés", "+15 modules".
4. **Logo marquee:** "Ils nous font confiance". An infinite seamless scroll with edge fade masks that pauses on hover.
   Use placeholder partner logos (grayscale, colored on hover).
5. **Consolidation section:** "+15 outils. Réunis en 1 plateforme." This is a cloud/grid of module chips with lucide icons
   (Messagerie, Événements, Forums, Groupes, Mentorat, Marketplace, Enchères, Sondages, Badges, Jetons Tks, Création d'entreprise, KYC…)
   converging on a central Communium card.
6. **Numbered feature showcase (01, 02, 03…):** a bento/zig-zag layout like clientx. Each module has a headline, copy and a small
   *live-looking* HTML mock:
   01 Réseau vérifié (KYC CNIE + OCR), 02 Matching IA & recherche sémantique (reuse/restyle the `NetworkDiagram` in red),
   03 Mentorat, 04 Marketplace & enchères, 05 Messagerie temps réel, 06 Événements & meetings, 07 Forums & groupes,
   08 Jetons Tks & portefeuille, 09 Création d'entreprise.
7. **4-step process:** Rejoindre → Se vérifier → Se connecter → Développer, with a connecting progress line.
8. **Video / product section** (`#plateforme`): a rounded frame with a play-button overlay (placeholder poster, lazy-loaded).
9. **Use cases by profile:** Radix Tabs styled as pills (Entrepreneur, Investisseur, Mentor, Entreprise, Diaspora…)
   that switch a featured card with 3 big metrics and a quote.
10. **Pricing:** keep the existing 3 plans and their i18n keys (`planPersonal`, `planBusiness`, `planCreation`, prices, feature lists, `popular`),
    but drop the trading-card/rarity look. Use clean cards with check icons. The popular one gets a red border and glow plus a "Le plus populaire" badge.
11. **FAQ:** a numbered accordion (01–05) with a smooth height animation (the `accordion-down/up` keyframes already exist).
12. **Final CTA band:** repeat the hero headline with a red CTA and trust badges.
13. **Footer:** brand blurb, 3 link columns (Plateforme, Ressources, Contact), and a bottom bar with the copyright and the `/privacy` and `/contact` links.

## Quality bar

- Generous whitespace, large tight-tracked headlines, 1px subtle borders, soft layered shadows, `rounded-2xl` cards.
- Motion with `motion`: fade + 12px rise on scroll, staggered in grids, ~400–600ms, using the existing `ease-out` token.
  Stats count up, and buttons lift/press on hover/active. Everything respects `prefers-reduced-motion`.
- Mobile-first with no horizontal scroll at 360px. Check 360 / 768 / 1280 / 1440, in LTR and RTL, in light and dark.
- Accessible: semantic landmarks, one `h1`, red `:focus-visible` rings, ARIA on tabs/accordion, `aria-hidden` on decorative mocks.
- Performance: Server Components where possible (keep `"use client"` only on interactive pieces), `next/image`, lazy video.

## Workflow

- Build section by section. After each one, run `pnpm --filter @communium/frontend dev`, open http://localhost:3000,
  compare it side by side with clientx, and fix visual issues before moving on.
- Run `pnpm --filter @communium/frontend lint` and `build` at the end. Make sure `/dashboard` pages look unchanged.
- Finish with a summary of the files changed, the new components, the new i18n keys, and the placeholder content
  (logos, metrics, video, testimonials) I need to replace with real data.
