# KrishiSetu Public Landing Page — Research and Implementation Plan

**Date:** 2026-08-25  
**Status:** Proposed for hackathon implementation  
**Product mode:** Non-official prototype using fictional or clearly labelled demonstration data

## 1. Recommended outcome

Replace the current login-first home route with a modern, multilingual public landing page that proves KrishiSetu's value before asking a farmer to sign in.

The page should create an immediate emotional connection through restrained farming footage, then become useful within one scroll: urgent public notices, local weather, mandi prices, schemes, advisories, and agricultural news. Login remains prominent, but it is the gateway to personalised services—not a barrier to public information.

The central experience promise is:

> **One trusted place to know what matters, find support, and take the next step.**

This is more persuasive for hackathon judges than a purely cinematic homepage because it demonstrates both high visual quality and a credible public-service information architecture.

## 2. Research conclusions

### 2.1 What should influence the design

- UX4G recommends mobile-first, consistent navigation, progressive disclosure, multilingual support, and accessibility by default. KrishiSetu should use these as structural principles rather than visually copying an official portal.
- myScheme permits citizens to browse and search schemes without signing in, while login adds saving and personalisation. KrishiSetu should follow the same public-first boundary.
- The National Portal of India groups weather, commodity prices, schemes, and agricultural information as core farmer needs. These should form the landing page's main utility layer.
- Agmarknet/eNAM demonstrate the value of commodity price, arrival, mandi, and price-discovery information. A market snapshot should therefore show meaningful fields—not decorative numbers.
- Moving content that starts automatically and lasts more than five seconds needs a pause/stop/hide mechanism under WCAG 2.2.2. The video must also respect reduced-motion preferences.
- Background video is expensive on weak connections. A poster image and conservative loading strategy are essential; the public page must remain complete and attractive when video never loads.

### 2.2 Design position

Use a full-bleed farming video for the hero, not a full-page video behind every section. Below the first viewport, transition to calm white and warm field-toned surfaces so public information remains readable and credible.

The visual tone should be **cinematic agriculture + accountable civic service**:

- cinematic, human, locally recognisable farming footage;
- clear Civic Blue and Agri Green actions from the existing KrishiSetu system;
- warm crop/soil accents used sparingly;
- strong typography, large touch targets, and generous spacing;
- no glassmorphism over data-heavy sections, neon gradients, auto-rotating carousels, or generic AI/startup imagery.

## 3. Target audiences and their first questions

| Audience | First question | Landing-page answer |
|---|---|---|
| Farmer on a phone | What affects my farm today? | Local weather, alert, mandi price, and advisory in the first two scrolls |
| Farmer seeking support | Which schemes can help me? | Search/browse public schemes; login only for personalised eligibility or applying |
| CSC/field worker | What official update should I communicate? | Searchable notices with priority, date, source, and expiry |
| Hackathon judge | Why is this better than another portal? | A coherent single-window story, multilingual UX, privacy boundary, and working data-rich interactions |
| Department stakeholder | Can this scale safely? | Source labels, update timestamps, public/private separation, adapter-ready data contracts, and accessible behaviour |

## 4. Information architecture and page sequence

```text
Sticky public header
  Brand | Home | Services | Market | Notices | News | Language | Farmer Login

Hero (full-bleed video with dark readable overlay)
  Clear promise + two CTAs + pause/play control + data-saver fallback

Public alert band
  One highest-priority notice; no moving ticker

Today's farmer snapshot
  Weather | Mandi price | Crop advisory | Open scheme windows

Explore services
  Schemes | Market prices | Weather | Advisories | Public notices | Help

Market watch
  District/mandi selector + commodity cards/table + trend + source/as-of

Schemes and deadlines
  Three featured scheme cards + eligibility/apply distinction

Notices and agriculture news
  Action-required notices on the left; informative stories on the right

How KrishiSetu helps
  Discover -> Check eligibility -> Apply once -> Track progress

Trust, privacy, and multilingual access
  Public without login; personal data only after consent

Final login CTA
Footer with help, accessibility, privacy, sources, and prototype disclosure
```

## 5. Detailed section specification

### 5.1 Prototype disclosure and header

Keep the translated **“Hackathon prototype • Not a government website • All records are fictional”** message in the footer rather than a top bar. Do not use the State Emblem, government seals, national symbols, or wording that implies endorsement.

Header behaviour:

- transparent over the hero at the top, becoming a solid high-contrast surface after scroll;
- KrishiSetu brand on the left;
- short anchor navigation on desktop, accessible menu on mobile;
- language selector for English, Marathi, Hindi, and Kannada;
- clearly labelled **Farmer Login** as the only filled header action;
- 44px minimum targets, visible keyboard focus, and a skip-to-content link.

