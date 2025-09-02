import Gallery from "./components/Gallery";

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="max-w-3xl mx-auto" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="max-w-3xl mx-auto" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="max-w-3xl mx-auto" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="max-w-3xl mx-auto" {...props} />
  ),
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className="max-w-3xl mx-auto" {...props} />
  ),
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 className="max-w-3xl mx-auto" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="max-w-3xl mx-auto" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="max-w-3xl mx-auto" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="max-w-3xl mx-auto" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="max-w-3xl mx-auto" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="max-w-3xl mx-auto" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="max-w-3xl mx-auto" {...props} />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className="max-w-3xl mx-auto" alt={props.alt ?? ""} {...props} />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="max-w-3xl mx-auto" {...props} />
  ),
  a: (props: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a className="max-w-3xl mx-auto" {...props} />
  ),
  Gallery,
};

export default mdxComponents;
