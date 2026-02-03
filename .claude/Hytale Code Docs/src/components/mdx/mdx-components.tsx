import type { MDXComponents } from "mdx/types";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Link as LinkIcon } from "lucide-react";
import { InfoBox } from "./info-box";
import { FeatureCard } from "./feature-card";
import { ApiEndpoint } from "./api-endpoint";
import { VersionBadge } from "./version-badge";
import { CodeBlock } from "./code-block";
import { DocCard } from "./doc-card";
import { Mermaid } from "./mermaid";
import { FileTree } from "./file-tree";
import { EventsReference } from "@/components/events-reference";
import { cn } from "@/lib/utils";

/**
 * Prepends locale prefix to internal links that don't already have one.
 * External links (http/https) and links already starting with locale are unchanged.
 */
function getLocalizedHref(href: string, locale: string): string {
  // Don't modify external links
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }

  // Don't modify anchor-only links
  if (href.startsWith("#")) {
    return href;
  }

  // Don't modify if already has locale prefix
  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) {
    return href;
  }

  // Don't add prefix for English (default locale)
  if (locale === "en") {
    return href;
  }

  // Add locale prefix for other locales
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

// Heading component with anchor link on hover
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 2 | 3 | 4;
}

const headingStyles = {
  2: "mt-10 scroll-m-20 border-b border-border pb-2 text-2xl font-semibold tracking-tight first:mt-0",
  3: "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
  4: "mt-6 scroll-m-20 text-lg font-semibold tracking-tight",
};

