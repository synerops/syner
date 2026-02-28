"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import Link from "@tiptap/extension-link";
import { SlashCommand } from "./slash-command/slash-command";
import { CodeBlockView } from "./code-block/code-block-view";
import { AssistantInput } from "./assistant-input";
import { FileProvider, useFileContext } from "@/components/file/file-context";
import { Toolbar } from "./toolbar";
import { StatusBar } from "@/components/status-bar";
import { CommandPalette, useRecentFiles } from "@/components/command-palette";
import { RepoSelector } from "@/components/repo-selector";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useAuth } from "@/hooks/use-auth";
import { useCallback, useEffect, useRef, useState } from "react";
import { Extension, type Editor as TiptapEditor } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Slice, type ResolvedPos } from "@tiptap/pm/model";
import type { EditorView } from "@tiptap/pm/view";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const lowlight = createLowlight(common);

const MarkdownPaste = Extension.create({
  name: "markdownPaste",

  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      new Plugin({
        key: new PluginKey("markdownPaste"),
        props: {
          handlePaste: (view, event) => {
            const text = event.clipboardData?.getData("text/plain")?.trim();
            if (!text) return false;

            const { from, to } = view.state.selection;
            const hasSelection = from !== to;
            const isUrl = /^https?:\/\/\S+$/i.test(text);

            if (hasSelection && isUrl) {
              editor.chain().setLink({ href: text }).run();
              return true;
            }

            return false;
          },

          clipboardTextParser(
            text: string,
            $context: ResolvedPos,
            _plain: boolean,
            _view: EditorView
          ): Slice {
            if (!editor.markdown) {
              return Slice.empty;
            }
            const json = editor.markdown.parse(text);
            const node = editor.schema.nodeFromJSON(json);
            return Slice.maxOpen(node.content);
          },
        },
      }),
    ];
  },
});

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

interface EditorAreaProps {
  editor: TiptapEditor | null;
  onOpenPalette: () => void;
}

function EditorArea({ editor, onOpenPalette }: EditorAreaProps) {
  const { markDirty, saveFile, openFile, newFile, fileName } = useFileContext();
  const { addRecentFile } = useRecentFiles();

  useEffect(() => {
    if (!editor) return;

    const handler = () => markDirty();
    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor, markDirty]);

  // Track recent files when file is opened
  useEffect(() => {
    if (fileName && fileName !== "untitled.md") {
      addRecentFile(fileName);
    }
  }, [fileName, addRecentFile]);

  useKeyboardShortcuts({
    onSave: saveFile,
    onOpen: openFile,
    onNew: newFile,
    onPalette: onOpenPalette,
  });

  return <EditorContent editor={editor} />;
}

function EditorShell({ editor }: { editor: TiptapEditor | null }) {
  const { isDirty, openFileFromDrop, openFile, newFile } = useFileContext();
  const { user, repo, login, logout, setRepo, isAuthenticated } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [repoSelectorOpen, setRepoSelectorOpen] = useState(false);
  const pendingDrop = useRef<{ content: string; fileName: string } | null>(
    null
  );
  const dragCounter = useRef(0);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const openRepoSelector = useCallback(() => setRepoSelectorOpen(true), []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);

      const file = Array.from(e.dataTransfer.files).find((f) =>
        f.name.endsWith(".md")
      );
      if (!file) return;

      const content = await readFileAsText(file);

      if (isDirty) {
        pendingDrop.current = { content, fileName: file.name };
        setShowConfirm(true);
      } else {
        openFileFromDrop(content, file.name);
      }
    },
    [isDirty, openFileFromDrop]
  );

  const confirmDrop = useCallback(() => {
    if (pendingDrop.current) {
      openFileFromDrop(
        pendingDrop.current.content,
        pendingDrop.current.fileName
      );
      pendingDrop.current = null;
    }
    setShowConfirm(false);
  }, [openFileFromDrop]);

  const cancelDrop = useCallback(() => {
    pendingDrop.current = null;
    setShowConfirm(false);
  }, []);

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="relative flex min-h-screen flex-col bg-background pb-10"
    >
      {isDragging ? (
        <div className="drop-overlay">
          <span className="drop-overlay-text">Drop .md file</span>
        </div>
      ) : null}
      <Toolbar editor={editor} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <EditorArea editor={editor} onOpenPalette={openPalette} />
        {editor && <AssistantInput editor={editor} />}
      </main>
      <StatusBar onOpenPalette={openPalette} />
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onNewFile={newFile}
        onOpenFile={openFile}
      />
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Open the dropped file anyway?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDrop}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDrop}>
              Open file
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockView);
        },
      }).configure({
        lowlight,
      }),
      Link.configure({
        autolink: true,
        linkOnPaste: false,
        openOnClick: false,
        defaultProtocol: "https",
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
      Markdown,
      Placeholder.configure({
        placeholder: "Start writing, or type / for commands...",
      }),
      SlashCommand,
      MarkdownPaste,
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap focus:outline-none min-h-[80vh]",
      },
      handleDrop: () => true,
      handleClick: (view, pos, event) => {
        if (!(event.metaKey || event.ctrlKey)) return false;

        const link = (event.target as HTMLElement).closest("a");
        if (!link) return false;

        const href = link.getAttribute("href");
        if (href) {
          window.open(href, "_blank", "noopener,noreferrer");
          return true;
        }

        return false;
      },
    },
  });

  return (
    <FileProvider editor={editor}>
      <EditorShell editor={editor} />
    </FileProvider>
  );
}
