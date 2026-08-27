# KrishiSetu Public Landing Page
## Phase 0 Decision Record, Google Flow Prompt, and Gemini 3.7 Flash High Handoff

**Decision date:** 2026-08-25  
**Decision owner:** KrishiSetu hackathon team  
**Status:** Phase 0 decisions locked; hero source asset selected; Phase 3 web derivatives, integration, and visual QA completed  
**Downstream implementer:** Gemini 3.7 Flash High  
**Related strategy:** `docs/implementation/KRISHISETU-PUBLIC-LANDING-PAGE-PLAN.md`

---

## 1. Purpose of this document

This is the single implementation handoff for the new KrishiSetu public landing page. It fixes the Phase 0 product, content, interaction, data, asset, and route decisions so later phases can be implemented without reopening design questions.

Gemini 3.7 Flash High should treat the decisions marked **LOCKED** as requirements. It may make small code-level decisions that preserve these requirements, but it must not replace the information hierarchy, change the access boundary, invent official/live data, introduce restricted government branding, or add unapproved sections.

---

## 2. Phase 0 completion decision

### 2.1 Completed decisions

- **LOCKED:** Public landing page replaces login as `/{locale}`.
- **LOCKED:** Existing login moves to `/{locale}/login`.
- **LOCKED:** Hero uses a realistic, restrained farming video on desktop with a static-poster fallback.
- **LOCKED:** The public page provides notices, weather, market prices, advisories, scheme discovery, and agriculture updates without login.
- **LOCKED:** Personalised eligibility, applications, credit, land data, application status, and farmer-specific content remain protected by login and consent.
- **LOCKED:** English, Marathi, Hindi, and Kannada remain supported.
- **LOCKED:** All landing-page operational values are deterministic synthetic fixtures for the hackathon and are visibly labelled.
- **LOCKED:** No government emblem, Ashoka Chakra, flag treatment, ministry seal, official badge, or endorsement language may be added.
- **LOCKED:** No marquee, auto-scrolling ticker, auto-rotating carousel, parallax effect, or audio autoplay.

### 2.2 Selected hero source asset — LOCKED

Use this supplied video as the landing-page hero source asset:

`apps/web/public/media/public-home/krishisetu-hero-source.mp4`

It is the required source for the public landing-page hero. Gemini must not generate, download, substitute, or select another hero video unless the team explicitly changes this decision.

### 2.3 Hero media completion

The supplied video was reviewed against Section 11.5, approved for the hackathon hero, converted to an audio-free MP4 derivative, and paired with desktop/mobile AVIF and WebP poster assets. Runtime resilience and the completed provenance record are documented in Sections 11.8 and 13. A WebM copy was not created because no WebM encoder is part of the repository toolchain; the compact H.264 MP4 is the production runtime source and the poster remains the universal fallback.

---

## 3. Product promise and audience

### 3.1 Primary audience

Small and marginal farmers using mobile phones, initially represented by the existing Pune/Haveli synthetic demo context.

### 3.2 Secondary audiences

- CSC and field-service workers helping farmers;
- government/public-service stakeholders evaluating the concept;
- hackathon judges assessing innovation, usability, accessibility, and implementation quality.

### 3.3 Product promise — LOCKED

> **One trusted place to know what matters, find support, and take the next step.**

### 3.4 Experience principle — LOCKED

> **Public value first. Personalisation after consent.**

The page must be visually impressive in the first viewport and practically useful in the next viewport. It must not behave like a promotional microsite that forces login before showing useful information.

---

## 4. Visual direction — LOCKED

The creative direction is **cinematic agriculture + accountable civic service**.

### Use

- realistic Maharashtra farming landscape during the monsoon season;
- calm, human-scale footage rather than spectacular drone-only footage;
- Civic Blue and Agri Green from the existing design tokens;
- clean white information surfaces below the hero;
- restrained warm wheat/soil accent only after contrast testing;
- strong typography, large touch targets, generous spacing, subtle borders, and low shadows;
- familiar agricultural imagery: healthy crops, soil, irrigation, field inspection, distant low hills.

### Avoid

