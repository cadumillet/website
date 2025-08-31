import { GetStaticPaths, GetStaticProps } from "next";
import { getProjectSlugs, getSerializedProject } from "@/lib/mdx";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import mdxComponents from "@/mdx-components";
import Gallery from "@/components/Gallery";

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getProjectSlugs();
  return {
    paths: slugs.map((slug) => ({
      params: { slug: slug.replace(/\.mdx$/, "") },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { mdxSource, frontMatter } = await getSerializedProject(
    params?.slug as string
  );
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
  };
  return (
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
  );
}
