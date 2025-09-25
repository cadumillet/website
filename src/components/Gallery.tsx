import { useEffect, useRef, useState } from "react";
import { useImagePreviewContext } from "./ImagePreviewProvider";

type Props = {
  images: string[];
  columns?: number;
  fullWidth?: boolean;
};

export default function Gallery({ images, columns = 3, fullWidth }: Props) {
  // Intrinsic aspect ratios for each image (computed on load): width / height
  // Used to make each grid row have a uniform height that adapts to the widest
  // image in that row.
  const [ratios, setRatios] = useState<number[]>([]);
  const previewCtx = useImagePreviewContext();
  const galleryIdRef = useRef<number | null>(null);
  useEffect(() => {
    if (!previewCtx) return;
    galleryIdRef.current = previewCtx.registerGallery(images);
    return () => {
      if (galleryIdRef.current !== null)
        previewCtx.unregisterGallery(galleryIdRef.current);
    };
  }, [images, previewCtx]);
  // On <lg screens, 20px horizontal padding; on lg+, 60px (consistent with markdown rhythm).
  if (images.length === 1) {
    return (
      <div className={`mb-5 lg:mb-15 ${fullWidth ? "px-0" : "px-5 lg:px-15"}`}>
        <img
          src={images[0]}
          className="w-full cursor-pointer"
          alt=""
          onClick={() => previewCtx?.openAt(galleryIdRef.current!, 0)}
        />
      </div>
    );
  }

  return (
    <div
      className={`mb-5 lg:mb-15 ${
        fullWidth
          ? "grid gap-0.5 items-start px-0"
          : "grid gap-0.5 items-start px-5 lg:px-15"
      }`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {images.map((src, i) => {
        // Determine this tile's row boundaries based on the configured column count
        const rowIndex = Math.floor(i / columns);
        const rowStart = rowIndex * columns;
        const rowEnd = Math.min(rowStart + columns, images.length);
        // Collect known aspect ratios for the images in the current row
        const rowRatios = ratios
          .slice(rowStart, rowEnd)
          .filter((r): r is number => typeof r === "number");
        // The row's uniform height is driven by the widest image in the row
        // (max width/height). If no ratios are known yet (initial paint), fall
        // back to 1:1 to avoid layout shifts.
        const targetAspectRatio =
          rowRatios.length > 0 ? Math.max(...rowRatios) : 1; // width / height

        return (
          <div
            key={i}
            className="w-full overflow-hidden cursor-pointer"
            style={{ aspectRatio: targetAspectRatio }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              // object-cover: if a row mixes wide (e.g. 16/9) and tall (e.g. 3/4)
              // images, tall images will be cropped vertically to match the row
              // height (set by the widest image). When all images in a row are
              // tall and share similar ratios, no cropping occurs because the
              // row aspect matches them.
              onClick={() => previewCtx?.openAt(galleryIdRef.current!, i)}
              onLoad={(e) => {
                const img = e.currentTarget;
                const aspect = img.naturalWidth / img.naturalHeight;
                setRatios((prev) => {
                  const next = prev.slice();
                  next[i] = aspect;
                  return next;
                });
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
