const THEME_STORAGE_KEY = "insurance-microsite:theme";

export function readStoredTheme(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function writeStoredTheme(json: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, json);
  } catch {
    // storage unavailable (private browsing, quota) - theme just won't persist
  }
}
