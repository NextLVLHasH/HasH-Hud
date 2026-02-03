"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdblockDetector() {
  const t = useTranslations("adblock");
  const [adblockDetected, setAdblockDetected] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    // Check if already dismissed in this session
    const wasDismissed = sessionStorage.getItem("adblock-dismissed");
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Create a bait element that adblockers typically block
    const bait = document.createElement("div");
    bait.className = "ad ads adsbox ad-banner ad-placement carbon-ads";
    bait.style.cssText = "position: absolute; top: -10px; left: -10px; width: 1px; height: 1px;";
    bait.innerHTML = "&nbsp;";
    document.body.appendChild(bait);

    // Check after a short delay
    const timer = setTimeout(() => {
      const isBlocked =
        bait.offsetParent === null ||
        bait.offsetHeight === 0 ||
        bait.offsetWidth === 0 ||
        bait.clientHeight === 0;

      if (isBlocked) {
        setAdblockDetected(true);
      }

      // Clean up bait element
      if (bait.parentNode) {
        bait.parentNode.removeChild(bait);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (bait.parentNode) {
        bait.parentNode.removeChild(bait);
      }
    };
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("adblock-dismissed", "true");
  };

  if (!adblockDetected || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="rounded-xl border border-border bg-card shadow-lg p-5 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">{t("title")}</h4>
            <p className="text-sm text-muted-foreground mb-3">
              {t("message")}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDismiss}
              className="text-xs"
            >
              {t("dismiss")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
