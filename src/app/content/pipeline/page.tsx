// SERVER COMPONENT - Pipeline page that renders static content on the server
// Displays pipeline management and lead tracking interface
export default function ProfilePage() {
  return (
    <main className="p-4 md:p-8 space-y-4">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Pipeline</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-300">
          View and manage your user profile information. Update your personal details, 
          account settings, and manage your user preferences.
        </p>
      </div>
    </main>
  );
}
