import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content/docs");

export interface DocMeta {
  title: string;
  description?: string;
  sidebarLabel?: string;
  sidebarPosition?: number;
}

export interface Doc {
  slug: string[];
  meta: DocMeta;
  content: string;
}

function getDocsDirectory(locale: string = "en"): string {
  return path.join(contentDirectory, locale);
}

export function getDocBySlug(slug: string[], locale: string = "en"): Doc | null {
  const docsDirectory = getDocsDirectory(locale);
  const slugPath = slug.join("/");

  // Try different file extensions
  const extensions = [".mdx", ".md"];
  let filePath: string | null = null;

  for (const ext of extensions) {
    const testPath = path.join(docsDirectory, `${slugPath}${ext}`);
    if (fs.existsSync(testPath)) {
      filePath = testPath;
      break;
    }
    // Also try index files in directories
    const indexPath = path.join(docsDirectory, slugPath, `index${ext}`);
    if (fs.existsSync(indexPath)) {
      filePath = indexPath;
      break;
    }
  }

  if (!filePath) {
    // Fallback to English if not found in current locale
    if (locale !== "en") {
      return getDocBySlug(slug, "en");
    }
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    meta: {
      title: data.title || slug[slug.length - 1],
      description: data.description,
      sidebarLabel: data.sidebar_label || data.sidebarLabel,
      sidebarPosition: data.sidebar_position || data.sidebarPosition,
    },
    content,
  };
}

export function getAllDocSlugs(locale: string = "en"): string[][] {
  const docsDirectory = getDocsDirectory(locale);
  const slugs: string[][] = [];

  function walkDir(dir: string, prefix: string[] = []) {
    if (!fs.existsSync(dir)) {
      return;
    }

    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath, [...prefix, file]);
      } else if (file.endsWith(".md") || file.endsWith(".mdx")) {
        const fileName = file.replace(/\.(md|mdx)$/, "");
        if (fileName === "index") {
          if (prefix.length > 0) {
            slugs.push(prefix);
          }
        } else {
          slugs.push([...prefix, fileName]);
        }
      }
    }
  }

  walkDir(docsDirectory);
  return slugs;
}

export function getDocNavigation(
  currentSlug: string[],
  locale: string = "en"
): {
  prev: { title: string; href: string } | null;
  next: { title: string; href: string } | null;
} {
  const allSlugs = getAllDocSlugs(locale);
  const currentPath = currentSlug.join("/");
  const currentIndex = allSlugs.findIndex((s) => s.join("/") === currentPath);

  // Build locale prefix for non-English locales
  const localePrefix = locale !== "en" ? `/${locale}` : "";

  let prev = null;
  let next = null;

  if (currentIndex > 0) {
    const prevSlug = allSlugs[currentIndex - 1];
    const prevDoc = getDocBySlug(prevSlug, locale);
    if (prevDoc) {
      prev = {
        title: prevDoc.meta.title,
        href: `${localePrefix}/docs/${prevSlug.join("/")}`,
      };
    }
  }

  if (currentIndex < allSlugs.length - 1) {
    const nextSlug = allSlugs[currentIndex + 1];
    const nextDoc = getDocBySlug(nextSlug, locale);
    if (nextDoc) {
      next = {
        title: nextDoc.meta.title,
        href: `${localePrefix}/docs/${nextSlug.join("/")}`,
      };
    }
  }

  return { prev, next };
}
