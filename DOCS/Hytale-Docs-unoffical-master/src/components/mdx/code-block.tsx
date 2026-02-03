"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

// Map language codes to display names
const languageNames: Record<string, string> = {
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
  jsx: "JSX",
  java: "Java",
  py: "Python",
  python: "Python",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  bash: "Bash",
  sh: "Shell",
  shell: "Shell",
  css: "CSS",
  scss: "SCSS",
  html: "HTML",
  xml: "XML",
  sql: "SQL",
  md: "Markdown",
  markdown: "Markdown",
  go: "Go",
  rust: "Rust",
  cpp: "C++",
  c: "C",
  csharp: "C#",
  cs: "C#",
  php: "PHP",
  ruby: "Ruby",
  kotlin: "Kotlin",
  swift: "Swift",
  gradle: "Gradle",
  groovy: "Groovy",
  toml: "TOML",
  ini: "INI",
  properties: "Properties",
};

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const preRef = React.useRef<HTMLPreElement>(null);

  // Extract language from children's className
  const childProps = (children as React.ReactElement)?.props as { className?: string } | undefined;
  const childClassName = childProps?.className || "";
  const languageMatch = childClassName.match(/language-(\w+)/);
  const language = languageMatch ? languageMatch[1] : "";
  const displayLanguage = languageNames[language] || language.toUpperCase();

  const handleCopy = async () => {
    if (preRef.current && typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        const code = preRef.current.textContent || "";
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <div className="group relative my-6">
      {/* Language badge */}
      {language && (
        <div className="absolute top-0 right-12 z-10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/80 backdrop-blur-sm rounded-b-lg border-x border-b border-border">
          {displayLanguage}
        </div>
      )}

      <pre
        ref={preRef}
        className={cn(
          "overflow-x-auto rounded-xl border border-border bg-card p-5 pt-8 text-sm font-mono whitespace-pre",
          className
        )}
        style={{ tabSize: 4 }}
      >
        {children}
      </pre>

      {/* Copy button - always visible for keyboard users, with focus ring */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-3 top-3 min-h-[44px] min-w-[44px] opacity-70 transition-all duration-200 hover:opacity-100 focus:opacity-100 focus-visible:opacity-100 bg-muted/50 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onClick={handleCopy}
        aria-pressed={copied}
        aria-label={copied ? "Code copied" : "Copy code"}
      >
        {copied ? (
          <Check className="h-4 w-4 text-[--color-hytale-green]" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="sr-only">{copied ? "Code copied" : "Copy code"}</span>
      </Button>
    </div>
  );
}
