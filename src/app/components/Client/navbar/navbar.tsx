'use client'
// CLIENT COMPONENT - Uses React hooks (useState, useEffect) for interactive navbar functionality
// Manages expand/collapse state and body overflow control for mobile navigation
import NavLinks from "@/app/components/Server/navlinks";
import { useState, useEffect } from "react";

export default function Navbar({ links }: { links: Array<{href: string, text: string, isActive: boolean, icon: React.ReactNode}> }) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isExpanded]);

  return (
    <nav className={`h-screen transition-all duration-600 ease-in-out ease- flex flex-col
       ${isExpanded ? 'w-64 border-white border-r-2' : 'w-20  '}`}>
      <button 
        className="w-full white-pulsing-element transition-colors duration-200 hover:darkcyanbg " 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <p className=" pt-5 pb-4 transition-transform duration-200">
          {!isExpanded ? <i className="fi fi-ts-grip-lines text-4xl"></i> :  <i className="fi fi-ts-grip-lines-vertical text-4xl"></i> }
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
