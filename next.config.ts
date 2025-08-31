import withMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMdx = withMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

export default withMdx(nextConfig);
