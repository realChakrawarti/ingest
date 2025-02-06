import "~/app/styles/globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import { Toaster } from "~/shared/ui/toaster";
import AppSidebar from "~/widgets/app-sidebar";
import BackgroundPattern from "~/widgets/background-pattern";
import Footer from "~/widgets/footer";
import Header from "~/widgets/header";

import Providers from "./context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  applicationName: "YTCatalog",
  description:
    "Discover new channels, curate your favorite videos, and stay organized.",
  keywords: ["youtube", "catalog", "channels", "videos", "organize"],
  title: "YTCatalog - Organize Your YouTube Universe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.youtube.com/iframe_api"
          strategy="lazyOnload"
        />
      </head>
      <body className={`min-h-full overflow-y-auto ${inter.className}`}>
        <BackgroundPattern />
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