- glossy startup gradients, neon green, glassmorphism behind data, AI sparkles, or futuristic holograms;
- close-up generated faces, posed advertising smiles, ceremonial imagery, or poverty/distress imagery;
- tractors or technology as the sole idea of modern farming;
- drone shots that make the farmer feel small or irrelevant;
- rapid cuts, camera shake, flashing highlights, time-lapse, slow-motion particles, or excessive lens flare;
- national symbols, political figures, government offices, branded clothing, logos, readable documents, or number plates.

### Existing brand requirements

- Civic Blue: `#1E3A8A`
- Civic Blue dark: `#172554`
- Agri Green: `#166534`
- Agri Green dark: `#14532D`
- Page surface: `#F8FAFC`
- Card surface: `#FFFFFF`
- Text: `#0F172A`
- Muted text: `#475569`
- Border: `#CBD5E1`
- Typography: existing Noto family setup for Latin, Devanagari, and Kannada scripts

Do not create a separate visual language for the landing page. It must lead naturally into the existing login, consent, and dashboard experience.

---

## 5. Page information architecture — LOCKED

Use this exact order:

1. Public header
2. Full-bleed hero video/poster
3. Important public alert band
4. Today's farmer snapshot
5. Explore public services
6. Market watch
7. Featured schemes and deadlines
8. Public notices and agriculture updates
9. How KrishiSetu works
10. Privacy and trust panel
11. Final farmer-login call to action
12. Public footer with prototype disclosure

The page must not add testimonials, fabricated impact statistics, partner-logo walls, app-store badges, donation prompts, chatbots, or newsletter forms.

---

## 6. Header and navigation decisions

### 6.1 Prototype disclosure — UPDATED 2026-08-25

Keep the existing translated disclosure in the public footer:

`Hackathon prototype • Not a government website`

It must not appear as a bar above the header. It remains part of the page footer, is not baked into the video, and is available in every supported locale.

### 6.2 Desktop header — LOCKED

Left:

- existing KrishiSetu brand mark;
- canonical name `KrishiSetu`;
- existing motto treatment.

Centre navigation:

- `Home`
- `Services`
- `Market`
- `Schemes`
- `Notices`

Right:

- language selector;
- primary button `Farmer Login`.

### 6.3 Header behaviour

- Overlay the hero using a dark translucent or transparent treatment only if every header item maintains AA contrast.
- Change to a solid white surface with border/shadow after the hero begins scrolling away.
- If reliable contrast across the video cannot be guaranteed, use a solid white header from first paint. Accessibility wins over transparency.
- On mobile, use brand + language + login/menu without shrinking controls below 44px.
- Include a keyboard-visible `Skip to main content` link.

### 6.4 Anchor mapping

| Label | Destination |
|---|---|
| Home | Page top |
| Services | `#services` |
| Market | `#market` |
| Schemes | `#schemes` |
| Notices | `#notices` |
| Farmer Login | `/{locale}/login` |

Do not add a header item whose destination is not implemented.

---

## 7. Canonical English copy deck — LOCKED

English is the canonical source copy. Gemini must create matching message keys in all four locale catalogs. Marathi, Hindi, and Kannada drafts must be complete and natural, but should be flagged for human language review before final presentation.

### 7.1 Hero

**Eyebrow**  
`Public agricultural information • No login required`

**H1**  
`From field to opportunity, one bridge for every farmer.`

**Supporting text**  
`Discover schemes, mandi prices, weather advisories and public updates in one place. Sign in only when you are ready for personalised eligibility and applications.`

**Primary CTA**  
`Explore public services`

**Primary destination**  
`#services`

**Secondary CTA**  
`Farmer login`

**Secondary destination**  
`/{locale}/login`

**Video control labels**  
`Pause background video` / `Play background video`

### 7.2 Public alert band

**Label**  
`Important update`

**Title**  
`Solar pump subsidy applications close on 31 August 2026`

**Metadata**  
`Synthetic demo notice • Updated 25 August 2026`

**Action**  
`View notice`

If no public notice detail route is implemented in the current phase, the action must focus/open an accessible landing-page notice detail panel. It must not link to an authenticated or dead route.

### 7.3 Today's farmer snapshot

**Section title**  
`What matters today`

**Section description**  
`A quick public snapshot for Pune district using synthetic demonstration data.`

Card labels:

1. `Weather in Haveli`
2. `Pune market snapshot`
3. `Today's crop advisory`
4. `Open scheme windows`

