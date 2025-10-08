"use client";
import { useState } from "react";
import { LogoutButton } from "@/components/auth/LogoutButton";
// CLIENT COMPONENT - Uses React hooks (useState, useEffect) for interactive navbar functionality
// Manages expand/collapse state and body overflow control for mobile navigation
import NavLinks from "@/components/layout/NavLinks.server";
import { useNavbar } from "@/lib/contexts/navbar-context";
import ContactModal from "@/components/contact/ContactModal.client";

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
      className={`h-screen flex-none transition-all duration-600 ease-in-out flex flex-col
       ${isExpanded ? "w-64 border-white border-r-2 " : "w-20 "}`}
      style={{ minHeight: "100vh" }}
    >
      <button
        className="w-full white-pulsing-element transition-colors duration-200 hover:darkcyanbg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <p className=" pt-5 pb-4 transition-transform duration-200">
          {!isExpanded ? (
            <i className="fi fi-ts-grip-lines text-4xl"></i>
          ) : (
            <i className="fi fi-ts-grip-lines-vertical text-4xl"></i>
          )}
        </p>
      </button>

      <div className="transition-opacity duration-300 flex-1 flex flex-col justify-evenly ">
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

        <button
          onClick={() => setIsContactModalOpen(true)}
          className="white-pulsing-element box-shadow-custom text-xl text-center pt-7 pb-7 transition-colors duration-200 hover:bg-blue-600/20 hover:text-blue-400"
        >
          <i className="fi fi-ts-envelope" style={{ fontSize: '24px' }}></i>
          {isExpanded && <span className="ml-2">Get Info</span>}
        </button>

        <LogoutButton className="white-pulsing-element"></LogoutButton>
      </div>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </nav>
  );
}
