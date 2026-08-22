# KrishiSetu Brand Identity and UI Design System

**Brand:** KrishiSetu  
**Meaning:** Agricultural Bridge  
**Motto:** अन्नदः सर्वदश्चैव  
**Motto meaning:** “The provider of food is the provider of everything.”  
**Design baseline:** UX4G Design System 3.0, GIGW 3.0, and WCAG 2.1 Level AA  
**Languages:** English default; English, Marathi, Hindi, and Kannada supported  
**Prototype status:** Non-official hackathon product using fictional data only

## 1. Compliance and brand-safety position

KrishiSetu should feel calm, accountable, legible, and public-service oriented. It must not imitate an official government product so closely that a farmer could mistake it for one.

The Government of India’s GIGW 3.0 is based on WCAG 2.1 and uses Level AA as its accessibility baseline. UX4G uses a mobile-first, base-4 spacing system, semantic components, a 16px browser-relative body baseline, and a 44×44px minimum touch target in its handbook. This document aligns the visual system to those principles, but **only testing and the applicable STQC assessment can establish formal GIGW conformity**.

### 1.1 State Emblem restriction

The State Emblem of India is not a general-purpose brand asset. The Ministry of Home Affairs states that its use is restricted to authorized authorities and purposes, and the hackathon brief prohibits government logos that imply approval or partnership.

Therefore the design has two header modes:

- **Hackathon mode — required for this prototype:** an original `DEMO` trust seal occupies the left slot. It must not contain the Lion Capital, Ashoka Chakra, “Satyameva Jayate,” or a colourable imitation. A persistent notice says “Hackathon prototype • Not a government website.”
- **Authorized government deployment mode — reference only:** the complete State Emblem, including “Satyameva Jayate,” may occupy the same left slot only after written authorization and official asset approval. It must never be bundled into the public prototype repository by default.

The requested emblem geometry is fully specified below so an authorized deployment can adopt it without changing layout. The default component must render the safe demo seal.

### 1.2 Motto provenance and use

The full Subhashitam was shared by the Prime Minister and published by PIB on April 20, 2026:

```text
कृषिर्धन्या कृषिर्मेध्या जन्तूनां जीवनं कृषिः।
अन्नदः सर्वदश्चैव तस्माच्छ्रेष्ठतरो हि सः॥
```

The short line `अन्नदः सर्वदश्चैव` is appropriate as KrishiSetu’s respectful brand motto. Its appearance on an official government page validates the text and broad meaning; it does **not** imply endorsement of KrishiSetu.

## 2. Brand foundations

### 2.1 Brand character

| Attribute | Visual expression | Avoid |
|---|---|---|
| Authoritative | Civic Blue, stable grid, direct labels | ceremonial clutter, multiple logo rows |
| Agricultural | restrained Agri Green and a leaf/furrow line | generic startup gradients, neon green |
| Interoperable | bridge and connected data nodes | literal cloud/AI sparkle motifs |
| Accessible | high contrast, 16px body, 48px primary controls | tiny metadata, icon-only controls |
| Respectful | Sanskrit motto as quiet supporting text | motto as a decorative headline or watermark |
| Honest | persistent non-official/mock notice | state emblems, seals, or copy implying approval |

### 2.2 Naming and wordmark

- Canonical English wordmark: `KrishiSetu`, capital K and S, no space.
- Marathi supporting name when needed: `कृषीसेतू`.
- Do not alternate between `Krishi Setu`, `Krishi-Setu`, and `KrishiSetu` in product chrome.
- The symbol may appear alone only when the adjacent interface exposes the accessible name `KrishiSetu`.
- The motto is never part of the SVG outline; it remains live selectable text in Noto Sans Devanagari.

## 3. Logo architecture

### 3.1 Minimalist SVG concept

The KrishiSetu symbol combines three ideas in one continuous, low-detail mark:

1. **Bridge:** a Civic Blue arch spanning left to right, with two short vertical piers. It represents a stable service layer over fragmented systems.
2. **DPI/data nodes:** three solid circular nodes at the two bridge ends and crown. The nodes are joined by the arch; no circuit-board complexity is added.
3. **Leaf/furrow:** two Agri Green curves below the arch form a leaf-like field furrow. Their centre line points forward, suggesting cultivation and a path across the bridge.

