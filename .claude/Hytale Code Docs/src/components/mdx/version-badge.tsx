import { Badge } from "@/components/ui/badge";
import { Check, Star, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type VersionStatus = "current" | "beta" | "deprecated" | "upcoming";

interface VersionBadgeProps {
  version: string;
  status?: VersionStatus;
}

const statusConfig: Record<
  VersionStatus,
  {
    icon: typeof Check;
    className: string;
    label: string;
  }
> = {
  current: {
    icon: Check,
    className: "bg-[--color-hytale-green]/20 text-[--color-hytale-green] border-[--color-hytale-green]/50",
    label: "Current",
  },
  beta: {
    icon: Star,
    className: "bg-[--color-hytale-violet]/20 text-[--color-hytale-violet] border-[--color-hytale-violet]/50",
    label: "Beta",
  },
  deprecated: {
    icon: AlertCircle,
    className: "bg-destructive/20 text-destructive border-destructive/50",
    label: "Deprecated",
  },
  upcoming: {
    icon: Clock,
    className: "bg-[--color-hytale-cyan]/20 text-[--color-hytale-cyan] border-[--color-hytale-cyan]/50",
    label: "Upcoming",
  },
};

export function VersionBadge({ version, status = "current" }: VersionBadgeProps) {
  const { icon: Icon, className, label } = statusConfig[status];

  return (
    <Badge variant="outline" className={cn("gap-1.5", className)}>
      <Icon className="h-3 w-3" />
      <span>{version}</span>
      <span className="text-xs opacity-75">({label})</span>
    </Badge>
  );
}
