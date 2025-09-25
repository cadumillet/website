import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

type ProjectItem = {
  slug: string;
  title?: string;
  thumbnail?: string;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useKeyboardShortcuts(
    [
      {
        key: ["k", "K"],
        meta: true,
        handler: () => setOpen(true),
      },
      {
        key: ["k", "K"],
        ctrl: true,
        handler: () => setOpen(true),
      },
      {
        key: ["Escape", "Esc"],
        handler: () => setOpen(false),
        when: open,
      },
    ],
    { enabled: true, useCapture: true }
  );

  // Lock body scroll while palette is open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    fetch("/api/projects")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data: ProjectItem[]) => setItems(data))
      .catch(() => setItems([]));
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // Allow opening via global event from navbar button
  useEffect(() => {
    const onOpen = (_e: Event) => setOpen(true);
    if (typeof window !== "undefined") {
      window.addEventListener("command-palette:open", onOpen as EventListener);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "command-palette:open",
          onOpen as EventListener
        );
      }
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      [it.slug, it.title]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    );
  }, [items, query]);

  useEffect(() => {
    if (activeIndex >= filtered.length) setActiveIndex(0);
  }, [filtered.length, activeIndex]);

  const onKeyDownList = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (i) =>
          (i - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1)
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filtered[activeIndex];
      if (selected) {
        setOpen(false);
        router.push(
          { pathname: "/", query: { project: selected.slug } },
          undefined,
          {
            shallow: true,
          }
        );
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
      onClick={() => setOpen(false)}
      onWheel={(e) => {
        const target = document.querySelector(
          "[data-project-modal-scroll]"
        ) as HTMLElement | null;
        if (target) {
          e.preventDefault();
          target.scrollBy({ top: e.deltaY, behavior: "auto" });
        }
      }}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        if (!touch) return;
        const target = document.querySelector(
          "[data-project-modal-scroll]"
        ) as HTMLElement | null;
        if (target) {
          // Let default touch scrolling occur inside modal content only
          // Prevent background scroll by canceling here
          e.preventDefault();
        }
      }}
      onScroll={(e) => {
        // Prevent document scroll while palette is open
        e.preventDefault();
      }}
    >
      <div
        className="w-full max-w-2xl rounded-xl bg-white/80 backdrop-blur-md text-black shadow-2xl overflow-hidden border border-gray-200 flex flex-col h-[28rem] max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDownList}
      >
        <div className="border-b border-gray-200 p-3">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-transparent outline-none placeholder-gray-400 text-base"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No results</div>
          ) : (
            <ul className="p-1">
              {filtered.map((item, idx) => (
                <li
                  key={item.slug}
                  className="p-1"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => {
                    setOpen(false);
                    router.push(
                      { pathname: "/", query: { project: item.slug } },
                      undefined,
                      { shallow: true }
                    );
                  }}
                >
                  <div
                    className={`flex items-center gap-3 rounded-md p-2 cursor-pointer ${
                      idx === activeIndex ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                  >
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="h-8 w-8 rounded object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded bg-gray-200" />
                    )}
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {item.title || item.slug}
                      </div>
                    </div>
                    <span className="ml-auto truncate text-xs text-gray-500">
                      {item.slug}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-gray-200 bg-white/60 backdrop-blur-sm px-3 py-2 text-xs text-gray-600 flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-wide text-gray-500">
            Project shortcuts:
          </span>
          <div className="flex items-center gap-2">
            <kbd className="pointer-events-none flex h-5 w-5 items-center justify-center rounded bg-white text-gray-500 border border-gray-300 font-sans text-[0.7rem] font-medium select-none">
              F
            </kbd>
            <span>Fullscreen</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="pointer-events-none flex h-5 w-5 items-center justify-center rounded bg-white text-gray-500 border border-gray-300 font-sans text-[0.7rem] font-medium select-none">
              ?
            </kbd>
            <span>Info</span>
          </div>
        </div>
      </div>
    </div>
  );
}
