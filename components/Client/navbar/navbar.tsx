"use client";
// CLIENT COMPONENT - Uses React hooks (useState, useEffect) for interactive navbar functionality
// Manages expand/collapse state and body overflow control for mobile navigation
import NavLinks from "@/components/Server/navlinks";
import { useNavbar } from "@/lib/contexts/navbar-context";

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

  return (
    <nav
      className={`h-screen flex-none transition-all duration-600 ease-in-out flex flex-col
       ${isExpanded ? "w-64 border-white border-r-2 " : "w-20 "}`}
      style={{ minHeight: "100vh" }}
    >
      <button
        className="w-full pulse-element transition-colors duration-200 hover:darkcyanbg"
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
      </div>
    </nav>
  );
}
