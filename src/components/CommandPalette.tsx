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
    { enabled: true }
  );

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
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 md:p-10"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-2xl rounded-xl bg-white text-black shadow-2xl overflow-hidden"
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
        <div className="max-h-[60vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No results</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filtered.map((item, idx) => (
                <li
                  key={item.slug}
                  className={`flex items-center gap-3 p-3 cursor-pointer ${
                    idx === activeIndex ? "bg-gray-100" : ""
                  }`}
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
                    <div className="truncate text-xs text-gray-500">
                      {item.slug}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