SVG construction rules:

```text
viewBox: 0 0 64 64
safe area: 6 units on every side
stroke width: 3 units at 64px; round caps and round joins
bridge/data stroke and nodes: #1E3A8A
leaf/furrow stroke: #166534
background: transparent
minimum rendered symbol: 32×32px
preferred header symbol: 40×40px
single-colour fallback: #1E3A8A
no gradients, shadows, text, flags, maps, wheat clip-art, tractors, hands, coins, Lion Capital, or Ashoka Chakra
```

Recommended geometry:

```text
Bridge arch: M10 34 Q32 12 54 34
Bridge deck: M10 34 H54
Piers: M16 34 V43 and M48 34 V43
Nodes: circles at (10,34), (32,20), and (54,34), radius 3.5
Upper furrow/leaf: M14 46 Q32 34 50 46
Lower furrow: M20 51 Q32 43 44 51
Centre vein/path: M32 40 V54
```

The actual vector should be optically adjusted at 32px and 40px; geometry is a starting constraint, not permission to add detail.

### 3.2 Lockups

| Lockup | Composition | Use |
|---|---|---|
| Primary horizontal | symbol left, `KrishiSetu` right | desktop header, documents |
| Compact mobile | `KrishiSetu` title then 40px symbol on far right; motto below title | required mobile header |
| Symbol only | 32–40px mark with accessible label | favicon/app icon contexts |
| Monochrome | all strokes Civic Blue | print, one-colour reproduction |

Clear space equals the radius of one data node on all sides at minimum. Do not place the symbol on photographs or low-contrast colour fields.

### 3.3 Accessible SVG markup

When the wordmark is visible next to the SVG, the SVG is decorative:

```html
<svg aria-hidden="true" focusable="false" viewBox="0 0 64 64">…</svg>
```

When the symbol is used alone:

```html
<svg role="img" aria-labelledby="krishiSetuLogoTitle krishiSetuLogoDesc" viewBox="0 0 64 64">
  <title id="krishiSetuLogoTitle">KrishiSetu</title>
  <desc id="krishiSetuLogoDesc">A connected bridge above an agricultural leaf and field furrows.</desc>
  …
</svg>
```

Never put important text into SVG paths. Keep the product name and motto as HTML text so they scale, translate, and remain accessible.

## 4. Logo-generation prompt

Use this prompt with a vector-capable image or logo generation system:

```text
Create a clean, original, minimalist vector logo symbol for “KrishiSetu,” a mobile-first Indian agricultural digital public infrastructure prototype. The idea is “a digital bridge connecting fragmented agricultural services.” Combine exactly three visual elements into one coherent mark: (1) a strong single-span bridge arch, (2) three connected circular data nodes located at the left endpoint, crown, and right endpoint of the bridge, and (3) two simple agricultural leaf or field-furrow curves beneath the bridge. Use flat vector geometry, round stroke caps and joins, balanced negative space, and a transparent background. Use Civic Blue #1E3A8A for the bridge and data nodes and Agri Green #166534 for the leaf/furrows. Design on a 64×64 viewBox with a 6-unit safe area and approximately 3-unit strokes. It must remain recognizable at 32px and work in one colour.

Do not use gradients, 3D effects, shadows, glossy styling, startup-style sparkles, AI stars, circuit-board clutter, wheat bundles, tractors, coins, hands, maps of India, the Indian flag, the Ashoka Chakra, the Lion Capital/State Emblem, “Satyameva Jayate,” official seals, or any government insignia. Do not place text or the Sanskrit motto inside the SVG. Deliver editable SVG paths with expanded artboard, no raster images, no embedded fonts, and no background rectangle. Also produce a monochrome #1E3A8A variant and show legibility previews at 32px, 40px, and 64px.
```

Rejection criteria:

- resembles a ministry/government seal;
- contains unauthorized national symbols;
- depends on a gradient or fine detail to read;
- confuses the furrow with a Wi-Fi/cloud icon;
- uses more than the two approved brand colours;
- fails at 32px or becomes visually heavier than the wordmark.

