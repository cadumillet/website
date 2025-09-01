import { getAllProjects } from "@/lib/mdx";
import Link from "next/link";

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
  return (
    <main className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {projects.map((project: Project) => (
          <Link key={project.slug} href={`/projects/${project.slug}`}>
            <img src={project.thumbnail} className="w-full" />
          </Link>
        ))}
      </div>
    </main>
  );
}
