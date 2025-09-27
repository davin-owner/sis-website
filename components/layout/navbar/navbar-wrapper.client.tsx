'use client'
// CLIENT COMPONENT - Uses usePathname hook to determine active navigation state
// Bridges server-side routing with client-side navigation highlighting
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from './navbar.client';

export default function NavbarWrapper() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Define your links data with dynamic active state
  const linksData = [
    { href: "/", text: "Dashboard", isActive: mounted && pathname === "/", icon: <i className="fi fi-ts-dashboard" style={{fontSize: '24px'}}></i> },
    { href: "/content/pipeline", text: "Pipelines", isActive: mounted && pathname === "/content/pipeline", icon: <i className="fi fi-ts-lead-funnel"></i> },
    { href: "/content/data", text: "Data", isActive: mounted && pathname === "/content/data", icon: <i className="fi fi-ts-database"></i> },
    { href: "/content/calendar", text: "Calendar", isActive: mounted && pathname === "/content/calendar", icon: <i className="fi fi-ts-calendar-clock"></i> },
    { href: "/content/email", text: "Emailing", isActive: mounted && pathname === "/content/email", icon: <i className="fi fi-ts-email-feedback"></i> },
    { href: "/content/phone", text: "SMS", isActive: mounted && pathname === "/content/phone", icon: <i className="fi  fi-ts-reservation-smartphone"></i> },
    { href: "/content/artists", text: "Artists", isActive: mounted && pathname === "/content/artists", icon: <i className="fi fi-ts-circle-user"></i> },
    { href: "/settings", text: "Settings", isActive: mounted && pathname === "/settings", icon: <i className="fi fi-ts-settings-window"></i> },
  ];


  return <Navbar links={linksData} />;
}
    