## 5. Mobile header architecture

### 5.1 Header stack

The header is a compact three-layer system, not a logo wall:

```text
┌────────────────────────────────────┐
│ DEMO • Not a government website   │  32px minimum; always visible
├────────────────────────────────────┤
│ [DEMO seal]       KrishiSetu [mark]│  64px main brand row
│                   अन्नदः सर्वदश्चैव│  motto aligned under title
├────────────────────────────────────┤
│ मराठी  English        Help  Profile│  48px utility/nav row when needed
└────────────────────────────────────┘
```

Authorized government reference mode replaces `[DEMO seal]` with the complete approved State Emblem asset without changing the grid.

### 5.2 Exact mobile measurements

| Element | Specification |
|---|---|
| Prototype notice | min-height 32px; `#FEF3C7` background; `#78350F` text; 12px/18px; 600 weight; 8px 16px padding |
| Main brand row | min-height 72px; white background; 12px 16px padding; 1px bottom border `#CBD5E1` |
| Grid | `56px minmax(0, 1fr)`; 12px column gap; left asset start-aligned; right cluster end-aligned |
| Demo seal | 48×48px visible box inside a 48×48px non-interactive slot; original bridge-node mark plus `DEMO`, no insignia |
| Authorized emblem | max 44×52px image inside the 56px slot; complete official asset only; authorization required |
| Right brand cluster | flex column; align end; max-width calc(100vw - 100px); min-width 0 |
| Title row | flex; align centre; justify end; 8px gap |
| Product title | 20px/28px, weight 700, Civic Blue; no truncation in English; Marathi alternative 20px/30px |
| Logo symbol | 40×40px visible and intrinsic; decorative when title is visible |
| Motto | 12px/18px, weight 400, `#475569`; Noto Sans Devanagari; margin-top 2px; exact text preserved |
| Utility row | 48px minimum; horizontal list; every control has 44×44px target; wrap into menu below 360px rather than shrink text |
| Sticky behavior | notice + main row may be sticky; utility row may scroll away; sticky stack must not exceed 152px |

### 5.3 Header semantics

```html
<div role="note" class="prototype-notice">Hackathon prototype • Not a government website</div>
<header class="site-header">
  <div class="header-brand-row">
    <div class="header-authority-slot" aria-hidden="true"><!-- original DEMO seal --></div>
    <a class="brand-lockup" href="/" aria-label="KrishiSetu home">
      <span class="brand-title-row">
        <span class="brand-title">KrishiSetu</span>
        <svg aria-hidden="true" focusable="false"><!-- KrishiSetu mark --></svg>
      </span>
      <span class="brand-motto" lang="sa-Deva">अन्नदः सर्वदश्चैव</span>
    </a>
  </div>
</header>
```

The page still requires one visible `<h1>` describing the screen. The brand title in the header is not the page `<h1>`.

## 6. Colour system

### 6.1 Core palette

| Token | Value | Role |
|---|---:|---|
| Civic Blue | `#1E3A8A` | identity, header title, links, selected navigation |
| Civic Blue dark | `#172554` | active states and high-contrast blue surfaces |
| Civic Blue light | `#DBEAFE` | selected/expanded background, never as the sole state cue |
| Agri Green | `#166534` | primary citizen action |
| Agri Green dark | `#14532D` | hover/active action state |
| Page surface | `#F8FAFC` | page canvas and disclosed detail region |
| Card surface | `#FFFFFF` | primary content cards and forms |
| High-contrast text | `#0F172A` | headings and body |
| Muted text | `#475569` | metadata/motto; safe for 12px text on light surfaces |
| Border | `#CBD5E1` | cards, separators, inputs |
| Error | `#DC2626` | error border/icon/text with an accompanying label |
| Error dark | `#991B1B` | compact error text/active state |
| Error surface | `#FEF2F2` | error summary background |
| Success | `#15803D` | confirmed status, never the primary CTA colour role |
| Success dark | `#166534` | success text on light surface |
| Success surface | `#F0FDF4` | success summary background |
| Warning surface | `#FEF3C7` | prototype/warning notice |
| Warning text | `#78350F` | warning/prototype text |

