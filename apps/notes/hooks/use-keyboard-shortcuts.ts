"use client";

import { useEffect } from "react";

interface KeyboardShortcutActions {
  onSave: () => void;
  onOpen: () => void;
  onNew: () => void;
  onPalette?: () => void;
}

export function useKeyboardShortcuts({
  onSave,
  onOpen,
  onNew,
  onPalette,
}: KeyboardShortcutActions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      switch (e.key.toLowerCase()) {
        case "s":
          e.preventDefault();
          onSave();
          break;
        case "o":
          e.preventDefault();
          onOpen();
          break;
        case "n":
          e.preventDefault();
          onNew();
          break;
        case "k":
          if (onPalette) {
            e.preventDefault();
            onPalette();
          }
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSave, onOpen, onNew, onPalette]);
}
