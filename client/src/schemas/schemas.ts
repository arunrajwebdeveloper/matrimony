// lib/schemas.ts
import { z } from "zod";

export const singleImageSchema = z.object({
  image: z.instanceof(File, { message: "Image is required" }),
});

export const multipleImagesSchema = z.object({
  images: z
    .array(z.instanceof(File))
    .min(1, "Select at least 1 image")
    .max(5, "You can upload up to 5 images"),
});
