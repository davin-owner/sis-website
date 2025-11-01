'use client'
// CLIENT COMPONENT - Uses usePathname hook to determine active navigation state
// Bridges server-side routing with client-side navigation highlighting
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from './Navbar.client';
import { LayoutDashboard, Filter, Database, CalendarClock, Mail, Smartphone, UserCircle2, Settings } from 'lucide-react';

export default function NavbarWrapper() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Define your links data with dynamic active state
  const linksData = [
    { href: "/dashboard", text: "Dashboard", isActive: mounted && pathname === "/dashboard", icon: <LayoutDashboard size={24} /> },
    { href: "/content/pipeline", text: "Pipelines", isActive: mounted && pathname === "/content/pipeline", icon: <Filter size={24} /> },
    { href: "/content/data", text: "Data", isActive: mounted && pathname === "/content/data", icon: <Database size={24} /> },
    { href: "/content/calendar", text: "Calendar", isActive: mounted && pathname === "/content/calendar", icon: <CalendarClock size={24} /> },
    { href: "/content/email", text: "Emailing", isActive: mounted && pathname === "/content/email", icon: <Mail size={24} /> },
    { href: "/content/phone", text: "SMS", isActive: mounted && pathname === "/content/phone", icon: <Smartphone size={24} /> },
    { href: "/content/artists", text: "Artists", isActive: mounted && pathname === "/content/artists", icon: <UserCircle2 size={24} /> },
    { href: "/settings", text: "Settings", isActive: mounted && pathname === "/settings", icon: <Settings size={24} /> },
  ];


  return <Navbar links={linksData} />;
}
    