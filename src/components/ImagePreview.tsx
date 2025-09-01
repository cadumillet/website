import { useEffect, useState } from "react";

type Props = {
  images: string[];
  initialIndex: number;
  onClose: () => void;
};

export default function ImagePreview({ images, initialIndex, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);

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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      {images.length > 1 && (
        <button
          aria-label="Previous image"
          className="absolute left-0 top-0 h-full w-1/5 md:w-1/6 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIndex((i) => (i - 1 + images.length) % images.length);
          }}
        />
      )}
      <div
        className="max-w-[min(90vw,1400px)] max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt="" className="w-full h-full object-contain" />
      </div>
      {images.length > 1 && (
        <button
          aria-label="Next image"
          className="absolute right-0 top-0 h-full w-1/5 md:w-1/6 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIndex((i) => (i + 1) % images.length);
          }}
        />
      )}
      <button
        aria-label="Close"
        className="absolute top-3 right-3 text-white/80 hover:text-white text-xl"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        ×
      </button>
    </div>
  );
}
