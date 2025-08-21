// app/upload-single/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fileToObjectURL, processImagePipeline } from "@/lib/image";
import ImageCropper from "./ImageCropper";
import { Crop, ImagePlus, Plus, Trash2 } from "lucide-react";
import ImageCropModal from "./ImageCropModal";

type ImageItem = {
  id: string;
  originalFile?: File; // only for new uploads
  originalUrl?: string;
  processedFile?: File;
  processedUrl?: string;
  source?: boolean; // flag for backend images
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5050";

export default function UploadSinglePage({
  sourceImage = null,
}: {
  sourceImage?: string | null;
}) {
  const [image, setImage] = useState<ImageItem | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [cropPixels, setCropPixels] = useState<any>(null);

  // load source image if exists
  useEffect(() => {
    if (sourceImage) {
      setImage({
        id: "source",
        processedUrl: sourceImage,
        source: true,
      });
    }
  }, [sourceImage]);

  const onFileChange = (file?: File) => {
    if (!file) return;
    const url = fileToObjectURL(file);
    setImage({
      id: Date.now().toString(),
      originalFile: file,
      originalUrl: url,
      source: false,
    });
    setShowModal(true); // open modal automatically
  };

  const buildAndPreview = async () => {
    if (!image?.originalUrl || !cropPixels) return null;
    const processed = await processImagePipeline(
      image.originalUrl,
      cropPixels,
      `profile-${Date.now().toString()}.jpg`,
      {
        compress: { maxSizeMB: 0.8, maxWidthOrHeight: 800 },
        watermark: {
          text: "© Matrimony",
          position: "bottom-right",
          opacity: 0.5,
        },
      }
    );
    const processedUrl = URL.createObjectURL(processed);

    setImage({
      ...image,
      processedFile: processed,
      processedUrl,
    });
    setShowModal(false);
    return processed;
  };

  const onSubmit = async () => {
    if (!image || image.source) {
      alert("Source image already exists on backend, no need to upload.");
      return;
    }
    const file = image.processedFile ?? (await buildAndPreview());
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
    setImage(null);
    setShowModal(false);
  };

  const handleCancelCrop = () => {
    if (image?.processedUrl || image?.source) {
      setShowModal(false);
    } else {
      handleRemoveImage();
    }
  };

  const onHandleCrop = () => {
    if (!image || image.source) return; // source cannot be edited
    setShowModal(true);
  };

  return (
    <main className="space-y-4">
      <div className="space-y-2">
        {image?.processedUrl ? (
          <div className="relative w-40 h-40 overflow-hidden rounded group">
            <img
              src={image.processedUrl}
              alt="preview"
              className="w-40 h-40 object-cover rounded"
            />
            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 bg-red-600 rounded z-20 cursor-pointer w-7 h-7 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={18} color="white" />
            </button>

            {/* Edit button only if NOT source */}
            {!image.source && (
              <button
                type="button"
                className="absolute inset-0 w-full h-full bg-blue-600/50 text-white font-normal text-xs p-1 z-10 cursor-pointer flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={onHandleCrop}
              >
                <Crop size={18} color="white" />
                <span>Edit</span>
              </button>
            )}
          </div>
        ) : (
          <label className="w-40 h-40 group rounded-md bg-slate-50 hover:bg-slate-100 flex select-none border-2 border-dashed border-slate-400 hover:border-slate-500 cursor-pointer p-1 transition duration-300">
            <input
              type="file"
              accept="image/*"
              className="hidden w-0 h-0 opacity-0"
              onChange={(e) => onFileChange(e.target.files?.[0])}
            />
            <div className="m-auto flex justify-center items-center flex-col gap-1">
              <Plus
                size={30}
                className="text-slate-400 group-hover:text-slate-500 transition duration-300"
              />
            </div>
          </label>
        )}
      </div>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        onClick={onSubmit}
        disabled={!image || !image.processedUrl || image.source} // only enable if processed & not source
      >
        Upload
      </button>

      {/* Modal for cropping */}
      {image?.originalUrl && showModal && !image.source && (
        <ImageCropModal
          src={image.originalUrl}
          onCropComplete={setCropPixels}
          onComplete={buildAndPreview}
          onCancel={handleCancelCrop}
        />
      )}
    </main>
  );
}
