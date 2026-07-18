import { z } from "zod";

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

// Selectable display fonts. Each id maps to a CSS variable defined in
// app/layout.tsx (via next/font) and applied through lib/theme/apply.ts.
export const FONT_OPTIONS = [
  { id: "geist", label: "Geist", cssVar: "--font-geist-sans", stack: "var(--font-geist-sans)" },
  { id: "inter", label: "Inter", cssVar: "--font-inter", stack: "var(--font-inter)" },
  { id: "poppins", label: "Poppins", cssVar: "--font-poppins", stack: "var(--font-poppins)" },
  { id: "lora", label: "Lora (serif)", cssVar: "--font-lora", stack: "var(--font-lora)" },
] as const;

export type FontId = (typeof FONT_OPTIONS)[number]["id"];
const FONT_IDS = FONT_OPTIONS.map((f) => f.id) as [FontId, ...FontId[]];

export const DEFAULT_HEADLINE = "Health cover that just works.";

export const ThemeSchema = z.object({
  version: z.literal(1),
  brandName: z.string().min(1).max(40),
  tagline: z.string().max(80).optional(),
  // The public site's hero heading. Optional with a default so older `?theme=`
  // links (which predate this field) still decode without error.
  headline: z.string().min(1).max(60).default(DEFAULT_HEADLINE),
  // Display font id; defaults to Geist for backward compatibility.
  font: z.enum(FONT_IDS).default("geist"),
  // Intermediary/agent identifier, printed on the issued policy PDF.
  imId: z.string().min(1, "IM-ID is required").max(40),
  // A Vercel Blob URL, not an embedded data URI - keeps the theme small
  // enough to always fit in a shareable link regardless of image size.
  logoUrl: z.string().url().optional(),
  colors: z.object({
    primary: z.string().regex(HEX_RE),
    secondary: z.string().regex(HEX_RE),
  }),
});

export type Theme = z.infer<typeof ThemeSchema>;

export const DEFAULT_THEME: Theme = {
  version: 1,
  brandName: "Suraksha Health",
  tagline: "Health insurance, sorted.",
  headline: DEFAULT_HEADLINE,
  font: "geist",
  imId: "IMF00000000",
  colors: {
    primary: "#DC2626",
    secondary: "#00B8A9",
  },
};
