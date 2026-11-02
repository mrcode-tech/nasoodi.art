"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // next-themes 0.4.6 injects an inline bootstrap script. React 19.3+
  // warns when that executable script is rendered again on the client.
  // Keep the real script for SSR (where it prevents a theme flash), but
  // render it as a non-executable data block during client hydration.
  const scriptProps =
    typeof window === "undefined"
      ? undefined
      : { type: "application/json" as const };

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      scriptProps={scriptProps}
    >
      {children}
    </NextThemesProvider>
  );
}
