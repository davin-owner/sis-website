/**
 * NAVBAR CONTEXT - Global Navigation State Management
 *
 * This context provides shared state for the navigation sidebar across the entire app.
 * It manages the expand/collapse state and handles responsive behavior.
 *
 * Features:
 * - Global sidebar expansion state (collapsed/expanded)
 * - Body overflow control for mobile navigation
 * - Type-safe context with error boundaries
 * - Persistent state across page navigation
 *
 * Usage:
 * 1. Wrap app in <NavbarProvider> (done in layout.tsx)
 * 2. Use useNavbar() hook in any component to access/modify state
 *
 * Components that use this context:
 * - Navbar component (manages expand/collapse)
 * - ClientPipelineBoard (adjusts layout based on navbar state)
 * - Any component needing responsive layout based on sidebar
 */
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface NavbarContextType {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isExpanded]);

  return (
    <NavbarContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
}