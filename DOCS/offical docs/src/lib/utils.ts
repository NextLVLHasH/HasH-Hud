import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function deepMerge<T extends Record<string, any>>(
  base: T,
  override: T,
): T {
  const result = { ...base };

  for (const key in override) {
    const baseValue = base[key];
    const overrideValue = override[key];

    if (
      overrideValue &&
      typeof overrideValue === "object" &&
      !Array.isArray(overrideValue) &&
      baseValue &&
      typeof baseValue === "object" &&
      !Array.isArray(baseValue)
    ) {
      // Recursively merge nested objects
      result[key] = deepMerge(baseValue, overrideValue);
    } else {
      // Override primitive values and arrays
      result[key] = overrideValue;
    }
  }

  return result;
}
