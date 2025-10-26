/**
 * ROOT LAYOUT - Simple Ink Studios Management Platform
 *
 * This is the main layout component that wraps the entire application.
 * It runs on the server and defines the global HTML structure and metadata.
 *
 * Features:
 * - Global CSS imports (Tailwind + custom styles)
 * - Navbar context provider for shared navigation state
 * - Persistent sidebar navigation
 * - Responsive flex layout (navbar + main content)
 */
import type { Metadata } from "next";
import { NavbarProvider } from "@/lib/contexts/navbar-context";
import ConditionalNavbar from "../components/layout/ConditionalNavbar.client";
import "./globals.css";
import Loading from "./loading";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Simple Ink Studios",
  description: "Keeping your managment simple.",
  authors: [{ name: "davin preble" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <SpeedInsights />

      <body className="flex app-canvas">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem={false}
          storageKey="sis-theme"
        >
          <NavbarProvider>
            <ConditionalNavbar />
            <Suspense fallback={<Loading />}>
              <main className="flex-1">{children}</main>
            </Suspense>
          </NavbarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
