"use client";

import * as React from "react";

const PUBLISHER_ID = "ca-pub-4389631952462736";
const ADSENSE_URL = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`;

declare global {
  interface Window {
    adsbygoogle: unknown[];
    __adsenseLoaded?: boolean;
    __adsenseLoading?: boolean;
  }
}

/**
 * Loads the Google AdSense script lazily after the page has loaded.
 * Uses requestIdleCallback when available, falls back to setTimeout.
 * This prevents the ~946KB AdSense script from blocking the initial page render.
 */
export function AdScriptLoader() {
  React.useEffect(() => {
    // Skip if already loaded or loading
    if (typeof window === "undefined") return;
    if (window.__adsenseLoaded || window.__adsenseLoading) return;

    const loadAdsenseScript = () => {
      // Double-check to prevent race conditions
      if (window.__adsenseLoaded || window.__adsenseLoading) return;
      window.__adsenseLoading = true;

      // Initialize adsbygoogle array if not exists
      window.adsbygoogle = window.adsbygoogle || [];

      // Create and append the script
      const script = document.createElement("script");
      script.src = ADSENSE_URL;
      script.async = true;
      script.crossOrigin = "anonymous";

      script.onload = () => {
        window.__adsenseLoaded = true;
        window.__adsenseLoading = false;
        // Dispatch custom event to notify ad units that the script is ready
        window.dispatchEvent(new CustomEvent("adsense-ready"));
      };

      script.onerror = () => {
        window.__adsenseLoading = false;
        console.warn("AdSense script failed to load");
      };

      document.head.appendChild(script);
    };

    // Use requestIdleCallback if available for optimal timing
    const scheduleLoad = () => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(loadAdsenseScript, { timeout: 3000 });
      } else {
        // Fallback to setTimeout for browsers without requestIdleCallback
        setTimeout(loadAdsenseScript, 2000);
      }
    };

    // Wait for window load event before scheduling
    if (document.readyState === "complete") {
      scheduleLoad();
    } else {
      window.addEventListener("load", scheduleLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", scheduleLoad);
    };
  }, []);

  // This component doesn't render anything
  return null;
}

/**
 * Hook to check if AdSense script is loaded and ready
 */
export function useAdsenseReady(): boolean {
  const [isReady, setIsReady] = React.useState(
    typeof window !== "undefined" && window.__adsenseLoaded === true
  );

  React.useEffect(() => {
    if (window.__adsenseLoaded) {
      setIsReady(true);
      return;
    }

    const handleReady = () => setIsReady(true);
    window.addEventListener("adsense-ready", handleReady);

    return () => {
      window.removeEventListener("adsense-ready", handleReady);
    };
  }, []);

  return isReady;
}
