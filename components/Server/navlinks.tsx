// SERVER COMPONENT - Pure presentational component for navigation links
// No client-side state or interactions, just renders navigation items
import React from 'react'
import Link from 'next/link';

function NavLinks({ href, text, isActive, icon, isExpanded}: { 
  href: string; 
  text: string; 
  isActive: boolean;
  icon: React.ReactNode;
  isExpanded: boolean;
}) {
  return (
    <Link href={href} className={isActive ? 'active glowing-text' : 'inactive' }>
        <div className='box-shadow-custom white-pulsing-element text-xl text-center pt-7 pb-7'>
        
                {icon} {isExpanded && text}
            
        </div>
    </Link>
  );
}

export default NavLinks;
