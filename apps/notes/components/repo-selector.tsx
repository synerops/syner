"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FolderGit2, Plus, Loader2 } from "lucide-react";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  owner: string;
  private: boolean;
  description: string | null;
}

interface RepoSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRepoSelected: (repo: { owner: string; name: string }) => void;
}

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Failed to load repositories");
    return r.json();
  });

export function RepoSelector({
  open,
  onOpenChange,
  onRepoSelected,
}: RepoSelectorProps) {
  const [selecting, setSelecting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useSWR<{ repos: Repo[] }>(
    open ? "/api/repos" : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const repos = data?.repos ?? [];

  const selectRepo = useCallback(
    async (repo: Repo) => {
      setSelecting(true);
      setError(null);
      try {
        const response = await fetch("/api/repos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ owner: repo.owner, name: repo.name }),
        });
        if (!response.ok) throw new Error("Failed to select repository");
        const result = await response.json();
        onRepoSelected(result.repo);
        onOpenChange(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to select repository");
      } finally {
        setSelecting(false);
      }
    },
    [onRepoSelected, onOpenChange]
  );

  const createKbRepo = useCallback(async () => {
    setCreating(true);
    setError(null);
    try {
      const response = await fetch("/api/repos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ create: true, name: "kb" }),
      });
      if (!response.ok) throw new Error("Failed to create repository");
      const result = await response.json();
      onRepoSelected(result.repo);
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create repository");
    } finally {
      setCreating(false);
    }
  }, [onRepoSelected, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select a Repository</DialogTitle>
          <DialogDescription>
            Choose an existing repository or create a new one to store your notes.
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-1">
              {repos.map((repo) => (
                <button
                  key={repo.id}
                  onClick={() => selectRepo(repo)}
                  disabled={selecting}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-accent disabled:opacity-50"
                >
                  <FolderGit2 className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 overflow-hidden">
                    <div className="truncate font-medium">{repo.full_name}</div>
                    {repo.description ? (
                      <div className="truncate text-xs text-muted-foreground">
                        {repo.description}
                      </div>
                    ) : null}
                  </div>
                  {repo.private ? (
                    <span className="text-xs text-muted-foreground">Private</span>
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={createKbRepo}
            disabled={creating}
            className="w-full"
          >
            {creating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Create "kb" Repository
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
