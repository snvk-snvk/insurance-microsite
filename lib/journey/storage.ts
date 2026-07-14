// sessionStorage (not localStorage): this data is PII (name, DOB, address,
// phone) and should not outlive the browser tab, unlike the theme.
const JOURNEY_STORAGE_KEY = "insurance-microsite:journey";

export function readStoredJourney(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(JOURNEY_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function writeStoredJourney(json: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(JOURNEY_STORAGE_KEY, json);
  } catch {
    // storage unavailable - journey just won't survive a refresh
  }
}

export function clearStoredJourney(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(JOURNEY_STORAGE_KEY);
  } catch {
    // ignore
  }
}