### 5.2 Hero: the memorable hackathon moment

**Recommended visual:** a 12–18 second seamless loop beginning with a wide sunrise/sunset field shot, moving to a farmer inspecting crops or irrigation, and ending on a calm landscape that loops without a visible jump.

Avoid drone-only spectacle, rapid cutting, text baked into footage, distress imagery, recognisable private data, brand logos, or footage that looks unrelated to Indian agriculture.

Suggested copy direction:

- Eyebrow: `Agricultural services, connected`
- H1: `From field to opportunity, one bridge for every farmer.`
- Supporting text: `Discover schemes, mandi prices, weather advisories and public updates—then sign in for personalised eligibility and applications.`
- Primary CTA: `Explore public services`
- Secondary CTA: `Farmer login`

Video requirements:

- muted, inline, looping video with no audio track;
- readable static poster available immediately;
- visible pause/play control adjacent to the hero content;
- `prefers-reduced-motion: reduce` shows the poster and does not autoplay;
- mobile/data-saver mode defaults to poster or an intentionally small encode;
- dark directional overlay tested against every frame, with text contrast meeting WCAG AA;
- video is decorative; the value proposition exists as live HTML and does not depend on the footage.

### 5.3 Public alert band

Show one high-priority notice as a stable alert band immediately below the hero:

`Important update` + concise title + deadline + `View notice`.

Do not use a marquee or continuously moving news ticker. If multiple notices exist, show a count and a **View all notices** link.

### 5.4 Today's farmer snapshot

Use a four-card responsive grid. On mobile it becomes a horizontal snap list only if every card remains keyboard accessible; a stacked layout is the safer default.

Each card answers one question:

1. **Weather:** current condition, high/low, rain probability, district, alert state.
2. **Market:** selected commodity, nearest/demo mandi, modal price, daily direction.
3. **Advisory:** a one-sentence crop action with severity and validity date.
4. **Schemes:** number of open windows and the nearest deadline.

Every value must include a source label and `Updated`/`As of` timestamp. For the hackathon, label fixtures **Synthetic demo data**; do not present invented values as live government data.

### 5.5 Explore services

Use six large icon cards with direct verbs and one-line descriptions:

- Find schemes
- Check mandi prices
- View weather
- Read crop advisories
- Read public notices
- Get help

Public actions remain browsable. Actions involving a saved profile, eligibility decision, application, land record, credit, or status take the user to login and then return them to the intended page.

### 5.6 Market watch

This should be the page's strongest interactive proof point after the hero.

Controls:

- district or location selector;
- mandi selector;
- commodity filter;
- `Last updated` value and data-source label.

Data presentation:

| Commodity | Mandi | Modal price | Unit | Day change | Arrival |
|---|---|---:|---|---:|---:|

Use green/red direction with arrow, text, and sign so colour is never the only cue. Show three to five commodities, followed by **View all market prices**. Do not auto-scroll prices.

### 5.7 Featured schemes and deadlines

Show three cards maximum on the landing page. Each includes:

- scheme name and benefit type;
- one-sentence citizen-language summary;
- eligible audience tags;
- deadline or `Open` state;
- source/update metadata;
- **View details** for public information;
- **Check my eligibility** as the login-gated action.

This makes the public/private boundary visible and understandable.

### 5.8 Notices and news

Do not merge these concepts:

- **Public notices** are authoritative, dated, actionable items such as deadlines, corrigenda, revised forms, and service advisories.
- **Agriculture news** is informational content such as a programme launch, seasonal advisory article, success story, or field innovation.

Desktop layout: two columns with three items each. Mobile layout: two labelled sections, notices first. Each item needs date, category, source, title, concise summary, and destination. Avoid auto-advancing carousels.

### 5.9 How it works and trust

Explain the authenticated journey in four steps:

1. Discover public information without login.
2. Sign in with a farmer identity.
3. Grant purpose-specific consent.
4. Check eligibility, apply, and track progress.

Add a compact trust panel:

- public browsing needs no personal data;
- personalised services require login and consent;
- fictional records only in the prototype;
- preferences and core journeys support four languages.

### 5.10 Footer

Include Help, Accessibility, Privacy, Public Notices, Data Sources, Contact/Feedback, language access, last updated date, and the prototype disclosure. Do not create dead links for the hackathon; hide or label future destinations honestly.

## 6. Visual system

Continue the existing tokens so the landing page feels like the same product:

- Civic Blue `#1E3A8A` for identity, links, and selected public navigation;
- Agri Green `#166534` for primary citizen actions;
- white and `#F8FAFC` for information surfaces;
- a restrained warm field tint (for example pale wheat/soil) only as a new semantic landing accent after contrast testing;
- Noto family typography for all four scripts;
- 16px minimum body copy, strong display type in the hero, and fluid sizing with `clamp()`;
- 12px card radius, subtle borders, and low shadows; elevation should indicate hierarchy, not decorate every object.

