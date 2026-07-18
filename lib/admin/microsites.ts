import { DEFAULT_THEME, ThemeSchema, type Theme } from "@/lib/theme/schema";
import { DEFAULT_PRODUCT_ID, type ProductId } from "@/lib/products/catalog";
import { z } from "zod";

// A partner "journey" = a themed microsite config. Prototype persistence:
// localStorage only, no backend. Labelled "Journey" in the UI, but named
// Microsite internally to avoid clashing with lib/journey/ (the customer flow).
export const MicrositeSchema = z.object({
  id: z.string(),
  partnerName: z.string(),
  productId: z.string(),
  status: z.enum(["live", "disabled"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  theme: ThemeSchema,
});

export type Microsite = z.infer<typeof MicrositeSchema>;

const STORAGE_KEY = "insurance-microsite:admin-microsites";

function nowIso() {
  return new Date().toISOString();
}

// A handful of demo journeys so the list isn't empty on first visit.
const SEED_MICROSITES: Array<{
  partnerName: string;
  productId: ProductId;
  createdAt: string;
  status: "live" | "disabled";
  primary: string;
  secondary: string;
  font: Theme["font"];
  tagline: string;
}> = [
  { partnerName: "CarePlus Insurance", productId: "health", createdAt: "2026-05-02", status: "live", primary: "#1baf7a", secondary: "#0f766e", font: "geist", tagline: "Care that comes first." },
  { partnerName: "MediShield Direct", productId: "health", createdAt: "2026-05-21", status: "live", primary: "#e34948", secondary: "#b91c1c", font: "inter", tagline: "Direct cover, no fuss." },
  { partnerName: "WellnessFirst Cover", productId: "life", createdAt: "2026-06-10", status: "disabled", primary: "#eda100", secondary: "#a16207", font: "poppins", tagline: "Put wellness first." },
  { partnerName: "TrustGuard Health", productId: "motor", createdAt: "2026-06-28", status: "live", primary: "#4a3aa7", secondary: "#3730a3", font: "lora", tagline: "Guarding what matters." },
];

function buildSeed(): Microsite[] {
  return SEED_MICROSITES.map((s, i) => ({
    id: `seed-${i + 1}`,
    partnerName: s.partnerName,
    productId: s.productId,
    status: s.status,
    createdAt: `${s.createdAt}T09:00:00.000Z`,
    updatedAt: `${s.createdAt}T09:00:00.000Z`,
    theme: {
      ...DEFAULT_THEME,
      brandName: s.partnerName,
      tagline: s.tagline,
      font: s.font,
      imId: `IMF${10000000 + i * 111111}`,
      colors: { primary: s.primary, secondary: s.secondary },
    },
  }));
}

function read(): Microsite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = buildSeed();
      write(seed);
      return seed;
    }
    const parsed = z.array(MicrositeSchema).safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

function write(list: Microsite[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // best-effort; storage may be full or unavailable
  }
}

export function listMicrosites(): Microsite[] {
  return read().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getMicrosite(id: string): Microsite | null {
  return read().find((m) => m.id === id) ?? null;
}

export function createMicrosite(input: {
  partnerName: string;
  productId: string;
  theme: Theme;
  status?: "live" | "disabled";
}): Microsite {
  const list = read();
  const ts = nowIso();
  const microsite: Microsite = {
    id: crypto.randomUUID(),
    partnerName: input.partnerName,
    productId: input.productId,
    status: input.status ?? "live",
    createdAt: ts,
    updatedAt: ts,
    theme: input.theme,
  };
  write([microsite, ...list]);
  return microsite;
}

export function updateMicrosite(
  id: string,
  patch: Partial<Pick<Microsite, "partnerName" | "productId" | "theme" | "status">>
): Microsite | null {
  const list = read();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  const updated: Microsite = { ...list[idx], ...patch, updatedAt: nowIso() };
  list[idx] = updated;
  write(list);
  return updated;
}

export function setStatus(id: string, status: "live" | "disabled"): Microsite | null {
  return updateMicrosite(id, { status });
}

export function deleteMicrosite(id: string) {
  write(read().filter((m) => m.id !== id));
}

export function newDraftMicrosite(): {
  partnerName: string;
  productId: ProductId;
  theme: Theme;
} {
  return {
    partnerName: "",
    productId: DEFAULT_PRODUCT_ID,
    theme: { ...DEFAULT_THEME, brandName: "", imId: "" },
  };
}
