import { FONT_OPTIONS, type Theme } from "./schema";
import { contrastForeground } from "@/lib/utils/contrast-color";
import type { CSSProperties } from "react";

const FONT_STACK_BY_ID = Object.fromEntries(
  FONT_OPTIONS.map((f) => [f.id, f.stack])
) as Record<string, string>;

/**
 * The same theme colours + font as CSS custom properties, for applying to a
 * scoped container (the admin editor's live preview) instead of the whole
 * document — so partner branding doesn't leak into the admin chrome.
 */
export function themeStyleVars(theme: Theme): CSSProperties {
  const stack = FONT_STACK_BY_ID[theme.font] ?? FONT_STACK_BY_ID.geist;
  return {
    "--color-primary": theme.colors.primary,
    "--color-primary-foreground": contrastForeground(theme.colors.primary),
    "--color-secondary": theme.colors.secondary,
    "--color-secondary-foreground": contrastForeground(theme.colors.secondary),
    "--font-sans": stack,
    fontFamily: "var(--font-sans)",
  } as CSSProperties;
}

/**
 * Applies a theme's colours + font to the document as CSS variables. Shared by
 * the public site's ThemeProvider and the admin editor's live preview so the
 * two can never drift.
 */
export function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", theme.colors.primary);
  root.style.setProperty(
    "--color-primary-foreground",
    contrastForeground(theme.colors.primary)
  );
  root.style.setProperty("--color-secondary", theme.colors.secondary);
  root.style.setProperty(
    "--color-secondary-foreground",
    contrastForeground(theme.colors.secondary)
  );
  const stack = FONT_STACK_BY_ID[theme.font] ?? FONT_STACK_BY_ID.geist;
  root.style.setProperty("--font-sans", stack);
}