Normal text must meet at least 4.5:1 contrast and large text at least 3:1. Interactive component boundaries and meaningful graphical objects must meet at least 3:1 against adjacent colours. Verify the final rendered combinations with automated and manual tools; token selection alone is not certification.

Verified reference pairs: Civic Blue/white `10.36:1`, Agri Green/white `7.13:1`, muted text/page surface `7.24:1`, Error/white `4.83:1`, Success/white `5.02:1`, and primary text/page surface `17.06:1`.

### 6.2 Colour usage rules

- Civic Blue is the trust/identity colour, not the main conversion button.
- Agri Green is reserved for the single primary action in a region.
- Error and Success are semantic; do not use them decoratively.
- Never use green/red alone. Add an icon, visible text, and programmatic state.
- Place dense data on white cards over the `#F8FAFC` page canvas.
- Use blue/green tints only for a small status area or expanded detail region, not full-page backgrounds.

## 7. Typography system

### 7.1 Font families

```text
English/Latin: Noto Sans
Marathi/Hindi/Sanskrit/Devanagari: Noto Sans Devanagari
Kannada: Noto Sans Kannada
Fallback: Noto Sans, system-ui, sans-serif
```

Self-host WOFF2 files and set `font-display: swap`. Use the `lang` attribute at page and inline-language boundaries. Devanagari and Kannada controls must allow adequate glyph clearance; never force a line box below 1.5. Locale support and the English default come only from `packages/i18n/src/locale-registry.ts`.

### 7.2 Type scale

| Role | Size / line height | Weight | Use |
|---|---|---:|---|
| Display/H1 | 28px / 40px | 700 | one page title |
| H2 | 22px / 32px | 700 | major section |
| H3/card title | 18px / 27px | 700 | card/section title |
| Body | 16px / 24px | 400 | default content |
| Body strong | 16px / 24px | 700 | important labels/values |
| Small | 14px / 21px | 400 or 600 | timestamps/helper text |
| Extra-small/legal/motto | 12px / 18px | 400 | legal, motto, compact source metadata only |
| Button | 16px / 24px | 700 | all main buttons |
| Data value | 24px / 36px | 700 | one primary value per card |

Do not reduce text below 12px. Do not use an increase in size as the only emphasis mechanism; use `<strong>`/700 weight and plain-language placement. Avoid 500 weight for critical text because some Noto Sans Devanagari delivery bundles may not include it.

## 8. Ready-to-use CSS variables

The complete ready-to-use file is [krishisetu.tokens.css](./krishisetu.tokens.css). The required `:root` block is:

```css
:root {
  color-scheme: light;

  --ks-font-latin: "Noto Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
  --ks-font-devanagari: "Noto Sans Devanagari", "Noto Sans", system-ui, sans-serif;
  --ks-font-kannada: "Noto Sans Kannada", "Noto Sans", system-ui, sans-serif;

  --ks-color-civic-blue: #1e3a8a;
  --ks-color-civic-blue-dark: #172554;
  --ks-color-civic-blue-light: #dbeafe;
  --ks-color-agri-green: #166534;
  --ks-color-agri-green-dark: #14532d;
  --ks-color-surface-page: #f8fafc;
  --ks-color-surface-card: #ffffff;
  --ks-color-text: #0f172a;
  --ks-color-text-muted: #475569;
  --ks-color-border: #cbd5e1;
  --ks-color-error: #dc2626;
  --ks-color-error-dark: #991b1b;
  --ks-color-error-surface: #fef2f2;
  --ks-color-success: #15803d;
  --ks-color-success-dark: #166534;
  --ks-color-success-surface: #f0fdf4;
  --ks-color-warning-surface: #fef3c7;
  --ks-color-warning-text: #78350f;
  --ks-color-focus: #0f172a;

  --ks-font-size-xs: 0.75rem;
  --ks-font-size-sm: 0.875rem;
  --ks-font-size-md: 1rem;
  --ks-font-size-lg: 1.125rem;
  --ks-font-size-xl: 1.375rem;
  --ks-font-size-2xl: 1.75rem;
  --ks-line-height-xs: 1.125rem;
  --ks-line-height-sm: 1.3125rem;
  --ks-line-height-md: 1.5rem;
  --ks-line-height-lg: 1.6875rem;
  --ks-line-height-xl: 2rem;
  --ks-line-height-2xl: 2.5rem;
  --ks-font-weight-regular: 400;
  --ks-font-weight-semibold: 600;
  --ks-font-weight-bold: 700;

  --ks-space-1: 0.25rem;
  --ks-space-2: 0.5rem;
  --ks-space-3: 0.75rem;
  --ks-space-4: 1rem;
  --ks-space-5: 1.25rem;
  --ks-space-6: 1.5rem;
  --ks-space-8: 2rem;
  --ks-space-10: 2.5rem;
  --ks-space-12: 3rem;

  --ks-radius-sm: 0.25rem;
  --ks-radius-md: 0.5rem;
  --ks-radius-lg: 0.75rem;
  --ks-border-width: 1px;
  --ks-border-width-strong: 2px;
  --ks-touch-min: 2.75rem;
  --ks-touch-comfortable: 3rem;
  --ks-control-height: 3rem;
  --ks-content-max: 75rem;
  --ks-shadow-card: 0 1px 2px rgb(15 23 42 / 0.08);
  --ks-focus-outline: 3px solid var(--ks-color-focus);
  --ks-focus-offset: 3px;
}
```

