import type { Theme } from "@/lib/theme/schema";

// All numbers here are illustrative demo data - there is no real analytics
// pipeline. Metrics are seeded off a string (a version's brand name) with a
// deterministic PRNG so they stay stable across renders/reloads instead of
// reshuffling every time the dashboard is viewed, the same way the premium
// calculator produces consistent-but-fake numbers.

function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function next() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function randRange(rand: () => number, min: number, max: number): number {
  return Math.floor(min + rand() * (max - min));
}

export const ADDON_LABELS = [
  "OPD cover",
  "Maternity cover",
  "Critical illness cover",
  "Room rent upgrade",
  "Personal accident cover",
];

export type VersionMetrics = {
  dau: number;
  mau: number;
  landingVisits: number;
  quotesGenerated: number;
  proposalsStarted: number;
  paymentsInitiated: number;
  policiesIssued: number;
  totalPremiumCollected: number;
  avgPremium: number;
  mobileSharePct: number;
  topAddon: string;
  /** Policies issued per day, oldest first, for a 14-day trend. */
  dailyPolicies: number[];
};

export function generateVersionMetrics(seed: string): VersionMetrics {
  const rand = seededRandom(seed);

  const mau = randRange(rand, 800, 6000);
  const dau = Math.round(mau * (0.08 + rand() * 0.1));

  const landingVisits = randRange(rand, 1200, 9000);
  const quotesGenerated = Math.round(landingVisits * (0.5 + rand() * 0.15));
  const proposalsStarted = Math.round(quotesGenerated * (0.55 + rand() * 0.15));
  const paymentsInitiated = Math.round(proposalsStarted * (0.6 + rand() * 0.15));
  const policiesIssued = Math.round(paymentsInitiated * (0.82 + rand() * 0.1));

  const avgPremium = randRange(rand, 8000, 22000);
  const totalPremiumCollected = policiesIssued * avgPremium;

  const mobileSharePct = randRange(rand, 62, 88);
  const topAddon = ADDON_LABELS[randRange(rand, 0, ADDON_LABELS.length)];

  const dailyAvg = Math.max(1, Math.round(policiesIssued / 30));
  const dailyPolicies = Array.from({ length: 14 }, () =>
    randRange(rand, Math.max(1, Math.round(dailyAvg * 0.4)), Math.round(dailyAvg * 1.8) + 1)
  );

  return {
    dau,
    mau,
    landingVisits,
    quotesGenerated,
    proposalsStarted,
    paymentsInitiated,
    policiesIssued,
    totalPremiumCollected,
    avgPremium,
    mobileSharePct,
    topAddon,
    dailyPolicies,
  };
}

// --- Per-journey frontend event analytics (mock) ---------------------------
export type FrontendEvents = {
  sessions: number;
  pageViews: number;
  ctaClicks: number;
  formFieldFocuses: number;
  formAbandonPct: number;
  avgSessionSec: number;
  bounceRatePct: number;
  mobileSharePct: number;
  /** Sessions per day, oldest first, 14-day trend. */
  dailySessions: number[];
};

export function generateFrontendEvents(seed: string): FrontendEvents {
  const rand = seededRandom(`${seed}:frontend`);
  const sessions = randRange(rand, 3000, 24000);
  const pageViews = Math.round(sessions * (2.4 + rand() * 1.6));
  const ctaClicks = Math.round(sessions * (0.35 + rand() * 0.25));
  const formFieldFocuses = Math.round(ctaClicks * (2 + rand() * 2));
  const dailyAvg = Math.max(1, Math.round(sessions / 30));
  return {
    sessions,
    pageViews,
    ctaClicks,
    formFieldFocuses,
    formAbandonPct: randRange(rand, 28, 62),
    avgSessionSec: randRange(rand, 40, 190),
    bounceRatePct: randRange(rand, 22, 55),
    mobileSharePct: randRange(rand, 62, 88),
    dailySessions: Array.from({ length: 14 }, () =>
      randRange(rand, Math.round(dailyAvg * 0.5), Math.round(dailyAvg * 1.7) + 1)
    ),
  };
}

// --- Per-journey backend analytics (mock) ----------------------------------
export type BackendMetrics = {
  quoteApiCalls: number;
  premiumCalcs: number;
  pdfsGenerated: number;
  apiSuccessRatePct: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  errorCount: number;
  policiesIssued: number;
  premiumCollected: number;
};

export function generateBackendMetrics(seed: string): BackendMetrics {
  const rand = seededRandom(`${seed}:backend`);
  const m = generateVersionMetrics(seed);
  const quoteApiCalls = Math.round(m.quotesGenerated * (1.1 + rand() * 0.5));
  const avgLatencyMs = randRange(rand, 90, 420);
  return {
    quoteApiCalls,
    premiumCalcs: Math.round(quoteApiCalls * (1.3 + rand() * 0.8)),
    pdfsGenerated: m.policiesIssued,
    apiSuccessRatePct: 970 + randRange(rand, 0, 29), // per-mille → 97.0–99.9%
    avgLatencyMs,
    p95LatencyMs: Math.round(avgLatencyMs * (1.8 + rand() * 0.9)),
    errorCount: randRange(rand, 3, 120),
    policiesIssued: m.policiesIssued,
    premiumCollected: m.totalPremiumCollected,
  };
}

export type MicrositeVersion = {
  id: string;
  brandName: string;
  createdAt: string;
  primaryColor: string;
  isLive: boolean;
};

const SEED_VERSIONS: Omit<MicrositeVersion, "isLive">[] = [
  { id: "v1", brandName: "CarePlus Insurance", createdAt: "2026-05-02", primaryColor: "#1baf7a" },
  { id: "v2", brandName: "MediShield Direct", createdAt: "2026-05-21", primaryColor: "#e34948" },
  { id: "v3", brandName: "WellnessFirst Cover", createdAt: "2026-06-10", primaryColor: "#eda100" },
  { id: "v4", brandName: "TrustGuard Health", createdAt: "2026-06-28", primaryColor: "#4a3aa7" },
];

/** The live/current version (whatever is being edited) first, then a handful of sample past versions. */
export function getAllVersions(currentTheme: Theme): MicrositeVersion[] {
  const current: MicrositeVersion = {
    id: "current",
    brandName: currentTheme.brandName,
    createdAt: new Date().toISOString().slice(0, 10),
    primaryColor: currentTheme.colors.primary,
    isLive: true,
  };
  return [current, ...SEED_VERSIONS.map((v) => ({ ...v, isLive: false }))];
}
