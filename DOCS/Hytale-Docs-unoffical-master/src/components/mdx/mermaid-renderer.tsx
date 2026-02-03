"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// Initialize mermaid with Hytale theme
mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  securityLevel: "loose",
  themeVariables: {
    // Background colors
    background: "transparent",
    primaryColor: "#253649",
    secondaryColor: "#1a2332",
    tertiaryColor: "#2d3f54",

    // Border colors
    primaryBorderColor: "#e8a849",
    secondaryBorderColor: "#4a90a8",
    tertiaryBorderColor: "#3d5168",

    // Text colors - ensure visibility
    primaryTextColor: "#e2e8f0",
    secondaryTextColor: "#94a3b8",
    tertiaryTextColor: "#64748b",
    textColor: "#e2e8f0",

    // Line colors
    lineColor: "#4a90a8",

    // Node colors
    nodeBorder: "#e8a849",
    nodeTextColor: "#e2e8f0",

    // Flowchart specific
    mainBkg: "#253649",
    nodeBkg: "#253649",
    clusterBkg: "#1e2b3d",
    clusterBorder: "#3d5168",

    // Label colors
    labelBackground: "#1a2332",
    labelTextColor: "#e2e8f0",
    edgeLabelBackground: "#1a2332",

    // Arrow
    arrowheadColor: "#e8a849",

    // Font
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontSize: "14px",
  },
  flowchart: {
    curve: "basis",
    padding: 30,
    nodeSpacing: 60,
    rankSpacing: 60,
    htmlLabels: false,
    useMaxWidth: false,
  },
  sequence: {
    actorMargin: 50,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    useMaxWidth: false,
  },
});

interface MermaidRendererProps {
  chartString: string;
}

export function MermaidRenderer({ chartString }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current || !chartString.trim()) return;

      try {
        // Generate unique ID for this chart
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        // Render the chart
        const { svg } = await mermaid.render(id, chartString);
        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        console.error("Chart content:", chartString);
        setError("Failed to render diagram");
      }
    };

    renderChart();
  }, [chartString]);

  if (error) {
    return (
      <div className="my-6 rounded-xl border-2 border-red-500/50 bg-red-500/10 p-4 text-red-400">
        <p className="text-sm font-medium">Diagram Error</p>
        <pre className="mt-2 text-xs opacity-75 whitespace-pre-wrap">{chartString}</pre>
      </div>
    );
  }

  return (
    <div className="my-8 w-full">
      <div
        ref={containerRef}
        className="mermaid-container rounded-xl border-2 border-border bg-card/50 p-8 overflow-x-auto flex justify-center"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
