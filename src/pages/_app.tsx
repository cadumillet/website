import "@/styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";

const CommandPalette = dynamic(() => import("@/components/CommandPalette"), {
  ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <CommandPalette />
    </>
  );
}
