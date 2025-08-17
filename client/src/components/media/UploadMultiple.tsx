// app/upload-multiple/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { fileToObjectURL, processImagePipeline } from "@/lib/image";
import ImageCropper from "./ImageCropper";
import { ImagePlus } from "lucide-react";

type FormData = { images: File[] };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5050";

export default function UploadMultiplePage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { images: [] },
  });

  const [showModal, setShowModal] = useState(false);
  const [srcUrls, setSrcUrls] = useState<string[]>([]);
  const [cropPixels, setCropPixels] = useState<(any | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finalFiles, setFinalFiles] = useState<File[]>([]);

  const canProceed = useMemo(() => {
    if (!srcUrls.length) return false;
    return cropPixels[currentIndex] != null;
  }, [cropPixels, currentIndex, srcUrls.length]);

  useEffect(() => {
    return () => {
      srcUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [srcUrls]);

  const onFilesPicked = (newFiles: File[]) => {
    const remainingSlots = 5 - finalFiles.length;

    if (remainingSlots <= 0) {
      alert("Only up to 5 images allowed");
      return;
    }

    if (newFiles.length > remainingSlots) {
      alert(`You can only add ${remainingSlots} more image(s).`);
      newFiles = newFiles.slice(0, remainingSlots);
    }

    const updatedFiles = [...finalFiles, ...newFiles];
    setFinalFiles(updatedFiles);
    setValue("images", updatedFiles);

    const urls = [...srcUrls, ...newFiles.map((f) => fileToObjectURL(f))];
    setSrcUrls(urls);
    setCropPixels((prev) => [
      ...prev,
      ...new Array(newFiles.length).fill(null),
    ]);

    if (newFiles.length > 0) {
      setShowModal(true);
      setCurrentIndex(srcUrls.length); // start crop on first new image
    }
  };

  const processCurrent = async () => {
    const idx = currentIndex;
    const src = srcUrls[idx];
    const area = cropPixels[idx];
    if (!src || !area) return;

    const processed = await processImagePipeline(
      src,
      area,
      `image-${idx + 1}.jpg`,
      {
        compress: { maxSizeMB: 0.8, maxWidthOrHeight: 800 },
        watermark: {
          text: "© Matrimony",
          position: "bottom-right",
          opacity: 0.8,
        },
      }
    );

    setFinalFiles((prev) => {
      const next = [...prev];
      next[idx] = processed;
      setValue("images", next); // keep form value in sync
      return next;
    });
  };

  const handleNext = async () => {
    await processCurrent();

    if (currentIndex < srcUrls.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setShowModal(false);
    }
  };

  const handlePrev = async () => {
    await processCurrent();
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleRemove = (index: number) => {
    const updatedSrc = srcUrls.filter((_, i) => i !== index);
    const updatedFiles = finalFiles.filter((_, i) => i !== index);
    const updatedCrops = cropPixels.filter((_, i) => i !== index);

    setSrcUrls(updatedSrc);
    setFinalFiles(updatedFiles);
    setCropPixels(updatedCrops);
    setValue("images", updatedFiles);
  };

  const onSubmit = async () => {
    await processCurrent();

    const complete = finalFiles.filter(Boolean).length === srcUrls.length;
    if (!complete) {
      alert("Please finish cropping all images before uploading.");
      return;
    }

    const fd = new FormData();
    finalFiles.forEach((f, i) =>
      fd.append("files", f, f.name ?? `image-${i + 1}.jpg`)
    );

    await fetch(`${API_BASE}/upload/multiple`, {
      method: "POST",
      body: fd,
    });

    alert("Uploaded all images!");
  };

  return (
    <main className="space-y-6">
      {/* {finalFiles.length > 0 && ( */}
      <section className="space-y-2">
        <p className="text-sm text-gray-600">Preview</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {finalFiles.map(
            (file, i) =>
              file && (
                <div key={i} className="relative w-40 h-40">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`final-${i}`}
                    className="w-40 h-40 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              )
          )}
          <label className="w-40 h-40 rounded-md bg-slate-50 flex select-none border-2 border-dashed border-slate-400 hover:border-slate-500 cursor-pointer p-1 transition">
            <input
              type="file"
              accept="image/*"
              multiple
              {...register("images")}
              onChange={(e) => onFilesPicked(Array.from(e.target.files || []))}
              className=" hidden w-0 h-0 opacity-0"
            />
            <div className="m-auto flex justify-center items-center flex-col gap-1">
              <ImagePlus size={30} color="#45556c" />
              <p className="text-sm text-slate-600 font-medium m-0">
                Upload Images
              </p>
            </div>
          </label>
        </div>
      </section>
      {/* )} */}

      <button
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        disabled={srcUrls.length === 0}
        onClick={handleSubmit(onSubmit)}
      >
        Upload All
      </button>

      {srcUrls.length > 0 && showModal && (
        <div className="fixed inset-0 h-full w-full bg-transparent z-[600]">
          <div className="fixed inset-0 bg-gray-900/50" />
          <div className="max-w-[600px] w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[605] bg-white rounded-md overflow-hidden">
            {errors.images && (
              <p className="text-red-600">{String(errors.images.message)}</p>
            )}

            <h2 className="font-medium">
              Crop image {currentIndex + 1} of {srcUrls.length}
            </h2>
            <ImageCropper
              imageSrc={srcUrls[currentIndex]}
              onCropComplete={(area) => {
                setCropPixels((prev) => {
                  const next = [...prev];
                  next[currentIndex] = area;
                  return next;
                });
              }}
            />
            <div className="flex gap-2 p-4 justify-between items-center">
              <div>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                  disabled={!canProceed}
                  onClick={handleNext}
                >
                  {currentIndex === srcUrls.length - 1
                    ? "Save & Finish"
                    : "Save & Next"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
