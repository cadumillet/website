import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import ImagePreview from "./ImagePreview";

type GalleryEntry = { id: number; images: string[] };

type ImagePreviewContextValue = {
  registerGallery: (images: string[]) => number;
  unregisterGallery: (id: number) => void;
  openAt: (galleryId: number, localIndex: number) => void;
};

const ImagePreviewContext = createContext<ImagePreviewContextValue | null>(
  null
);

export function useImagePreviewContext() {
  return useContext(ImagePreviewContext);
}

export function ImagePreviewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const nextIdRef = useRef(1);
  const [galleries, setGalleries] = useState<GalleryEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [initialIndex, setInitialIndex] = useState(0);

  const registerGallery = useCallback((images: string[]) => {
    const id = nextIdRef.current++;
    setGalleries((prev) => [...prev, { id, images }]);
    return id;
  }, []);

  const unregisterGallery = useCallback((id: number) => {
    setGalleries((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const openAt = useCallback(
    (galleryId: number, localIndex: number) => {
      const ordered = galleries;
      const flat: string[] = [];
      let startIndex = 0;
      for (const g of ordered) {
        if (g.id === galleryId) {
          startIndex = flat.length + localIndex;
        }
        flat.push(...g.images);
      }
      setAllImages(flat);
      setInitialIndex(Math.max(0, Math.min(startIndex, flat.length - 1)));
      setIsOpen(true);
    },
    [galleries]
  );

  const value = useMemo(
    () => ({ registerGallery, unregisterGallery, openAt }),
    [registerGallery, unregisterGallery, openAt]
  );

  return (
    <ImagePreviewContext.Provider value={value}>
      {children}
      {isOpen && (
        <ImagePreview
          images={allImages}
          initialIndex={initialIndex}
          onClose={() => setIsOpen(false)}
        />
      )}
    </ImagePreviewContext.Provider>
  );
}
