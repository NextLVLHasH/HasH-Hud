"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Settings, X } from "lucide-react";
import { useCookieConsent } from "@/contexts/cookie-consent-context";

export function CookieConsent() {
  const t = useTranslations("cookies");
  const { showBanner, acceptAll, rejectAll, openPreferences } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-xl border border-border bg-card/95 backdrop-blur-sm shadow-lg p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">{t("title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("description")}
              </p>
            </div>
            <button
              onClick={rejectAll}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors shrink-0"
              aria-label={t("close")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={openPreferences}
              className="w-full sm:w-auto gap-2"
            >
              <Settings className="h-4 w-4" />
              {t("customize")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={rejectAll}
              className="w-full sm:w-auto"
            >
              {t("rejectAll")}
            </Button>
            <Button
              size="sm"
              onClick={acceptAll}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              {t("acceptAll")}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            {t("privacyNote")}{" "}
            <button
              onClick={openPreferences}
              className="text-primary hover:underline"
            >
              {t("cookieSettings")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
