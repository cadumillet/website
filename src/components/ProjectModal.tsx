import { useEffect, useMemo, useState } from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import type { FrontMatter } from "@/lib/mdx";
import mdxComponents from "@/mdx-components";
import Gallery from "./Gallery";
import { ImagePreviewProvider } from "./ImagePreviewProvider";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export default function ProjectModal({
  slug,
  onClose,
  onLoaded,
}: {
  slug: string;
  onClose: () => void;
  onLoaded?: () => void;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [project, setProject] = useState<{
    mdxSource: MDXRemoteSerializeResult;
    frontMatter: FrontMatter;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/project?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        setProject(data);
        onLoaded?.();
      })
      .catch(() => {
        setProject(null);
        onLoaded?.();
      });
  }, [slug, onLoaded]);

  const shortcuts = useMemo(
    () => [
      {
        key: ["f", "F"],
        handler: () => setIsFullscreen((prev) => !prev),
      },
      {
        key: ["Escape", "Esc"],
        handler: () => onClose(),
      },
    ],
    [onClose]
  );

  useKeyboardShortcuts(shortcuts);

  if (!project) return null;

  const style = {
    color: project.frontMatter.textColor,
    backgroundColor: project.frontMatter.backgroundColor,
    fontFamily: project.frontMatter.fontFamily,
  };

  return (
    <ImagePreviewProvider>
      <div
        className={`fixed inset-0 z-50 overflow-y-auto py-0 bg-white ${
          isFullscreen ? "lg:py-0" : "lg:py-15"
        }`}
        data-project-modal-scroll
        onClick={onClose}
      >
        <div
          className={`relative mx-auto shadow-2xl markdown max-w-none w-full min-h-screen ${
            isFullscreen
              ? "lg:max-w-none lg:w-full lg:min-h-screen"
              : "lg:max-w-7xl lg:w-auto lg:min-h-0"
          }`}
          style={style}
          onClick={(e) => e.stopPropagation()}
        >
          <MDXRemote
            {...project.mdxSource}
            components={{
              ...mdxComponents,
              Gallery: (props) => <Gallery {...props} />,
            }}
          />
        </div>
      </div>
    </ImagePreviewProvider>
  );
}
