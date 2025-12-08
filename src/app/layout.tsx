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
  title: "Wassim Alkharrat",
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
        width: 1200,
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
    icon: [
      { url: "/logo.png", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
    shortcut: "/logo.png",
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
