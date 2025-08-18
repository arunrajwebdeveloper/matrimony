// app/upload-single/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { fileToObjectURL, processImagePipeline } from "@/lib/image";
import ImageCropper from "./ImageCropper";
import { Crop, ImagePlus, Trash2 } from "lucide-react";

type FormData = {
  image: File | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5050";

export default function UploadSinglePage({
  sourceImage = null,
}: {
  sourceImage?: string | null;
}) {
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

  const handleRemoveImage = () => {
    reset();
    setPreviewUrl(null);
    setFinalPreview(null);
    setShowModal(false);
  };

  const handleCancel = () => {
    if (finalPreview) {
      setShowModal(false);
    } else {
      handleRemoveImage();
    }
  };

  const onHandleCrop = () => {
    setShowModal(true);
    setPreviewUrl(previewUrl); // not necessary
  };

  return (
    <main className="space-y-4">
      {errors.image && (
        <p className="text-red-600">{String(errors.image.message)}</p>
      )}

      {/* Show processed preview if available, else raw preview */}

      <div className="space-y-2">
        {finalPreview || previewUrl ? (
          <div className="relative w-40 h-40 overflow-hidden rounded group ">
            <img
              src={finalPreview || previewUrl!}
              alt="preview"
              className="w-40 h-40 object-cover rounded"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 bg-red-600 rounded z-20 cursor-pointer w-7 h-7 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={18} color="white" />
            </button>

            <button
              type="button"
              className="absolute inset-0 w-full h-full bg-blue-600/50 text-white font-normal text-xs p-1 z-10 cursor-pointer flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onHandleCrop}
            >
              <Crop size={18} color="white" />
              <span>Edit</span>
            </button>
          </div>
        ) : (
          <label className="w-40 h-40 rounded-md bg-slate-50 flex select-none border-2 border-dashed border-slate-400 hover:border-slate-500 cursor-pointer p-1 transition">
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              onChange={(e) => onFileChange(e.target.files?.[0])}
              className=" hidden w-0 h-0 opacity-0"
            />
            <div className="m-auto flex justify-center items-center flex-col gap-1">
              <ImagePlus size={30} color="#45556c" />
              <p className="text-sm text-slate-600 font-medium m-0">
                Upload Image
              </p>
            </div>
          </label>
        )}
      </div>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        onClick={handleSubmit(onSubmit)}
        disabled={!finalPreview} // only enable when processed
      >
        Upload
      </button>

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
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
