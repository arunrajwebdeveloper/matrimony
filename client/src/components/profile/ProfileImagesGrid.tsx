"use client";

import useFancybox from "@/lib/useFancybox";

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
        <img src={item} alt="" className="h-full w-full object-cover" />
      </a>
    );
  };

  return (
    <div ref={fancyboxRef} className="relative w-full px-6 py-4">
      <div className="w-full overflow-hidden rounded md:h-[360px]">
        {/* === One media === */}
        {gridItems.length === 1 && (
          <div className="h-full w-full">{renderMedia(gridItems[0], 0)}</div>
        )}

        {/* === Two media items === */}
        {gridItems.length === 2 && (
          <div className="flex h-full gap-1">
            {gridItems.map((item: string, i: number) => (
              <div key={i} className="h-full w-1/2">
                {renderMedia(item, i)}
              </div>
            ))}
          </div>
        )}

        {/* === Three or four media items === */}
        {gridItems.length >= 3 && (
          <div className="flex h-full flex-col gap-1 md:flex-row">
            {/* Column 1: First item full height */}
            <div className="flex-1">{renderMedia(gridItems[0], 0)}</div>

            {/* Column 2: two stacked items (1 or 2 items) */}
            <div className="flex flex-1 flex-row gap-1 md:flex-col">
              {gridItems[1] && (
                <div className="flex-1 md:h-1/2">
                  {renderMedia(gridItems[1], 1)}
                </div>
              )}
              {gridItems[2] && (
                <div className="flex-1 md:h-1/2 relative">
                  {renderMedia(gridItems[2], 2)}
                  {remainingImages > 0 && (
                    <div className="absolute py-1 px-2 bottom-1 right-1 select-none rounded bg-black/50 text-xs font-normal text-white z-20">
                      {`${remainingImages} more images`}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden Lightbox Anchors for all images */}
      <div className="hidden">
        {lightboxImages.map((item: string, i: number) => (
          <a key={i} data-fancybox="gallery" href={item}>
            <img src={item} alt={`profile-image-${i}`} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ProfileImagesGrid;
