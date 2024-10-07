import { GeistSans } from "geist/font/sans";

import "./globals.css";

import RootLayout from "@/components/admin-panel/admin-panel-layout";
import { ThemeProvider } from "@/providers/theme-provider";

export default function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RootLayout>
            {children}
          </RootLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