### 7.4 Explore public services

**Section title**  
`Explore farmer services`

**Section description**  
`Find useful public information first. Sign in only for services that need your farm profile.`

Cards:

| Title | Description | Destination |
|---|---|---|
| Find schemes | Browse support for irrigation, machinery and crop credit. | `#schemes` |
| Check mandi prices | Compare synthetic market prices and daily movement. | `#market` |
| View weather | See district conditions, rainfall and warnings. | Snapshot weather card/detail panel |
| Read crop advisories | Get concise seasonal actions for field decisions. | Snapshot advisory/detail panel |
| Read public notices | Follow deadlines, revised forms and service updates. | `#notices` |
| Get help | Understand public browsing, login and consent. | `#how-it-works` |

### 7.5 Market watch

**Section title**  
`Market watch`

**Section description**  
`Compare selected commodities at Pune Market Yard.`

**Required disclaimer**  
`Synthetic demonstration prices • Not live Agmarknet or eNAM data`

**Freshness**  
`As of 25 August 2026, 9:00 AM IST`

**Action**  
`View market details`

For the MVP this action may open an accessible detail panel containing all fixture rows. Do not create an empty page.

### 7.6 Featured schemes

**Section title**  
`Schemes and support`

**Section description**  
`Understand available support publicly, then sign in to check eligibility for your farm.`

Public action: `View details`  
Protected action: `Check my eligibility`

The protected action must go to `/{locale}/login?returnTo=/{locale}/schemes/{schemeCode}` using a validated same-origin internal path, or to `/login` without `returnTo` if safe return handling is not implemented.

### 7.7 Notices and agriculture updates

**Notices title**  
`Public notices`

**Notices description**  
`Deadlines, revised forms and service information that may require action.`

**Updates title**  
`Agriculture updates`

**Updates description**  
`Practical demonstration articles for seasonal awareness and market readiness.`

Use `Agriculture updates`, not `Latest government news`, because the MVP content is synthetic/editorial and must not appear official.

### 7.8 How it works

**Section title**  
`Public information first. Personalised support when you choose.`

Steps:

1. `Discover` — `Browse notices, markets, weather and schemes without login.`
2. `Sign in` — `Use a fictional farmer identity in this hackathon prototype.`
3. `Give consent` — `Choose the purposes for which your demonstration data may be used.`
4. `Act and track` — `Check eligibility, apply and follow application progress.`

### 7.9 Trust panel

**Title**  
`Designed around farmer choice and privacy`

Points:

- `Public browsing does not require personal data.`
- `Personalised services begin only after login and purpose-specific consent.`
- `All people, records, prices and operational values in this prototype are fictional.`
- `Core journeys support English, Marathi, Hindi and Kannada.`

### 7.10 Final CTA

**Title**  
`Ready for services matched to your farm?`

**Description**  
`Sign in to check personalised eligibility, prepare applications and track progress.`

**Primary action**  
`Farmer login` -> `/{locale}/login`

**Secondary action**  
`Browse schemes` -> `#schemes`

---

## 8. Synthetic landing data — LOCKED

All values in this section are fictional, deterministic, and for demonstration only. The UI must not label them `Live`, `Official`, `Real-time`, `Verified by government`, or equivalent.

### 8.1 Public provenance

```ts
{
  mode: 'SYNTHETIC',
  updatedAt: '2026-08-25T03:30:00.000Z',
  displayUpdatedAt: '25 August 2026, 9:00 AM IST',
  labelKey: 'publicHome.syntheticDataLabel'
}
```

Canonical label:

`Synthetic demonstration data • Not a live government feed`

### 8.2 Weather snapshot

```ts
{
  districtId: 'pune',
  districtLabel: 'Pune',
  talukaLabel: 'Haveli',
  temperatureCelsius: 27,
  condition: 'Moderate rain',
  rainfallProbabilityPercent: 68,
  rainfallMm24h: 14.2,
  relativeHumidityPercent: 82,
  windSpeedKmh: 18.5,
  warning: 'Yellow rainfall watch',
  sourceLabel: 'Mock Agromet adapter',
  prototypeData: true
}
```

### 8.3 Crop advisory

Title:

`Pause spraying during rain and inspect low-lying plots`

Summary:

