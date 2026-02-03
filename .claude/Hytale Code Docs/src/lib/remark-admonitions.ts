import { visit } from "unist-util-visit";
import type { Root, Paragraph, Text } from "mdast";

// Custom remark plugin to handle Docusaurus-style admonitions
// Converts :::tip, :::warning, :::info, :::danger, :::note to InfoBox components

const ADMONITION_TYPES = ["tip", "warning", "info", "danger", "note", "caution"];

// Map admonition types to InfoBox types (caution -> warning)
const TYPE_MAP: Record<string, string> = {
  tip: "tip",
  warning: "warning",
  info: "info",
  danger: "danger",
  note: "note",
  caution: "warning",
};

// Helper to check if a paragraph contains closing :::
function paragraphContainsClosing(node: Paragraph): boolean {
  for (const child of node.children) {
    if (child.type === "text") {
      const text = (child as Text).value;
      if (text.includes("\n:::") || text.trim() === ":::" || text.endsWith(":::")) {
        return true;
      }
    }
  }
  return false;
}

export function remarkAdmonitions() {
  return (tree: Root) => {
    const nodesToProcess: Array<{
      parent: any;
      startIndex: number;
      endIndex: number;
      type: string;
      title?: string;
    }> = [];

    // First pass: identify admonition blocks
    visit(tree, "paragraph", (node: Paragraph, index: number | undefined, parent: any) => {
      if (index === undefined || !parent) return;

      const firstChild = node.children[0];
      if (firstChild?.type !== "text") return;

      const text = (firstChild as Text).value;

      // Check for opening :::type or :::type Title
      for (const type of ADMONITION_TYPES) {
        // Match :::type at the start of the line, with optional title
        const regex = new RegExp(`^:::${type}(?:\\s+(.*))?`, "im");
        const match = text.match(regex);

        if (match) {
          // Extract title (text after :::type on same line, before newline)
          const afterType = match[1] || "";
          const titleMatch = afterType.split("\n")[0].trim();
          const title = titleMatch || undefined;

          // Find the closing ::: - check current paragraph first (all children)
          let endIndex = -1;

          if (paragraphContainsClosing(node)) {
            // Self-contained admonition (opening and closing in same paragraph)
            endIndex = index;
          } else {
            // Look for closing ::: in subsequent nodes
            for (let i = index + 1; i < parent.children.length; i++) {
              const child = parent.children[i];
              if (child.type === "paragraph") {
                if (paragraphContainsClosing(child)) {
                  endIndex = i;
                  break;
                }
              }
              // Skip other node types (lists, code blocks, etc.) - they become content
            }
          }

          if (endIndex !== -1) {
            nodesToProcess.push({
              parent,
              startIndex: index,
              endIndex,
              type,
              title,
            });
          }
          break;
        }
      }
    });

    // Second pass: replace admonition blocks (in reverse order to maintain indices)
    nodesToProcess.reverse().forEach(({ parent, startIndex, endIndex, type, title }) => {
      const contentNodes: any[] = [];
      const isSelfContained = startIndex === endIndex;

      if (isSelfContained) {
        // Everything is in one paragraph - extract content between opening and closing
        const node = parent.children[startIndex];
        if (node.type === "paragraph" && node.children?.length > 0) {
          const newChildren: any[] = [];

          for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];

            if (child.type === "text") {
              let text = (child as Text).value;

              if (i === 0) {
                // First text child - remove opening :::type line
                const lines = text.split("\n");
                text = lines.slice(1).join("\n");
              }

              // Remove closing ::: from any text node
              text = text.replace(/\n:::$/, "").replace(/:::$/, "");

              if (text) {
                newChildren.push({ type: "text", value: text });
              }
            } else {
              // Keep non-text children (strong, link, etc.) as-is
              newChildren.push(child);
            }
          }

          if (newChildren.length > 0) {
            contentNodes.push({
              type: "paragraph",
              children: newChildren,
            });
          }
        }
      } else {
        // Multi-paragraph admonition
        for (let i = startIndex; i <= endIndex; i++) {
          const node = parent.children[i];

          if (i === startIndex) {
            // Opening paragraph - remove :::type line
            if (node.type === "paragraph" && node.children?.length > 0) {
              const newChildren: any[] = [];

              for (let j = 0; j < node.children.length; j++) {
                const child = node.children[j];

                if (child.type === "text" && j === 0) {
                  const text = (child as Text).value;
                  const lines = text.split("\n");
                  const remainingText = lines.slice(1).join("\n");
                  if (remainingText) {
                    newChildren.push({ type: "text", value: remainingText });
                  }
                } else {
                  newChildren.push(child);
                }
              }

              if (newChildren.length > 0) {
                contentNodes.push({
                  type: "paragraph",
                  children: newChildren,
                });
              }
            }
          } else if (i === endIndex) {
            // Closing paragraph - remove :::
            if (node.type === "paragraph" && node.children?.length > 0) {
              const newChildren: any[] = [];

              for (const child of node.children) {
                if (child.type === "text") {
                  const text = (child as Text).value
                    .replace(/\n?:::$/, "")
                    .replace(/^:::$/, "");
                  if (text.trim()) {
                    newChildren.push({ type: "text", value: text });
                  }
                } else {
                  newChildren.push(child);
                }
              }

              if (newChildren.length > 0) {
                contentNodes.push({
                  type: "paragraph",
                  children: newChildren,
                });
              }
            }
          } else {
            // Intermediate nodes - keep as-is
            contentNodes.push(node);
          }
        }
      }

      // Create the InfoBox JSX
      const mappedType = TYPE_MAP[type] || type;
      const infoBoxNode = {
        type: "mdxJsxFlowElement",
        name: "InfoBox",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "type",
            value: mappedType,
          },
          ...(title
            ? [
                {
                  type: "mdxJsxAttribute",
                  name: "title",
                  value: title,
                },
              ]
            : []),
        ],
        children: contentNodes,
      };

      // Replace the nodes
      parent.children.splice(startIndex, endIndex - startIndex + 1, infoBoxNode);
    });
  };
}
