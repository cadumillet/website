import { getAllProjects } from "@/lib/mdx";
import Link from "next/link";
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
    <main className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {projects.map((project: Project) => (
          <button
            key={project.slug}
            onClick={() => openModal(project.slug)}
            className="text-left"
          >
            <img src={project.thumbnail} className="w-full" />
          </button>
        ))}
      </div>

      {modalSlug && <ProjectModal slug={modalSlug} onClose={closeModal} />}
    </main>
  );
}