`Delay foliar spraying until a dry window. Check soybean and pigeon-pea plots for standing water and clear blocked drainage channels.`

Validity:

`Valid through 26 August 2026`

Source:

`Synthetic agromet advisory`

### 8.4 Market selector defaults

- District: `Pune`
- Market: `Pune Market Yard (demo)`
- Commodity: `All commodities`
- Unit: `₹ per quintal`

### 8.5 Market rows

| Commodity | Modal price | Change | Direction label | Arrival |
|---|---:|---:|---|---:|
| Soybean | ₹4,650/q | +1.8% | Up | 124 q |
| Onion | ₹2,250/q | -2.3% | Down | 340 q |
| Tomato | ₹1,800/q | +4.2% | Up | 95 q |
| Pigeon pea | ₹7,450/q | +0.7% | Up | 76 q |

Direction must use icon/arrow, signed value, and text. Never rely on green/red alone.

### 8.6 Featured schemes

Reuse the existing synthetic scheme catalog rather than creating duplicate scheme identities:

1. `offering_drip_2026`
   - Public title from `schemes.dripTitle`
   - Benefit: `Up to 80% synthetic subsidy illustration`
   - Audience: `Small and marginal farmers`
   - State: `Open until 30 September 2026`

2. `offering_rotavator_2026`
   - Public title from `schemes.rotavatorTitle`
   - Benefit: `Up to 50% synthetic subsidy illustration`
   - Audience: `Farmers seeking machinery support`
   - State: `Open`

3. `offering_kcc_2026`
   - Public title from `credit.cardTitle`
   - Benefit: `Synthetic crop-credit illustration`
   - Audience: `Eligible cultivators after consent-based checks`
   - State: `Available for eligibility check`

Do not display the existing personalised estimated rupee benefit on the public landing page. Those values depend on farmer context and belong behind login/consent.

### 8.7 Public notices

Reuse the existing notification fixture identities and translations where possible:

1. `notice-2026-002` — solar pump deadline — critical
2. `notice-2026-001` — drip irrigation window — high
3. `notice-2026-003` — revised self-declaration form — normal

The landing-page alert uses `notice-2026-002`. Do not expose authenticated application actions directly. On the public page, `Apply now` becomes `View notice`; the detail can explain that login is required to apply.

### 8.8 Agriculture updates

These are synthetic editorial cards, not official news:

1. **Title:** `Preparing soybean fields after heavy rainfall`  
   **Date:** `24 August 2026`  
   **Category:** `Seasonal guidance`  
   **Summary:** `Simple drainage and field-inspection steps to reduce waterlogging risk.`

2. **Title:** `Five questions to ask before choosing a mandi`  
   **Date:** `23 August 2026`  
   **Category:** `Market readiness`  
   **Summary:** `Compare modal price, transport cost, arrivals, quality rules and payment timing.`

3. **Title:** `How farmer producer organisations can improve market access`  
   **Date:** `21 August 2026`  
   **Category:** `Farmer collectives`  
   **Summary:** `A short introduction to aggregation, negotiation and shared logistics.`

Each card must show `Synthetic editorial content` as its source label.

---

## 9. Public/private access boundary — LOCKED

### Public without login

- landing page;
- synthetic public alert and notice summaries;
- synthetic weather and crop advisory summaries;
- synthetic mandi-price comparison;
- scheme titles, summaries, audience, general benefits, and public deadlines;
- agriculture update cards;
- help, privacy explanation, accessibility, and language switching.

### Login + consent required

- farmer profile and identifiers;
- land records and crop registry records;
- saved preferences derived from a farmer identity;
- personalised scheme eligibility or estimated benefit;
- credit pre-qualification or estimates;
- starting/submitting an application;
- application status and receipts;
- personal notification centre;
- consent history and withdrawal.

No public landing fixture or view model may contain a farmer ID, ULPIN, survey number, bank detail, application ID, credit amount, or consent record.

---

## 10. Route decisions and required flow

### 10.1 Required routes

| Route | Access | Decision |
|---|---|---|
| `/` | Public redirect | Continue redirecting to the default locale |
| `/{locale}` | Public | New landing page |
| `/{locale}/login` | Public | Existing `LoginView` moved here |
| `/{locale}/consent` | Session required | Existing flow retained |
| `/{locale}/dashboard` | Login + consent | Existing flow retained |

