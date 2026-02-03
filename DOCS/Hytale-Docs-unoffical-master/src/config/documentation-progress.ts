export interface ProgressCategory {
  id: string;
  documented: number;
  total: number;
}

export interface DocumentationProgress {
  lastUpdated: string;
  categories: ProgressCategory[];
}

export const documentationProgress: DocumentationProgress = {
  lastUpdated: "2026-01-14",
  categories: [
    {
      id: "modules",
      documented: 21,
      total: 21,
    },
    {
      id: "commands",
      documented: 168,
      total: 168,
    },
    {
      id: "events",
      documented: 65,
      total: 65,
    },
    {
      id: "components",
      documented: 100,
      total: 100,
    },
    {
      id: "packets",
      documented: 268,
      total: 268,
    },
  ],
};

export function getOverallProgress(): number {
  const { categories } = documentationProgress;
  const totalDocumented = categories.reduce((sum, cat) => sum + cat.documented, 0);
  const totalItems = categories.reduce((sum, cat) => sum + cat.total, 0);
  return Math.round((totalDocumented / totalItems) * 100);
}

export function getCategoryProgress(category: ProgressCategory): number {
  return Math.round((category.documented / category.total) * 100);
}
