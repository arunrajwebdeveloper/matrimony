// lib/image.ts
import imageCompression from "browser-image-compression";

/** Load <img> safely */
export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

/** Convert File -> object URL (for preview/cropper) */
export function fileToObjectURL(file: File) {
  return URL.createObjectURL(file);
}

/** Crop an image by croppedAreaPixels from react-easy-crop */
export async function cropFromSrc(
  imageSrc: string,
  croppedAreaPixels: { x: number; y: number; width: number; height: number }
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  canvas.width = Math.max(1, Math.round(croppedAreaPixels.width));
  canvas.height = Math.max(1, Math.round(croppedAreaPixels.height));

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/jpeg",
      0.95
    );
  });
}

/** Compress a Blob to target constraints */
export async function compressBlob(
  blob: Blob,
  opts: { maxSizeMB?: number; maxWidthOrHeight?: number } = {}
): Promise<Blob> {
  const { maxSizeMB = 1, maxWidthOrHeight = 1000 } = opts;
  const file = new File([blob], "tmp.jpg", { type: "image/jpeg" });
  const compressed = await imageCompression(file, {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
  });
  return compressed;
}

/** Add a text watermark onto a Blob */
export async function addWatermark(
  blob: Blob,
  options: {
    text?: string;
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    opacity?: number;
    padding?: number;
  } = {}
): Promise<Blob> {
  const {
    text = "© Matrimony",
    position = "bottom-right",
    opacity = 0.7,
    padding = 25,
  } = options;

  const src = URL.createObjectURL(blob);
  const img = await createImage(src);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  canvas.width = img.width;
  canvas.height = img.height;

  // draw original
  ctx.drawImage(img, 0, 0);

  // watermark
  const fontSize = Math.max(12, Math.floor(canvas.width / 12));
  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle = `rgba(255,255,255,${opacity})`;
  ctx.textBaseline = "alphabetic";

  // outline to improve readability
  // ctx.strokeStyle = `rgba(0,0,0,${opacity})`;
  ctx.strokeStyle = `rgba(0,0,0,0)`;
  ctx.lineWidth = Math.max(2, Math.floor(fontSize / 10));

  const metrics = ctx.measureText(text);
  const textHeight = fontSize;

  let x = canvas.width - padding;
  let y = canvas.height - padding;

  if (position.includes("top")) y = padding + textHeight;
  if (position.includes("left")) x = padding;

  ctx.textAlign = position.includes("left") ? "left" : "right";

  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/jpeg",
      0.9
    );
  });
}

/** Blob -> File helper */
export function blobToFile(
  blob: Blob,
  name = "image.jpg",
  type = "image/jpeg"
) {
  return new File([blob], name, { type });
}

/** Full pipeline: crop -> compress -> watermark -> File */
export async function processImagePipeline(
  srcUrl: string,
  cropPixels: { x: number; y: number; width: number; height: number },
  outName: string,
  options?: {
    compress?: { maxSizeMB?: number; maxWidthOrHeight?: number };
    watermark?: {
      text?: string;
      position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
      opacity?: number;
      padding?: number;
    };
  }
): Promise<File> {
  const cropped = await cropFromSrc(srcUrl, cropPixels);
  const compressed = await compressBlob(cropped, options?.compress);
  const watermarked = await addWatermark(compressed, options?.watermark);
  return blobToFile(watermarked, outName, "image/jpeg");
}
