"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { BookOpen, FileText, Wrench } from "lucide-react";

interface StatItemProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  suffix?: string;
  color: string;
}

function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [count, setCount] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function StatItem({ value, label, icon, suffix, color }: StatItemProps) {
  return (
    <div className="relative group">
      <div
        className="flex flex-col items-center p-8 rounded-lg border-2 border-border bg-muted/30 transition-all duration-300 hover:border-opacity-50"
        style={{
          ["--stat-color" as string]: color,
        }}
      >
        {/* Glow on hover */}
        <div
          className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            boxShadow: `0 0 40px ${color}15`,
          }}
        />

        {/* Icon */}
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            backgroundColor: `${color}20`,
          }}
        >
          <div style={{ color }}>{icon}</div>
        </div>

        {/* Value */}
        <div className="text-4xl font-bold mb-2" style={{ color }}>
          <AnimatedCounter value={value} suffix={suffix} />
        </div>

        {/* Label */}
        <div className="text-muted-foreground text-sm font-medium">{label}</div>
      </div>
    </div>
  );
}

export function StatsSection() {
  const t = useTranslations("stats");

  return (
    <section className="py-16 bg-card">
      <div className="container px-4">
        <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
          <StatItem
            value={50}
            suffix="+"
            label={t("guides")}
            icon={<BookOpen className="h-8 w-8" />}
            color="#e8a849"
          />
          <StatItem
            value={200}
            suffix="+"
            label={t("pages")}
            icon={<FileText className="h-8 w-8" />}
            color="#4a90a8"
          />
          <StatItem
            value={3}
            label={t("tools")}
            icon={<Wrench className="h-8 w-8" />}
            color="#4a9e6e"
          />
        </div>
      </div>
    </section>
  );
}