## 9. Buttons and touch targets

### 9.1 Shared button anatomy

All button targets are at least 44×44px. Main mobile actions use a 48px minimum height for extra tolerance on inexpensive touchscreens.

```css
.ks-button {
  min-inline-size: var(--ks-touch-min); /* 44px */
  min-block-size: var(--ks-touch-comfortable); /* 48px */
  padding: 0.75rem 1.25rem;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  font: 700 1rem/1.5rem var(--ks-font-latin);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}
```

Use a native `<button>` for actions and `<a>` for navigation. Do not make a `<div>` clickable. Keep icon-only actions exceptional; when used, provide an accessible name and the same target size.

### 9.2 Primary “Apply Now”

```css
.ks-button--primary {
  color: #ffffff;
  background: #166534;
  border-color: #166534;
}

.ks-button--primary:hover { background: #14532d; border-color: #14532d; }
.ks-button--primary:active { background: #052e16; border-color: #052e16; }
```

Specification: 12px vertical × 20px horizontal padding, 8px radius, 700 weight, 16px/24px text, 48px minimum height. Only one primary button should dominate a card or form step.

### 9.3 Secondary “Grant Consent”

```css
.ks-button--secondary {
  color: #1e3a8a;
  background: #ffffff;
  border-color: #1e3a8a;
}

.ks-button--secondary:hover { color: #172554; background: #eff6ff; border-color: #172554; }
.ks-button--secondary:active { color: #ffffff; background: #172554; }
```

Specification: 10px vertical × 18px horizontal content padding plus 2px border, 8px radius, 700 weight, 16px/24px text, 48px minimum height.

Consent is a meaningful choice. The same screen must show a clearly visible `Not now` or `Continue without sharing` action; it may not hide refusal in a text link, preselect optional scopes, or make Grant Consent visually coercive. If consent is the screen’s single next action, the outlined treatment remains intentional and trustworthy.

### 9.4 Focus, disabled, loading, and error states

```css
.ks-button:focus-visible,
.ks-disclosure:focus-visible,
.ks-link:focus-visible {
  outline: var(--ks-focus-outline);
  outline-offset: var(--ks-focus-offset);
}

.ks-button:disabled,
.ks-button[aria-disabled="true"] {
  color: #475569;
  background: #e2e8f0;
  border-color: #cbd5e1;
  cursor: not-allowed;
  opacity: 1;
}
```

- Loading preserves button width, displays a labelled spinner, sets `aria-busy="true"`, and prevents duplicate activation.
- Do not remove focus outlines.
- Disabled controls need a nearby explanation if the reason is not evident.
- Error handling belongs in an error summary and near the relevant field; do not turn the button red.

