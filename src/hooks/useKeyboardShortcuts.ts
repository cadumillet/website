import { useEffect } from "react";

export type KeyboardShortcut = {
  key: string | string[];
  handler: (event: KeyboardEvent) => void;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  preventDefault?: boolean; // defaults to true
  when?: boolean; // defaults to true
};

type UseKeyboardShortcutsOptions = {
  enabled?: boolean;
  target?: Window | Document | HTMLElement;
};

function normalizeKey(key: string): string {
  const lowered = key.toLowerCase();
  if (lowered === "esc") return "escape";
  return lowered;
}

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[] | null | undefined,
  options?: UseKeyboardShortcutsOptions
): void {
  const { enabled = true, target } = options ?? {};

  useEffect(() => {
    if (!enabled || !shortcuts || shortcuts.length === 0) return;

    const normalizedShortcuts = shortcuts.map((s) => ({
      ...s,
      keys: (Array.isArray(s.key) ? s.key : [s.key]).map(normalizeKey),
    }));

    const handleKeyDown = (event: KeyboardEvent) => {
      const eventKey = normalizeKey(event.key);

      for (const s of normalizedShortcuts as Array<
        KeyboardShortcut & { keys: string[] }
      >) {
        if (s.when === false) continue;
        if (s.ctrl && !event.ctrlKey) continue;
        if (s.shift && !event.shiftKey) continue;
        if (s.alt && !event.altKey) continue;
        if (s.meta && !event.metaKey) continue;

        if (s.keys.includes(eventKey)) {
          if (s.preventDefault !== false) {
            event.preventDefault();
          }
          s.handler(event);
          break;
        }
      }
    };

    const targetEl: Window | Document | HTMLElement = target ?? window;
    targetEl.addEventListener("keydown", handleKeyDown as EventListener);

    return () => {
      targetEl.removeEventListener("keydown", handleKeyDown as EventListener);
    };
  }, [enabled, target, ...(shortcuts ?? [])]);
}
