// SERVER COMPONENT - Data page that renders static content on the server
// Displays data management and analytics interface
export default function DataPage() {
  return (
    <div className="min-h-dvh app-canvas">
      <div className="page-container">
        <main className="p-4 md:p-8 space-y-6">
          <h1 className="text-4xl font-bold gradient-text-ink mb-8">
            Data
          </h1>
          <div className="surface p-8 transition-all duration-300 hover:shadow-lg">
            <p className="text-foreground text-lg leading-relaxed">
              Access and manage your data, analytics, and reports. View
              insights, export data, and monitor your application&apos;s performance
              metrics.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
