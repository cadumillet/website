import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'

const contentPath = path.join(process.cwd(), 'src/content')

export function getProjectSlugs() {
  return fs.readdirSync(contentPath).filter(file => file.endsWith('.mdx'))
}

export function getProjectBySlug(slug: string) {
  const mdxPath = path.join(contentPath, `${slug}.mdx`)
  const source = fs.readFileSync(mdxPath, 'utf-8')
  const { content, data } = matter(source)
  return { content, data }
}

export async function getSerializedProject(slug: string) {
  const { content, data } = getProjectBySlug(slug)
  const mdxSource = await serialize(content)
  return { mdxSource, frontMatter: data }
}