// Keeps the logo small enough to embed in localStorage AND a shareable URL.
// A header logo only ever renders at icon size, so one small compressed
// tier is used everywhere - no separate "high-res local" variant.
//
// PNG rather than WebP: the policy PDF embeds this same data URI via
// @react-pdf/renderer, which decodes images through pdfkit and does not
// support WebP server-side. PNG is lossless (no quality knob), so instead
// of lowering quality to hit the size budget, we iteratively shrink the
// dimensions.
const MAX_WIDTH = 160;
const MAX_HEIGHT = 56;
// Floor on BOTH dimensions independently, not just width. A square or
// portrait-oriented source photo (e.g. a phone camera JPEG) barely shrinks
// in height once width alone hits a floor, so the compressed image stayed
// far larger than intended and got silently dropped from the shareable
// link. Flooring both dimensions bounds the total pixel count regardless
// of the source image's aspect ratio.
const MIN_WIDTH = 32;
const MIN_HEIGHT = 32;
// Chosen so even a 32x32 image of pure random noise - the worst case for
// lossless PNG, totally incompressible - still lands under this: raw PNG
// is at most (32*3+1)*32 ~= 3104 bytes, and base64 inflates that ~4/3 to
// ~4140 chars. That guarantees compression always converges instead of
// silently giving up on busy/photographic uploads.
const TARGET_MAX_DATA_URL_LENGTH = 4200;
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

    const atFloor = width <= MIN_WIDTH && height <= MIN_HEIGHT;
    if (dataUrl.length <= TARGET_MAX_DATA_URL_LENGTH || atFloor) break;
    width = Math.max(MIN_WIDTH, Math.round(width * SHRINK_FACTOR));
    height = Math.max(MIN_HEIGHT, Math.round(height * SHRINK_FACTOR));
  }

  bitmap.close();
  return dataUrl;
}
