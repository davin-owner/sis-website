// SERVER COMPONENT - Email page that renders static content on the server
// Displays email management and communication interface
export default function EmailPage() {
  return (
    <div className="min-h-dvh app-canvas">
      <div className="page-container">
        <main className="p-4 md:p-8 space-y-4">
          <h1 className="text-3xl font-bold text-white glowing-text">
            Email
          </h1>
          <div className="bg-card border border-border rounded-lg shadow-md p-6">
            <p className="text-card-foreground">
              View and manage your email communications. Send messages,
              track conversations, and manage your email preferences.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
