import React from "react";
import ImageCropper from "./ImageCropper";
import { Pixels } from "@/types/imageCropper";

interface CropModalProps {
  src: string;
  onCropComplete: React.Dispatch<React.SetStateAction<Pixels | null>>;
  onComplete: () => void;
  onCancel: () => void;
}

function ImageCropModal({
  onCancel,
  src,
  onCropComplete,
  onComplete,
}: CropModalProps) {
  return (
    <div className="fixed inset-0 h-full w-full bg-transparent z-[600]">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onCancel}></div>
      <div className="max-w-[600px] w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[605] bg-white rounded-md overflow-hidden">
        <ImageCropper imageSrc={src} onCropComplete={onCropComplete} />
        <div className="flex gap-2 p-4 justify-center items-center">
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer hover:bg-gray-600 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors"
            onClick={onComplete}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageCropModal;
