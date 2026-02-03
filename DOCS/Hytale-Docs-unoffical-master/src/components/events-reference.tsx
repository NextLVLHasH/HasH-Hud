"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Search, Filter, CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { eventsMetadata, type EventMetadata } from "@/config/sidebar";
import { cn } from "@/lib/utils";

type FilterCategory = "all" | "player" | "block" | "world" | "chunk" | "server" | "entity" | "permission" | "inventory" | "other";

const categoryToFilter: Record<EventMetadata["category"], FilterCategory> = {
  player: "player",
  block: "block",
  world: "world",
  chunk: "chunk",
  server: "server",
  entity: "entity",
  permission: "permission",
  inventory: "inventory",
  prefab: "other",
  damage: "other",
  zone: "other",
  asset: "other",
  npc: "other",
  adventure: "other",
  i18n: "other",
  singleplayer: "other",
};

const filterCategories: FilterCategory[] = [
  "all",
  "player",
  "block",
  "world",
  "chunk",
  "server",
  "entity",
  "permission",
  "inventory",
  "other",
];

const categoryColors: Record<EventMetadata["category"], string> = {
  player: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  block: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  world: "bg-green-500/10 text-green-500 border-green-500/20",
  chunk: "bg-teal-500/10 text-teal-500 border-teal-500/20",
  server: "bg-red-500/10 text-red-500 border-red-500/20",
  entity: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  permission: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  inventory: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  prefab: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  damage: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  zone: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  asset: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  npc: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  adventure: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  i18n: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  singleplayer: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export function EventsReference() {
  const t = useTranslations("eventsRef");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");

  const filteredEvents = useMemo(() => {
    return eventsMetadata.filter((event) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        event.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        activeFilter === "all" ||
        categoryToFilter[event.category] === activeFilter;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeFilter]);

  const getStatusBadge = (event: EventMetadata) => {
    if (event.nonFunctional) {
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
          <XCircle className="w-3 h-3 mr-1" />
          {t("nonFunctional")}
        </Badge>
      );
    }
    if (event.verified) {
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {t("verified")}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
        <AlertCircle className="w-3 h-3 mr-1" />
        {t("untested")}
      </Badge>
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {filterCategories.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              )}
            >
              {t(`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`)}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{t("showingEvents", { count: filteredEvents.length })}</span>
          {(searchQuery || activeFilter !== "all") && (
            <button
              onClick={clearFilters}
              className="text-primary hover:underline"
            >
              {t("clearFilters")}
            </button>
          )}
        </div>
      </div>

      {/* Events Table */}
      {filteredEvents.length > 0 ? (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">{t("columnName")}</TableHead>
                <TableHead className="font-semibold hidden sm:table-cell">{t("columnCategory")}</TableHead>
                <TableHead className="font-semibold text-center hidden md:table-cell">{t("columnCancellable")}</TableHead>
                <TableHead className="font-semibold text-center hidden lg:table-cell">{t("columnAsync")}</TableHead>
                <TableHead className="font-semibold text-center hidden lg:table-cell">{t("columnEcs")}</TableHead>
                <TableHead className="font-semibold">{t("columnStatus")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.name} className="hover:bg-muted/30">
                  <TableCell>
                    <Link
                      href={event.href}
                      className="font-mono text-sm text-primary hover:underline"
                    >
                      {event.name}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant="outline"
                      className={cn("capitalize", categoryColors[event.category])}
                    >
                      {event.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    {event.cancellable ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center hidden lg:table-cell">
                    {event.async ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-500 mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center hidden lg:table-cell">
                    {event.ecsEvent ? (
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                        ECS
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(event)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>{t("noResults")}</p>
          <button
            onClick={clearFilters}
            className="text-primary hover:underline mt-2"
          >
            {t("clearFilters")}
          </button>
        </div>
      )}
    </div>
  );
}
