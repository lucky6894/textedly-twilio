"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import axios from "axios";
import { GeistSans } from "geist/font/sans";
import { PropsWithChildren } from "react";
import { Toaster } from "sonner";

import "./globals.css";

// axios config
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Toaster position="top-right" />
          {children}
        </ThemeProvider>
      </body>
    </html >
  );
}
