import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle, Lightbulb, XCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type InfoBoxType = "info" | "warning" | "tip" | "danger" | "note";

interface InfoBoxProps {
  type?: InfoBoxType;
  title?: string;
  children: React.ReactNode;
}

const config: Record<
  InfoBoxType,
  {
    icon: typeof Info;
    className: string;
    defaultTitle: string;
    textPrefix: string;
    useAlertRole: boolean;
  }
> = {
  info: {
    icon: Info,
    className:
      "border-[--color-hytale-cyan]/50 bg-[--color-hytale-cyan]/10 [&>svg]:text-[--color-hytale-cyan]",
    defaultTitle: "Info",
    textPrefix: "Info:",
    useAlertRole: false,
  },
  warning: {
    icon: AlertTriangle,
    className:
      "border-[--color-hytale-gold]/50 bg-[--color-hytale-gold]/10 [&>svg]:text-[--color-hytale-gold]",
    defaultTitle: "Warning",
    textPrefix: "Warning:",
    useAlertRole: true,
  },
  tip: {
    icon: Lightbulb,
    className:
      "border-[--color-hytale-green]/50 bg-[--color-hytale-green]/10 [&>svg]:text-[--color-hytale-green]",
    defaultTitle: "Tip",
    textPrefix: "Tip:",
    useAlertRole: false,
  },
  danger: {
    icon: XCircle,
    className:
      "border-destructive/50 bg-destructive/10 [&>svg]:text-destructive",
    defaultTitle: "Danger",
    textPrefix: "Danger:",
    useAlertRole: true,
  },
  note: {
    icon: FileText,
    className:
      "border-[--color-hytale-violet]/50 bg-[--color-hytale-violet]/10 [&>svg]:text-[--color-hytale-violet]",
    defaultTitle: "Note",
    textPrefix: "Note:",
    useAlertRole: false,
  },
};

export function InfoBox({ type = "info", title, children }: InfoBoxProps) {
  const { icon: Icon, className, defaultTitle, textPrefix, useAlertRole } = config[type];
  const displayTitle = title || defaultTitle;

  return (
    <Alert
      className={cn("my-4", className)}
      role={useAlertRole ? "alert" : undefined}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <AlertTitle>
        <span className="sr-only">{textPrefix} </span>
        {displayTitle}
      </AlertTitle>
      <AlertDescription className="mt-2">{children}</AlertDescription>
    </Alert>
  );
}
