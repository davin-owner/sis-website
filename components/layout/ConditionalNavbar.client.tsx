/**
 * CONDITIONAL NAVBAR - Shows/Hides Navbar Based on Route
 *
 * PURPOSE:
 * The landing page (waitlist) shouldn't have the navbar
 * But the dashboard and other app pages should have it
 *
 * LOGIC:
 * - If on "/" (landing page) → Don't show navbar
 * - If on any other page → Show navbar
 */

"use client";

import { usePathname } from "next/navigation";
import NavbarWrapper from "./navbar/NavbarWrapper.client";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Don't show navbar on landing page or auth pages
  const hideNavbar = pathname === "/" || pathname.startsWith("/auth");

  if (hideNavbar) {
    return null; // Don't render navbar
  }

  return <NavbarWrapper />;
}
