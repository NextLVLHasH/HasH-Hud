"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { ExternalLink, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWA } from "@/contexts/pwa-context";
import { cn } from "@/lib/utils";

export function OpenAppPrompt() {
  const t = useTranslations("pwa");
  const { showOpenAppPrompt, dismissOpenAppPrompt } = usePWA();

  const [isVisible, setIsVisible] = React.useState(false);

  // Animate in when prompt should show
  React.useEffect(() => {
    if (showOpenAppPrompt) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [showOpenAppPrompt]);

  const handleOpenApp = () => {
    // Try to open the app using the manifest start_url
    // On most platforms, this will open the installed PWA
    window.location.href = window.location.origin;
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(dismissOpenAppPrompt, 300);
  };

  if (!showOpenAppPrompt) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 p-4",
        "transition-all duration-300 ease-out",
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card/95 backdrop-blur-sm shadow-lg overflow-hidden">
        {/* Gradient accent bar */}
        <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500" />

        <div className="p-4">
          <div className="flex items-center gap-3">
            {/* App icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-green-500" />
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground">
                {t("openApp.title")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("openApp.description")}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
              aria-label={t("install.dismiss")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-3">
            <Button
              onClick={handleOpenApp}
              size="sm"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {t("openApp.openButton")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-muted-foreground"
            >
              {t("openApp.continueInBrowser")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
