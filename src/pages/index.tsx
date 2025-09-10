import { getAllProjects } from "@/lib/mdx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

type ProjectModalProps = { slug: string; onClose: () => void };
const ProjectModal = dynamic<ProjectModalProps>(
  () => import("@/components/ProjectModal")
);

type Project = {
  slug: string;
  title: string;
  thumbnail: string;
};

export const getStaticProps = async () => {
  const projects = getAllProjects();
  return { props: { projects } };
};

export default function Home({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [modalSlug, setModalSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    const project = router.query.project;
    setModalSlug(typeof project === "string" ? project : null);
  }, [router.isReady, router.query.project]);

  const openModal = (slug: string) => {
    router.push({ pathname: "/", query: { project: slug } }, undefined, {
      shallow: true,
    });
  };

  const closeModal = () => {
    setModalSlug(null);
    router.push({ pathname: "/" }, undefined, { shallow: true });
  };

  return (
    <main className="container mx-auto">
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-0.5 p-1 lg:p-15">
        {projects.map((project: Project) => (
          <button
            key={project.slug}
            onClick={() => openModal(project.slug)}
            className="group relative text-left cursor-pointer focus:outline-none aspect-[4/3] overflow-hidden"
          >
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full block object-cover"
            />
            <span className="pointer-events-none absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {project.slug}
            </span>
          </button>
        ))}
      </div>

      {modalSlug && <ProjectModal slug={modalSlug} onClose={closeModal} />}
    </main>
  );
}
