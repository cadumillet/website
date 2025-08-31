import { ReactNode } from "react";

export default function Markdown({ children }: { children: ReactNode }) {
  return <div className="markdown">{children}</div>;
}
