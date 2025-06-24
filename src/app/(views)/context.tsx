"use client";

import { ProgressProvider } from "@bprogress/next/app";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import AuthContextProvider from "~/features/auth/context-provider";

import { SidebarProvider } from "~/shared/ui/sidebar";

export default function Providers({
  children,
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute={["data-theme", "class"]}
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AuthContextProvider>
        <ProgressProvider
          startPosition={0.3}
          height="4px"
          color="#e11d48"
          options={{ showSpinner: false }}
          shallowRouting
        >
          <SidebarProvider>
            <div className="flex flex-grow min-h-screen">{children}</div>
          </SidebarProvider>
        </ProgressProvider>
      </AuthContextProvider>
    </NextThemesProvider>
  );
}
