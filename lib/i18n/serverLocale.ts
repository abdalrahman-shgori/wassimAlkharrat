import { NextRequest } from "next/server";
import { Locale, defaultLocale, isLocale } from "@/lib/i18n/config";

/**
 * Read the preferred locale from the Accept-Language header.
 * Falls back to the default locale when missing/invalid.
 */
export function getPreferredLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language");
  if (header) {
    // take the first language token (e.g. "ar-SA,ar;q=0.9,en;q=0.8")
    const preferred = header.split(",")[0]?.trim().split("-")[0]?.toLowerCase();
    if (isLocale(preferred)) {
      return preferred;
    }
  }
  return defaultLocale;
}

/**
 * Pick a localized string based on locale with sensible fallbacks.
 */
export function pickLocalizedString(
  locale: Locale,
  values: { en?: string | null; ar?: string | null }
): string {
  const { en, ar } = values;
  if (locale === "ar") {
    return ar || en || "";
  }
  return en || ar || "";
}

