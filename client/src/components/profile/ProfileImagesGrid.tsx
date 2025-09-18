"use client";

import useFancybox from "@/hooks/useFancybox";
import { Image } from "lucide-react";

const ProfileImagesGrid = ({ mediaItems = [] }: { mediaItems?: string[] }) => {
  const [fancyboxRef] = useFancybox({
    //  custom options
    theme: "light",
  });

  const gridItems = mediaItems?.slice(0, 3);

  const lightboxImages = mediaItems?.filter(
    (item: string) => !gridItems.includes(item)
  );

  const totalImageCount = mediaItems?.length;

  const displayedImageCount = gridItems?.length;
  const remainingImages = totalImageCount - displayedImageCount;

  const renderMedia = (item: string, index: number) => {
    return (
      <a
        key={index}
        data-fancybox="gallery"
        href={item}
        className="block h-full w-full"
      >
        <img
          src={item}
          alt={`gallery-image-${index}`}
          className="h-full w-full object-cover"
        />
      </a>
    );
  };

  return (
    <div ref={fancyboxRef} className="relative w-full px-6 py-4">
      <h3 className="flex items-center font-semibold text-black text-md mb-6">
        <Image size={20} className="mr-2 text-black" />
        User Images
      </h3>
      {mediaItems?.length !== 0 ? (
        <div className="w-full overflow-hidden rounded-2xl">
          {/* === One media === */}
          {gridItems.length === 1 && (
            <div className="h-full w-full">{renderMedia(gridItems[0], 0)}</div>
          )}

          {/* === Two media items === */}
          {gridItems.length === 2 && (
            <div className="flex h-full gap-2">
              {gridItems.map((item: string, i: number) => (
                <div key={i} className="h-full w-1/2">
                  {renderMedia(item, i)}
                </div>
              ))}
            </div>
          )}

          {/* === Three or four media items === */}
          {gridItems.length >= 3 && (
            <div className="flex h-full flex-col gap-2 md:flex-row">
              {/* Column 1: First item full height */}
              <div className="flex-1 md:basis-1">
                {renderMedia(gridItems[0], 0)}
              </div>

              {/* Column 2: two stacked items (1 or 2 items) */}
              <div className="flex flex-1 flex-row gap-2 md:flex-col">
                {gridItems[1] && (
                  <div className="flex-1 md:basis-1/2">
                    {renderMedia(gridItems[1], 1)}
                  </div>
                )}
                {gridItems[2] && (
                  <div className="flex-1 md:basis-1/2 relative">
                    {renderMedia(gridItems[2], 2)}
                    {remainingImages > 0 && (
                      <div className="absolute py-2 px-4 bottom-3 right-3 select-none rounded-2xl pointer-events-none bg-slate-600/50 text-xs font-medium text-white z-20">
                        {`${remainingImages} more ${
                          remainingImages > 1 ? `images` : `image`
                        }`}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className="m-0 text-sm font-normal text-gray-600 ">
            Profile images not uploaded yet.
          </p>
        </div>
      )}

      {/* Hidden Lightbox Anchors for all images */}
      <div className="hidden">
        {lightboxImages.map((item: string, i: number) => (
          <a key={i} data-fancybox="gallery" href={item}>
            <img src={item} alt={`gallery-image-${i}`} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ProfileImagesGrid;
