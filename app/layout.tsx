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
 *
 * Layout Structure:
 * <html>
 *   <body className="flex app-canvas">
 *     <NavbarProvider>          // Global state for navbar expansion
 *       <NavbarWrapper />       // Left sidebar navigation (always visible)
 *       <main>{children}</main> // Page content area
 *     </NavbarProvider>
 *   </body>
 * </html>
 */
import type { Metadata } from "next";
import { NavbarProvider } from "@/lib/contexts/navbar-context";
import ConditionalNavbar from "../components/layout/ConditionalNavbar.client";
import "./globals.css";
import Loading from "./loading";
import { Suspense } from "react";

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
    <html lang="en">
      <body className="flex app-canvas ">
        <NavbarProvider>
          <ConditionalNavbar />
          <Suspense fallback={<Loading />}>
            <main className="flex-1">{children}</main>
          </Suspense>
        </NavbarProvider>
      </body>
    </html>
  );
}
