"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Server, FolderTree, FileJson } from "lucide-react";

export default function ToolsPage() {
  const t = useTranslations("tools");

  const tools = [
    {
      title: t("serverCalculator"),
      description: t("serverCalculatorDesc"),
      href: "/tools/server-calculator",
      icon: Server,
    },
    {
      title: t("projectGenerator"),
      description: t("projectGeneratorDesc"),
      href: "/tools/project-generator",
      icon: FolderTree,
    },
    {
      title: t("jsonValidator"),
      description: t("jsonValidatorDesc"),
      href: "/tools/json-validator",
      icon: FileJson,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gradient mb-4">
          {t("title")}
        </h1>
        <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Card className="h-full bg-card border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">{tool.title}</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  {tool.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-xl bg-muted/50 border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {t("basedOnOfficialTitle")}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t("basedOnOfficialDesc")}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="https://hytale.com/news/2025/11/hytale-modding-strategy-and-status"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground hover:text-primary transition-colors"
          >
            {t("moddingStrategy")}
          </a>
          <a
            href="https://hytale.com/news/2019/1/an-overview-of-hytales-server-technology"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground hover:text-primary transition-colors"
          >
            {t("serverTechnology")}
          </a>
        </div>
      </div>
    </div>
  );
}