Do not add separate public market/news/notices routes in the first implementation unless all content, localisation, tests, and navigation destinations are completed. Landing-page detail panels are acceptable for Phase 2 and reduce scope.

### 10.2 Required journey

```text
/{locale}
  -> public browsing
  -> /{locale}/login
  -> /{locale}/consent
  -> /{locale}/dashboard
```

Logout destination:

`/{locale}`

Unauthorised protected-route action:

`Go to farmer login` -> `/{locale}/login`

Brand link while unauthenticated:

`/{locale}`

Brand link while authenticated:

`/{locale}/dashboard`

### 10.3 Return-to safety

If `returnTo` is implemented:

- allow only a relative path beginning with the active `/{locale}/` prefix;
- reject protocols, hosts, `//`, backslashes, encoded host tricks, and unsupported routes;
- fall back to `/{locale}/consent` after login;
- never allow an external redirect.

If this validation cannot be implemented and tested within the phase, omit `returnTo` completely.

---

## 11. Hero media specification — LOCKED

### 11.1 Story and composition

The approved concept is a single calm observational shot in a realistic western Maharashtra field shortly after monsoon rain.

- An adult Indian farmer inspects healthy soybean/pigeon-pea leaves.
- The farmer remains in the right third of the frame.
- The left half contains calm darker foliage/negative space for the hero text.
- Low hills, soft clouds, wet leaves, and subtle field movement create depth.
- The camera makes a very slow stable forward glide at human height.
- There is no dialogue, narration, music, lip movement, or readable text.
- The final frame should be visually close enough to the opening frame for a gentle website loop.

### 11.2 Google Flow generation settings

Use the current Flow interface as follows:

- Mode: `Video`
- Model: `Veo 3.1 Quality` when available; otherwise `Veo 3.1 Fast`
- Input: `Text to Video`
- Aspect ratio: `16:9`
- Duration: `8 seconds`
- Outputs: `2` candidates per generation
- Audio: no dialogue, narration, music, or designed sound is required; final web export must contain no audio track
- Generate at least four candidates across two runs before selection

Google Flow's official guidance recommends specifying subject, action, environment, lighting, and style. Current model capabilities and durations can change, so use the closest available 16:9 quality option if the interface differs.

### 11.3 Copy/paste Google Flow prompt

```text
Create an 8-second, photorealistic cinematic documentary-style video for the hero background of a modern Indian public agricultural services website. One continuous shot in a real-looking western Maharashtra farm during the green monsoon season, early morning just after gentle rain. Healthy soybean and pigeon-pea plants fill the foreground with small natural droplets on the leaves. An adult Indian farmer in simple, practical, unbranded cotton work clothes calmly walks two steps and gently inspects the crop leaves with one hand. Keep the farmer in the right third of the frame, shown mostly in side profile or from behind at medium-wide distance; no close-up face and no posing for camera. Preserve clean, slightly darker visual negative space across the left half of the frame so white website headline text will remain readable there.

Camera: one very slow, stable forward dolly at human eye level, 35mm documentary lens, subtle natural depth of field, no drone movement, no handheld shake, no cuts, no zoom, no parallax effect. Lighting: soft diffused sunrise behind monsoon clouds, natural green and earth colours, gentle highlights on wet leaves, realistic skin and fabric, restrained cinematic dynamic range, no orange-teal grade, no exaggerated lens flare. Environment: neat but authentic smallholder field, narrow soil path, distant low green hills and a few native trees, slight leaf movement in a light breeze, physically accurate plants and hands. Mood: hopeful, calm, dignified, trustworthy and grounded in everyday farming, not an advertisement. The camera movement and farmer action should settle gently near the end, with the final composition visually similar to the opening composition so the clip can loop unobtrusively as a website background.

No text, captions, logos, watermarks added to the scene, flags, government symbols, political figures, religious symbols, branded machinery, branded clothing, buildings, number plates, documents, smartphones, holograms, futuristic interfaces, crowds, children, animals, dialogue, lip movement, music, dramatic weather, heavy rain, lightning, smoke, dust effects, fast motion, slow motion, time-lapse, oversaturated colours, artificial plastic skin, malformed fingers, duplicated plants or people.
```