## 10. Progressive-disclosure Data Card

### 10.1 Purpose

A Data Card answers one farmer question at a time: “How much land is linked?”, “Is my bank ready?”, or “What crop is recorded?” It does not reproduce a database table.

### 10.2 Structure

```text
┌────────────────────────────────────┐
│ [icon] MY LAND              READY │  eyebrow/status
│ 0.675 hectares                    │  one primary value
│ Your verified share across 1 plot │  plain summary
│                                    │
│ [Show plot and ownership details] │  48px disclosure target
├────────────────────────────────────┤
│ Expanded detail on #F8FAFC         │  hidden initially
│ Survey 123/1A • Share 1/2          │
│ Source: Mock Mahabhumi • 20 Aug    │
└────────────────────────────────────┘
```

Semantic anatomy:

```html
<article class="ks-data-card" aria-labelledby="land-card-title">
  <header class="ks-data-card__header">
    <div>
      <p class="ks-data-card__eyebrow">My land</p>
      <h2 id="land-card-title" class="ks-data-card__title">Linked cultivable area</h2>
    </div>
    <span class="ks-status" data-status="success">Ready</span>
  </header>
  <p class="ks-data-card__value">0.675 <span>hectares</span></p>
  <p class="ks-data-card__summary">Your verified half-share across one fictional plot.</p>
  <button class="ks-disclosure" aria-expanded="false" aria-controls="land-card-details">
    Show plot and ownership details
  </button>
  <div id="land-card-details" class="ks-data-card__details" hidden>…</div>
</article>
```

### 10.3 Exact styling

- Card background: `#FFFFFF`; page canvas: `#F8FAFC`.
- Border: 1px `#CBD5E1`; radius: 12px; shadow: one subtle `0 1px 2px` shadow.
- Outer padding: 16px mobile, 20px at ≥768px.
- Header gap: 12px; value margin-top: 16px; summary margin-top: 4px.
- Eyebrow: 12px/18px, 700, uppercase only in English, Civic Blue.
- Card title: 18px/27px, 700, high-contrast text.
- Primary value: 24px/36px, 700; unit remains 16px/24px to prevent visual noise.
- Summary: 16px/24px, regular; maximum about 80 characters.
- Disclosure button: full-width on mobile, minimum 48px high, text plus chevron; `aria-expanded` controls details.
- Expanded detail region: `#F8FAFC`, 16px padding, 1px top border, −16px side/bottom margin so it reaches the card edges, rounded lower corners.
- Show no more than three summary facts before disclosure. Move source IDs, timestamps, technical codes, and joint-owner detail into the expanded region.

### 10.4 Status styling

Status pills include visible text and a leading icon. Use `Ready`, `Needs action`, `Unavailable`, or `Mock result`; never show colour alone.

```css
.ks-status[data-status="success"] {
  color: #166534;
  background: #f0fdf4;
  border-color: #86efac;
}

.ks-status[data-status="error"] {
  color: #991b1b;
  background: #fef2f2;
  border-color: #fecaca;
}
```

Dynamic changes use a polite live region. Critical form submission errors move focus to the error-summary heading instead of relying on the card status.

## 11. Forms, navigation, and content rules

- Every screen has one descriptive `<h1>`; heading levels do not skip.
- Every input has a persistent visible `<label>`, helper text before errors, and an error linked with `aria-describedby`.
- Error summary appears above the form, receives focus after failed submit, and links to each invalid field.
- Do not use placeholder text as a label.
- Use digit grouping for synthetic Farmer IDs, but store them as strings.
- Mobile bottom-navigation targets are at least 48px high and combine icon with text.
- Links are underlined in body copy. Navigation links may use a persistent selected indicator plus `aria-current="page"`.
- Write the action from the farmer’s perspective: `Apply now`, `Review shared data`, `Show land details`, `Withdraw consent`.
- Translate administrative codes into plain English, Marathi, Hindi, and Kannada; preserve the code under a `Technical details` disclosure.
- Never animate marquees, auto-rotate carousels, or rely on motion. Honour `prefers-reduced-motion`.

## 12. Responsive behavior

