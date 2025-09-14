"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { fileToObjectURL, processImagePipeline } from "@/lib/image";
import { Crop, Plus, Trash2 } from "lucide-react";
import ImageCropModal from "./ImageCropModal";
import { API_ENDPOINTS, FOLDER_TYPES } from "@/utils/constants";
import api from "@/lib/api";
import { ImageMultiUpload } from "@/types/imageUpload";
import { ApiResponse } from "@/types";
import ConfirmModal from "../modal/ConfirmModal";
import { getFileNameFromUrl } from "@/utils/getFilenameFromUrl";
import CircleSpinner from "../ui/CircleSpinner";

type ImageItem = {
  id: string;
  originalFile?: File; // only for new uploads
  originalUrl?: string;
  processedFile?: File;
  processedUrl?: string;
  source?: boolean; // flag for backend images
};

export default function UploadMultiplePage({
  sourceImages = [],
}: {
  sourceImages?: string[];
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<ImageItem[]>([]);
  const [activeImage, setActiveImage] = useState<ImageItem | null>(null);
  const [cropPixels, setCropPixels] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isShowConfirm, setIsShowConfirm] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

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
      source: false,
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
      `image-${Date.now().toString()}.jpg`,
      {
        compress: { maxSizeMB: 0.8, maxWidthOrHeight: 800 },
        watermark: {
          text: "© Matrimony",
          position: "bottom-right",
          opacity: 0.3,
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

  const handleCancelCrop = () => {
    if (activeImage && !activeImage.processedFile) {
      // remove unprocessed image
      setImages((prev) => prev.filter((img) => img.id !== activeImage.id));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset input file
    }

    setActiveImage(null);
    setShowModal(false);
    setCropPixels(null);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  async function uploadFiles(files: ImageItem[], type: "profile-photos") {
    const formData = new FormData();
    files?.forEach((img) => {
      if (img.processedFile) {
        formData.append("files", img.processedFile);
      }
    });

    const res = await api.post<ApiResponse<ImageMultiUpload>>(
      API_ENDPOINTS.UPLOAD.MULTIPLE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res?.data?.result;
  }

  const onSubmit = async () => {
    startTransition(async () => {
      try {
        if (!images || images.length === 0) {
          alert("Choose images to upload.");
          return;
        }

        const { files } = await uploadFiles(images, "profile-photos");
        const filenames = files?.map((file: any) => file?.filename);
        const res = await api.patch(API_ENDPOINTS.PROFILE_IMAGES_UPLOAD, {
          filenames,
        });

        setImages(
          (prev) =>
            prev?.map((img) => ({
              ...img,
              source: true,
            })) ?? []
        );

        console.log("Profile images updated:", res.data);
      } catch (err) {
        console.error("❌ Error uploading profile images:", err);
        alert("Failed to upload profile images. Please try again.");
      }
    });
  };

  const onRemoveImage = async (filename: string) => {
    startTransition(async () => {
      try {
        if (!filename) {
          alert("Filename not found.");
          return;
        }

        const res = await api.patch(API_ENDPOINTS.PROFILE_IMAGES_REMOVE, {
          filename,
        });

        console.log("✅ Profile photo remove:", res.data?.result?.message);
      } catch (err) {
        console.error("❌ Error removing profile photo:", err);
        alert("Failed to remove profile photo. Please try again.");
      }
    });
  };

  const handleClose = (): void => {
    setActiveImage(null);
    setIsShowConfirm(false);
  };

  const handleRemoveImage = (img: any) => {
    setActiveImage(img);
    setIsShowConfirm(true);
  };

  const onConfirmRemoveImage = async () => {
    if (activeImage?.processedUrl && activeImage?.source) {
      const filename = getFileNameFromUrl(activeImage?.processedUrl!);
      await onRemoveImage(filename);
    }
    removeImage(activeImage?.id!);
    setActiveImage(null);
    setShowModal(false);
    handleClose();
  };

  const MAX_SLOTS = 6;
  const processedImages = images.filter((img) => img.processedUrl);
  const emptySlots = MAX_SLOTS - processedImages.length;

  return (
    <>
      <main className="space-y-4">
        {/* Upload area (dynamic slots) */}
        <div className="flex gap-6 flex-wrap">
          {/* Show previews */}
          {processedImages?.map((img) => (
            <div
              key={img.id}
              className="relative aspect-[4/3] h-50 overflow-hidden rounded group "
            >
              <img
                src={img.processedUrl}
                alt="preview"
                className="aspect-[4/3] h-50 object-cover rounded"
              />
              {/* Delete always available */}
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-600 rounded z-20 cursor-pointer w-7 h-7 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity"
                // onClick={() => removeImage(img.id)}
                onClick={() => handleRemoveImage(img)}
              >
                <Trash2 size={18} color="white" />
              </button>
              {/* Edit only if not source */}
              {!img.source && (
                <button
                  type="button"
                  className="absolute inset-0 w-full h-full bg-blue-600/50 text-white font-normal text-xs p-1 z-10 cursor-pointer flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    setActiveImage(img); // selected image
                    setShowModal(true);
                  }}
                >
                  <Crop size={18} color="white" />
                  <span>Edit</span>
                </button>
              )}

              {/* Loader */}

              {isPending && (
                <div className="absolute inset-0 w-full h-full bg-blue-600/50 text-white p-1 z-10 flex items-center justify-center opacity-50">
                  <CircleSpinner size={50} />
                </div>
              )}
            </div>
          ))}

          {processedImages?.length !== MAX_SLOTS && (
            <label className="aspect-[4/3] h-50 group rounded-md bg-slate-50 hover:bg-slate-100 flex select-none border-2 border-dashed border-slate-400 hover:border-slate-500 cursor-pointer p-1 transition duration-300">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className=" hidden w-0 h-0 opacity-0"
                onChange={(e) => onFileChange(e.target.files?.[0])}
                disabled={isPending}
              />
              <div className="m-auto flex justify-center items-center flex-col gap-1">
                <Plus
                  size={30}
                  className="text-slate-400 group-hover:text-slate-500 transition duration-300"
                />
              </div>
            </label>
          )}

          {/* Show remaining empty slots */}
          {/* {Array.from({ length: emptySlots }).map((_, i) => (
          <label
            key={`empty-${i}`}
            className="aspect-[4/3] h-50 group rounded-md bg-slate-50 hover:bg-slate-100 flex select-none border-2 border-dashed border-slate-400 hover:border-slate-500 cursor-pointer p-1 transition duration-300"
          >
            <input
              type="file"
              accept="image/*"
              className=" hidden w-0 h-0 opacity-0"
              onChange={(e) => onFileChange(e.target.files?.[0])}
              disabled={isPending}
            />
            <div className="m-auto flex justify-center items-center flex-col gap-1">
              <Plus
                size={30}
                className="text-slate-400 group-hover:text-slate-500 transition duration-300"
              />
            </div>
          </label>
        ))} */}
        </div>

        {images?.some((pic) => !pic?.source && pic?.processedUrl) && (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 min-w-36"
            onClick={onSubmit}
            disabled={
              !images?.some((pic) => !pic?.source && pic?.processedUrl) ||
              isPending
            }
          >
            {isPending ? "Wait..." : "Upload"}
          </button>
        )}

        {/* Modal for Crop */}
        {showModal && activeImage && (
          <ImageCropModal
            src={activeImage.originalUrl!}
            onCropComplete={setCropPixels}
            onComplete={buildAndPreview}
            onCancel={handleCancelCrop}
            aspect={4 / 3}
          />
        )}
      </main>

      {/* CONFIRM MODAL */}

      <ConfirmModal
        isShow={isShowConfirm}
        title={"Remove Profile Photo"}
        description={"Are you sure you want to remove this profile photo?"}
        onClose={handleClose}
        onConfirm={onConfirmRemoveImage}
      />
    </>
  );
}
