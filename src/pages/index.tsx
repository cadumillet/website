import { getProjectSlugs, getProjectBySlug } from "@/lib/mdx";
import Link from "next/link";

type Project = {
  slug: string;
  title: string;
  thumbnail: string;
};

export async function getStaticProps() {
  const slugs = getProjectSlugs();
  const projects = slugs.map((slug) => {
    const { data } = getProjectBySlug(slug.replace(/\.mdx$/, ""));
    return { ...data, slug: data.slug };
  });
  return { props: { projects } };
}

export default function Home({ projects }: { projects: Project[] }) {
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {projects.map((project: Project) => (
        <Link key={project.slug} href={`/projects/${project.slug}`}>
          <div className="block group">
            <img src={project.thumbnail} className="rounded w-full" />
            <h2 className="mt-2 font-semibold">{project.title}</h2>
          </div>
        </Link>
      ))}
    </main>
  );
}
