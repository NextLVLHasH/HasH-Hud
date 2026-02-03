"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Boxes,
  Server,
  Code,
  Wrench,
  BookOpen,
  Users,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function NavCardsSection() {
  const t = useTranslations("navCards");

  const navCards = [
    {
      title: t("modding"),
      description: t("moddingDesc"),
      href: "/docs/modding/overview",
      icon: Boxes,
      color: "#e8a849",
      popular: true,
    },
    {
      title: t("servers"),
      description: t("serversDesc"),
      href: "/docs/servers/overview",
      icon: Server,
      color: "#4a90a8",
    },
    {
      title: t("apiRef"),
      description: t("apiDesc"),
      href: "/docs/api/overview",
      icon: Code,
      color: "#4a9e6e",
    },
    {
      title: t("tools"),
      description: t("toolsDesc"),
      href: "/docs/tools/overview",
      icon: Wrench,
      color: "#8b5cf6",
    },
    {
      title: t("guides"),
      description: t("guidesDesc"),
      href: "/docs/guides/first-block",
      icon: BookOpen,
      color: "#e8a849",
      beginner: true,
    },
    {
      title: t("community"),
      description: t("communityDesc"),
      href: "/docs/community/contributing",
      icon: Users,
      color: "#4a90a8",
    },
  ];

  return (
    <section className="py-20 bg-card">
      <div className="container px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gradient hytale-title">
            {t("title")}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {navCards.map((card) => (
            <Link key={card.title} href={card.href} className="group block">
              <div
                className={cn(
                  "relative h-full rounded-lg border-2 border-border bg-muted/50 p-6 transition-all duration-300",
                  "hover:border-opacity-100 hover:bg-muted hover:shadow-xl"
                )}
                style={{
                  ["--card-color" as string]: card.color,
                }}
              >
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    boxShadow: `0 0 30px ${card.color}20, 0 0 60px ${card.color}10`,
                  }}
                />

                {/* Badge */}
                {(card.popular || card.beginner) && (
                  <div
                    className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: card.color,
                      color: "var(--card)",
                    }}
                  >
                    {card.popular ? t("popular") : t("beginner")}
                  </div>
                )}

                {/* Icon */}
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${card.color}20`,
                  }}
                >
                  <card.icon
                    className="h-7 w-7"
                    style={{ color: card.color }}
                  />
                </div>

                {/* Title */}
                <h3
                  className="mb-2 text-lg font-bold tracking-wide transition-colors duration-300"
                  style={{
                    color: card.color,
                  }}
                >
                  {card.title}
                </h3>

                {/* Description */}
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </p>

                {/* Link */}
                <div
                  className="flex items-center text-sm font-medium opacity-0 transition-all duration-300 group-hover:opacity-100"
                  style={{ color: card.color }}
                >
                  {t("explore")}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>

                {/* Bottom border accent */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ backgroundColor: card.color }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
