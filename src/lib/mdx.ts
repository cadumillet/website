import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import glob from "fast-glob";

const contentPath = path.join(process.cwd(), "src/content");

export function getProjectSlugs() {
  const files = glob.sync("**/*.mdx", { cwd: contentPath });
  return files; // returns e.g., ['photography/project-a.mdx', 'writing/project-b.mdx']
}

export function getProjectBySlug(slug: string) {
  const mdxPath = path.join(contentPath, `${slug}.mdx`);
  const source = fs.readFileSync(mdxPath, "utf-8");
  const { content, data } = matter(source);
  return { content, data };
}

export async function getSerializedProject(slug: string) {
  const { content, data } = getProjectBySlug(slug);
  const mdxSource = await serialize(content);
  return { mdxSource, frontMatter: data };
}

export function getAllProjects() {
  const files = getProjectSlugs(); // e.g., ['photography/project-a.mdx']

  return files.map((file) => {
    const slug = file.replace(/\.mdx$/, ""); // → 'photography/project-a'
    const filePath = path.join(contentPath, file);
    const source = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(source);

    return {
      slug, // ✅ derived from file path
      ...data, // frontMatter (title, textColor, etc.)
    };
  });
}
