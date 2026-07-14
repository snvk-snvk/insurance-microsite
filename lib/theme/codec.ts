import { ThemeSchema, type Theme } from "./schema";

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
 * Encodes a theme for use in a shareable `?theme=` URL. The logo is a
 * Vercel Blob URL (not an embedded data URI), so the encoded theme is
 * always small - no size budget or drop-logic needed here.
 */
export function encodeThemeToParam(theme: Theme): string {
  return base64UrlEncode(JSON.stringify(theme));
}

export function decodeThemeFromParam(param: string): Theme | null {
  try {
    const json = base64UrlDecode(param);
    return ThemeSchema.parse(JSON.parse(json));
  } catch {
    return null;
  }
}
