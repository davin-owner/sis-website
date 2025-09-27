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