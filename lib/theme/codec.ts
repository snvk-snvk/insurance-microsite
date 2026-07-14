import { ThemeSchema, type Theme } from "./schema";

// Keeps the full shareable URL (origin + path + ?theme=) safely under ~2000
// chars, the practical limit across browsers, SMS, and chat apps.
export const MAX_ENCODED_THEME_PARAM_LENGTH = 1800;

function base64UrlEncode(input: string): string {
  const base64 =
    typeof window === "undefined"
      ? Buffer.from(input, "utf-8").toString("base64")
      : btoa(unescape(encodeURIComponent(input)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(encoded: string): string {
  const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
  return typeof window === "undefined"
    ? Buffer.from(padded, "base64").toString("utf-8")
    : decodeURIComponent(escape(atob(padded)));
}

/**
 * Encodes a theme for use in a shareable `?theme=` URL. If the logo pushes
 * the encoded payload past the length budget, it's dropped from the link
 * only - the local editor/preview still has it via localStorage.
 */
export function encodeThemeToParam(theme: Theme): string {
  const full = base64UrlEncode(JSON.stringify(theme));
  if (full.length <= MAX_ENCODED_THEME_PARAM_LENGTH || !theme.logoDataUrl) {
    return full;
  }
  const withoutLogo: Theme = { ...theme, logoDataUrl: undefined };
  return base64UrlEncode(JSON.stringify(withoutLogo));
}

/** Lets the UI warn the user before a logo silently gets dropped from a share link. */
export function willLinkIncludeLogo(theme: Theme): boolean {
  if (!theme.logoDataUrl) return false;
  const full = base64UrlEncode(JSON.stringify(theme));
  return full.length <= MAX_ENCODED_THEME_PARAM_LENGTH;
}

export function decodeThemeFromParam(param: string): Theme | null {
  try {
    const json = base64UrlDecode(param);
    return ThemeSchema.parse(JSON.parse(json));
  } catch {
    return null;
  }
}
