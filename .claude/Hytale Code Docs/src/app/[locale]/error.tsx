"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">{t("title")}</CardTitle>
            <CardDescription className="text-base">
              {t("description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              {t("details")}
            </p>
            {error.digest && (
              <p className="mt-2 font-mono text-xs text-muted-foreground/70">
                {t("errorCode")}: {error.digest}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="default"
              className="w-full sm:flex-1"
              onClick={reset}
            >
              <RefreshCw className="h-4 w-4" />
              {t("tryAgain")}
            </Button>
            <Button variant="outline" className="w-full sm:flex-1" asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
                {t("backToHome")}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
