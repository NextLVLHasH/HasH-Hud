"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowRight, FileText, FolderOpen } from "lucide-react";

interface DocCardProps {
  item: {
    type: string;
    label: string;
    href: string;
    description?: string;
  };
}

export function DocCard({ item }: DocCardProps) {
  const t = useTranslations("docs");
  const isCategory = item.type === "category";
  const Icon = isCategory ? FolderOpen : FileText;

  return (
    <Link href={item.href} className="group block h-full">
      <div className="h-full p-5 rounded-xl border-2 border-border bg-muted/50 transition-all duration-300 hover:border-primary/50 hover:bg-muted hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
        {/* Header with icon */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-tight pt-2">
            {item.label}
          </h3>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 pl-[52px]">
            {item.description}
          </p>
        )}

        {/* Link indicator */}
        <div className="flex items-center text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 pl-[52px]">
          {t("learnMore")}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

// Grid wrapper component for consistent spacing
export function DocCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 my-6">
      {children}
    </div>
  );
}
