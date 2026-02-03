"use client";

import * as React from "react";
import { Folder, FolderOpen, FileText, FileCode, FileJson, File, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FileTreeItem {
  name: string;
  type: "file" | "folder";
  children?: FileTreeItem[];
  highlight?: boolean;
}

// Parse a text-based file tree structure
function parseFileTree(content: string | React.ReactNode): FileTreeItem[] {
  // Handle non-string content
  const text = typeof content === "string" ? content : String(content || "");
  if (!text.trim()) return [];

  const lines = text.trim().split("\n");
  const root: FileTreeItem[] = [];
  const stack: { item: FileTreeItem; indent: number }[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    // Calculate indent level (count leading spaces/tree characters)
    const cleanLine = line.replace(/^[│├└─\s]+/, "");
    const indent = line.length - line.replace(/^[│├└─\s]+/, "").length;

    // Determine if it's a folder (ends with /)
    const isFolder = cleanLine.endsWith("/");
    const name = cleanLine.replace(/\/$/, "");

    const item: FileTreeItem = {
      name,
      type: isFolder ? "folder" : "file",
      children: isFolder ? [] : undefined,
    };

    // Find parent
    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(item);
    } else {
      stack[stack.length - 1].item.children?.push(item);
    }

    if (isFolder) {
      stack.push({ item, indent });
    }
  }

  return root;
}

// Get icon based on file extension
function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "java":
    case "kt":
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
    case "py":
    case "go":
    case "rs":
      return <FileCode className="h-4 w-4 text-secondary" />;
    case "json":
    case "yaml":
    case "yml":
    case "toml":
      return <FileJson className="h-4 w-4 text-primary" />;
    case "md":
    case "mdx":
    case "txt":
      return <FileText className="h-4 w-4 text-muted-foreground" />;
    case "gradle":
    case "xml":
    case "properties":
      return <FileCode className="h-4 w-4 text-chart-3" />;
    default:
      return <File className="h-4 w-4 text-muted-foreground" />;
  }
}

interface FileTreeNodeProps {
  item: FileTreeItem;
  level: number;
  isLast: boolean;
  parentLines: boolean[];
}

function FileTreeNode({ item, level, isLast, parentLines }: FileTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = item.type === "folder";

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 py-1 hover:bg-primary/5 rounded cursor-default transition-colors",
          isFolder && "cursor-pointer"
        )}
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        {/* Tree lines */}
        <div className="flex items-center">
          {parentLines.map((showLine, i) => (
            <span
              key={i}
              className="w-4 h-6 flex items-center justify-center text-border"
            >
              {showLine && "│"}
            </span>
          ))}
          <span className="w-4 h-6 flex items-center justify-center text-primary">
            {isLast ? "└" : "├"}
          </span>
          <span className="w-4 h-6 flex items-center justify-center text-primary">
            ─
          </span>
        </div>

        {/* Folder toggle / File icon */}
        {isFolder ? (
          <div className="flex items-center gap-1">
            <ChevronRight
              className={cn(
                "h-3 w-3 text-muted-foreground transition-transform",
                isOpen && "rotate-90"
              )}
            />
            {isOpen ? (
              <FolderOpen className="h-4 w-4 text-primary" />
            ) : (
              <Folder className="h-4 w-4 text-primary" />
            )}
          </div>
        ) : (
          <span className="ml-4">{getFileIcon(item.name)}</span>
        )}

        {/* Name */}
        <span
          className={cn(
            "ml-1 text-sm",
            isFolder ? "text-primary font-medium" : "text-foreground"
          )}
        >
          {item.name}
          {isFolder && "/"}
        </span>
      </div>

      {/* Children */}
      {isFolder && isOpen && item.children && (
        <div>
          {item.children.map((child, index) => (
            <FileTreeNode
              key={child.name + index}
              item={child}
              level={level + 1}
              isLast={index === item.children!.length - 1}
              parentLines={[...parentLines, !isLast]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FileTreeProps {
  children: React.ReactNode;
}

export function FileTree({ children }: FileTreeProps) {
  const items = parseFileTree(children);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="my-6 rounded-xl border-2 border-border bg-card p-4 font-mono text-sm overflow-x-auto">
      {items.map((item, index) => (
        <FileTreeNode
          key={item.name + index}
          item={item}
          level={0}
          isLast={index === items.length - 1}
          parentLines={[]}
        />
      ))}
    </div>
  );
}
