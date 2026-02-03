"use client";

import * as React from "react";
import { useAdsenseReady } from "./ad-script-loader";

interface AdUnitProps {
  slot?: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const PUBLISHER_ID = "ca-pub-4389631952462736";

// Ad slot IDs from AdSense
const AD_SLOTS = {
  sidebar: "8249458786",
  article: "4899233101",
  footer: "4443759924",
};

// Set to true to show placeholder boxes instead of real ads (for testing layout)
// Change to false once AdSense is approved
const SHOW_PLACEHOLDERS = true;

/**
 * Hook to observe when an element enters the viewport.
 * Returns true once the element has been visible.
 */
function useIntersectionObserver(
  ref: React.RefObject<Element | null>,
  options?: IntersectionObserverInit
): boolean {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || isVisible) return;

    // Check if IntersectionObserver is supported
    if (!("IntersectionObserver" in window)) {
      // Fallback: load immediately if no IntersectionObserver support
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Once visible, stop observing
            observer.disconnect();
          }
        });
      },
      {
        root: null,
        rootMargin: "200px", // Start loading 200px before entering viewport
        threshold: 0,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, isVisible, options]);

  return isVisible;
}

export function AdUnit({ slot, format = "auto", className = "" }: AdUnitProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const adRef = React.useRef<HTMLModElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [adPushed, setAdPushed] = React.useState(false);

  const isAdsenseReady = useAdsenseReady();
  const isVisible = useIntersectionObserver(containerRef);

  React.useEffect(() => {
    // Only load if we have a slot ID, adsense is ready, element is visible, and ad hasn't been pushed yet
    if (!slot || !isAdsenseReady || !isVisible || adPushed) return;

    const timer = setTimeout(() => {
      try {
        if (typeof window !== "undefined" && window.adsbygoogle && adRef.current) {
          window.adsbygoogle.push({});
          setAdPushed(true);
          setIsLoaded(true);
        }
      } catch (err) {
        console.error("AdSense error:", err);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [slot, isAdsenseReady, isVisible, adPushed]);

  // Don't render if no slot ID configured
  if (!slot) return null;

  return (
    <div ref={containerRef} className={`ad-container overflow-hidden ${className}`}>
      {isVisible && (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", minHeight: isLoaded ? "auto" : "0" }}
          data-ad-client={PUBLISHER_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}

// Placeholder component for testing
function AdPlaceholder({ height, label }: { height: string; label: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20"
      style={{ height }}
    >
      <span className="text-xs text-muted-foreground/50">{label}</span>
    </div>
  );
}

// Discrete sidebar ad - appears at bottom of sidebar
export function SidebarAd() {
  return (
    <div className="mt-6 pt-6 border-t border-border">
      <p className="text-[10px] text-muted-foreground/60 mb-2 uppercase tracking-wider">
        Sponsored
      </p>
      {SHOW_PLACEHOLDERS ? (
        <AdPlaceholder height="250px" label="Sidebar Ad" />
      ) : (
        <AdUnit slot={AD_SLOTS.sidebar} format="vertical" />
      )}
    </div>
  );
}

// Discrete article ad - appears after content (in-article format)
export function ArticleAd() {
  return (
    <div className="my-10 py-6 border-y border-border/50">
      <p className="text-[10px] text-muted-foreground/50 mb-3 uppercase tracking-wider text-center">
        Sponsored
      </p>
      {SHOW_PLACEHOLDERS ? (
        <AdPlaceholder height="120px" label="In-Article Ad" />
      ) : (
        <InArticleAd />
      )}
    </div>
  );
}

// Special in-article ad format with lazy loading
function InArticleAd() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const adRef = React.useRef<HTMLModElement>(null);
  const [adPushed, setAdPushed] = React.useState(false);

  const isAdsenseReady = useAdsenseReady();
  const isVisible = useIntersectionObserver(containerRef);

  React.useEffect(() => {
    if (!isAdsenseReady || !isVisible || adPushed) return;

    const timer = setTimeout(() => {
      try {
        if (typeof window !== "undefined" && window.adsbygoogle && adRef.current) {
          window.adsbygoogle.push({});
          setAdPushed(true);
        }
      } catch (err) {
        console.error("AdSense error:", err);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAdsenseReady, isVisible, adPushed]);

  return (
    <div ref={containerRef}>
      {isVisible && (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center" }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client={PUBLISHER_ID}
          data-ad-slot={AD_SLOTS.article}
        />
      )}
    </div>
  );
}

// Discrete footer ad
export function FooterAd() {
  return (
    <div className="py-4">
      <p className="text-[10px] text-muted-foreground/50 mb-2 uppercase tracking-wider text-center">
        Sponsored
      </p>
      {SHOW_PLACEHOLDERS ? (
        <AdPlaceholder height="90px" label="Footer Ad" />
      ) : (
        <AdUnit slot={AD_SLOTS.footer} format="horizontal" />
      )}
    </div>
  );
}
