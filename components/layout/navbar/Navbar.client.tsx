"use client";
import { useState } from "react";
import { LogoutButton } from "@/components/auth/LogoutButton";
// CLIENT COMPONENT - Uses React hooks (useState, useEffect) for interactive navbar functionality
// Manages expand/collapse state and body overflow control for mobile navigation
import NavLinks from "@/components/layout/NavLinks.server";
import { useNavbar } from "@/lib/contexts/navbar-context";
import ContactModal from "@/components/contact/ContactModal.client";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Menu, PanelLeftClose, Mail } from 'lucide-react';

export default function Navbar({
  links,
}: {
  links: Array<{
    href: string;
    text: string;
    isActive: boolean;
    icon: React.ReactNode;
  }>;
}) {
  const { isExpanded, setIsExpanded } = useNavbar();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <nav
      className={`h-screen flex-none text-accent dark:text-white transition-all duration-600 ease-in-out flex flex-col
       ${isExpanded ? "w-64 border-white border-r-2 " : "w-20 "}`}
      style={{ minHeight: "100vh" }}
    >
      {/* Toggle button at top */}
      <button
        className="w-full white-pulsing-element transition-colors duration-200 hover:darkcyanbg flex-shrink-0 dark:text-white flex items-center justify-center py-5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {!isExpanded ? (
          <Menu size={36} />
        ) : (
          <PanelLeftClose size={36} />
        )}
      </button>

      {/* Main navigation links - centered and evenly spaced */}
      <div className="flex-1 flex flex-col justify-center py-8 gap-2">
        {links.map((link) => (
          <NavLinks
            key={link.href}
            href={link.href}
            text={link.text}
            isActive={link.isActive}
            icon={link.icon}
            isExpanded={isExpanded}
          />
        ))}

        {/* Theme Toggle */}

        <button
          onClick={() => setIsContactModalOpen(true)}
          className="white-pulsing-element box-shadow-custom text-xl text-center py-6 transition-colors duration-200 hover:bg-blue-600/20 hover:text-blue-400 dark:text-white"
        >
          <Mail size={24} />
          {isExpanded && <span className="ml-2">Contact</span>}
        </button>

        <LogoutButton className="white-pulsing-element dark:text-white"></LogoutButton>

        <div className="text-xl text-center py-6 transition-colors duration-200 flex items-center justify-center dark:text-white">
          <ThemeToggle />
          {isExpanded && <span className="ml-3">Theme</span>}
        </div>

        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />
      </div>
    </nav>
  );
}
