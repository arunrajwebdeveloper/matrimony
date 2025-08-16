// components/ImageCropper.tsx
"use client";

import { useState } from "react";
import Cropper from "react-easy-crop";

type Pixels = { x: number; y: number; width: number; height: number };

export default function ImageCropper({
  imageSrc,
  onCropComplete,
  initialZoom = 1,
  className,
}: {
  imageSrc: string;
  onCropComplete: (area: Pixels) => void;
  initialZoom?: number;
  className?: string;
}) {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(initialZoom);

  return (
    <div
      className={
        className ?? "relative w-full h-72 bg-black rounded-lg overflow-hidden"
      }
    >
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={1} // square
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={(_, area) => onCropComplete(area as Pixels)}
        restrictPosition={false}
        showGrid={false}
      />
      <div className="absolute bottom-2 left-0 right-0 flex items-center gap-2 px-4">
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
