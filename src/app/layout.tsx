import type { Metadata } from "next";
import { Hind_Siliguri, Manrope } from 'next/font/google'
import "./globals.css";
import { Providers } from "./providers";
import { Suspense } from "react";
import { LoadingProvider, HarvestLoader } from "@/Components/loading";
import LayoutShell from "@/Components/LayoutShell";
import AuthSync from "@/Components/AuthSync";

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' })
const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bengali',
})

export const metadata: Metadata = {
  title: {
    default: "ফসলবাড়ি | বাংলাদেশের কৃষি বাজার",
    template: "%s | ফসলবাড়ি",
  },
  description:
    "সরাসরি কৃষকের কাছ থেকে তাজা শাকসবজি, মৌসুমি ফল ও অর্গানিক পণ্য কিনুন। ফসলবাড়ি — বাংলাদেশের বিশ্বস্ত কৃষি বাজারপ্লেস।",
  keywords: [
    "কৃষি বাজার",
    "তাজা শাকসবজি",
    "মৌসুমি ফল",
    "অর্গানিক পণ্য",
    "বাংলাদেশ",
    "কৃষক",
    "ফসলবাড়ি",
  ],
  openGraph: {
    title: "ফসলবাড়ি | বাংলাদেশের কৃষি বাজার",
    description:
      "সরাসরি কৃষকের কাছ থেকে তাজা শাকসবজি, মৌসুমি ফল ও অর্গানিক পণ্য কিনুন।",
    url: "https://foshol-bari.vercel.app",
    siteName: "ফসলবাড়ি",
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ফসলবাড়ি | বাংলাদেশের কৃষি বাজার",
    description:
      "সরাসরি কৃষকের কাছ থেকে তাজা শাকসবজি, মৌসুমি ফল ও অর্গানিক পণ্য কিনুন।",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="h-full antialiased" suppressHydrationWarning>
      <body className={`${hindSiliguri.variable} ${manrope.variable} ${hindSiliguri.className} min-h-full flex flex-col`}>
        <Providers>
          <Suspense fallback={<HarvestLoader variant="fallback" />}>
            <LoadingProvider>
              <LayoutShell>
                {children}
              </LayoutShell>
            </LoadingProvider>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}