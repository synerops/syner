export interface CodeLanguage {
  label: string;
  value: string;
  aliases: string[];
}

export const codeLanguages: CodeLanguage[] = [
  { label: "Plain text", value: "", aliases: ["text", "plain"] },
  { label: "JavaScript", value: "javascript", aliases: ["js"] },
  { label: "TypeScript", value: "typescript", aliases: ["ts"] },
  { label: "HTML", value: "xml", aliases: ["html"] },
  { label: "CSS", value: "css", aliases: [] },
  { label: "JSON", value: "json", aliases: [] },
  { label: "Python", value: "python", aliases: ["py"] },
  { label: "Bash", value: "bash", aliases: ["sh", "shell"] },
  { label: "SQL", value: "sql", aliases: [] },
  { label: "Go", value: "go", aliases: ["golang"] },
  { label: "Rust", value: "rust", aliases: ["rs"] },
  { label: "Java", value: "java", aliases: [] },
  { label: "C", value: "c", aliases: [] },
  { label: "C++", value: "cpp", aliases: ["c++"] },
  { label: "C#", value: "csharp", aliases: ["cs", "c#"] },
  { label: "PHP", value: "php", aliases: [] },
  { label: "Ruby", value: "ruby", aliases: ["rb"] },
  { label: "Swift", value: "swift", aliases: [] },
  { label: "Kotlin", value: "kotlin", aliases: ["kt"] },
  { label: "YAML", value: "yaml", aliases: ["yml"] },
  { label: "Markdown", value: "markdown", aliases: ["md"] },
  { label: "Docker", value: "dockerfile", aliases: ["docker"] },
];

export function getLabelForLanguage(value: string): string {
  const lang = codeLanguages.find(
    (l) =>
      l.value === value ||
      l.aliases.includes(value)
  );
  return lang?.label ?? "Plain text";
}
