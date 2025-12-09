'use client';

import { useEffect } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import type { AbstractIntlMessages } from 'next-intl';

type ClientIntlProviderProps = {
  locale: string;
  direction: 'ltr' | 'rtl';
  messages: AbstractIntlMessages;
  timeZone: string;
  children: React.ReactNode;
};

export default function ClientIntlProvider({
  locale,
  direction,
  messages,
  timeZone,
  children,
}: ClientIntlProviderProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    document.body?.setAttribute('dir', direction);
    document.body?.setAttribute('data-direction', direction);
  }, [locale, direction]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
      {children}
    </NextIntlClientProvider>
  );
}

