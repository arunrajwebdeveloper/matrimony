// app/upload-single/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { fileToObjectURL, processImagePipeline } from "@/lib/image";
import ImageCropper from "./ImageCropper";

type FormData = {
  image: File | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5050";

export default function UploadSinglePage() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // raw preview
  const [cropPixels, setCropPixels] = useState<any>(null);
  const [finalPreview, setFinalPreview] = useState<string | null>(null); // processed preview

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { image: null },
  });

  const onFileChange = (file?: File) => {
    if (!file) return;
    setValue("image", file);
    const url = fileToObjectURL(file);
    setPreviewUrl(url); // show raw preview immediately
    setFinalPreview(null);
    setShowModal(true); // open modal automatically
  };

  const buildAndPreview = async () => {
    if (!previewUrl || !cropPixels) return;
    const processed = await processImagePipeline(
      previewUrl,
      cropPixels,
      `profile-${Date.now().toString()}.jpg`,
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
    setShowModal(false);
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

  const handleRemove = () => {
    reset(); // reset RHF
    setPreviewUrl(null);
    setFinalPreview(null);
    setShowModal(false);
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

      {/* Modal for cropping */}
      {previewUrl && showModal && (
        <div className="fixed inset-0 h-full w-full bg-transparent z-[600]">
          <div className="fixed inset-0 bg-gray-900/50"></div>
          <div className="max-w-[600px] w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[605] bg-white rounded-md overflow-hidden">
            <ImageCropper
              imageSrc={previewUrl}
              onCropComplete={setCropPixels}
            />
            <div className="flex gap-2 p-4 justify-center items-center ">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={buildAndPreview}
              >
                Done
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={handleRemove}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show processed preview if available, else raw preview */}
      {(finalPreview || previewUrl) && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Preview</p>
          <div className="relative w-60 h-60">
            <img
              src={finalPreview || previewUrl!}
              alt="preview"
              className="w-60 h-60 object-cover rounded"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleSubmit(onSubmit)}
        disabled={!finalPreview} // only enable when processed
      >
        Upload
      </button>
    </main>
  );
}
