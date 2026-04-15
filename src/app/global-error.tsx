"use client";

import { useEffect } from "react";

import * as Sentry from "@sentry/nextjs";

import { fontHilmar, fontOutfit } from "~/shared/lib/fonts";
import { Button } from "~/shared/ui/button";

import AppSidebar from "~/widgets/app-sidebar";
import Footer from "~/widgets/footer";
import Header from "~/widgets/header";

import Providers from "./(views)/context";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html
      className={`h-full ${fontHilmar.variable} ${fontOutfit.variable}`}
      lang="en"
    >
      <title>Something went wrong | Ingest</title>
      <body className="font-outfit min-h-full overflow-y-auto">
        <Providers>
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="container mx-auto flex-1 overflow-y-auto">
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <h2 className="text-lg font-semibold">Something went wrong</h2>
                <p className="text-muted-foreground text-sm">{error?.digest}</p>
                <div className="flex gap-2">
                  <Button type="button" onClick={() => reset()}>
                    Try again
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    Reload page
                  </Button>
                </div>
              </div>
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}