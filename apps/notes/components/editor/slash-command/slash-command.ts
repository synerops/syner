import { Extension } from "@tiptap/core";
import { Suggestion } from "@tiptap/suggestion";
import { PluginKey } from "@tiptap/pm/state";
import { createRoot, type Root } from "react-dom/client";
import { createElement, createRef } from "react";
import { slashCommandItems, type SlashCommandItem } from "./slash-items";
import { SlashMenu, type SlashMenuRef } from "./slash-menu";

const slashCommandPluginKey = new PluginKey("slashCommand");

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addProseMirrorPlugins() {
    return [
      Suggestion<SlashCommandItem, SlashCommandItem>({
        editor: this.editor,
        pluginKey: slashCommandPluginKey,
        char: "/",
        allowedPrefixes: null,
        items: ({ query }) => {
          const search = query.toLowerCase();
          return slashCommandItems.filter(
            (item) =>
              item.title.toLowerCase().includes(search) ||
              item.description.toLowerCase().includes(search) ||
              item.aliases.some((alias) =>
                alias.toLowerCase().includes(search)
              )
          );
        },
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
        render: () => {
          let popup: HTMLDivElement | null = null;
          let root: Root | null = null;
          const menuRef = createRef<SlashMenuRef>();

          return {
            onStart: (props) => {
              popup = document.createElement("div");
              popup.style.position = "absolute";
              popup.style.zIndex = "50";
              document.body.appendChild(popup);

              root = createRoot(popup);
              root.render(
                createElement(SlashMenu, {
                  ref: menuRef,
                  items: props.items,
                  command: (item) => props.command(item),
                })
              );

              updatePosition(popup, props.clientRect);
            },

            onUpdate: (props) => {
              root?.render(
                createElement(SlashMenu, {
                  ref: menuRef,
                  items: props.items,
                  command: (item) => props.command(item),
                })
              );

              updatePosition(popup, props.clientRect);
            },

            onKeyDown: (props) => {
              if (props.event.key === "Escape") {
                popup?.remove();
                root?.unmount();
                popup = null;
                root = null;
                return true;
              }

              return menuRef.current?.onKeyDown(props) ?? false;
            },

            onExit: () => {
              popup?.remove();
              root?.unmount();
              popup = null;
              root = null;
            },
          };
        },
      }),
    ];
  },
});

function updatePosition(
  popup: HTMLDivElement | null,
  clientRect: (() => DOMRect | null) | null | undefined
) {
  if (!popup || !clientRect) return;

  const rect = clientRect();
  if (!rect) return;

  const top = rect.bottom + window.scrollY + 4;
  const left = rect.left + window.scrollX;

  popup.style.top = `${top}px`;
  popup.style.left = `${left}px`;
}
