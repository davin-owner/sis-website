// SERVER COMPONENT - Pure presentational component for navigation links
// No client-side state or interactions, just renders navigation items
import React from "react";
import Link from "next/link";

function NavLinks({
  href,
  text,
  isActive,
  icon,
  isExpanded,
}: {
  href: string;
  text: string;
  isActive: boolean;
  icon: React.ReactNode;
  isExpanded: boolean;
}) {
  return (
    <Link href={href}>
      <div className={`box-shadow-custom white-pulsing-element text-xl text-center py-5 flex items-center justify-center gap-2 ${isActive ? "active glowing-text" : "inactive"}`}>
        <span className="flex items-center justify-center">{icon}</span>
        {isExpanded && <span>{text}</span>}
      </div>
    </Link>
  );
}

export default NavLinks;