Motion should be limited to the hero video, header transition, focus/hover states, and small in-view reveals that disappear entirely under reduced motion.

## 7. Routing and access model

### 7.1 Proposed routes

| Route | Access | Purpose |
|---|---|---|
| `/{locale}` | Public | New landing page |
| `/{locale}/login` | Public | Existing `LoginView` |
| `/{locale}/public/notices` | Public | Public notice index, optional for MVP |
| `/{locale}/public/market` | Public | Market detail, optional for MVP |
| `/{locale}/public/news` | Public | Agriculture news index, optional for MVP |
| `/{locale}/dashboard` and application routes | Authenticated + consent | Existing personalised experience |

For the hackathon MVP, landing-page sections can be complete without adding all three optional indexes. If a destination is not implemented, the card should open an accessible detail panel or link to the relevant official source rather than a dead route.

### 7.2 Required existing-flow changes

- Move the current contents of `apps/web/app/[locale]/page.tsx` to a new `apps/web/app/[locale]/login/page.tsx`.
- Render the new landing page at `apps/web/app/[locale]/page.tsx`.
- After login, retain the existing transition to `/{locale}/consent`.
- Update logout and unauthorised-access actions to send the user to `/{locale}/login`, not home.
- Update `AppShell` auth-route detection to distinguish landing, login, and consent.
- Make the unauthenticated brand link go to the public home page.
- Add `/login` and any selected public routes to route architecture tests and smoke tests.
- Preserve locale while navigating to login and preserve an optional safe internal `returnTo` path.

## 8. Component and data design

### 8.1 Suggested feature structure

```text
apps/web/src/features/public-home/
  PublicHomeView.tsx
  PublicHomeView.module.css
  components/
    PublicHero.tsx
    PublicAlertBand.tsx
    FarmerSnapshot.tsx
    PublicServiceGrid.tsx
    MarketWatch.tsx
    FeaturedSchemes.tsx
    NoticesAndNews.tsx
    HowKrishiSetuWorks.tsx
    PublicTrustPanel.tsx
  fixtures/
    public-home-fixture.ts
  index.ts
```

Use CSS Modules rather than adding another large inline `<style>` block. Extract only genuinely reusable primitives into `packages/design-system`; landing-specific composition belongs in the web feature.

### 8.2 Public view model

Create a single landing view model so fixture data can later be replaced by adapters without redesigning the UI:

```ts
interface PublicHomeViewModel {
  alert: PublicAlertSummary | null;
  weather: PublicWeatherSummary;
  market: readonly PublicMarketQuote[];
  advisory: PublicAdvisorySummary;
  schemes: readonly PublicSchemeSummary[];
  notices: readonly PublicNoticeSummary[];
  news: readonly PublicNewsSummary[];
  provenance: {
    mode: 'SYNTHETIC' | 'LIVE';
    updatedAt: string;
    sources: readonly string[];
  };
}
```

For MVP reliability, use deterministic multilingual fixtures. Keep future source adapters separate for Agmarknet/eNAM market information, IMD/agromet weather and advisories, scheme sources, and PIB/department news. Network failures must degrade each widget independently and never blank the landing page.

### 8.3 Localisation

Add a dedicated `publicHome.json` catalog for `en`, `mr`, `hi`, and `kn`. Translate all visible copy, alt text, control labels, error/empty states, dates, units, and source labels. Check the longest translated labels at 320px width; do not ship English fallbacks as the main content in the three Indian-language routes.

## 9. Delivery plan

### Phase 0 — Content lock and asset decision (half day)

- Approve page promise, hero copy, six public services, demo district/mandi, and three featured schemes.
- Select properly licensed footage or create original footage; record provenance in the source register.
- Produce video variants, poster image, and focal-point crops for desktop/mobile.
- Decide which landing cards open a route, detail panel, or official external source.

**Exit:** no placeholder copy, mystery data, dead CTA, or unlicensed asset remains in the design.

### Phase 1 — Route and shell foundation (half day)

- Add the public home and `/login` routes.
- Update login/logout/access-required redirects and route tests.
- Add a landing-shell mode for transparent/sticky header behaviour and full-width main content.
- Preserve the current authenticated shell unchanged.

**Exit:** landing -> login -> consent -> dashboard -> logout works in all four locales.

### Phase 2 — High-impact MVP (one day)

- Build the hero, alert band, snapshot, service grid, market watch, featured schemes, notices/news, trust section, CTA, and footer.
- Add deterministic public fixtures and all four message catalogs.
- Implement responsive states from 320px through wide desktop.

