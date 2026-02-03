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

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar skeleton */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-6">
            <Skeleton className="h-8 w-32" />
            <div className="hidden items-center gap-1 md:flex">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="hidden h-9 w-40 sm:block" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="flex-1">
        <div className="mx-auto max-w-[1200px] px-4 py-12 lg:px-6">
          {/* Hero skeleton */}
          <div className="flex flex-col items-center text-center">
            <Skeleton className="mb-4 h-6 w-24 rounded-full" />
            <Skeleton className="mb-4 h-12 w-80 md:w-[500px]" />
            <Skeleton className="mb-2 h-5 w-64 md:w-96" />
            <Skeleton className="mb-8 h-5 w-56 md:w-80" />
            <div className="flex gap-4">
              <Skeleton className="h-11 w-32" />
              <Skeleton className="h-11 w-40" />
            </div>
          </div>

          {/* Cards grid skeleton */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer skeleton */}
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-[1600px] px-4 py-12 lg:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
