// SERVER COMPONENT - Calendar page that renders on the server
// Imports and renders the client-side Calendar component for interactive functionality
import Calendar from "@/components/studio/Calendar.client";

export default function Page() {
  return (
    <main>
      <h1 className="text-4xl glowing-text mb-6 mt-6 text-center">
        My Calendar
      </h1>
      <div className="self-center m-10">
        <Calendar />
        {/* safe to use, because Calendar is a client component */}
      </div>
    </main>
  );
}
