"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCookieConsent, CookiePreferences } from "@/contexts/cookie-consent-context";
import { Cookie, BarChart3, Megaphone, Shield } from "lucide-react";

interface CookieCategoryProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

function CookieCategory({
  id,
  title,
  description,
  icon,
  checked,
  disabled,
  onCheckedChange,
}: CookieCategoryProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/30">
      <div className="shrink-0 p-2 rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor={id}
            className="font-medium text-foreground cursor-pointer"
          >
            {title}
          </label>
          <Switch
            id={id}
            checked={checked}
            disabled={disabled}
            onCheckedChange={onCheckedChange}
            aria-describedby={`${id}-description`}
          />
        </div>
        <p
          id={`${id}-description`}
          className="text-sm text-muted-foreground mt-1"
        >
          {description}
        </p>
      </div>
    </div>
  );
}

export function CookiePreferencesDialog() {
  const t = useTranslations("cookies");
  const {
    preferences,
    showPreferences,
    setShowPreferences,
    savePreferences,
    acceptAll,
    rejectAll,
  } = useCookieConsent();

  // Local state for editing preferences
  const [localPreferences, setLocalPreferences] = React.useState<CookiePreferences>(preferences);

  // Sync local state when dialog opens or preferences change
  React.useEffect(() => {
    if (showPreferences) {
      setLocalPreferences(preferences);
    }
  }, [showPreferences, preferences]);

  const handleSave = () => {
    savePreferences(localPreferences);
  };

  const handleCancel = () => {
    setShowPreferences(false);
  };

  return (
    <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
      <DialogContent
        className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto"
        aria-labelledby="cookie-preferences-title"
        aria-describedby="cookie-preferences-description"
      >
        <DialogHeader>
          <DialogTitle id="cookie-preferences-title" className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            {t("preferencesTitle")}
          </DialogTitle>
          <DialogDescription id="cookie-preferences-description">
            {t("preferencesDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4">
          <CookieCategory
            id="essential-cookies"
            title={t("categories.essential.title")}
            description={t("categories.essential.description")}
            icon={<Shield className="h-5 w-5" />}
            checked={true}
            disabled={true}
          />

          <CookieCategory
            id="analytics-cookies"
            title={t("categories.analytics.title")}
            description={t("categories.analytics.description")}
            icon={<BarChart3 className="h-5 w-5" />}
            checked={localPreferences.analytics}
            onCheckedChange={(checked) =>
              setLocalPreferences((prev) => ({ ...prev, analytics: checked }))
            }
          />

          <CookieCategory
            id="advertising-cookies"
            title={t("categories.advertising.title")}
            description={t("categories.advertising.description")}
            icon={<Megaphone className="h-5 w-5" />}
            checked={localPreferences.advertising}
            onCheckedChange={(checked) =>
              setLocalPreferences((prev) => ({ ...prev, advertising: checked }))
            }
          />
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={rejectAll}
              className="flex-1 sm:flex-none"
            >
              {t("rejectAll")}
            </Button>
            <Button
              variant="outline"
              onClick={acceptAll}
              className="flex-1 sm:flex-none"
            >
              {t("acceptAll")}
            </Button>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="flex-1 sm:flex-none"
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 sm:flex-none"
            >
              {t("savePreferences")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
