import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "~/app/styles/globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import * as Sentry from "@sentry/nextjs";
import type { Metadata } from "next";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";

import appConfig from "~/shared/app-config";
import { Toaster } from "~/shared/ui/sonner";
import isDevelopment from "~/shared/utils/is-development";

import AppSidebar from "~/widgets/app-sidebar";
import Footer from "~/widgets/footer";
import Header from "~/widgets/header";
import { ReactScan } from "~/widgets/react-scan";

import Providers from "./context";

// ✅ Dynamic Metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    applicationName: `${appConfig.marketName}`,
    description:
      "Discover new YouTube channels, subreddits. Curate your content across channels & subreddits. Stay organized.",
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

// ✅ Enhanced Layout Component
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className="h-full scroll-smooth bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950"
      suppressHydrationWarning
    >
      {isDevelopment() ? <ReactScan /> : null}

      <head>
        <Script
          src="https://www.youtube.com/iframe_api"
          strategy="lazyOnload"
        />
      </head>

      <body
        className={`relative min-h-full font-outfit antialiased text-gray-800 dark:text-gray-200`}
      >
        {/* ✨ Background Layers for Aesthetic */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-gray-800 opacity-[0.05]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-gradient-to-b from-indigo-200/60 via-purple-200/40 to-transparent dark:from-indigo-800/40 dark:via-purple-700/30 blur-3xl rounded-full" />
        </div>

        <Providers>
          {/* ✨ App Layout Structure */}
          <div className="flex min-h-screen flex-row">
            <AppSidebar />

            <div className="flex flex-col flex-1 relative z-10">
              <Header />

              {/* 🌟 Animated Page Transition */}
              <AnimatePresence mode="wait">
                <motion.main
                  key={typeof window !== "undefined" ? location.pathname : ""}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex-1 container mx-auto px-4 md:px-8 py-6 overflow-y-auto"
                >
                  {children}
                </motion.main>
              </AnimatePresence>

              <Footer />
            </div>
          </div>
        </Providers>

        {/* ✅ Global Toast Notifications */}
        <Toaster closeButton visibleToasts={1} position="top-right" />

        {/* ✅ Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics
            gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          />
        )}
      </body>
    </html>
  );
}
