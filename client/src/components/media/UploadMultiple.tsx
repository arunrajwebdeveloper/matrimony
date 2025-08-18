// app/upload-multiple/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fileToObjectURL, processImagePipeline } from "@/lib/image";
import ImageCropper from "./ImageCropper";
import { Crop, ImagePlus, Trash2 } from "lucide-react";

type ImageItem = {
  id: string;
  originalFile?: File; // only for new uploads
  originalUrl?: string;
  processedFile?: File;
  processedUrl?: string;
  source?: boolean; // flag for backend images
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5050";

export default function UploadMultiplePage({
  sourceImages = [],
}: {
  sourceImages?: string[];
}) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [activeImage, setActiveImage] = useState<ImageItem | null>(null);
  const [cropPixels, setCropPixels] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (sourceImages?.length) {
      // ✅ preload source images as processed
      const preloaded = sourceImages?.map((url, i) => ({
        id: `source-${i}`,
        processedUrl: url,
        source: true,
      }));
      setImages(preloaded);
    }
  }, []);

  const onFileChange = (file?: File) => {
    if (!file) return;

    const newImage: ImageItem = {
      id: Date.now().toString(),
      originalFile: file,
      originalUrl: fileToObjectURL(file),
    };

    setImages((prev) => [...prev, newImage]);
    setActiveImage(newImage);
    setShowModal(true);
  };

  const buildAndPreview = async () => {
    if (!activeImage || !cropPixels) return;

    const processed = await processImagePipeline(
      activeImage.originalUrl!,
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

    setImages((prev) =>
      prev.map((img) =>
        img.id === activeImage.id
          ? {
              ...img,
              processedFile: processed,
              processedUrl: URL.createObjectURL(processed),
            }
          : img
      )
    );

    setActiveImage(null);
    setShowModal(false);
    setCropPixels(null);
  };

  const cancelCrop = () => {
    if (activeImage && !activeImage.processedFile) {
      // remove unprocessed image
      setImages((prev) => prev.filter((img) => img.id !== activeImage.id));
    }
    setActiveImage(null);
    setShowModal(false);
    setCropPixels(null);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const onSubmit = async () => {
    const fd = new FormData();
    images.forEach((img) => {
      if (img.processedFile) {
        // ✅ only upload newly processed images
        fd.append("files", img.processedFile);
      }
    });

    await fetch(`${API_BASE}/upload/multiple`, {
      method: "POST",
      body: fd,
    });

    alert("Uploaded!");
  };

  const MAX_SLOTS = 5;
  const processedImages = images.filter((img) => img.processedUrl);
  const emptySlots = MAX_SLOTS - processedImages.length;

  return (
    <main className="space-y-4">
      {/* Upload area (dynamic slots) */}
      <div className="flex gap-4 flex-wrap">
        {/* Show previews */}
        {processedImages.map((img) => (
          <div
            key={img.id}
            className="relative w-40 h-40 overflow-hidden rounded group "
          >
            <img
              src={img.processedUrl}
              alt="preview"
              className="w-40 h-40 object-cover rounded"
            />
            {/* Delete always available */}
            <button
              type="button"
              className="absolute top-1 right-1 bg-red-600 rounded z-20 cursor-pointer w-7 h-7 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(img.id)}
            >
              <Trash2 size={18} color="white" />
            </button>
            {/* Edit only if not source */}
            {!img.source && (
              <button
                type="button"
                className="absolute inset-0 w-full h-full bg-blue-600/50 text-white font-normal text-xs p-1 z-10 cursor-pointer flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  setActiveImage(img);
                  setShowModal(true);
                }}
              >
                <Crop size={18} color="white" />
                <span>Edit</span>
              </button>
            )}
          </div>
        ))}

        {/* Show remaining empty slots */}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <label
            key={`empty-${i}`}
            className="w-40 h-40 rounded-md bg-slate-50 flex select-none border-2 border-dashed border-slate-400 hover:border-slate-500 cursor-pointer p-1 transition"
          >
            <input
              type="file"
              accept="image/*"
              className=" hidden w-0 h-0 opacity-0"
              onChange={(e) => onFileChange(e.target.files?.[0])}
            />
            <div className="m-auto flex justify-center items-center flex-col gap-1">
              <ImagePlus size={30} color="#45556c" />
              <p className="text-sm text-slate-600 font-medium m-0">
                Upload Images
              </p>
            </div>
          </label>
        ))}
      </div>

      {/* Modal for Crop */}
      {showModal && activeImage && (
        <div className="fixed inset-0 h-full w-full bg-transparent z-[600]">
          <div className="fixed inset-0 bg-gray-900/50"></div>
          <div className="max-w-[600px] w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[605] bg-white rounded-md overflow-hidden">
            <ImageCropper
              imageSrc={activeImage.originalUrl!}
              onCropComplete={setCropPixels}
            />
            <div className="flex gap-2 p-4 justify-center items-center">
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={cancelCrop}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={buildAndPreview}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        onClick={onSubmit}
        disabled={images.length === 0}
      >
        Upload
      </button>
    </main>
  );
}
