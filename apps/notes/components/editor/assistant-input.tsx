"use client";

import { BubbleMenu } from "@tiptap/react/menus";
import type { Editor } from "@tiptap/core";
import { useState, useCallback, useRef, useEffect } from "react";
import { Send, X, Loader2, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssistantResponse {
  action: "replace" | "insert" | "error";
  content: string;
  originalSelection: string;
}

interface AssistantInputProps {
  editor: Editor;
}

export function AssistantInput({ editor }: AssistantInputProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<AssistantResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getSelectedText = useCallback(() => {
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to, " ");
  }, [editor]);

  const handleSubmit = useCallback(async () => {
    const selection = getSelectedText();
    if (!selection.trim() || !message.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selection,
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from assistant");
      }

      const data: AssistantResponse = await response.json();
      setPreview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [message, getSelectedText]);

  const handleAccept = useCallback(() => {
    if (!preview) return;

    const { from, to } = editor.state.selection;
    editor
      .chain()
      .focus()
      .deleteRange({ from, to })
      .insertContentAt(from, preview.content)
      .run();

    setPreview(null);
    setMessage("");
  }, [editor, preview]);

  const handleReject = useCallback(() => {
    setPreview(null);
    setMessage("");
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === "Escape") {
        setPreview(null);
        setMessage("");
        setError(null);
      }
    },
    [handleSubmit]
  );

  // Focus input when bubble menu appears
  useEffect(() => {
    if (inputRef.current && !preview && !isLoading) {
      inputRef.current.focus();
    }
  }, [preview, isLoading]);

  return (
    <BubbleMenu
      editor={editor}
      options={{
        placement: "bottom",
        offset: { mainAxis: 8 },
      }}
      shouldShow={({ editor, state }) => {
        const { from, to } = state.selection;
        const hasSelection = from !== to;
        const isCodeBlock = editor.isActive("codeBlock");
        return hasSelection && !isCodeBlock;
      }}
    >
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-popover p-2 shadow-lg min-w-[320px] max-w-[480px]">
        {error && (
          <div className="flex items-center gap-2 rounded bg-destructive/10 px-2 py-1 text-xs text-destructive">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4"
              onClick={() => setError(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {preview ? (
          <div className="flex flex-col gap-2">
            <div className="text-xs text-muted-foreground">Suggested change:</div>
            <div className="rounded border border-border bg-muted/50 p-2 text-sm">
              <div className="line-through text-muted-foreground/60 mb-1">
                {preview.originalSelection}
              </div>
              <div className="text-foreground">{preview.content}</div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReject}
                className="h-7 gap-1 text-xs"
              >
                <RotateCcw className="h-3 w-3" />
                Try again
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleAccept}
                className="h-7 gap-1 text-xs"
              >
                <Check className="h-3 w-3" />
                Accept
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <span className="text-sm">🤖</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask assistant to edit this..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSubmit}
              disabled={isLoading || !message.trim()}
              className="h-8 w-8"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </BubbleMenu>
  );
}
