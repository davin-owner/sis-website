// SERVER COMPONENT - Email page that renders static content on the server
// Displays email management and communication interface
export default function EmailPage() {
  return (
    <div className="min-h-dvh">
      <div className="page-container">
        <main className="p-4 md:p-8 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            EmailPage
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-300">
              View and manage your user profile information. Update your
              personal details, account settings, and manage your user
              preferences.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
