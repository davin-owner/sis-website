// SERVER COMPONENT - Pure layout component with no client-side functionality
// Provides grid layout structure for page content organization
// components/Container.tsx
export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-container">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">{children}</div>
    </div>
  );
}
