"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TocItem } from "@/lib/extract-headings";

export type { TocItem };

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const t = useTranslations("tableOfContents");
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [items]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveId(id);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="sticky top-20 hidden xl:block w-64 shrink-0">
      <ScrollArea className="h-[calc(100vh-6rem)]">
        <nav aria-label={t("navigation")}>
          <h2 className="text-sm font-semibold text-foreground mb-4">
            {t("title")}
          </h2>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={`${item.id}-${index}`}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={cn(
                    "block text-sm transition-colors duration-200",
                    "hover:text-primary",
                    item.level === 2 && "pl-0",
                    item.level === 3 && "pl-3",
                    item.level === 4 && "pl-6",
                    activeId === item.id
                      ? "text-primary font-medium border-l-2 border-primary -ml-[2px] pl-[calc(var(--indent,0px)+10px)]"
                      : "text-muted-foreground"
                  )}
                  style={{
                    "--indent":
                      item.level === 2
                        ? "0px"
                        : item.level === 3
                        ? "12px"
                        : "24px",
                  } as React.CSSProperties}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
    </aside>
  );
}
