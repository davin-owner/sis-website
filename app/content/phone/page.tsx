// SERVER COMPONENT - SMS page that renders static content on the server
// Displays SMS management and communication interface
export default function SMSPage() {
  return (
    <div className="min-h-dvh app-canvas">
      <div className="page-container">
        <main className="p-4 md:p-8 space-y-6">
          <h1 className="text-4xl font-bold gradient-text-ink mb-8">
            SMS & Phone
          </h1>
          <div className="surface p-8 transition-all duration-300 hover:shadow-lg">
            <p className="text-foreground text-lg leading-relaxed">
              View and manage your SMS communications. Send text messages,
              track conversations, and manage your phone contacts.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