### 11.4 Optional refinement prompt

If the best candidate is visually good but too bright behind the text, edit/refine it with:

```text
Keep the farmer, field, camera motion and realistic documentary style unchanged. Make only the left 55 percent of the composition naturally calmer and one stop darker using shaded foliage and cloud tone, without adding an artificial vignette or black graphic overlay. Preserve realistic colours and detail. Do not change the farmer's identity, body, clothing, crop type, scene timing or camera path.
```

If the candidate has visible anatomy or plant errors, regenerate it instead of hiding those errors with the website overlay.

### 11.5 Candidate rejection criteria

Reject a candidate if any of these are present:

- malformed hands, limbs, tools, leaves, irrigation pipes, or duplicated people;
- identifiable text/logo/flag/official symbol;
- central subject blocking headline space;
- left side too bright or visually busy for text;
- close-up or uncanny face;
- glamorous fashion styling or staged advertisement behaviour;
- inaccurate crop geometry or impossible field layout;
- rapid camera movement, cuts, visible loop jump, flicker, warping, or exposure pulsing;
- despair, disaster, child labour, unsafe behaviour, or political/religious implication;
- visual treatment that could imply an actual government production.

### 11.6 Selection scorecard

Score every candidate from 1–5:

| Criterion | Weight |
|---|---:|
| Realism and anatomical consistency | 25% |
| Readable left-side text area | 20% |
| Authentic agricultural environment | 15% |
| Calm camera movement and loop potential | 15% |
| Dignified farmer representation | 10% |
| Natural colour and lighting | 10% |
| Absence of restricted/unwanted elements | 5% |

Select only a candidate scoring at least 4/5 in realism, text space, and dignity, with no rejection criterion triggered.

### 11.7 Asset naming and web derivatives

The selected source asset is already stored at:

```text
apps/web/public/media/public-home/krishisetu-hero-source.mp4
```

Keep this file as the immutable source. Create these web derivatives from it:

```text
apps/web/public/media/public-home/krishisetu-hero-desktop.webm
apps/web/public/media/public-home/krishisetu-hero-desktop.mp4
apps/web/public/media/public-home/krishisetu-hero-poster.avif
apps/web/public/media/public-home/krishisetu-hero-poster.webp
apps/web/public/media/public-home/krishisetu-hero-poster-mobile.avif
```

Requirements:

- remove the audio track from both video exports;
- poster should be an approved clean frame with the farmer on the right;
- do not bake the dark website overlay or text into the media;
- use CSS for the overlay so contrast can be tuned responsively;
- preserve the AI-generation metadata/provenance and do not attempt to remove SynthID;
- record generation date, tool/model, prompt version, selected candidate, human reviewer, and modification/export steps in Section 13.

### 11.8 Runtime media behaviour

- Hero text, buttons, poster, and layout render without waiting for video JavaScript or download.
- Video is decorative and must not carry unique information.
- Video uses `muted`, `playsInline`, `loop`, and an appropriate preload strategy.
- Do not autoplay if `prefers-reduced-motion: reduce` matches.
- Prefer poster-only on mobile/data-saver/reduced-motion where feasible.
- Provide a visible keyboard-operable pause/play button with an accessible name.
- Remember pause only for the current visit; do not require storage.
- On playback or media error, keep the poster and hide/disable the video control gracefully.
- Overlay and text must meet contrast requirements on the lightest and darkest frames.

---

## 12. Component and file handoff for Gemini 3.7 Flash High

### 12.1 Target feature structure

```text
apps/web/src/features/public-home/
  PublicHomeView.tsx
  PublicHomeView.module.css
  public-home.types.ts
  public-home.fixture.ts
  index.ts
  components/
    PublicHero.tsx
    PublicAlertBand.tsx
    FarmerSnapshot.tsx
    PublicServiceGrid.tsx
    MarketWatch.tsx
    FeaturedSchemes.tsx
    NoticesAndUpdates.tsx
    HowItWorks.tsx
    PublicTrustPanel.tsx
```

Gemini may merge very small components when that materially improves clarity, but `PublicHero`, `MarketWatch`, and the landing view model/fixture must remain independently testable.

### 12.2 Route changes

