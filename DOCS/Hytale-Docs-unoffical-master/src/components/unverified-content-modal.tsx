"use client";

import { useState, useEffect, ReactNode } from "react";
import { AlertTriangle, Bot, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface UnverifiedContentModalProps {
  children: ReactNode;
  pageSlug: string;
  isVerified: boolean;
  isNonFunctional: boolean;
  isEventPage: boolean;
}

const STORAGE_KEY = "HYTALEDOCS_UNVERIFIED_ACKNOWLEDGED";

export function UnverifiedContentModal({
  children,
  pageSlug,
  isVerified,
  isNonFunctional,
  isEventPage,
}: UnverifiedContentModalProps) {
  const t = useTranslations("unverifiedModal");
  const [acknowledged, setAcknowledged] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Determine if we should show the modal
  // Show for: event pages that are not verified and not marked as nonFunctional
  // Also show for ANY page that is not verified (to cover all AI-generated content)
  const shouldShowModal = !isVerified && !isNonFunctional;

  useEffect(() => {
    setMounted(true);
    if (shouldShowModal) {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const acknowledgedPages: string[] = JSON.parse(stored);
          setAcknowledged(acknowledgedPages.includes(pageSlug));
        } catch {
          setAcknowledged(false);
        }
      } else {
        setAcknowledged(false);
      }
    }
  }, [pageSlug, shouldShowModal]);

  const handleAcknowledge = () => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    let acknowledgedPages: string[] = [];
    if (stored) {
      try {
        acknowledgedPages = JSON.parse(stored);
      } catch {
        acknowledgedPages = [];
      }
    }
    if (!acknowledgedPages.includes(pageSlug)) {
      acknowledgedPages.push(pageSlug);
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(acknowledgedPages));
    setAcknowledged(true);
  };

  // Don't show modal if:
  // - Page is verified
  // - Page is non-functional (different warning shown in sidebar)
  // - User already acknowledged this page
  if (!shouldShowModal || acknowledged) {
    return <>{children}</>;
  }

  // Don't render the blocking modal until client-side hydration is complete
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred content behind */}
      <div className="blur-lg pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>

      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-xl border-2 border-amber-500/50 bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-amber-500/30 bg-amber-500/10 px-6 py-4 rounded-t-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-500">{t("title")}</h2>
              <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-start gap-3 rounded-lg bg-amber-500/5 border border-amber-500/20 p-4">
              <Bot className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground leading-relaxed">
                {t("aiGeneratedWarning")}
              </p>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{t("mayContain")}</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>{t("issue1")}</li>
                <li>{t("issue2")}</li>
                <li>{t("issue3")}</li>
                <li>{t("issue4")}</li>
              </ul>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-primary/5 border border-primary/20 p-4">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground leading-relaxed">
                {t("verifiedPagesNote")}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 border-t border-border px-6 py-4 bg-muted/30 rounded-b-xl">
            <Button
              onClick={handleAcknowledge}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              size="lg"
            >
              {t("acknowledgeButton")}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              {t("reportNote")}{" "}
              <a
                href="https://github.com/HytaleDocs/wiki-next/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