**Exit:** the full story works offline/local and looks complete even before video playback.

### Phase 3 — Motion, polish, and resilience (half day)

- Integrate compressed video and poster.
- Add pause/play, reduced-motion, data-saver, loading, and media-error behaviours.
- Tune header transition, spacing, type scale, image focal points, and interaction feedback.
- Add per-widget unavailable/stale states.

**Exit:** failure to load video or one data widget does not harm navigation or content.

### Phase 4 — Verification and demo rehearsal (half to one day)

- Run typecheck, build, unit/architecture/locale tests, and smoke tests.
- Keyboard-only test every control and validate focus order.
- Test screen reader landmarks/headings/control names.
- Test contrast over representative hero frames and at 200% zoom.
- Test reduced motion, no-video, slow network, and 320px layout.
- Check Core Web Vitals and prevent hero media from delaying the text and CTAs.
- Rehearse the judge flow below.

**Exit:** all acceptance criteria pass with evidence screenshots or a short QA record.

## 10. Hackathon demo choreography (60–90 seconds)

1. Open the landing page and state the promise while the restrained farm loop establishes context.
2. Change language to Marathi or Kannada to demonstrate inclusive public access.
3. Show the urgent notice and the useful four-card snapshot—no login required.
4. Change the mandi/commodity selection and show price provenance/update time.
5. Open a scheme, then choose **Check my eligibility** to demonstrate the intentional login boundary.
6. Login, grant purpose-specific consent, and arrive at the existing personalised dashboard.

This sequence tells a complete story: public value first, personalisation second, privacy throughout.

## 11. Acceptance criteria

### Product and content

- `/{locale}` is useful without authentication and `/login` is explicit.
- Hero copy explains KrishiSetu within five seconds of scanning.
- Weather, market, scheme, notice, and news content show source and freshness.
- Synthetic values are unmistakably labelled and do not imply live official data.
- Notices and news are visibly distinct.
- Every CTA has a working, honest destination.

### Accessibility

- Semantic header/nav/main/section/article/footer structure and one logical H1.
- Full keyboard operation with visible focus and no traps.
- Video can be paused, reduced-motion disables autoplay, and no audio autoplays.
- Text remains readable when the video is paused, unavailable, or on its lightest frame.
- Body text, controls, and reflow meet the existing WCAG 2.1 AA/GIGW-aligned baseline.

### Responsive and performance

- Fully usable at 320px, 768px, 1024px, and wide desktop.
- Hero text and primary CTAs appear independently of video download.
- Poster is the stable first paint; media failure produces no broken visual.
- No auto-rotating carousels, moving tickers, layout shifts, or blocking landing API waterfall.
- Mobile/data-saver users can receive the complete page without downloading the hero video.

### Architecture and safety

- Existing authenticated dashboard and consent flow remain intact.
- Public view models contain no farmer identity, land, bank, application, or consent data.
- Locale completeness and route invariants are updated.
- Assets have provenance/licensing records.
- The prototype disclosure remains in the footer and no restricted government insignia is introduced.

## 12. Scope priority if time becomes tight

**Must ship:** route split, landing header, video/poster hero, public alert, snapshot cards, service grid, market watch, featured schemes, notices, login CTA, four languages, responsive/accessibility behaviours.

**Should ship:** news column, how-it-works, trust section, richer market filtering, scroll-aware header polish.

**Can wait:** CMS, live government adapters, location permission, public search indexes, animations beyond the hero, analytics dashboard, chatbot, and personalised public recommendations.

The correct hackathon trade-off is a smaller page where every visible interaction works and every value is trustworthy, rather than a long portal filled with decorative or dead content.

## 13. Research references

- UX4G Design System 3.0: <https://www.ux4g.gov.in/>
- UX4G accessibility foundations: <https://www.ux4g.gov.in/foundations/accessibility>
- UX4G patterns: <https://www.ux4g.gov.in/patterns>
- Guidelines for Indian Government Websites and Apps (GIGW): <https://guidelines.india.gov.in/>
- myScheme FAQ (public browsing and login boundary): <https://reports.myscheme.gov.in/faqs>
- National Portal of India — Agriculture, Rural & Environment: <https://www.india.gov.in/category/agriculture-rural-environment>
- Agmarknet service description: <https://services.india.gov.in/service/detail/agmarknet-portal>
- eNAM: <https://enam.gov.in/>
- W3C WCAG 2.2.2 Pause, Stop, Hide: <https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html>
- W3C Animation from Interactions/reduced motion: <https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html>
- web.dev video performance guidance: <https://web.dev/learn/performance/video-performance>
