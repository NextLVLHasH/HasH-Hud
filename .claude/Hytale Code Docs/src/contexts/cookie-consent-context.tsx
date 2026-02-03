"use client";

import * as React from "react";

export interface CookiePreferences {
  essential: boolean; // Always true, cannot be disabled
  analytics: boolean;
  advertising: boolean;
}

interface CookieConsentContextType {
  preferences: CookiePreferences;
  hasConsented: boolean;
  showBanner: boolean;
  showPreferences: boolean;
  setShowBanner: (show: boolean) => void;
  setShowPreferences: (show: boolean) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (preferences: Partial<CookiePreferences>) => void;
  openPreferences: () => void;
}

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  advertising: false,
};

const CookieConsentContext = React.createContext<CookieConsentContextType | undefined>(undefined);

const STORAGE_KEY = "cookie-preferences";

function getStoredPreferences(): CookiePreferences | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        essential: true, // Always true
        analytics: Boolean(parsed.analytics),
        advertising: Boolean(parsed.advertising),
      };
    }
  } catch {
    // Invalid JSON, return null
  }
  return null;
}

function storePreferences(preferences: CookiePreferences): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = React.useState<CookiePreferences>(defaultPreferences);
  const [hasConsented, setHasConsented] = React.useState(true); // Default true to prevent flash
  const [showBanner, setShowBanner] = React.useState(false);
  const [showPreferences, setShowPreferences] = React.useState(false);

  // Initialize from localStorage
  React.useEffect(() => {
    const stored = getStoredPreferences();
    if (stored) {
      setPreferences(stored);
      setHasConsented(true);
    } else {
      setHasConsented(false);
      // Delay showing banner for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = React.useCallback(() => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      advertising: true,
    };
    setPreferences(allAccepted);
    storePreferences(allAccepted);
    setHasConsented(true);
    setShowBanner(false);
    setShowPreferences(false);
  }, []);

  const rejectAll = React.useCallback(() => {
    const rejected: CookiePreferences = {
      essential: true,
      analytics: false,
      advertising: false,
    };
    setPreferences(rejected);
    storePreferences(rejected);
    setHasConsented(true);
    setShowBanner(false);
    setShowPreferences(false);
  }, []);

  const savePreferences = React.useCallback((newPreferences: Partial<CookiePreferences>) => {
    const updated: CookiePreferences = {
      essential: true, // Always true
      analytics: newPreferences.analytics ?? preferences.analytics,
      advertising: newPreferences.advertising ?? preferences.advertising,
    };
    setPreferences(updated);
    storePreferences(updated);
    setHasConsented(true);
    setShowBanner(false);
    setShowPreferences(false);
  }, [preferences]);

  const openPreferences = React.useCallback(() => {
    setShowPreferences(true);
  }, []);

  const value: CookieConsentContextType = {
    preferences,
    hasConsented,
    showBanner,
    showPreferences,
    setShowBanner,
    setShowPreferences,
    acceptAll,
    rejectAll,
    savePreferences,
    openPreferences,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = React.useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return context;
}
