"use client";

import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  href,
  icon,
  badge,
  className,
}: FeatureCardProps) {
  return (
    <Link href={href} className="group block">
      <Card
        className={cn(
          "h-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
          className
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {icon}
                </div>
              )}
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
            </div>
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-3">{description}</CardDescription>
          <div className="flex items-center text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Learn more
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
