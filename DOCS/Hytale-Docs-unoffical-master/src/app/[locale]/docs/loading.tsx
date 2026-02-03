import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
      {...props}
    />
  );
}

// Deterministic widths for skeleton items to avoid Math.random() during render
const sidebarItemWidths = [75, 85, 65, 90, 70, 80, 60, 88, 72, 78];
const tocWidths = [70, 85, 55, 90, 65, 80];

export default function DocsLoading() {
  return (
    <div className="flex gap-6 lg:gap-8">
      {/* Sidebar skeleton */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-border lg:block xl:w-72 2xl:w-80">
        <div className="h-full py-4 pr-3">
          <nav className="space-y-1 pl-3">
            {/* Sidebar groups */}
            {Array.from({ length: 5 }).map((_, groupIndex) => (
              <div key={groupIndex} className="py-2">
                {/* Group title */}
                <Skeleton className="mb-2 h-5 w-28" />
                {/* Group items */}
                <div className="ml-2.5 space-y-1 border-l border-border pl-2.5">
                  {Array.from({ length: 3 + (groupIndex % 3) }).map((_, itemIndex) => (
                    <Skeleton
                      key={itemIndex}
                      className="h-7"
                      style={{
                        width: `${sidebarItemWidths[(groupIndex * 3 + itemIndex) % sidebarItemWidths.length]}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content skeleton */}
      <main className="min-w-0 flex-1 py-6">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Title */}
          <Skeleton className="mb-4 h-10 w-3/4 lg:w-1/2" />

          {/* Description */}
          <Skeleton className="mb-8 h-5 w-full lg:w-3/4" />

          {/* Content paragraphs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>

            {/* Code block skeleton */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <Skeleton className="mb-2 h-4 w-48" />
              <Skeleton className="mb-1 h-4 w-full" />
              <Skeleton className="mb-1 h-4 w-3/4" />
              <Skeleton className="mb-1 h-4 w-5/6" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Section heading */}
            <Skeleton className="mt-8 h-7 w-48" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Table skeleton */}
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="bg-muted/50 p-3">
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex gap-4 border-t border-border p-3"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>

            {/* Another section */}
            <Skeleton className="mt-8 h-7 w-36" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* Pagination skeleton */}
          <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </article>
      </main>

      {/* TOC skeleton */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 xl:block">
        <div className="py-6">
          <Skeleton className="mb-4 h-4 w-24" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-4"
                style={{
                  width: `${tocWidths[i]}%`,
                  marginLeft: i % 3 === 2 ? "12px" : "0",
                }}
              />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
