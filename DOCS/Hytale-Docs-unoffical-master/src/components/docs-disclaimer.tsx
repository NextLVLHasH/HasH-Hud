"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, X, ExternalLink } from "lucide-react";

const STORAGE_KEY = "hytaledocs-disclaimer-dismissed";

export function DocsDisclaimer() {
  const t = useTranslations("docsDisclaimer");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="sticky top-16 z-40 relative bg-gradient-to-r from-orange-500/10 via-orange-500/20 to-orange-500/10 border-b border-orange-500/30">
      <div className="container px-4">
        <div className="flex items-center justify-center gap-3 py-2.5 text-sm">
          <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />
          <span className="text-foreground">
            <span className="font-medium text-orange-500">{t("title")}</span>
            <span className="hidden sm:inline"> — {t("message")}</span>
          </span>
          <a
            href="https://github.com/timiliris/Hytale-Docs/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1 text-orange-500 hover:text-orange-400 font-medium transition-colors"
          >
            {t("reportLink")}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