1. Create `apps/web/app/[locale]/login/page.tsx` using the existing login route behaviour.
2. Replace `apps/web/app/[locale]/page.tsx` content with the public landing view.
3. Update `AppShell` to recognise landing, login, consent, and authenticated modes without changing protected navigation behaviour.
4. Update `AccessRequiredView` navigation to login.
5. Update route architecture tests for `/[locale]/login`.
6. Preserve root default-locale redirect.

### 12.3 Localisation structure

Add `publicHome.json` under:

```text
packages/i18n/messages/en/publicHome.json
packages/i18n/messages/mr/publicHome.json
packages/i18n/messages/hi/publicHome.json
packages/i18n/messages/kn/publicHome.json
```

Then run existing code generation and locale-completeness checks. Do not embed visible English strings in landing components. Data that is intentionally numeric may remain in the typed fixture, while labels, units, dates, categories, conditions, warnings, CTA copy, accessibility names, and empty/error states use message keys or locale-aware formatting.

### 12.4 Styling rules

- Use `PublicHomeView.module.css`; do not add another page-sized inline style block.
- Reuse existing design tokens and design-system buttons/status elements when their semantics fit.
- Keep landing-specific media composition and layouts in the landing feature.
- Add design-system primitives only if at least two product features genuinely need them.
- Use fluid grid/reflow rather than device-specific duplicated markup.
- Verify at 320px, 375px, 768px, 1024px, 1440px, and 200% zoom.

### 12.5 No-dead-destination rule

Every visible link/button must do one of the following:

- navigate to an implemented route;
- scroll to an implemented section;
- open a complete accessible detail panel/dialog;
- trigger the working language or video control.

Do not use `href="#"`, `javascript:`, empty click handlers, disabled-looking active buttons, or placeholder `Coming soon` CTAs in the final hackathon page.

---

## 13. Media provenance record template

Complete this table after generating and selecting the video. Do not create a second provenance document for the hero asset.

| Field | Required value |
|---|---|
| Asset purpose | Public landing hero background |
| Selected source asset | `apps/web/public/media/public-home/krishisetu-hero-source.mp4` |
| Generation tool | Google Flow; source supplied and selected by the user |
| Model | Not recorded in the supplied asset handoff |
| Generation date | Not recorded; repository asset received 2026-08-25 |
| Prompt | Section 11.3; no additional refinement prompt was recorded |
| Candidate/run ID | Not recorded in the supplied asset handoff |
| Selected by | KrishiSetu hackathon team |
| Human review | Passed for realism, dignity, anatomy, unbranded clothing, left-side text space, calm motion, and safety. The small source-origin provenance marker remains visible and was not removed. |
| Source export | Original handoff filename `hero-video-asset.mp4`; MP4/H.264 + AAC; 1280×720; 8.000 seconds; 2,014,901 bytes; SHA-256 `f63f0473c3eeb6d4e6ea5424599e3409bee6339ed0bec1fd6a580693c07ac19e` |
| Web transforms | Apple AVFoundation passthrough export retained the H.264 video track, removed the audio track, and enabled network optimization. A clean frame at 0.25 seconds was extracted with AVFoundation/ImageIO. Sharp produced 1280×720 AVIF/WebP posters and a 540×720 mobile AVIF crop. WebM was omitted because the repository has no WebM encoder; MP4 plus poster fallback is used. |
| Audio | Confirmed removed from `krishisetu-hero-desktop.mp4` (one video track, zero audio tracks) |
| SynthID/provenance | Preserved/not intentionally removed; no attempt was made to erase source provenance metadata or the visible source-origin marker |
| Runtime paths | `apps/web/public/media/public-home/krishisetu-hero-desktop.mp4`; `krishisetu-hero-poster.avif`; `krishisetu-hero-poster.webp`; `krishisetu-hero-poster-mobile.avif` in the same directory |
| Approval status | `APPROVED` for hackathon hero use; user-selected and visually re-verified 2026-08-25 |

---

## 14. Implementation phases assigned to Gemini

### Phase 1 — Route and shell foundation

- move login to `/{locale}/login`;
- establish public-home route;
- update shell modes, home links, logout/access-required flow, and route tests;
- keep login -> consent -> dashboard behaviour working.

### Phase 2 — Public landing MVP

