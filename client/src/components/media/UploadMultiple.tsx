// app/upload-multiple/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fileToObjectURL, processImagePipeline } from "@/lib/image";
import ImageCropper from "./ImageCropper";
import { multipleImagesSchema } from "@/schemas/schemas";

type FormData = { images: File[] };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5050";

export default function UploadMultiplePage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(multipleImagesSchema) as any,
    defaultValues: { images: [] },
  });

  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [srcUrls, setSrcUrls] = useState<string[]>([]);
  const [cropPixels, setCropPixels] = useState<(any | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [finalFiles, setFinalFiles] = useState<File[]>([]);
  const [finalPreviews, setFinalPreviews] = useState<string[]>([]);

  const canProceed = useMemo(() => {
    if (!srcUrls.length) return false;
    return cropPixels[currentIndex] != null;
  }, [cropPixels, currentIndex, srcUrls.length]);

  useEffect(() => {
    return () => {
      // revoke URLs on unmount
      srcUrls.forEach((u) => URL.revokeObjectURL(u));
      finalPreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [srcUrls, finalPreviews]);

  const onFilesPicked = (files: File[]) => {
    if (files.length > 5) {
      alert("Only up to 5 images allowed");
      files = files.slice(0, 5);
    }
    setValue("images", files);
    setRawFiles(files);
    const urls = files.map((f) => fileToObjectURL(f));
    setSrcUrls(urls);
    setCropPixels(new Array(files.length).fill(null));
    setCurrentIndex(0);
    setFinalFiles([]);
    setFinalPreviews([]);
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
        watermark: { text: "© MyApp", position: "bottom-right", opacity: 0.6 },
      }
    );

    setFinalFiles((prev) => {
      const next = [...prev];
      next[idx] = processed;
      return next;
    });

    const previewUrl = URL.createObjectURL(processed);
    setFinalPreviews((prev) => {
      const next = [...prev];
      next[idx] = previewUrl;
      return next;
    });
  };

  const handleNext = async () => {
    await processCurrent();
    if (currentIndex < srcUrls.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = async () => {
    await processCurrent();
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const onSubmit = async () => {
    // ensure last edited is processed
    await processCurrent();

    // verify all processed
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
      <input
        type="file"
        accept="image/*"
        multiple
        {...register("images")}
        onChange={(e) => onFilesPicked(Array.from(e.target.files || []))}
      />
      {errors.images && (
        <p className="text-red-600">{String(errors.images.message)}</p>
      )}

      {srcUrls.length > 0 && (
        <section className="space-y-3">
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-2 rounded bg-gray-200"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              Prev
            </button>
            <button
              type="button"
              className="px-3 py-2 rounded bg-gray-800 text-white disabled:opacity-50"
              disabled={!canProceed}
              onClick={handleNext}
            >
              Save & Next
            </button>
          </div>
        </section>
      )}

      {finalPreviews.length > 0 && (
        <section className="space-y-2">
          <h3 className="font-medium">
            Preview (cropped + compressed + watermarked)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {finalPreviews.map(
              (src, i) =>
                src && (
                  <img
                    key={i}
                    src={src}
                    alt={`final-${i}`}
                    className="w-40 h-40 object-cover rounded"
                  />
                )
            )}
          </div>
        </section>
      )}

      <button
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        disabled={srcUrls.length === 0}
        onClick={handleSubmit(onSubmit)}
      >
        Upload All
      </button>
    </main>
  );
}
