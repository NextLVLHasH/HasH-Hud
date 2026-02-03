"use client";

import dynamic from "next/dynamic";
import { type ReactNode } from "react";

// Extract text from React children recursively
function getTextContent(node: ReactNode): string {
  if (node === null || node === undefined) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (typeof node === "object" && "props" in node) {
    return getTextContent((node as { props?: { children?: ReactNode } }).props?.children);
  }
  return "";
}

// Loading skeleton component
function MermaidSkeleton() {
  return (
    <div className="my-8 w-full">
      <div className="mermaid-container rounded-xl border-2 border-border bg-card/50 p-8 overflow-x-auto flex justify-center">
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="h-4 w-32 bg-muted-foreground/20 rounded" />
            <div className="h-24 w-48 bg-muted-foreground/10 rounded-lg" />
            <div className="flex gap-2">
              <div className="h-3 w-16 bg-muted-foreground/20 rounded" />
              <div className="h-3 w-20 bg-muted-foreground/20 rounded" />
            </div>
          </div>
          <span className="text-sm text-muted-foreground">Loading diagram...</span>
        </div>
      </div>
    </div>
  );
}

// Dynamically import the actual Mermaid renderer to avoid SSR issues
const MermaidRenderer = dynamic(
  () => import("./mermaid-renderer").then((mod) => mod.MermaidRenderer),
  {
    ssr: false,
    loading: () => <MermaidSkeleton />,
  }
);

interface MermaidProps {
  chart: ReactNode;
}

export function Mermaid({ chart }: MermaidProps) {
  // Extract text content from React children (handles syntax highlighted spans)
  const chartString = typeof chart === "string" ? chart : getTextContent(chart);

  return <MermaidRenderer chartString={chartString} />;
}