- implement all sections in Section 5;
- add the locked fixtures in Section 8;
- add all four locale catalogs;
- ensure every CTA has a real destination;
- implement responsive layout and accessible detail panels where routes are intentionally deferred.

### Phase 3 — Media and resilience

- integrate the human-approved hero assets only after the provenance record is complete;
- implement pause/play, reduced-motion, poster fallback, and error behaviour;
- add widget unavailable/stale states without changing the locked content hierarchy;
- tune responsive presentation without adding decorative features.

### Phase 4 — Verification

- run code generation, typecheck, build, unit tests, route architecture tests, locale-completeness tests, and smoke tests;
- keyboard-test all controls and detail panels;
- verify screen-reader landmarks, headings, names, focus return, and status messaging;
- test reduced motion, video failure, slow network, 320px reflow, and 200% zoom;
- produce a concise evidence record listing commands, results, and any accepted limitations.

---

## 15. Definition of done for Gemini handoff

Gemini must not report completion until all applicable items pass:

### Routing and journey

- `/{locale}` shows the public landing page.
- `/{locale}/login` shows the existing login experience.
- Login continues to consent and then dashboard.
- Logout returns to public home.
- Protected routes offer a working path to login.
- All behaviour works for `en`, `mr`, `hi`, and `kn`.

### Content and data

- Canonical copy and section order match this document.
- Every operational value is labelled as synthetic.
- Public scheme cards do not expose personalised estimates.
- Public view models contain no farmer/private data.
- Notices and agriculture updates remain visibly distinct.
- Every visible CTA works.

### Hero media

- Page works with only the poster.
- Page works when video fails.
- Reduced-motion prevents autoplay.
- Pause/play is visible, named, keyboard operable, and accurately reflects state.
- No audio track plays or downloads as audio content.
- Text contrast is checked across the video.

### Accessibility and quality

- One logical H1 and sequential headings.
- Correct header/nav/main/section/article/footer semantics.
- Visible focus and no keyboard trap.
- No colour-only status meaning.
- No horizontal page overflow at 320px.
- Locale completeness, typecheck, build, and relevant tests pass.
- Existing authenticated pages are not visually or functionally regressed.

---

## 16. Escalation points for a more powerful model or human reviewer

Gemini should stop and request review rather than make an arbitrary decision when:

- choosing the final Google Flow candidate;
- changing hero art direction, canonical copy, page order, or public/private boundary;
- introducing a new live external data source or API;
- making an accessibility trade-off involving motion, contrast, focus, or semantic meaning;
- deciding whether translated Marathi, Hindi, or Kannada copy is linguistically presentation-ready;
- changing consent/security behaviour or implementing redirect validation beyond the stated pattern;
- resolving a regression that requires altering existing architecture or privacy invariants.

Routine implementation, CSS refinement within the locked direction, fixture wiring, test updates, mechanical localisation integration, and ordinary bug fixes do not require escalation.

---

## 17. Official references used for this decision

- Google Flow — create videos and prompting guidance: <https://support.google.com/flow/answer/16353334?hl=en>
- Google Flow — current models and supported features: <https://support.google.com/flow/answer/16352836?hl=en>
- Google Flow — editing, extension, and Scenebuilder: <https://support.google.com/flow/answer/16935718?hl=en>
- Google Flow — getting started and SynthID disclosure: <https://support.google.com/flow/answer/16353333?hl=en>
- Google Flow filmmaking tips: <https://blog.google/innovation-and-ai/products/flow-video-tips/>
- UX4G accessibility foundations: <https://www.ux4g.gov.in/foundations/accessibility>
- UX4G public-service patterns: <https://www.ux4g.gov.in/patterns>
- GIGW: <https://guidelines.india.gov.in/>
- W3C WCAG 2.2.2, Pause/Stop/Hide: <https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html>
- W3C reduced-motion guidance: <https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html>

---

## 18. Final instruction to Gemini 3.7 Flash High

Implement the landing page from this document in dependency order. Preserve existing user changes and existing KrishiSetu architecture. Begin with read-only inspection and route tests, then complete Phase 1 before Phase 2. Use deterministic fixtures and do not wait for the final video; build poster-first and integrate the approved media in Phase 3. Run validation after every phase. Do not call synthetic content live or official, do not add dead interactions, and do not claim completion while any definition-of-done item is unmet.
