'use client'
// CLIENT COMPONENT - Uses usePathname hook to determine active navigation state
// Bridges server-side routing with client-side navigation highlighting
import { usePathname } from 'next/navigation';
import Navbar from './navbar.client';

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // Define your links data with dynamic active state
  const linksData = [
    { href: "/", text: "Dashboard", isActive: pathname === "/", icon: <i className="fi fi-ts-dashboard" style={{fontSize: '24px'}}></i> },
    { href: "/content/pipeline", text: "Pipelines", isActive: pathname === "/content/pipeline", icon: <i className="fi fi-ts-lead-funnel"></i> },
    { href: "/content/data", text: "Data", isActive: pathname === "/content/data", icon: <i className="fi fi-ts-database"></i> },
    { href: "/content/calendar", text: "Calendar", isActive: pathname === "/content/calendar", icon: <i className="fi fi-ts-calendar-clock"></i> },
    { href: "/content/email", text: "Emailing", isActive: pathname === "/content/email", icon: <i className="fi fi-ts-email-feedback"></i> },
    { href: "/content/phone", text: "SMS", isActive: pathname === "/content/phone", icon: <i className="fi  fi-ts-reservation-smartphone"></i> },
    { href: "/content/artists", text: "Artists", isActive: pathname === "/content/content/profile", icon: <i className="fi fi-ts-circle-user"></i> },
    { href: "/settings", text: "Settings", isActive: pathname === "/settings", icon: <i className="fi fi-ts-settings-window"></i> },
  ];


  return <Navbar links={linksData} />;
}
    