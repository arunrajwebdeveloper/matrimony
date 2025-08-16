// app/upload-single/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fileToObjectURL, processImagePipeline } from "@/lib/image";
import ImageCropper from "./ImageCropper";
import { singleImageSchema } from "@/schemas/schemas";

type FormData = {
  image: File | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5050";

export default function UploadSinglePage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropPixels, setCropPixels] = useState<any>(null);
  const [finalPreview, setFinalPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(singleImageSchema) as any,
    defaultValues: { image: null },
  });

  const onFileChange = (file?: File) => {
    if (!file) return;
    setValue("image", file);
    const url = fileToObjectURL(file);
    setPreviewUrl(url);
    setFinalPreview(null);
  };

  const buildAndPreview = async () => {
    if (!previewUrl || !cropPixels) return;
    const processed = await processImagePipeline(
      previewUrl,
      cropPixels,
      "profile.jpg",
      {
        compress: { maxSizeMB: 0.8, maxWidthOrHeight: 800 },
        watermark: {
          text: "© Matrimony",
          position: "bottom-right",
          opacity: 0.8,
        },
      }
    );
    setFinalPreview(URL.createObjectURL(processed));
    return processed;
  };

  const onSubmit = async () => {
    const file = await buildAndPreview();
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);

    await fetch(`${API_BASE}/upload/single`, {
      method: "POST",
      body: fd,
    });

    alert("Uploaded!");
  };

  return (
    <main className="space-y-4">
      <input
        type="file"
        accept="image/*"
        {...register("image")}
        onChange={(e) => onFileChange(e.target.files?.[0])}
      />
      {errors.image && (
        <p className="text-red-600">{String(errors.image.message)}</p>
      )}

      {previewUrl && (
        <>
          <ImageCropper imageSrc={previewUrl} onCropComplete={setCropPixels} />
          <div className="flex gap-2">
            <button
              type="button"
              className="px-3 py-2 bg-gray-800 text-white rounded"
              onClick={buildAndPreview}
            >
              Preview Result
            </button>
          </div>
        </>
      )}

      {finalPreview && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Preview (cropped + compressed + watermarked)
          </p>
          <img
            src={finalPreview}
            alt="final-preview"
            className="w-60 h-60 object-cover rounded"
          />
        </div>
      )}

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleSubmit(onSubmit)}
      >
        Upload
      </button>
    </main>
  );
}
