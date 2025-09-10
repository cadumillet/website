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
}: {
  slug: string;
  onClose: () => void;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [project, setProject] = useState<{
    mdxSource: MDXRemoteSerializeResult;
    frontMatter: FrontMatter;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/project?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(setProject)
      .catch(() => setProject(null));
  }, [slug]);

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
    "--content-spacing": project.frontMatter.padding,
  };

  return (
    <ImagePreviewProvider>
      <div
        className={`fixed inset-0 z-50 overflow-y-auto ${
          isFullscreen ? "py-0" : "py-15"
        }`}
        onClick={onClose}
      >
        <div
          className={`relative mx-auto shadow-2xl markdown ${
            isFullscreen ? "max-w-none w-full min-h-screen" : "max-w-7xl"
          }`}
          style={style}
          onClick={(e) => e.stopPropagation()}
        >
          <MDXRemote
            {...project.mdxSource}
            components={{
              ...mdxComponents,
              Gallery: (props) => (
                <Gallery padding={project.frontMatter.padding} {...props} />
              ),
            }}
          />
        </div>
      </div>
    </ImagePreviewProvider>
  );
}