function Heading({ level, className, id, children, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;

  return (
    <Tag
      id={id}
      className={cn("group flex items-center gap-2", headingStyles[level], className)}
      {...props}
    >
      <span>{children}</span>
      {id && (
        <a
          href={`#${id}`}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Link to ${typeof children === "string" ? children : "section"}`}
        >
          <LinkIcon className="h-4 w-4 text-muted-foreground hover:text-primary" />
        </a>
      )}
    </Tag>
  );
}

// Extract text content from React children (handles nested elements)
function extractTextFromChildren(children: React.ReactNode): string {
  if (children === null || children === undefined) {
    return "";
  }
  if (typeof children === "string") {
    return children;
  }
  if (typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }
  // Check if it's a React element with props
  if (typeof children === "object" && "props" in children) {
    const props = (children as React.ReactElement).props as { children?: React.ReactNode };
    return extractTextFromChildren(props?.children);
  }
  return "";
}

// Detect if code content looks like a file tree
function isFileTreeContent(code: unknown): boolean {
  if (typeof code !== "string") return false;

  const lines = code.trim().split("\n");
  if (lines.length < 2) return false;

  // Check if it's ASCII art (box drawing) - NOT a file tree
  // ASCII art uses corner characters like ┌┐└┘ and horizontal borders
  const hasBoxCorners = lines.some(line => /[┌┐┘┬┴┼]/.test(line));
  const hasHorizontalBorder = lines.some(line => /[─]{3,}/.test(line)); // 3+ horizontal lines = border
  if (hasBoxCorners || hasHorizontalBorder) {
    return false; // This is ASCII art, not a file tree
  }

  // File tree patterns: lines like "├── filename" or "└── folder/"
  const hasFileTreePattern = lines.some(line => /^[\s│]*[├└]──\s+\S/.test(line));
  const hasFolderPatterns = lines.some(line => /^\s*[a-zA-Z0-9_-]+\/\s*$/.test(line.replace(/[├└│─\s]/g, "")));
  const startsWithFolder = /^[a-zA-Z0-9_-]+\/$/.test(lines[0].trim());

  return hasFileTreePattern || (hasFolderPatterns && startsWithFolder);
}

// Map Docusaurus CSS classes to Tailwind
function mapDocusaurusClasses(className?: string): string {
  if (!className) return "";

  const mappings: Record<string, string> = {
    row: "grid grid-cols-1 md:grid-cols-2 gap-4",
    "col--6": "",
    "col--4": "",
    "col--12": "",
    col: "",
    "margin-bottom--lg": "mb-6",
    "margin-bottom--md": "mb-4",
    "margin-top--lg": "mt-6",
    "margin-top--md": "mt-4",
  };

  return className
    .split(" ")
    .map((cls) => mappings[cls] || cls)
    .filter(Boolean)
    .join(" ");
}

export const mdxComponents: MDXComponents = {
  // Custom components
  InfoBox,
  FeatureCard,
  ApiEndpoint,
  VersionBadge,
  DocCard,
  FileTree,
  EventsReference,

  // Override div to handle Docusaurus classes
  div: ({ className, ...props }) => (
    <div className={mapDocusaurusClasses(className)} {...props} />
  ),

  // HTML element overrides
  // Hide h1 from MDX content - the page title is already rendered by the page component
  h1: () => null,
  h2: (props) => <Heading level={2} {...props} />,
  h3: (props) => <Heading level={3} {...props} />,
  h4: (props) => <Heading level={4} {...props} />,
  p: ({ className, ...props }) => (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-4", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("my-4 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("my-4 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "mt-4 border-l-4 border-primary pl-4 italic text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  hr: ({ ...props }) => <hr className="my-8 border-border" {...props} />,
  table: ({ className, ...props }) => (
    <div className="my-8 w-full overflow-x-auto">
      <table className={cn("w-full border-collapse text-sm", className)} {...props} />
    </div>
  ),
  thead: ({ className, ...props }) => (
    <thead className={cn("", className)} {...props} />
  ),
  tbody: ({ className, ...props }) => (
    <tbody className={cn("", className)} {...props} />
  ),
  tr: ({ className, ...props }) => (
    <tr
      className={cn(
        "border-b border-border transition-colors hover:bg-primary/5",
        className
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "px-5 py-4 text-left font-bold text-primary uppercase tracking-wider text-xs bg-muted/50 first:rounded-tl-lg last:rounded-tr-lg [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "px-5 py-4 text-foreground [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  pre: ({ children, className, ...props }: React.ComponentPropsWithoutRef<"pre">) => {
    // Check if this is a mermaid code block
    // Children is typically a <code> element with props
    const childElement = React.isValidElement(children) ? children : null;
    const childProps = childElement?.props as { className?: string; children?: React.ReactNode } | undefined;
    const childClassName = childProps?.className || "";

    // Handle mermaid diagrams - pass raw children, Mermaid will extract text
    if (childClassName.includes("language-mermaid")) {
      return <Mermaid chart={childProps?.children} />;
    }

    // Extract text content for other special handlers
    const code = extractTextFromChildren(childProps?.children);

    // Handle explicit file tree language
    if (childClassName.includes("language-filetree") || childClassName.includes("language-tree")) {
      return <FileTree>{code}</FileTree>;
    }

    // Auto-detect file tree structure (for unlabeled code blocks)
    if (!childClassName && code && isFileTreeContent(code)) {
      return <FileTree>{code}</FileTree>;
    }

    return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
  },
  code: ({ className, ...props }) => {
    // Inline code (not in a pre block)
    const isInline = !className?.includes("language-");
    if (isInline) {
      return (
        <code
          className={cn(
            "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
            className
          )}
          {...props}
        />
      );
    }
    return <code className={className} {...props} />;
  },
  // Default anchor handler (for English locale or when locale is not specified)
  a: ({ className, href, ...props }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          className={cn(
            "font-medium text-primary underline underline-offset-4 hover:text-primary/80",
            className
          )}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        />
      );
    }
    return (
      <Link
        href={href || "#"}
        className={cn(
          "font-medium text-primary underline underline-offset-4 hover:text-primary/80",
          className
        )}
        {...props}
      />
    );
  },
  img: ({ className, alt, src, width, height, ...props }) => {
    // Handle external images or images without dimensions
    const isExternal = typeof src === "string" && (src.startsWith("http://") || src.startsWith("https://"));

    // If no src provided, return null
    if (!src) return null;

    // Parse width and height, providing defaults for responsive images
    const imgWidth = typeof width === "number" ? width : (typeof width === "string" ? parseInt(width, 10) : 800);
    const imgHeight = typeof height === "number" ? height : (typeof height === "string" ? parseInt(height, 10) : 600);

    // For external images, use unoptimized mode to avoid domain configuration issues
    if (isExternal) {
      return (
        <Image
          src={src}
          alt={alt || ""}
          width={imgWidth}
          height={imgHeight}
          className={cn("rounded-lg border border-border", className)}
          loading="lazy"
          unoptimized
          {...props}
        />
      );
    }

    // For local images, use Next.js image optimization
    return (
      <Image
        src={src}
        alt={alt || ""}
        width={imgWidth}
        height={imgHeight}
        className={cn("rounded-lg border border-border", className)}
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
        {...props}
      />
    );
  },
};

/**
 * Creates locale-aware MDX components.
 * Internal links will be automatically prefixed with the locale (for non-English locales).
 */
export function createLocalizedMdxComponents(locale: string): MDXComponents {
  // For English, return the default components unchanged
  if (locale === "en") {
    return mdxComponents;
  }

  // For other locales, override the anchor component to add locale prefix
  return {
    ...mdxComponents,
    a: ({ className, href, ...props }) => {
      const isExternal = href?.startsWith("http");
      if (isExternal) {
        return (
          <a
            href={href}
            className={cn(
              "font-medium text-primary underline underline-offset-4 hover:text-primary/80",
              className
            )}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        );
      }
      // Localize internal links
      const localizedHref = getLocalizedHref(href || "#", locale);
      return (
        <Link
          href={localizedHref}
          className={cn(
            "font-medium text-primary underline underline-offset-4 hover:text-primary/80",
            className
          )}
          {...props}
        />
      );
    },
  };
}
