"use client";

import RootLayout from "@/components/admin-panel/admin-panel-layout";
import AuthProvider from "@/providers/auth-provider";
import CallProvider from "@/providers/call-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <RootLayout>
          <CallProvider>
            {children}
          </CallProvider>
        </RootLayout>
      </AuthProvider>
    </ThemeProvider>
  );
}
