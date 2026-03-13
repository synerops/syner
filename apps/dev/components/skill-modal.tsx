"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import type { SkillContent } from "@syner/sdk/skills";

interface SkillModalProps {
  skill: SkillContent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
}

export function SkillModal({
  skill,
  open,
  onOpenChange,
  loading,
}: SkillModalProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!skill) return;
    await navigator.clipboard.writeText(skill.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[80vh] w-[calc(100%-2rem)] max-w-4xl flex-col">
        <DialogHeader className="shrink-0">
          <div className="flex items-center gap-3">
            <DialogTitle className="font-mono text-lg">
              {loading ? "Loading..." : skill ? `/${skill.slug}` : "Skill"}
            </DialogTitle>
            {!loading && skill?.version && (
              <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">
                v{skill.version}
              </span>
            )}
            {!loading && skill && (
              <span className="rounded bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                {skill.category}
              </span>
            )}
          </div>
        </DialogHeader>
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
          </div>
        ) : skill ? (
          <>
            <p className="shrink-0 text-sm text-zinc-600 dark:text-zinc-400">
              {skill.description}
            </p>
            <div className="relative mt-4 flex-1 overflow-y-auto rounded-lg bg-zinc-50 dark:bg-zinc-900">
              <button
                type="button"
                onClick={handleCopy}
                className="absolute right-2 top-2 rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                aria-label={copied ? "Copied" : "Copy to clipboard"}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
              <pre className="whitespace-pre-wrap p-4 text-sm text-zinc-700 dark:text-zinc-300">
                {skill.content}
              </pre>
            </div>
            <DialogFooter className="shrink-0">
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
