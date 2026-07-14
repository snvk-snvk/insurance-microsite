import { z } from "zod";

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export const ThemeSchema = z.object({
  version: z.literal(1),
  brandName: z.string().min(1).max(40),
  tagline: z.string().max(80).optional(),
  logoDataUrl: z.string().optional(),
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
  colors: {
    primary: "#6C2BD9",
    secondary: "#00B8A9",
  },
};
