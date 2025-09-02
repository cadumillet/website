import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
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

export type FrontMatter = {
  title: string;
  thumbnail: string;
  date: string;
  type: string;
  textColor: string;
  backgroundColor: string;
  padding: string;
  basePath?: string;
  fontFamily?: string;
};

export async function getSerializedProject(slug: string) {
  const { content, data } = getProjectBySlug(slug);
  const mdxSource = await serialize(content, {
    scope: {
      basePath: data.basePath,
    },
  });
  return {
    mdxSource: mdxSource as MDXRemoteSerializeResult,
    frontMatter: data as FrontMatter,
  };
}

export function getAllProjects() {
  const files = getProjectSlugs(); // e.g., ['photography/project-a.mdx']

  const projects = files.map((file) => {
    const slug = file.replace(/\.mdx$/, ""); // e.g. '202501/001'
    const filePath = path.join(contentPath, file);
    const source = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(source);

    return {
      slug,
      ...data,
    };
  });

  // Sort by YYYYMM (folder) desc, then by entry index (filename) desc
  const parseSlugForSort = (slug: string) => {
    // Expecting 'YYYYMM/NNN' but be defensive
    const match = slug.match(/^(\d{6})\/(\d+)$/);
    if (!match) return { yyyymm: 0, index: 0 };
    const yyyymm = parseInt(match[1], 10);
    const index = parseInt(match[2], 10);
    return { yyyymm, index };
  };

  projects.sort((a: { slug: string }, b: { slug: string }) => {
    const A = parseSlugForSort(a.slug);
    const B = parseSlugForSort(b.slug);
    if (A.yyyymm !== B.yyyymm) return B.yyyymm - A.yyyymm;
    return B.index - A.index;
  });

  return projects;
}
