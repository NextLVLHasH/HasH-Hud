export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Extracts headings from MDX content for table of contents
 * This function parses the raw MDX source to find headings
 */
export function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const items: TocItem[] = [];
  const idCounts: Record<string, number> = {};
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    // Create slug from heading text (same logic as rehype-slug)
    let id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Handle duplicate IDs by adding suffix (same as rehype-slug)
    if (idCounts[id] !== undefined) {
      idCounts[id]++;
      id = `${id}-${idCounts[id]}`;
    } else {
      idCounts[id] = 0;
    }

    items.push({ id, text, level });
  }

  return items;
}
