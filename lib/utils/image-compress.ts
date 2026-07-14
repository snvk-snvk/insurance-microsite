// Keeps the logo small enough to embed in localStorage AND a shareable URL.
// A header logo only ever renders at icon size, so one small compressed
// tier is used everywhere - no separate "high-res local" variant.
const MAX_WIDTH = 160;
const MAX_HEIGHT = 56;
const TARGET_MAX_DATA_URL_LENGTH = 900;
const MIN_QUALITY = 0.2;
const QUALITY_STEP = 0.15;

export async function compressLogoFile(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width, MAX_HEIGHT / bitmap.height);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = 0.9;
  let dataUrl = canvas.toDataURL("image/webp", quality);
  while (dataUrl.length > TARGET_MAX_DATA_URL_LENGTH && quality > MIN_QUALITY) {
    quality -= QUALITY_STEP;
    dataUrl = canvas.toDataURL("image/webp", quality);
  }
  return dataUrl;
}
