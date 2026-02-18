"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

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
      <body className="min-h-full overflow-y-auto font-outfit">
        <Providers>
          <AppSidebar />
          <div className="flex flex-col flex-1">
            <Header />
            <main className="flex-1 overflow-y-auto container mx-auto">
              <div className="p-6 flex flex-col gap-3 items-center text-center">
                <h2 className="text-lg font-semibold">Something went wrong</h2>
                <p className="text-sm text-muted-foreground">{error?.digest}</p>
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
