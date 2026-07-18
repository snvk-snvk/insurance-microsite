# PRD — One-Click Partner Redirection Journeys

| | |
|---|---|
| **Status** | Draft for engineering review |
| **Owner** | Product |
| **Reference implementation** | POC in this repo (`/configurator` admin portal + `/(site)` customer flow) |
| **Regulatory context** | IRDAI / India (health insurance intermediary) |
| **Last updated** | 2026-07-18 |

> **How to read this doc.** A clickable POC already exists (see [§14 Appendix](#14-appendix)). It
> deliberately fakes several things (localStorage, mock analytics, simulated payment, no partner
> auth). This PRD describes the **production** system a human engineering team should build, and
> [§12](#12-poc--production-gap-analysis) maps every faked POC mechanism to what production needs.

---

## 1. Overview & background

We already have **server-side API integrations with many insurance-distribution partners**
(banks, fintechs, aggregators). Today, launching a co-branded insurance purchase experience with a
partner is a bespoke, slow effort. To **go to market faster**, we want a **hosted, themable
insurance journey** that any integrated partner can drop into their own iOS/Android app via an
**embedded WebView** and launch with a **one-click redirection** — the partner's user taps a
banner/CTA in the partner app and lands directly in a fully-branded, (optionally) pre-filled
insurance journey without leaving the app.

**One-line solution:** an internally-configured, per-partner-branded, WebView-embeddable insurance
journey with a secure partner→journey session handoff and GA4-based analytics.

Two surfaces:
1. **Internal config portal** (the POC's `/configurator`) — our ops team creates/edits a partner
   "journey": branding (logo, colours, font, heading, tagline), product, status, and sees analytics.
2. **Customer journey** (the POC's `/(site)` flow) — quote → proposal → payment → policy, rendered
   inside the partner's app WebView with the partner's branding.

---

## 2. Goals & non-goals

### Goals
- **G1** — Cut partner launch time from weeks of bespoke work to **configuration-only** (create a
  journey in the portal, hand the partner a URL/session contract).
- **G2** — A single hosted journey that renders **branded per partner** and runs inside an
  **embedded WebView** on iOS and Android.
- **G3** — **Secure one-click redirection**: the partner (already API-integrated) can start a
  session for a known user with a credential check, no separate login.
- **G4** — **Per-partner-configurable pre-fill** so the journey can be near one-click where the
  partner passes customer data, or self-serve where they don't.
- **G5** — **GA4-driven analytics** across frontend + backend + funnel, sliceable per partner and
  per journey.

### Non-goals (v1)
- **Partner self-serve** configuration (v1 is **internal ops only**; self-serve is a later phase).
- Products other than **Health** (Motor/Life/Travel are roadmap; UI already lists them as a stub).
- Native **SDKs** (v1 targets embedded WebView + a thin JS↔native bridge, not a full native SDK).
- Renewals, endorsements, claims, servicing (purchase funnel only).
- A public/standalone consumer site (journey is always partner-initiated).

---

## 3. Success metrics (GA-driven)

All measured in **GA4**, sliced by `partner_id` and `journey_id` custom dimensions.

| Metric | Definition | GA4 signal |
|---|---|---|
| Redirect success rate | Valid sessions started ÷ redirect attempts | `journey_start` ÷ (backend redirect-attempt event) |
| Landing→quote rate | Quotes ÷ journey starts | `quote_generated` ÷ `journey_start` |
| Funnel conversion | Policies issued ÷ journey starts | `policy_issued` ÷ `journey_start` |
| Step drop-off | Exit rate per step | step-scoped events (§7.6) |
| WebView TTI | Time to interactive inside WebView | `web_vitals` / custom `journey_tti` |
| Payment success rate | Successful payments ÷ payment attempts | `payment_success` ÷ `payment_attempt` |
| Time-to-launch (ops) | Journey created → first live session | portal audit + first `journey_start` |

Targets to be set with business during v1 planning (see [§13](#13-open-questions--decisions)).

---

## 4. Personas & users

- **Internal ops / partner-success (primary portal user)** — configures journeys, branding, status;
  monitors analytics. Authenticated internal users with RBAC.
- **End customer** — the partner's user, inside the partner app WebView. Never sees our brand as the
  primary identity; sees the partner/co-brand. May be pre-authenticated by the partner.
- **Partner (integrator, not a portal user in v1)** — an engineering counterpart who integrates the
  redirection handshake and embeds the WebView. Consumes our integration contract + credentials.

---

## 5. Scope

### 5.1 In-scope (v1)
- Internal config portal: journey CRUD, branding (logo, primary/secondary colour, font, heading,
  tagline), product selection (Health functional), **status live/disabled**, **versioning +
  publish/rollback**, copy shareable/handoff URL, per-journey analytics view, audit log.
- **Partner credential check + session handoff** for one-click redirection (mechanism options in
  §7.2; final choice deferred to eng).
- **Embedded WebView** rendering on iOS + Android, incl. JS↔native bridge and **return-to-app**
  handshake.
- **Per-partner-configurable pre-fill** of customer data into the journey.
- Customer journey for **Health**: quote → proposal → payment → policy issuance + PDF.
- **Real payment** (gateway) + **real policy issuance** via existing/backing insurer systems.
- **GA4 analytics**: frontend events, backend events (Measurement Protocol), funnel, per-partner
  dimensions, consent mode.
- Security/privacy/compliance baseline (§10) for IRDAI + PII + PCI.

### 5.2 Out-of-scope (v1 / later phases)
- Partner **self-serve** portal + partner RBAC/SSO.
- **Multi-product** journeys (Motor/Life/Travel logic, pricing, forms).
- Native **iOS/Android SDKs** and offline support.
- **Renewals/endorsements/claims/servicing**, policy management post-issuance.
- Marketing site, SEO, standalone consumer acquisition.
- A/B experimentation framework (basic version compare only via analytics).
- Multi-language localisation beyond the launch locale (English + ₹/en-IN), unless a pilot partner
  requires it.

---

## 6. Assumptions & constraints

- **A1** Existing **partner API integrations + credentials** exist server-side and are the source of
  truth for "is this partner/user valid?" at redirection. *(Confirm the exact credential store &
  contract.)*
- **A2** We **own the full funnel** including payment and policy issuance (the POC does). *(Confirm —
  some partners may want to own payment; see §13.)*
- **A3** **Product v1 = Health only**; other products are stubs in the UI.
- **A4** **IRDAI/India** regulatory context: ₹ currency, pincode, **IM-ID** (intermediary id printed
  on the policy), consent capture, and **data localization** requirements apply.
- **A5** **GA4** is the analytics platform. Default model: **one GA4 property**, `partner_id` /
  `journey_id` custom dimensions, **BigQuery export** for funnel/backend joins. *(Confirm property
  strategy — single vs per-partner.)*
- **A6** **Embedded WebView** is the delivery surface (WKWebView on iOS, `android.webkit.WebView` on
  Android); we control the web app, partner controls the container.
- **A7** Config portal is **internal-only** in v1.
- **A8** Journey is **always partner-initiated** (no cold, unauthenticated public entry).

---

## 7. Functional requirements

### 7.1 Internal config portal (evolves the POC)
- **CRUD** partner journeys. Entity = `Journey` (a.k.a. Microsite config): partner, product,
  branding, status, timestamps (see §8). POC has this as an in-browser `Microsite` type.
- **Branding editor** with live preview: brand name, logo upload, primary/secondary colour, **font**
  (curated set), **hero heading**, tagline. (POC: `MicrositeEditor`, `JourneyPreview`, `FontPicker`,
  `ColorField`, `LogoUploader`.)
- **Status** live/disabled per journey; disabled journeys reject new sessions.
- **Versioning**: each publish creates an immutable version; support **rollback** and show which
  version is live. (POC has no versioning — new requirement.)
- **Handoff URL / integration snippet** per journey for the partner (replaces POC "copy URL").
- **Per-journey analytics** entry point (§7.6).
- **RBAC + audit log**: who changed what, when. Internal SSO (e.g. Google Workspace/Okta).
- **Logo storage**: object storage with a CDN URL (POC uses Vercel Blob; keep or move to our
  standard object store).

### 7.2 Partner credential check & session handoff (one-click redirection) — **open decision**
The user has left the exact mechanism to the engineering team. The PRD requires: **(a)** a partner
credential/identity check against existing integrations, **(b)** a short-lived, **non-guessable,
non-replayable** session that scopes the journey to one partner + journey + (optional) customer, and
**(c)** clean handling of expiry/revocation. Three candidate mechanisms:

| Option | How it works | Pros | Cons |
|---|---|---|---|
| **A. Server-minted session (recommended)** | Partner backend (with existing partner creds) calls `POST /api/journey-sessions`; we validate, create a session (partner, journey, pre-fill payload, TTL), return a one-time signed URL the app opens in the WebView. | Strongest control (server validation, revocation, no secrets in client, easy pre-fill payload); reuses existing partner API auth. | Requires a partner backend call before redirect. |
| **B. Signed JWT deep-link** | Partner builds a URL containing a JWT signed with a shared secret / their private key; we validate on load. | No server round-trip; simple. | Weaker revocation/replay control; key management; pre-fill payload sits in the token. |
| **C. OAuth/OIDC** | Partner acts as IdP; user authenticated via OAuth before journey. | Standard identity; good if partner login is required. | Heavier; over-kill if the partner already vouches for the user. |

**Recommendation:** Option **A** (leverages the existing server-to-server partner integration; best
security + pre-fill ergonomics). Decision owner: engineering + security. Requirements common to all:
short TTL, one-time use, bound to device/session where possible, auditable, and a documented
**integration contract** (request/response schema, error codes, sandbox keys).

### 7.3 Embedded WebView integration (iOS + Android)
- **Rendering**: WKWebView (iOS) / `WebView` (Android) opening the session URL. Document required
  WebView settings: JS enabled, DOM storage enabled, third-party-cookie behaviour, `userAgent`
  suffix to identify partner-app context.
- **JS↔native bridge**: a documented message contract for events the container may need —
  `journeyReady`, `journeyComplete{policyId}`, `journeyExit{reason}`, `requestClose`,
  `openExternal{url}` (for bank/UPI apps), `share`, `heightChanged`. Define both directions
  (web→native, native→web) and a versioned schema.
- **Return-to-app handshake**: on completion/exit, return control to the partner app via a
  **deep-link / universal link / app link** (partner-provided return URL) **and** a bridge event, so
  the partner can dismiss the WebView and update their UI. Cover success, failure, and user-abort.
- **Navigation**: intercept back-navigation; block navigation outside our allow-listed origins;
  handle external redirects (payment/UPI/bank apps) by delegating to the system browser/app and
  returning.
- **Resilience**: connectivity loss, session expiry, and load-timeout states with retry + a bridge
  `journeyExit` so the container isn't stuck.
- **Security**: TLS pinning guidance for partners, origin allow-list, disable file access & mixed
  content, CSP suited to WebView, no long-lived secrets in the web layer.

### 7.4 Customer journey (Health)
- Steps: **quote** (pincode + members/ages) → **cover** (sum insured + add-ons) → **proposal**
  (insured details, contact/address, nominee, medical declaration) → **payment** → **success**
  (policy + PDF). (POC implements all of these.)
- **Configurable per-partner pre-fill**: the session payload (§7.2) may include customer data (name,
  DOB, mobile, email, pincode, address, KYC refs). The journey pre-fills and **skips/collapses**
  steps that are fully satisfied, degrading gracefully to full manual entry when data is absent.
  Pre-fill config is **per partner** (which fields they send).
- **Consent & PII**: explicit consent capture (terms, data sharing, IRDAI-mandated disclosures)
  before proceeding; PII shown must be editable/correctable.
- **Product logic**: real premium rating, sum-insured tiers, add-ons, tax — replacing the POC's demo
  math with the real rating engine/insurer APIs.

### 7.5 Payment & policy issuance
- **Payment gateway**: cards / UPI / netbanking / wallets, with **in-WebView behaviour** designed for
  redirect-based flows — **3-D Secure**, **UPI intent** (hand off to UPI apps and return), and bank
  app switches — handled via the bridge `openExternal` + return handshake (§7.3). PCI-DSS scope
  minimised (use gateway-hosted fields / tokenisation; never touch raw PAN).
- **Issuance**: call the insurer/backing system to issue the policy; generate the policy **PDF**
  (POC already renders a PDF server-side) with the correct **IM-ID** and partner co-branding.
- **Reconciliation & idempotency**: idempotent payment→issuance, webhooks for async confirmation,
  reconciliation + refund handling on failure.

### 7.6 Analytics (GA4)
- **Frontend events** (gtag/GA4) — canonical event taxonomy, each carrying `partner_id`, `journey_id`,
  `journey_version`, `session_id`:
  `journey_start`, `quote_generated`, `cover_selected`, `proposal_step_view` (+`step`),
  `proposal_completed`, `payment_attempt`, `payment_success`/`payment_failed`, `policy_issued`,
  `journey_exit` (+`reason`), plus interaction events (CTA clicks, field focus/abandon) and
  `web_vitals`/`journey_tti`.
- **Backend analytics** — server-side events via **GA4 Measurement Protocol** (redirect attempts,
  session mints, issuance, latency, API success/error), so server truth isn't dependent on the
  WebView. Deeper analysis via **BigQuery export**.
- **Funnel** — landing → quote → proposal → payment → policy, per partner/journey (GA4 funnel
  exploration + BigQuery).
- **WebView specifics** — ensure a stable **GA4 `client_id`** inside the WebView (WebViews can drop
  cookies / have no ad id); pass a `session_id` from the handoff and reconcile client+server events.
- **Consent mode** — GA4 consent mode gated on the journey's consent capture; respect DNT/regional
  rules.
- **Dashboards** — a per-journey analytics view in the portal (POC shows a mock version:
  `MicrositeAnalytics`) backed by GA4/BigQuery in production.

### 7.7 Theming / branding pipeline
- The POC encodes the theme in a `?theme=<base64>` URL param and applies it as CSS variables. In
  production, the **live journey config is server-served and session-scoped** (fetched by
  journey/version at session start), not carried in a client-tamperable URL. Branding tokens (colour,
  font, logo, heading, tagline) apply as CSS variables at render; keep the POC's `applyThemeToDocument`
  approach but source the config server-side and make it tamper-proof.

---

## 8. Data model & entities

| Entity | Key fields | POC today |
|---|---|---|
| **Partner** | id, name, status, credentials ref, allowed products, return-URL/app-link config, pre-fill capability | none (implied by mock product/partner) |
| **PartnerCredential** | partner_id, key/secret refs, signing keys, environment (sandbox/prod) | none |
| **Journey / MicrositeConfig** | id, partner_id, product_id, **theme** (brand, logo, colours, font, heading, tagline, imId), status, **version**, created/updated, author | `Microsite` in `lib/admin/microsites.ts` (localStorage) |
| **JourneyVersion** | journey_id, version, theme snapshot, published_at, published_by | none (no versioning) |
| **Session** | id, partner_id, journey_id, journey_version, pre-fill payload (encrypted PII), TTL, one-time flag, device binding, status | none (theme-in-URL) |
| **Event** | GA4/BigQuery; session_id, partner_id, journey_id, name, params, ts | seeded mock (`lib/analytics/mock-data.ts`) |
| **Order/Policy** | session_id, quote, proposal, payment ref, policy no, PDF ref, insurer refs | in-memory (`lib/journey`) |

Store: a real transactional DB for Partner/Journey/Session/Order; object store for logos + PDFs;
GA4 + BigQuery for events. PII in Session/Order encrypted at rest, India data residency (A4).

---

## 9. Non-functional requirements

- **Security** — see §10.
- **Privacy** — PII minimisation, encryption in transit + at rest, retention policy, right-to-erasure.
- **Performance** — WebView **cold-start TTI target** (set with business; propose ≤ 2.5s on mid-tier
  Android over 4G), lazy-load non-critical assets, standalone/edge-served static shell.
- **Availability/SLA** — target 99.9%; graceful degradation (journey load must not hard-fail the
  partner app; always emit a bridge `journeyExit`).
- **Scalability** — stateless journey rendering; sessions + events scale horizontally; handle
  partner-launch traffic spikes.
- **Accessibility** — WCAG 2.2 AA; WebView + screen-reader tested.
- **i18n/localisation** — en-IN + ₹ for launch; architecture ready for more locales.
- **OS/WebView support matrix** — define min versions (proposal: **iOS 15+ / WKWebView**, **Android
  8+ / current Chromium WebView**); test on partner-representative devices.

---

## 10. Security, privacy & compliance
- **Session security** — short-lived, one-time, non-replayable sessions; server-side validation;
  revocation; device/session binding where feasible (§7.2).
- **Transport & storage** — TLS everywhere, TLS-pinning guidance for partner WebViews; encrypt PII at
  rest; secrets in a managed vault.
- **WebView hardening** — origin allow-list, CSP, disable file/mixed content, no secrets in the web
  layer, sanitise all pre-fill/handoff input.
- **PCI-DSS** — keep card data out of our systems (gateway-hosted fields / tokenisation);
  SAQ-A-eligible design.
- **IRDAI / insurance compliance** — correct **IM-ID** on policy, mandated disclosures + consent,
  suitability, record-keeping, grievance info.
- **Data localization** — India residency for PII/financial data (A4).
- **Auditability** — audit logs for config changes (portal) and session/issuance events.

---

## 11. iOS & Android platform requirements (embedded WebView)
- **Cookies/storage** — journey must work under restrictive WebView cookie policies; prefer
  server-scoped sessions over third-party cookies; validate `localStorage`/`sessionStorage`
  availability and fall back.
- **GA4 client-id continuity** — provide a stable `client_id`/`session_id` from the handoff so
  analytics aren't fragmented across WebView launches (WebViews often lack cookies/ad-id).
- **Return handshake** — partner supplies a **universal link (iOS) / app link (Android)** and/or a
  bridge callback; we invoke both on completion/abort with a documented payload (`policyId`, status).
- **External app switches** — payment/UPI/bank flows leave the WebView; define `openExternal` + return
  behaviour so the session resumes correctly.
- **Permissions** — if KYC (camera/upload) is in a partner's flow, document WebView permission
  prompts (iOS `NSCameraUsageDescription`, Android runtime permission + `onPermissionRequest`).
- **Bridge contract** — versioned message schema (§7.3), with a fallback when no native bridge is
  present (e.g. journey opened in a plain browser for testing).
- **Testing** — device/OS matrix, partner-app integration test harness, and a reference WebView
  container app for QA.

---

## 12. POC → production gap analysis

The POC is a clickable guide; here is exactly what is faked and what production must build.

| Area | POC (dummy) | Production |
|---|---|---|
| Journey persistence | `localStorage` (`lib/admin/microsites.ts`) | Transactional **DB**, versioned `Journey`/`JourneyVersion` |
| Partner auth / handoff | none — theme in `?theme=` URL | **Credential check + server-minted session** (§7.2) |
| Pre-fill | none | **Per-partner configurable** pre-fill via session payload (§7.4) |
| Analytics | seeded mock (`lib/analytics/mock-data.ts`, `MicrositeAnalytics`) | **GA4** events + **Measurement Protocol** + **BigQuery** (§7.6) |
| Payment | simulated 2.7s overlay (`/(site)/payment`) | **Real gateway**, 3DS/UPI-in-WebView, PCI-minimised (§7.5) |
| Policy issuance | client-generated PDF only | **Insurer issuance API** + compliant PDF + reconciliation |
| Product | Health real; Motor/Life/Travel mock dropdown | Health v1; others later |
| Config portal auth | none (open route) | Internal **SSO + RBAC + audit** |
| Theming transport | `?theme=` (client-tamperable) | **Server-served, session-scoped** config (§7.7) |
| Rendering surface | desktop/mobile web | **Embedded WebView** + native bridge + return handshake |
| Versioning/rollback | none | Publish/version/rollback |
| Hosting | Render/Vercel free tier | Production infra, SLA, scaling, India residency |

---

## 13. Phasing / milestones (indicative)
- **Phase 0 — Foundations**: data model + DB, journey config service, internal SSO/RBAC, theming
  pipeline (server-served), object store for logos/PDFs.
- **Phase 1 — Handoff + WebView (pilot)**: session handoff (chosen mechanism), embedded-WebView
  integration + bridge + return handshake, Health journey with configurable pre-fill, real payment +
  issuance, GA4 events, one pilot partner.
- **Phase 2 — Analytics + hardening**: BigQuery/backend analytics, portal analytics dashboards,
  versioning/rollback, more pilot partners, perf/accessibility hardening.
- **Phase 3 — Scale**: multi-product, partner self-serve portal, native SDKs, experimentation.

---

## 14. Open questions & decisions
1. **Redirect/auth mechanism** — A/B/C in §7.2 (recommend A). *Owner: eng + security.*
2. **Payment/issuance ownership** — do all partners want us to own payment, or some own it? (A2)
3. **GA4 property strategy** — single property + dimensions vs per-partner property. (A5)
4. **Product roadmap** — order/priority of Motor/Life/Travel.
5. **Self-serve timing** — when do partners get portal access (Phase 3?).
6. **Success-metric targets** — set numeric targets for §3.
7. **KYC** — is any in-journey KYC (camera/upload) required in v1, or fully partner-provided?
8. **Insurer/rating dependencies** — which rating engine + issuance APIs back the Health product.

---

## 15. Risks & mitigations
| Risk | Mitigation |
|---|---|
| WebView fragmentation (cookies, storage, older engines) | Server-scoped sessions, OS/WebView support matrix, device-lab testing |
| Payment redirects break inside WebView (UPI/3DS) | `openExternal` + return handshake designed up front; gateway that supports app-switch return |
| Analytics gaps in WebView (no cookies/ad-id) | Handoff-provided `client_id`/`session_id`; server events via Measurement Protocol |
| Session token replay/leak | Short TTL, one-time use, server validation, device binding |
| Compliance miss (IRDAI/PII/PCI) | Early legal/compliance review; PCI-minimised design; India data residency |
| Partner integration variance | Clear versioned integration contract + sandbox + reference container app |
| Scope creep from "configurable per partner" | Constrain to a defined pre-fill field set; per-partner config, not per-partner code |

---

## 16. Appendix

### POC reference (what already exists in this repo)
- **Config portal**: `app/configurator/page.tsx` (list), `app/configurator/new`,
  `app/configurator/[id]/edit`, `app/configurator/[id]/analytics`;
  components `components/admin/{MicrositeList,MicrositeEditor,MicrositeAnalytics,JourneyPreview}.tsx`.
- **Journey config type + store**: `lib/admin/microsites.ts` (localStorage), product stub
  `lib/products/catalog.ts`.
- **Theme model**: `lib/theme/schema.ts` (`Theme`: brandName, tagline, headline, font, imId, logoUrl,
  colours), `lib/theme/codec.ts` (`?theme=` encode/decode), `lib/theme/apply.ts` (CSS-var apply),
  `components/theme/{ColorField,LogoUploader,FontPicker}.tsx`.
- **Customer journey**: `app/(site)/{page,quote,proposal,payment,success}`; state in `lib/journey/`;
  PDF in `lib/pdf/`; demo pricing in `lib/pricing/`.
- **Mock analytics**: `lib/analytics/mock-data.ts`, `components/analytics/{StatTile,FunnelChart,TrendChart}.tsx`.

### Glossary
- **Journey / Microsite** — a per-partner themed insurance purchase experience (one config = one
  journey). "Microsite" is the internal type name; "journey" is the product term.
- **IM-ID** — intermediary identifier printed on the issued policy (IRDAI requirement).
- **Handoff / one-click redirection** — the secure transition from the partner app into the hosted
  journey WebView.
- **Funnel** — landing → quote → proposal → payment → policy.
