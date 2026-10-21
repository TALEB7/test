"use client"

import * as React from "react"
import { ThemeProvider } from "./theme-provider"
import { SessionProvider } from "next-auth/react"
import { I18nProvider } from "@/lib/i18n"
import { QueryProvider } from "@/lib/query-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/* Light theme only: dark mode was removed, forcedTheme also overrides any old saved choice. */}
      <ThemeProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <I18nProvider>
        <QueryProvider>
          {children}
        </QueryProvider>
      </I18nProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
