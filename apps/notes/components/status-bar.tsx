"use client";

import { useFileContext } from "@/components/file/file-context";
import { Command } from "lucide-react";

interface StatusBarProps {
  onOpenPalette: () => void;
}

export function StatusBar({ onOpenPalette }: StatusBarProps) {
  const { fileName, isDirty } = useFileContext();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-border bg-background px-4 py-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="text-foreground">{fileName}</span>
        </span>
        {isDirty ? (
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Unsaved</span>
          </span>
        ) : null}
        <span className="text-muted-foreground/60">|</span>
        <span>Local Mode</span>
      </div>
      <button
        onClick={onOpenPalette}
        className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-accent"
      >
        <Command className="h-3 w-3" />
        <span>K</span>
      </button>
    </div>
  );
}
