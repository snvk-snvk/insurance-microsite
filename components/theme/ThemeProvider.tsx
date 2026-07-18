"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_THEME, ThemeSchema, type Theme } from "@/lib/theme/schema";
import { encodeThemeToParam, decodeThemeFromParam } from "@/lib/theme/codec";
import { readStoredTheme, writeStoredTheme } from "@/lib/theme/storage";
import { applyThemeToDocument } from "@/lib/theme/apply";

type ThemeContextValue = {
  theme: Theme;
  hydrated: boolean;
  updateTheme: (patch: Partial<Theme>) => void;
  resetTheme: () => void;
  shareUrl: string | null;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function parseStoredTheme(raw: string | null): Theme | null {
  if (!raw) return null;
  try {
    return ThemeSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

/**
 * Single mechanism consumed identically by the configurator's live preview
 * and the real public site, so the two can never drift.
 *
 * mode="site": resolves theme from ?theme= link -> localStorage -> default,
 * and a link always wins + gets written through to localStorage.
 * mode="editor": resolves from localStorage only; every edit writes through
 * immediately, which is what makes the configurator's preview "live".
 */
export function ThemeProvider({
  mode,
  children,
}: {
  mode: "site" | "editor";
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let resolved: Theme | null = null;

    if (mode === "site") {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get("theme");
      if (encoded) {
        resolved = decodeThemeFromParam(encoded);
      }
    }

    if (!resolved) {
      resolved = parseStoredTheme(readStoredTheme());
    }

    const finalTheme = resolved ?? DEFAULT_THEME;
    // One-time hydration from an external source (URL param / localStorage)
    // that isn't available during SSR - not derived-from-props state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(finalTheme);
    applyThemeToDocument(finalTheme);
    writeStoredTheme(JSON.stringify(finalTheme));
    setHydrated(true);
    // mode is fixed per route/layout - only run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTheme = (patch: Partial<Theme>) => {
    setThemeState((prev) => {
      const next: Theme = {
        ...prev,
        ...patch,
        colors: { ...prev.colors, ...(patch.colors ?? {}) },
      };
      applyThemeToDocument(next);
      writeStoredTheme(JSON.stringify(next));
      return next;
    });
  };

  const resetTheme = () => updateTheme(DEFAULT_THEME);

  const shareUrl = useMemo(() => {
    if (!hydrated || typeof window === "undefined") return null;
    return `${window.location.origin}/?theme=${encodeThemeToParam(theme)}`;
  }, [theme, hydrated]);

  return (
    <ThemeContext.Provider
      value={{ theme, hydrated, updateTheme, resetTheme, shareUrl }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
