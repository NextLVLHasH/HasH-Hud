import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content/docs");

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface SearchResult {
  title: string;
  description: string;
  href: string;
  content: string;
  category: string;
}

interface DocMeta {
  title?: string;
  description?: string;
  sidebar_label?: string;
}

// In-memory cache for docs by locale
const docsCache = new Map<string, CacheEntry<SearchResult[]>>();

// In-memory cache for search results
const searchCache = new Map<string, CacheEntry<SearchResult[]>>();

function isCacheValid<T>(entry: CacheEntry<T> | undefined): entry is CacheEntry<T> {
  if (!entry) return false;
  return Date.now() - entry.timestamp < CACHE_TTL;
}

function getCacheKey(query: string, locale: string): string {
  return `${locale}:${query.toLowerCase().trim()}`;
}

function getAllDocs(locale: string = "en"): SearchResult[] {
  // Check cache first
  const cached = docsCache.get(locale);
  if (isCacheValid(cached)) {
    return cached.data;
  }

  const docsDirectory = path.join(contentDirectory, locale);
  const results: SearchResult[] = [];

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
        try {
          const fileContents = fs.readFileSync(filePath, "utf8");
          const { data, content } = matter(fileContents);
          const meta = data as DocMeta;

          const fileName = file.replace(/\.(md|mdx)$/, "");
          let slug: string[];

          if (fileName === "index") {
            slug = prefix;
          } else {
            slug = [...prefix, fileName];
          }

          if (slug.length === 0) {
            return;
          }

          // Get category from first part of the path
          const category = prefix[0] || "docs";
          const categoryLabels: Record<string, Record<string, string>> = {
            fr: {
              "getting-started": "Pour Commencer",
              "gameplay": "Gameplay",
              modding: "Modding",
              servers: "Serveurs",
              api: "API",
              tools: "Outils",
              guides: "Guides",
              community: "Communaute",
            },
            en: {
              "getting-started": "Getting Started",
              "gameplay": "Gameplay",
              modding: "Modding",
              servers: "Servers",
              api: "API",
              tools: "Tools",
              guides: "Guides",
              community: "Community",
            },
          };

          const labels = categoryLabels[locale] || categoryLabels.en;

          results.push({
            title: meta.title || meta.sidebar_label || fileName,
            description: meta.description || "",
            href: `/docs/${slug.join("/")}`,
            content: content.slice(0, 500), // Limit content for search
            category: labels[category] || category,
          });
        } catch (error) {
          console.error(`Error reading file ${filePath}:`, error);
        }
      }
    }
  }

  walkDir(docsDirectory);

  // Cache the results
  docsCache.set(locale, {
    data: results,
    timestamp: Date.now(),
  });

  return results;
}

function searchDocs(query: string, locale: string = "en"): SearchResult[] {
  // Check search cache first
  const cacheKey = getCacheKey(query, locale);
  const cached = searchCache.get(cacheKey);
  if (isCacheValid(cached)) {
    return cached.data;
  }

  const allDocs = getAllDocs(locale);
  const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

  if (searchTerms.length === 0) {
    return [];
  }

  // Score and filter results
  const scoredResults = allDocs
    .map((doc) => {
      let score = 0;
      const titleLower = doc.title.toLowerCase();
      const descLower = doc.description.toLowerCase();
      const contentLower = doc.content.toLowerCase();

      for (const term of searchTerms) {
        // Title matches are weighted highest
        if (titleLower.includes(term)) {
          score += 10;
          // Exact title match bonus
          if (titleLower === term) {
            score += 5;
          }
        }

        // Description matches
        if (descLower.includes(term)) {
          score += 5;
        }

        // Content matches
        if (contentLower.includes(term)) {
          score += 1;
        }
      }

      return { ...doc, score };
    })
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Limit to 10 results

  // Remove score from returned results
  const results = scoredResults.map(({ score: _score, ...doc }) => doc);

  // Cache the search results
  searchCache.set(cacheKey, {
    data: results,
    timestamp: Date.now(),
  });

  // Clean up old cache entries periodically (keep cache size manageable)
  if (searchCache.size > 100) {
    const now = Date.now();
    for (const [key, entry] of searchCache.entries()) {
      if (now - entry.timestamp >= CACHE_TTL) {
        searchCache.delete(key);
      }
    }
  }

  return results;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const locale = searchParams.get("locale") || "en";

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { results: [] },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      }
    );
  }

  try {
    const results = searchDocs(query, locale);
    return NextResponse.json(
      { results },
      {
        headers: {
          // Cache successful search results for 5 minutes
          "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
          // Add Vary header for proper caching with different locales
          "Vary": "Accept-Encoding",
        },
      }
    );
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "An error occurred while searching" },
      { status: 500 }
    );
  }
}
