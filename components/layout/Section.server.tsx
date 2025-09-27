// SERVER COMPONENT - Pure presentational component for content sections
// Provides flexible section wrapper with optional className styling
// components/Section.tsx
export default function Section({className = "",children,}: { className?: string; children: React.ReactNode;}) 
{
  return <section className={className}>{children}</section>;
}
