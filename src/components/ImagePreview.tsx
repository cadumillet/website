import { useEffect, useState } from "react";

type Props = {
  images: string[];
  initialIndex: number;
  onClose: () => void;
};

export default function ImagePreview({ images, initialIndex, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [fitMode, setFitMode] = useState<"width" | "height">("height");

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  // Keyboard navigation and scroll lock while preview is open
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [images.length, onClose]);

  const src = images[index];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black"
      onClick={onClose}
    >
      {images.length > 1 && null}
      <div
        className={`${
          fitMode === "width"
            ? "max-w-[min(90vw,1400px)] max-h-[90vh]"
            : "h-[90vh] max-w-[90vw]"
        } overflow-auto no-scrollbar`}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt=""
          className={`${
            fitMode === "width" ? "w-full h-auto" : "h-full w-auto"
          } object-contain ${
            fitMode === "width" ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={() =>
            setFitMode((m) => (m === "width" ? "height" : "width"))
          }
        />
      </div>
      {images.length > 1 && null}
    </div>
  );
}
