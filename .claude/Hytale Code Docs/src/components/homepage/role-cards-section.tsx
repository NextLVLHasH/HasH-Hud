"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Gamepad2,
  Palette,
  Code2,
  Server,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function RoleCardsSection() {
  const t = useTranslations("roleCards");

  const roleCards = [
    {
      id: "player",
      title: t("playerTitle"),
      description: t("playerDesc"),
      href: "/docs/gameplay/overview",
      icon: Gamepad2,
      color: "#3b82f6", // blue
      bgGradient: "from-blue-500/10 to-blue-600/5",
    },
    {
      id: "creator",
      title: t("creatorTitle"),
      description: t("creatorDesc"),
      href: "/docs/modding/overview",
      icon: Palette,
      color: "#22c55e", // green
      bgGradient: "from-green-500/10 to-green-600/5",
    },
    {
      id: "developer",
      title: t("developerTitle"),
      description: t("developerDesc"),
      href: "/docs/modding/plugins/overview",
      icon: Code2,
      color: "#a855f7", // purple
      bgGradient: "from-purple-500/10 to-purple-600/5",
    },
    {
      id: "admin",
      title: t("adminTitle"),
      description: t("adminDesc"),
      href: "/docs/servers/overview",
      icon: Server,
      color: "#f97316", // orange
      bgGradient: "from-orange-500/10 to-orange-600/5",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-card/50">
      <div className="container px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl md:text-3xl font-bold text-gradient hytale-title">
            {t("title")}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {roleCards.map((card) => (
            <Link key={card.id} href={card.href} className="group block">
              <div
                className={cn(
                  "relative h-full rounded-xl border-2 border-border p-5 transition-all duration-300",
                  "bg-gradient-to-br",
                  card.bgGradient,
                  "hover:border-opacity-100 hover:shadow-lg hover:-translate-y-1"
                )}
                style={{
                  ["--card-color" as string]: card.color,
                }}
              >
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    boxShadow: `0 0 40px ${card.color}15`,
                  }}
                />

                {/* Icon */}
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${card.color}15`,
                    border: `1px solid ${card.color}30`,
                  }}
                >
                  <card.icon
                    className="h-6 w-6"
                    style={{ color: card.color }}
                  />
                </div>

                {/* Title */}
                <h3
                  className="mb-2 text-base font-bold tracking-wide transition-colors duration-300"
                  style={{
                    color: card.color,
                  }}
                >
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {card.description}
                </p>

                {/* Link indicator */}
                <div
                  className="flex items-center text-sm font-medium opacity-60 transition-all duration-300 group-hover:opacity-100"
                  style={{ color: card.color }}
                >
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
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
