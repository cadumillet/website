import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const isScrollingDown = y > lastY + 4;
      const isScrollingUp = y < lastY - 4;

      if (isScrollingDown && y > 40) {
        setIsHidden(true);
      } else if (isScrollingUp) {
        setIsHidden(false);
      }

      setLastY(y);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () =>
      window.removeEventListener("scroll", onScroll as EventListener);
  }, [lastY]);

  const metaSymbol = useMemo(() => {
    if (typeof navigator === "undefined") return "⌘";
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    return isMac ? "⌘" : "Ctrl";
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-3 z-40 flex justify-center transition-transform duration-300 ${
        isHidden ? "-translate-y-16" : "translate-y-0"
      } pointer-events-none`}
    >
      <button
        type="button"
        aria-label="Open search (Cmd+K)"
        onClick={() => {
          window.dispatchEvent(new Event("command-palette:open"));
        }}
        className="pointer-events-auto cursor-pointer flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-100 px-3 py-1.5 text-sm text-gray-700 backdrop-blur-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10"
      >
        <span className="text-gray-500">Search…</span>
        <span className="ml-1 inline-flex items-center gap-1 text-gray-500">
          <kbd className="pointer-events-none flex h-5 w-5 items-center justify-center rounded bg-white text-gray-500 border border-gray-300 font-sans text-[0.7rem] font-medium select-none">
            {metaSymbol}
          </kbd>
          <kbd className="pointer-events-none flex h-5 w-5 items-center justify-center rounded bg-white text-gray-500 border border-gray-300 font-sans text-[0.7rem] font-medium select-none">
            K
          </kbd>
        </span>
      </button>
    </div>
  );
}
