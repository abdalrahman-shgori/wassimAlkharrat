import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: {
    default: "Wassim Alkharrat Events - Creating Unforgettable Moments",
    template: "%s | Wassim Alkharrat Events",
  },
  description: "With over a decade of experience, we specialize in crafting extraordinary experiences that celebrate life's most precious moments. Professional event planning services for weddings, corporate events, and special occasions.",
  keywords: [
    "event planning",
    "wedding planning",
    "event management",
    "corporate events",
    "special occasions",
    "Wassim Alkharrat",
    "event coordinator",
    "luxury events",
    "bespoke events",
  ],
  authors: [{ name: "Wassim Alkharrat" }],
  creator: "Wassim Alkharrat",
  publisher: "Wassim Alkharrat Events",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Wassim Alkharrat Events - Creating Unforgettable Moments",
    description: "With over a decade of experience, we specialize in crafting extraordinary experiences that celebrate life's most precious moments.",
    siteName: "Wassim Alkharrat Events",
    images: [
      {
        url: "/images/logoWhite.png",
        width: 1200,
        height: 630,
        alt: "Wassim Alkharrat Events",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wassim Alkharrat Events - Creating Unforgettable Moments",
    description: "With over a decade of experience, we specialize in crafting extraordinary experiences that celebrate life's most precious moments.",
    images: ["/images/logoWhite.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${alice.variable} ${allison.variable}`}>
        {children}
      </body>
    </html>
  );
}
