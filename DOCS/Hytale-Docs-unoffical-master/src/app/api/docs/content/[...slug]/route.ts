import { NextResponse } from "next/server";
import { getDocBySlug, getDocNavigation } from "@/lib/docs";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";

// Enable CORS for IntelliJ plugin
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * Pre-process markdown to convert admonition blocks (:::type) to HTML.
 * Supports: :::info, :::tip, :::warning, :::danger, :::note
 */
function preprocessAdmonitions(markdown: string): string {
  // Match admonition blocks: :::type Title\nContent\n:::
  const admonitionRegex = /:::(info|tip|warning|danger|note|caution|important)(?:\s+(.+?))?\n([\s\S]*?):::/gi;

  return markdown.replace(admonitionRegex, (match, type, title, content) => {
    const normalizedType = type.toLowerCase();
    const displayTitle = title?.trim() || normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1);
    const trimmedContent = content.trim();

    // Map some alternative names
    const typeMap: Record<string, string> = {
      note: "info",
      caution: "warning",
      important: "danger",
    };
    const cssClass = typeMap[normalizedType] || normalizedType;

    // Get icon based on type
    const iconMap: Record<string, string> = {
      info: "ℹ️",
      tip: "💡",
      warning: "⚠️",
      danger: "🚨",
    };
    const icon = iconMap[cssClass] || "📌";

    return `<div class="admonition ${cssClass}">
<div class="admonition-title">${icon} ${displayTitle}</div>
<div class="admonition-content">

${trimmedContent}

</div>
</div>`;
  });
}

/**
 * GET /api/docs/content/[...slug]
 * Returns the documentation content as HTML with metadata
 *
 * Example: /api/docs/content/modding/plugins/overview
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";

  // Handle the slug - remove 'docs' prefix if present
  let docSlug = slug;
  if (docSlug[0] === "docs") {
    docSlug = docSlug.slice(1);
  }

  const doc = getDocBySlug(docSlug, locale);

  if (!doc) {
    return NextResponse.json(
      { error: "Document not found", slug: docSlug.join("/") },
      { status: 404, headers: corsHeaders }
    );
  }

  // Pre-process admonitions before markdown parsing
  const preprocessedContent = preprocessAdmonitions(doc.content);

  // Convert markdown to HTML
  let htmlContent = "";
  try {
    const result = await unified()
      .use(remarkParse)
      .use(remarkGfm) // GitHub Flavored Markdown
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeHighlight) // Syntax highlighting
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(preprocessedContent);

    htmlContent = String(result);
  } catch (error) {
    // Fallback: return raw markdown wrapped in pre
    htmlContent = `<pre>${doc.content}</pre>`;
  }

  // Get navigation (prev/next)
  const navigation = getDocNavigation(docSlug, locale);

  return NextResponse.json(
    {
      slug: docSlug.join("/"),
      meta: doc.meta,
      content: htmlContent,
      markdown: doc.content, // Also include raw markdown
      navigation: {
        prev: navigation.prev,
        next: navigation.next,
      },
      locale,
    },
    { headers: corsHeaders }
  );
}
