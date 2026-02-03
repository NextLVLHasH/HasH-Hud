"use client";

import * as React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ChevronRight, BadgeCheck, CircleOff, CircleHelp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { sidebarConfig, type SidebarItem, getAudienceBadgeColor } from "@/config/sidebar";
import { Badge } from "@/components/ui/badge";
import { SidebarAd } from "@/components/ads";
import { useMobileNavigation } from "@/contexts/mobile-navigation-context";

function SidebarLink({
  item,
  level = 0,
  t,
  badgeT,
}: {
  item: SidebarItem;
  level?: number;
  t: (key: string) => string;
  badgeT?: (key: string) => string;
}) {
  const pathname = usePathname();
  const isActive = item.href === pathname;
  const hasChildren = item.items && item.items.length > 0;
  const isChildActive =
    hasChildren &&
    item.items?.some(
      (child) =>
        child.href === pathname ||
        child.items?.some((grandchild) => grandchild.href === pathname)
    );

  const [isOpen, setIsOpen] = React.useState(isActive || isChildActive);

  React.useEffect(() => {
    if (isActive || isChildActive) {
      setIsOpen(true);
    }
  }, [isActive, isChildActive]);

  const title = t(item.titleKey);

  // Render audience badge for top-level items
  const audienceBadge = level === 0 && item.audience && badgeT ? (
    <Badge
      variant="outline"
      className={cn(
        "ml-auto text-[10px] px-1.5 py-0 h-4 font-normal",
        getAudienceBadgeColor(item.audience)
      )}
    >
      {badgeT(item.audience)}
    </Badge>
  ) : null;

  if (hasChildren) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-primary">
          <span className={cn("truncate", isChildActive && "text-primary")}>
            {title}
          </span>
          {audienceBadge}
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ml-auto",
              isOpen && "rotate-90",
              audienceBadge && "ml-0"
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="ml-2.5 border-l border-border pl-2.5">
            {item.items?.map((child) => (
              <SidebarLink key={child.titleKey} item={child} level={level + 1} t={t} badgeT={badgeT} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link
      href={item.href || "#"}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-muted",
        isActive
          ? "bg-primary/10 font-medium text-primary border-l-2 border-primary -ml-[2px] pl-[12px]"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <span className="truncate">{title}</span>
      {item.verified && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-hytale-green" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {t("verified")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {item.nonFunctional && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <CircleOff className="h-3.5 w-3.5 shrink-0 text-destructive" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs max-w-48">
              {t("nonFunctional")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {/* Show untested icon for events that haven't been tested yet */}
      {!item.verified && !item.nonFunctional && item.href?.includes("/events/") && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <CircleHelp className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs max-w-48">
              {t("untested")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </Link>
  );
}

export function Sidebar() {
  const t = useTranslations("sidebar");
  const badgeT = useTranslations("audienceBadges");

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 xl:w-80 2xl:w-96 shrink-0 border-r border-border lg:block">
      <ScrollArea className="h-full py-4 pr-3">
        <nav className="space-y-0.5 pl-3">
          {sidebarConfig.map((item) => (
            <SidebarLink key={item.titleKey} item={item} t={t} badgeT={badgeT} />
          ))}
        </nav>
        {/* Discrete ad at bottom of sidebar */}
        <div className="pl-3 pr-1">
          <SidebarAd />
        </div>
      </ScrollArea>
    </aside>
  );
}

export function MobileSidebar() {
  const t = useTranslations("sidebar");
  const badgeT = useTranslations("audienceBadges");

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <nav className="space-y-1 p-4">
        {sidebarConfig.map((item) => (
          <SidebarLink key={item.titleKey} item={item} t={t} badgeT={badgeT} />
        ))}
      </nav>
    </ScrollArea>
  );
}

export function MobileSidebarDrawer() {
  const t = useTranslations("sidebar");
  const badgeT = useTranslations("audienceBadges");
  const navT = useTranslations("nav");
  const { sidebarOpen, setSidebarOpen } = useMobileNavigation();

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent
        side="left"
        className={cn(
          "w-[280px] sm:w-[320px]",
          "bg-background border-r border-border",
          "p-0"
        )}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        <SheetHeader className="px-4 pb-3 border-b border-border">
          <SheetTitle className="text-sm font-semibold text-left">
            {navT("navigation")}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)]">
          <nav className="space-y-1 p-4">
            {sidebarConfig.map((item) => (
              <SidebarLink key={item.titleKey} item={item} t={t} badgeT={badgeT} />
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
