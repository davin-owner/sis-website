// SERVER COMPONENT - Calendar page that renders on the server
// Imports and renders the client-side Calendar component for interactive functionality
import Calendar from "@/components/studio/Calendar.client";

export default function Page() {
  return (
    <main className="min-h-screen app-canvas">
      <div className="page-container">
        <h1 className="text-4xl font-bold text-white glowing-text mb-8 text-center">
          My Calendar
        </h1>
        <Calendar />
      </div>
    </main>
  );
}