| Width | Behavior |
|---|---|
| 320–479px | single column; 16px page gutters; full-width main buttons; compact header; utility items collapse into labelled menu |
| 480–767px | single column; maximum 560px form/card width; paired secondary actions may share a row if each remains ≥44px |
| 768–1023px | two-column card grid when cards remain ≥320px; 24px gutters |
| ≥1024px | 240px side navigation plus content grid; maximum content width 1200px |

No horizontal page scrolling at 320px. At 200% zoom, content reflows rather than clipping. Do not prevent browser pinch zoom.

## 13. Accessibility acceptance checklist

- Body text is 16px/24px; legal/motto is never below 12px/18px.
- Noto Sans and Noto Sans Devanagari are loaded locally with `swap` and tested for matra clipping.
- All operable targets are at least 44×44px; primary actions are 48px high.
- Keyboard order matches visual order; no positive `tabindex`.
- Visible focus uses a 3px high-contrast outline with 3px offset.
- Normal text contrast is ≥4.5:1; large text and component boundaries meet the applicable 3:1 threshold.
- Meaning is never colour-only; status includes icon and text.
- Each route has one `<h1>` and sequential section headings.
- Cards use `<article>`, data uses appropriate lists/descriptions, and disclosure exposes `aria-expanded`/`aria-controls`.
- Touch and pointer actions are triggered on release/click, not touch-down only.
- Text supports 200% zoom and user-selected line/text spacing without loss of content or function.
- Automated axe checks report no serious/critical issues; manual keyboard and screen-reader passes cover the main journey.
- The final product says “aligned to UX4G/GIGW” unless a formal audit/certification supports the word “compliant.”

## 14. Brand guidelines summary

**Noto Sans**, **Noto Sans Devanagari**, and **Noto Sans Kannada** create a neutral, highly legible multilingual voice across English, Marathi, Hindi, Kannada, and Sanskrit. The explicit 16px body and 1.5 line-height baseline make the service readable on low-cost screens and under zoom. English is the configurable default; the language selector and routing consume the same locale registry rather than hardcoded lists.

**Civic Blue `#1E3A8A`** carries the authority and continuity expected from public-service infrastructure without copying an existing ministry identity. **Agri Green `#166534`** is deliberately limited to primary action and agricultural meaning, so status and navigation remain unambiguous.

The motto **अन्नदः सर्वदश्चैव** honours the farmer in a quiet 12px supporting role. It adds cultural depth without becoming ornamental clutter or implying product endorsement. Keeping it as live text preserves correct Devanagari rendering and accessibility.

The bridge/data-node/leaf mark makes the infrastructure promise visible: KrishiSetu connects systems, carries verified information, and serves agriculture. Its flat two-colour geometry remains credible at mobile-header size and avoids startup-style spectacle.

The result is production-shaped, not production-certified: semantic structure, plain language, predictable components, high contrast, adequate targets, honest prototype disclosure, and an authorization-safe header make the design suitable for rigorous implementation and testing.

## 15. Authoritative references

- [UX4G Design System 3.0](https://www.ux4g.gov.in/)
- [UX4G foundations](https://www.ux4g.gov.in/foundations?lang=en)
- [UX4G typography](https://doc.ux4g.gov.in/content/typography.php)
- [UX4G buttons](https://doc.ux4g.gov.in/components/buttons.php)
- [GIGW 3.0 scope and objective](https://guidelines.india.gov.in/scope-and-objective/)
- [GIGW 3.0 accessibility focus](https://guidelines.india.gov.in/focus-areas/)
- [GIGW semantic markup guidance](https://guidelines.india.gov.in/using-semantically-correct-markup/)
- [Ministry of Home Affairs: State Emblem rules](https://www.mha.gov.in/sites/default/files/EmblemRules2007_12022019.pdf)
- [Ministry of Home Affairs: complete and authorized State Emblem use](https://www.mha.gov.in/sites/default/files/EmblemEnglish_12012017_2.pdf)
- [PIB: Sanskrit Subhashitam on agriculture and farmers](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2253609&lang=1&reg=3)
- [Build What Moves India builder brief](https://buildwhatmovesindia.com/brief)
