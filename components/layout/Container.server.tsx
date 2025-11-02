// SERVER COMPONENT - Pure layout component with no client-side functionality
// Provides grid layout structure for page content organization

// components/Container.tsx
export default function Container({
  children,
  size,
}: {
  children: React.ReactNode;
  size: string;
}) {
  return (
    <div className={size}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">{children}</div>
    </div>
  );
}
