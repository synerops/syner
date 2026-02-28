"use client";

import type { Editor } from "@tiptap/core";
import { useFileContext } from "@/components/file/file-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FolderOpen,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Strikethrough,
  Link,
  Code,
  List,
  ListOrdered,
  Plus,
  Github,
  ChevronDown,
  LogOut,
  FolderGit2,
} from "lucide-react";
import React, { useState, useRef, useEffect, useCallback, memo } from "react";

interface User {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
}

interface Repo {
  owner: string;
  name: string;
}

interface ToolbarProps {
  editor: Editor | null;
  user?: User | null;
  repo?: Repo | null;
  onLogin?: () => void;
  onLogout?: () => void;
  onSelectRepo?: () => void;
}

const headingOptions = [
  { level: 0, label: "Paragraph" },
  { level: 1, label: "Heading 1" },
  { level: 2, label: "Heading 2" },
  { level: 3, label: "Heading 3" },
] as const;

const HeadingDropdown = memo(function HeadingDropdown({ editor }: { editor: Editor | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getCurrentHeading = () => {
    if (!editor) return "Paragraph";
    if (editor.isActive("heading", { level: 1 })) return "H1";
    if (editor.isActive("heading", { level: 2 })) return "H2";
    if (editor.isActive("heading", { level: 3 })) return "H3";
    return "T";
  };

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const setHeading = (level: number) => {
    if (!editor) return;
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 gap-1 px-2 font-mono text-xs"
      >
        {getCurrentHeading()}
        <ChevronDown className="h-3 w-3" />
      </Button>
      {isOpen ? (
        <div className="absolute top-full left-0 z-50 mt-1 w-32 rounded-md border border-border bg-popover p-1 shadow-md">
          {headingOptions.map((option) => (
            <button
              key={option.level}
              onClick={() => setHeading(option.level)}
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
});

export const Toolbar = memo(function Toolbar({
  editor,
  user,
  repo,
  onLogin,
  onLogout,
  onSelectRepo,
}: ToolbarProps) {
  const { openFile } = useFileContext();
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);

  const openLinkDialog = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setLinkDialogOpen(true);
  }, [editor]);

  const handleLinkSubmit = useCallback(() => {
    if (!editor) return;
    if (linkUrl === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkDialogOpen(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const handleLinkKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleLinkSubmit();
      }
    },
    [handleLinkSubmit]
  );

  useEffect(() => {
    if (linkDialogOpen && linkInputRef.current) {
      linkInputRef.current.focus();
      linkInputRef.current.select();
    }
  }, [linkDialogOpen]);

  return (
    <div className="sticky top-0 z-40 flex items-center gap-0.5 border-b border-border bg-background px-2 py-1.5">
      {/* Open File */}
      <Button
        variant="ghost"
        size="sm"
        onClick={openFile}
        className="h-8 gap-1.5 px-2 text-xs"
      >
        <FolderOpen className="h-4 w-4" />
        Open
      </Button>

      <Separator />

      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => editor?.chain().focus().undo().run()}
        disabled={!editor?.can().undo()}
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => editor?.chain().focus().redo().run()}
        disabled={!editor?.can().redo()}
      >
        <Redo2 className="h-4 w-4" />
      </Button>

      <Separator />

      {/* Heading Dropdown */}
      <HeadingDropdown editor={editor} />

      <Separator />

      {/* Text Formatting */}
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${editor?.isActive("bold") ? "bg-accent" : ""}`}
        onClick={() => editor?.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${editor?.isActive("italic") ? "bg-accent" : ""}`}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${editor?.isActive("strike") ? "bg-accent" : ""}`}
        onClick={() => editor?.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <Separator />

      {/* Link & Code */}
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${editor?.isActive("link") ? "bg-accent" : ""}`}
        onClick={openLinkDialog}
      >
        <Link className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${editor?.isActive("code") ? "bg-accent" : ""}`}
        onClick={() => editor?.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </Button>

      <Separator />

      {/* Lists */}
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${editor?.isActive("bulletList") ? "bg-accent" : ""}`}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${editor?.isActive("orderedList") ? "bg-accent" : ""}`}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Separator />

      {/* Add */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
      >
        <Plus className="h-4 w-4" />
      </Button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User/Auth Section */}
      {user ? (
        <div className="flex items-center gap-2">
          {repo ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={onSelectRepo}
            >
              <FolderGit2 className="h-4 w-4" />
              {repo.owner}/{repo.name}
            </Button>
          ) : null}
          {!repo && onSelectRepo ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={onSelectRepo}
            >
              <FolderGit2 className="h-4 w-4" />
              Select Repo
            </Button>
          ) : null}
          <Separator />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="h-6 w-6 rounded-full"
            />
            <span>{user.login}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={onLogin}
        >
          <Github className="h-4 w-4" />
          Login with GitHub
        </Button>
      )}

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <input
              ref={linkInputRef}
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={handleLinkKeyDown}
              placeholder="https://example.com"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLinkDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleLinkSubmit}>
                {linkUrl ? "Apply" : "Remove Link"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

function Separator() {
  return <div className="mx-1 h-6 w-px bg-border" />;
}
