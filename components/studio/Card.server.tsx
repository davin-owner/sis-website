// SERVER COMPONENT - Pure presentational component with no client-side functionality
// Used for displaying card layouts with title, subtitle, and content
// components/Card.tsx
export default function Card({
  title,
  subtitle,
  right,
  children,
}: {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode; // actions (filters, link)
  children: React.ReactNode;
}) {
  return (
    <div className="surface p-4 md:p-5">
      {(title || right) && (
        <div className="mb-3 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}
