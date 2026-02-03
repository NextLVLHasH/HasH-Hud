"use client";

import { Home } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbItem as BreadcrumbItemComponent,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemData {
  label: string;
  href?: string;
}

interface DocsBreadcrumbProps {
  items: BreadcrumbItemData[];
}

export function DocsBreadcrumb({ items }: DocsBreadcrumbProps) {
  const t = useTranslations("breadcrumb");

  return (
    <BreadcrumbRoot aria-label={t("navigation")}>
      <BreadcrumbList>
        <BreadcrumbItemComponent>
          <BreadcrumbLink asChild>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">{t("home")}</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItemComponent>
        <BreadcrumbSeparator />
        <BreadcrumbItemComponent>
          <BreadcrumbLink asChild>
            <Link
              href="/docs"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {t("docs")}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItemComponent>
        {items.map((item, index) => (
          <span key={index} className="contents">
            <BreadcrumbSeparator />
            <BreadcrumbItemComponent>
              {index === items.length - 1 ? (
                <BreadcrumbPage className="text-primary font-medium max-w-[200px] truncate">
                  {item.label}
                </BreadcrumbPage>
              ) : item.href ? (
                <BreadcrumbLink asChild>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors max-w-[150px] truncate"
                  >
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <span className="text-muted-foreground max-w-[150px] truncate">
                  {item.label}
                </span>
              )}
            </BreadcrumbItemComponent>
          </span>
        ))}
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
}
