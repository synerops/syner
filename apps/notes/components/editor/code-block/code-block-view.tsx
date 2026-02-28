"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/core";
import { useState, useCallback, useRef, useEffect } from "react";
import {
  codeLanguages,
  getLabelForLanguage,
} from "./code-block-languages";

export function CodeBlockView({
  node,
  updateAttributes,
}: NodeViewProps) {
  const language = node.attrs.language as string;
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = codeLanguages.filter((lang) => {
    const q = search.toLowerCase();
    return (
      lang.label.toLowerCase().includes(q) ||
      lang.value.toLowerCase().includes(q) ||
      lang.aliases.some((a) => a.toLowerCase().includes(q))
    );
  });

  const selectLanguage = useCallback(
    (value: string) => {
      updateAttributes({ language: value });
      setIsOpen(false);
      setSearch("");
    },
    [updateAttributes]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          selectLanguage(filtered[selectedIndex].value);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        setSearch("");
      }
    },
    [filtered, selectedIndex, selectLanguage]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <NodeViewWrapper className="code-block-wrapper">
      <div className="code-block-header">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="code-block-lang-btn"
            contentEditable={false}
            aria-label="Select language"
            aria-expanded={isOpen}
          >
            {getLabelForLanguage(language)}
          </button>
          {isOpen && (
            <div
              className="code-block-lang-dropdown"
              contentEditable={false}
            >
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search language..."
                aria-label="Search languages"
                className="code-block-lang-search"
              />
              <div className="code-block-lang-list">
                {filtered.map((lang, index) => (
                  <button
                    key={lang.value || "plain"}
                    onClick={() => selectLanguage(lang.value)}
                    className={`code-block-lang-item ${
                      index === selectedIndex ? "is-selected" : ""
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <pre>
        <NodeViewContent<"code"> as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
