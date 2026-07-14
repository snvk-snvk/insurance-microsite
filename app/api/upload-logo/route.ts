import { put, del } from "@vercel/blob";

// @vercel/blob's server SDK needs Node APIs, not the edge runtime.
export const runtime = "nodejs";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }
  const extension = EXTENSION_BY_TYPE[file.type];
  if (!extension) {
    return Response.json({ error: "Unsupported image type" }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return Response.json({ error: "Image too large (max 5MB)" }, { status: 400 });
  }

  const blob = await put(`logos/${crypto.randomUUID()}.${extension}`, file, {
    access: "public",
  });

  return Response.json({ url: blob.url });
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => null);
  const url = body?.url;
  if (typeof url !== "string" || !url.includes(".public.blob.vercel-storage.com/")) {
    return Response.json({ error: "Invalid url" }, { status: 400 });
  }
  await del(url).catch(() => {
    // best-effort cleanup; a missing/already-deleted blob isn't an error for the caller
  });
  return Response.json({ ok: true });
}
