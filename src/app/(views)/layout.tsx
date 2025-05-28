import "~/app/styles/globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import appConfig from "~/shared/app-config";
import isDevelopment from "~/shared/lib/is-development";
import { Toaster } from "~/shared/ui/toaster";
import AppSidebar from "~/widgets/app-sidebar";
import Footer from "~/widgets/footer";
import Header from "~/widgets/header";
import { ReactScan } from "~/widgets/react-scan";

import Providers from "./context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  applicationName: `${appConfig.marketName}`,
  description:
    "Discover new channels, curate your favorite videos, and stay organized.",
  keywords: ["youtube", "catalog", "channels", "videos", "organize"],
  title: `${appConfig.marketName} - Organize Your YouTube Universe`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      {isDevelopment() ? <ReactScan /> : null}
      <head>
        <Script
          src="https://www.youtube.com/iframe_api"
          strategy="lazyOnload"
        />
      </head>
      <body className={`min-h-full overflow-y-auto ${inter.className}`}>
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
        <Toaster />
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
