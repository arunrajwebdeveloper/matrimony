// components/ImageCropper.tsx
"use client";

import { Pixels } from "@/types/imageCropper";
import { useState } from "react";
import Cropper from "react-easy-crop";

export default function ImageCropper({
  imageSrc,
  onCropComplete,
  initialZoom = 1,
  className,
  aspect = 1,
}: {
  imageSrc: string;
  onCropComplete: (area: Pixels) => void;
  initialZoom?: number;
  className?: string;
  aspect?: number;
}) {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(initialZoom);

  return (
    <div
      className={
        // className ?? "relative w-full h-72 bg-white rounded-sm overflow-hidden"
        className ?? "relative w-full h-[340px] bg-white overflow-hidden "
      }
    >
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={aspect} // square
        cropShape="rect" // can be "round" if needed
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={(_, area) => onCropComplete(area as Pixels)}
        restrictPosition={true}
        showGrid={true}
      />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/60 h-8 rounded-lg flex items-center px-4">
        <input
          id="zoom-range"
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="range"
        />
      </div>
    </div>
  );
}
