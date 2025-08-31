import Gallery from "./components/Gallery";

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="container" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="container" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="container" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="container" {...props} />
  ),
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className="container" {...props} />
  ),
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 className="container" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="container" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="container" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="container" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="container" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="container" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="container" {...props} />
  ),
  img: (props: React.HTMLAttributes<HTMLImageElement>) => (
    <img className="container" {...props} />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="container" {...props} />
  ),
  a: (props: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a className="container" {...props} />
  ),
  Gallery,
};

export default mdxComponents;
