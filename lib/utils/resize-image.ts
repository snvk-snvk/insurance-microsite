// Resizes a logo upload to a sensible display size before it goes to
// storage (see app/api/upload-logo/route.ts). Purely a bandwidth/storage
// courtesy now - the resulting image is uploaded and referenced by URL,
// so there's no need to squeeze it into a URL-embeddable byte budget.
const MAX_WIDTH = 320;
const MAX_HEIGHT = 112;

export async function resizeLogoFile(file: File): Promise<Blob> {
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

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to encode image"));
    }, "image/png");
  });
}
