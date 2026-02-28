"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Editor } from "@tiptap/core";
import "@tiptap/markdown";
import {
  openMarkdownFile,
  saveMarkdownFile,
  saveMarkdownFileAs,
  isFileSystemAccessSupported,
} from "./file-system";

interface FileState {
  handle: FileSystemFileHandle | null;
  fileName: string;
  isDirty: boolean;
  originalContent: string;
}

interface FileContextValue extends FileState {
  openFile: () => Promise<void>;
  saveFile: () => Promise<void>;
  saveFileAs: () => Promise<void>;
  newFile: () => void;
  markDirty: () => void;
  openFileFromDrop: (content: string, fileName: string) => void;
}

const FileContext = createContext<FileContextValue | null>(null);

export function useFileContext() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
}

interface FileProviderProps {
  editor: Editor | null;
  children: React.ReactNode;
}

export function FileProvider({ editor, children }: FileProviderProps) {
  const [state, setState] = useState<FileState>({
    handle: null,
    fileName: "untitled.md",
    isDirty: false,
    originalContent: "",
  });

  const getMarkdown = useCallback((): string => {
    if (!editor) return "";
    return editor.getMarkdown();
  }, [editor]);

  const openFile = useCallback(async () => {
    if (state.isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Discard them?"
      );
      if (!confirmed) return;
    }

    try {
      const { handle, content, name } = await openMarkdownFile();
      editor?.commands.setContent(content, {
        emitUpdate: false,
        contentType: "markdown",
      });
      setState({
        handle,
        fileName: name,
        isDirty: false,
        originalContent: content,
      });
    } catch {
      // User cancelled the picker
    }
  }, [editor, state.isDirty]);

  const saveFile = useCallback(async () => {
    if (!editor) return;
    const content = getMarkdown();

    if (state.handle && isFileSystemAccessSupported()) {
      try {
        await saveMarkdownFile(state.handle, content);
        setState((prev) => ({
          ...prev,
          isDirty: false,
          originalContent: content,
        }));
      } catch {
        // Permission revoked or handle invalid — fall back to Save As
        await saveFileAs();
      }
    } else {
      await saveFileAs();
    }
  }, [editor, state.handle, getMarkdown]);

  const saveFileAs = useCallback(async () => {
    if (!editor) return;
    const content = getMarkdown();

    try {
      const handle = await saveMarkdownFileAs(content, state.fileName);
      const file = await handle.getFile();
      setState({
        handle,
        fileName: file.name,
        isDirty: false,
        originalContent: content,
      });
    } catch {
      // User cancelled or fallback download occurred
    }
  }, [editor, state.fileName, getMarkdown]);

  const newFile = useCallback(() => {
    if (state.isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Discard them?"
      );
      if (!confirmed) return;
    }

    editor?.commands.setContent("", { emitUpdate: false });
    setState({
      handle: null,
      fileName: "untitled.md",
      isDirty: false,
      originalContent: "",
    });
  }, [editor, state.isDirty]);

  const markDirty = useCallback(() => {
    setState((prev) => ({ ...prev, isDirty: true }));
  }, []);

  const openFileFromDrop = useCallback(
    (content: string, fileName: string) => {
      editor?.commands.setContent(content, {
        emitUpdate: false,
        contentType: "markdown",
      });
      setState({
        handle: null,
        fileName,
        isDirty: false,
        originalContent: content,
      });
    },
    [editor]
  );

  // Update document title
  useEffect(() => {
    const prefix = state.isDirty ? "\u2022 " : "";
    document.title = `${prefix}${state.fileName} — syner.md`;
  }, [state.fileName, state.isDirty]);

  // Warn before unload when dirty
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (state.isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [state.isDirty]);

  return (
    <FileContext.Provider
      value={{
        ...state,
        openFile,
        saveFile,
        saveFileAs,
        newFile,
        markDirty,
        openFileFromDrop,
      }}
    >
      {children}
    </FileContext.Provider>
  );
}
