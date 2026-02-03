"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, ChevronDown, ChevronUp, BookOpen, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  documentationProgress,
  getOverallProgress,
  getCategoryProgress,
} from "@/config/documentation-progress";

const STORAGE_KEY = "hytaledocs-progress-dismissed";

export function DocumentationProgress() {
  const t = useTranslations("docProgress");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const overallProgress = getOverallProgress();

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 75) return "bg-green-500";
    if (percent >= 50) return "bg-amber-500";
    if (percent >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Banner */}
      <div className="relative bg-gradient-to-r from-blue-500/10 via-blue-500/20 to-blue-500/10 border-b border-blue-500/20">
        <div className="container px-4">
          <div className="flex items-center justify-center gap-4 py-3">
            <button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-3 text-sm group cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-blue-500">
                  {overallProgress}%
                </span>
                <span className="hidden sm:inline text-foreground">—</span>
                <span className="text-foreground">{t("title")}</span>
              </span>

              {/* Mini progress bar */}
              <div className="hidden md:flex items-center gap-2">
                <Progress
                  value={overallProgress}
                  className="w-24 h-1.5"
                  indicatorClassName={getProgressColor(overallProgress)}
                />
              </div>

              <span className="text-muted-foreground text-xs hidden lg:inline">
                {t("clickDetails")}
              </span>
            </button>

            {/* Expand button for mobile - 44x44px minimum touch target */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground"
              aria-label={isExpanded ? "Collapse progress details" : "Expand progress details"}
              aria-expanded={isExpanded}
              aria-controls="mobile-progress-details"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Expanded view for mobile */}
          {isExpanded && (
            <div id="mobile-progress-details" className="md:hidden pb-3 space-y-2">
              {documentationProgress.categories.map((category) => {
                const percent = getCategoryProgress(category);
                return (
                  <div key={category.id} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-24 truncate">
                      {t(`categories.${category.id}`)}
                    </span>
                    <Progress
                      value={percent}
                      className="flex-1 h-1.5"
                      indicatorClassName={getProgressColor(percent)}
                    />
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {percent}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Close button - 44x44px minimum touch target */}
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss progress banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Dialog with detailed progress */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              {t("dialogTitle")}
            </DialogTitle>
            <DialogDescription>{t("dialogDescription")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Overall progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("overallProgress")}</span>
                <span className="text-2xl font-bold text-blue-500">
                  {overallProgress}%
                </span>
              </div>
              <Progress
                value={overallProgress}
                className="h-3"
                indicatorClassName={getProgressColor(overallProgress)}
              />
            </div>

            {/* Categories breakdown */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {t("breakdown")}
              </h4>

              {documentationProgress.categories.map((category) => {
                const percent = getCategoryProgress(category);
                return (
                  <div key={category.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span>{t(`categories.${category.id}`)}</span>
                      <span className="text-muted-foreground">
                        {category.documented}/{category.total}{" "}
                        <span
                          className={`font-medium ${
                            percent >= 50
                              ? "text-green-500"
                              : percent >= 25
                              ? "text-amber-500"
                              : "text-red-500"
                          }`}
                        >
                          ({percent}%)
                        </span>
                      </span>
                    </div>
                    <Progress
                      value={percent}
                      className="h-2"
                      indicatorClassName={getProgressColor(percent)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Last updated */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
              <Clock className="h-4 w-4" />
              <span>
                {t("lastUpdated")}: {formatDate(documentationProgress.lastUpdated)}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
