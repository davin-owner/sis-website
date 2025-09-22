// SERVER COMPONENT - Settings page that renders static content on the server
// Displays application settings and configuration interface
export default function SettingsPage() {
  return (
    <div className="min-h-dvh">
      <div className="page-container">
        <main className="p-4 md:p-8 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Settings
          </h1>
          <div className="bg-white  dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-300">
              Manage your application settings, preferences, and configuration
              options. Customize your experience and control how the application
              behaves.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
