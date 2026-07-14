// Keeps the logo small enough to embed in localStorage AND a shareable URL.
// A header logo only ever renders at icon size, so one small compressed
// tier is used everywhere - no separate "high-res local" variant.
//
// PNG rather than WebP: the policy PDF embeds this same data URI via
// @react-pdf/renderer, which decodes images through pdfkit and does not
// support WebP server-side. PNG is lossless (no quality knob), so instead
// of lowering quality to hit the size budget, we iteratively shrink the
// dimensions - fine for logos, which are typically flat/vector-like
// artwork that PNG compresses well even at small sizes.
const MAX_WIDTH = 160;
const MAX_HEIGHT = 56;
const MIN_WIDTH = 40;
const TARGET_MAX_DATA_URL_LENGTH = 900;
const SHRINK_FACTOR = 0.85;

export async function compressLogoFile(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const initialScale = Math.min(1, MAX_WIDTH / bitmap.width, MAX_HEIGHT / bitmap.height);
  let width = Math.max(1, Math.round(bitmap.width * initialScale));
  let height = Math.max(1, Math.round(bitmap.height * initialScale));

  let dataUrl = "";
  for (;;) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    ctx.drawImage(bitmap, 0, 0, width, height);
    dataUrl = canvas.toDataURL("image/png");

    if (dataUrl.length <= TARGET_MAX_DATA_URL_LENGTH || width <= MIN_WIDTH) break;
    width = Math.max(MIN_WIDTH, Math.round(width * SHRINK_FACTOR));
    height = Math.max(1, Math.round(height * SHRINK_FACTOR));
  }

  bitmap.close();
  return dataUrl;
}
