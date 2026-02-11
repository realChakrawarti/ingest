import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "~/app/styles/globals.css";
import "~/app/styles/custom.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import * as Sentry from "@sentry/nextjs";
import type { Metadata } from "next";
import Script from "next/script";

import appConfig from "~/shared/app-config";
import { fontHilmar, fontOutfit } from "~/shared/lib/fonts";
import { Toaster } from "~/shared/ui/sonner";

import AppSidebar from "~/widgets/app-sidebar";
import Footer from "~/widgets/footer";
import Header from "~/widgets/header";

import Providers from "./context";
export async function generateMetadata(): Promise<Metadata> {
  return {
    applicationName: `${appConfig.marketName}`,
    description:
      "Discover new YouTube channels, subreddits. Curate your content across channel & subreddits. Stay organized.",
    keywords: [
      "youtube",
      "catalog",
      "channels",
      "videos",
      "organize",
      "reddit",
      "subreddits",
    ],
    other: {
      ...Sentry.getTraceData(),
    },
    title: `${appConfig.marketName} - Organize Your Digital Universe`,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`h-full ${fontHilmar.variable} ${fontOutfit.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <Script
          src="https://www.youtube.com/iframe_api"
          strategy="lazyOnload"
        />
      </head>
      <body className="min-h-full overflow-y-auto font-outfit">
        <Providers>
          <AppSidebar />
          <div className="flex flex-col flex-1">
            <Header />
            <main className="flex-1 overflow-y-auto container mx-auto">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        <Toaster closeButton visibleToasts={1} position="top-right" />
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
