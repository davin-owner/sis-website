// SERVER COMPONENT - Root layout component that renders on the server
// Defines global metadata and HTML structure for the entire application
import type { Metadata } from "next";
import { NavbarProvider } from "@/lib/contexts/navbar-context";
import NavbarWrapper from "../components/Client/navbar/navbar-wrapper";
import "./globals.css";

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
          <NavbarWrapper />
          <main className="flex-1">{children}</main>
        </NavbarProvider>
      </body>
    </html>
  );
}
