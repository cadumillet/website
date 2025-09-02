import { useEffect, useState } from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import mdxComponents from "@/mdx-components";
import Gallery from "./Gallery";
import { ImagePreviewProvider } from "./ImagePreviewProvider";

export default function ProjectModal({
  slug,
  onClose,
}: {
  slug: string;
  onClose: () => void;
}) {
  const [project, setProject] = useState<{
    mdxSource: MDXRemoteSerializeResult;
    frontMatter: any;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/project?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(setProject)
      .catch(() => setProject(null));
  }, [slug]);

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
        className="fixed inset-0 z-50 overflow-y-auto py-15"
        style={{
          backgroundColor: "#00000030",
        }}
        onClick={onClose}
      >
        <div
          className="relative max-w-7xl mx-auto shadow-2xl markdown"
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
