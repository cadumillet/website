import { GetStaticPaths, GetStaticProps } from "next";
import { getProjectSlugs, getSerializedProject } from "@/lib/mdx";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import mdxComponents from "@/mdx-components";
import Gallery from "@/components/Gallery";
import { ImagePreviewProvider } from "@/components/ImagePreviewProvider";

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getProjectSlugs(); // e.g. ['photography/project-a.mdx']
  return {
    paths: slugs.map((slug) => ({
      params: { slug: slug.replace(/\.mdx$/, "").split("/") }, // → ['photography', 'project-a']
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slugArray = params?.slug as string[]; // ['photography', 'project-a']
  const slug = slugArray.join("/"); // 'photography/project-a'
  const { mdxSource, frontMatter } = await getSerializedProject(slug);
  return { props: { mdxSource, frontMatter } };
};

export default function ProjectPage({
  mdxSource,
  frontMatter,
}: {
  mdxSource: MDXRemoteSerializeResult;
  frontMatter: any;
}) {
  const style = {
    color: frontMatter.textColor,
    backgroundColor: frontMatter.backgroundColor,
    fontFamily: frontMatter.fontFamily,
    "--content-spacing": frontMatter.padding,
  };
  return (
    <ImagePreviewProvider>
      <main className="markdown" style={style}>
        <MDXRemote
          {...mdxSource}
          components={{
            ...mdxComponents,
            Gallery: (props) => (
              <Gallery padding={frontMatter.padding} {...props} />
            ),
          }}
        />
      </main>
    </ImagePreviewProvider>
  );
}
