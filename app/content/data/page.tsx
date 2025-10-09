// SERVER COMPONENT - Data page that renders static content on the server
// Displays data management and analytics interface
export default function DataPage() {
  return (
    <div className="min-h-dvh app-canvas">
      <div className="page-container">
        <main className="p-4 md:p-8 space-y-4">
          <h1 className="text-3xl font-bold text-white glowing-text">
            Data
          </h1>
          <div className="bg-card border border-border rounded-lg shadow-md p-6">
            <p className="text-card-foreground">
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
