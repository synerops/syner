"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  FilePlus,
  FolderOpen,
  Settings,
  Bot,
  FileText,
} from "lucide-react";

interface RecentFile {
  name: string;
  path: string;
  lastOpened: number;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNewFile: () => void;
  onOpenFile: () => void;
  onAskSyner?: () => void;
}

const RECENT_FILES_KEY = "syner-recent-files";
const MAX_RECENT_FILES = 5;

export function useRecentFiles() {
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_FILES_KEY);
    if (stored) {
      try {
        setRecentFiles(JSON.parse(stored));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  const addRecentFile = useCallback((name: string, path: string = name) => {
    setRecentFiles((prev) => {
      const filtered = prev.filter((f) => f.path !== path);
      const updated = [
        { name, path, lastOpened: Date.now() },
        ...filtered,
      ].slice(0, MAX_RECENT_FILES);
      localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentFiles = useCallback(() => {
    localStorage.removeItem(RECENT_FILES_KEY);
    setRecentFiles([]);
  }, []);

  return { recentFiles, addRecentFile, clearRecentFiles };
}

export function CommandPalette({
  open,
  onOpenChange,
  onNewFile,
  onOpenFile,
  onAskSyner,
}: CommandPaletteProps) {
  const { recentFiles } = useRecentFiles();

  const runCommand = useCallback(
    (command: () => void) => {
      onOpenChange(false);
      command();
    },
    [onOpenChange]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search files, commands, or ask syner..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {recentFiles.length > 0 ? (
          <CommandGroup heading="Recent">
            {recentFiles.map((file) => (
              <CommandItem
                key={file.path}
                onSelect={() => {
                  // In local mode, we can't re-open recent files easily
                  // This will be more useful in GitHub mode
                  onOpenChange(false);
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>{file.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  (recent)
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        <CommandSeparator />

        <CommandGroup heading="Commands">
          <CommandItem onSelect={() => runCommand(onNewFile)}>
            <FilePlus className="mr-2 h-4 w-4" />
            <span>New file</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(onOpenFile)}>
            <FolderOpen className="mr-2 h-4 w-4" />
            <span>Open file</span>
          </CommandItem>
          {onAskSyner ? (
            <CommandItem onSelect={() => runCommand(onAskSyner)}>
              <Bot className="mr-2 h-4 w-4" />
              <span>Ask syner about selection...</span>
            </CommandItem>
          ) : null}
          <CommandItem disabled>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <span className="ml-auto text-xs text-muted-foreground">
              Coming soon
            </span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
