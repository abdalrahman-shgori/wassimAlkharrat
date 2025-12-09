import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

import ClientIntlProvider from "@/components/i18n/ClientIntlProvider";
import {
  defaultLocale,
  defaultTimeZone,
  getDirection,
  getMessages,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";
import "./globals.css";
import FloatingSocial from "@/components/FloatingSocial/FloatingSocial";

const alice = localFont({
  src: "../../public/fonts/Alice-Regular.ttf",
  variable: "--font-alice",
  weight: "400",
  display: "swap",
});
const allison = localFont({
  src: "../../public/fonts/Allison-Regular.ttf",
  variable: "--font-allison",
  weight: "400",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Wassim Alkharrat Events",
  description: "Welcome to Wassim Alkharrat - Your trusted partner for exceptional services",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Wassim Alkharrat",
    description: "Welcome to Wassim Alkharrat - Your trusted partner for exceptional services",
    url: "/",
    siteName: "Wassim Alkharrat",
    images: [
      {
        url: "https://wassim-alkharrat.vercel.app/logo.png",
        width: 800,
        height: 630,
        alt: "Wassim Alkharrat Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wassim Alkharrat",
    description: "Welcome to Wassim Alkharrat - Your trusted partner for exceptional services",
    images: ["https://wassim-alkharrat.vercel.app/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let locale: Locale = defaultLocale;
  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get("NEXT_LOCALE")?.value;
    if (isLocale(cookieValue)) {
      locale = cookieValue;
    }
  } catch {
    // fall back to default locale
  }
  const direction = getDirection(locale);
  const messages = getMessages(locale);
  const timeZone = process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || defaultTimeZone;

  return (
    <html lang={locale} dir={direction}>
      <body
        className={`${alice.variable} ${allison.variable}`}
        data-direction={direction}
      >
        <ClientIntlProvider
          locale={locale}
          direction={direction}
          messages={messages}
          timeZone={timeZone}
        >
          {children}
          <FloatingSocial />
        </ClientIntlProvider>
      </body>
    </html>
  );
}
