'use client'
// CLIENT COMPONENT - Uses usePathname hook to determine active navigation state
// Bridges server-side routing with client-side navigation highlighting
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from './Navbar.client';

export default function NavbarWrapper() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Define your links data with dynamic active state
  const linksData = [
    { href: "/dashboard", text: "Dashboard", isActive: mounted && pathname === "/dashboard", icon: <i className="fi fi-ts-dashboard" style={{fontSize: '24px'}}></i> },
    { href: "/content/pipeline", text: "Pipelines", isActive: mounted && pathname === "/content/pipeline", icon: <i className="fi fi-ts-lead-funnel" style={{fontSize: '24px'}}></i> },
    { href: "/content/data", text: "Data", isActive: mounted && pathname === "/content/data", icon: <i className="fi fi-ts-database" style={{fontSize: '24px'}}></i> },
    { href: "/content/calendar", text: "Calendar", isActive: mounted && pathname === "/content/calendar", icon: <i className="fi fi-ts-calendar-clock" style={{fontSize: '24px'}}></i> },
    { href: "/content/email", text: "Emailing", isActive: mounted && pathname === "/content/email", icon: <i className="fi fi-ts-envelope" style={{fontSize: '24px'}}></i> },
    { href: "/content/phone", text: "SMS", isActive: mounted && pathname === "/content/phone", icon: <i className="fi fi-ts-mobile-notch" style={{fontSize: '24px'}}></i> },
    { href: "/content/artists", text: "Artists", isActive: mounted && pathname === "/content/artists", icon: <i className="fi fi-ts-circle-user" style={{fontSize: '24px'}}></i> },
    { href: "/settings", text: "Settings", isActive: mounted && pathname === "/settings", icon: <i className="fi fi-ts-settings" style={{fontSize: '24px'}}></i> },
  ];


  return <Navbar links={linksData} />;
}
    