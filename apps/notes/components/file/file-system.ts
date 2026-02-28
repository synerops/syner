// File System Access API types (not in default TS lib)
declare global {
  interface Window {
    showOpenFilePicker(
      options?: OpenFilePickerOptions
    ): Promise<FileSystemFileHandle[]>;
    showSaveFilePicker(
      options?: SaveFilePickerOptions
    ): Promise<FileSystemFileHandle>;
  }

  interface OpenFilePickerOptions {
    types?: FilePickerAcceptType[];
    multiple?: boolean;
  }

  interface SaveFilePickerOptions {
    suggestedName?: string;
    types?: FilePickerAcceptType[];
  }

  interface FilePickerAcceptType {
    description?: string;
    accept: Record<string, readonly string[]>;
  }
}

const markdownFileTypes: FilePickerAcceptType[] = [
  {
    description: "Markdown",
    accept: { "text/markdown": [".md"] as const },
  },
];

export function isFileSystemAccessSupported(): boolean {
  return "showOpenFilePicker" in window;
}

export async function openMarkdownFile(): Promise<{
  handle: FileSystemFileHandle;
  content: string;
  name: string;
}> {
  if (!isFileSystemAccessSupported()) {
    return openMarkdownFileFallback();
  }

  const [handle] = await window.showOpenFilePicker({
    types: markdownFileTypes,
    multiple: false,
  });
  const file = await handle.getFile();
  const content = await file.text();
  return { handle, content, name: file.name };
}

export async function saveMarkdownFile(
  handle: FileSystemFileHandle,
  content: string
): Promise<void> {
  const writable = await handle.createWritable();
  await writable.write(content);
  await writable.close();
}

export async function saveMarkdownFileAs(
  content: string,
  suggestedName?: string
): Promise<FileSystemFileHandle> {
  if (!isFileSystemAccessSupported()) {
    saveMarkdownFileFallback(content, suggestedName);
    // Return a fake handle since fallback can't provide one
    throw new Error("File saved via download. No file handle available.");
  }

  const handle = await window.showSaveFilePicker({
    suggestedName: suggestedName || "untitled.md",
    types: markdownFileTypes,
  });
  await saveMarkdownFile(handle, content);
  return handle;
}

// Fallback for browsers without File System Access API (Safari, Firefox)

async function openMarkdownFileFallback(): Promise<{
  handle: FileSystemFileHandle;
  content: string;
  name: string;
}> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".md,text/markdown";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        reject(new Error("No file selected"));
        return;
      }
      const content = await file.text();
      // No real handle in fallback mode
      resolve({
        handle: null as unknown as FileSystemFileHandle,
        content,
        name: file.name,
      });
    };

    input.oncancel = () => reject(new Error("File selection cancelled"));
    input.click();
  });
}

function saveMarkdownFileFallback(
  content: string,
  suggestedName?: string
): void {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = suggestedName || "untitled.md";
  a.click();
  URL.revokeObjectURL(url);
}
