import type { AbstractIntlMessages } from 'next-intl';

import ar from '@/locales/ar.json';
import en from '@/locales/en.json';

export const locales = ['en', 'ar'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';
export const defaultTimeZone = 'UTC';

export function isLocale(value?: string | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function getMessages(locale: Locale): AbstractIntlMessages {
  switch (locale) {
    case 'ar':
      return ar;
    case 'en':
    default:
      return en;
  }
}

