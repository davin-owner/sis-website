// SERVER COMPONENT - Calendar page that renders on the server
// Fetches appointment, client, and worker data and passes to CalendarWrapper
import CalendarWrapper from "@/components/features/calendar/CalendarWrapper.client";
import { createClient } from "@/lib/supabase/server";
import { getActiveShopIdFallback } from "@/lib/utils/active-shop";
import { redirect } from "next/navigation";
import { getShopAppointments } from "@/lib/supabase/data/appointment-data";
import { fetchShopLeadData } from "@/lib/supabase/data/shop-leads-data";
import { getShopWorkerData } from "@/lib/supabase/data/workers-data";
import { WorkersProvider } from "@/lib/contexts/workers-context";

export default async function Page() {
  // 1. Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 2. Get shop
  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) {
    redirect("/onboarding");
  }

  // 3. Fetch all necessary data
  const [appointments, clients, workers] = await Promise.all([
    getShopAppointments(shopId, user.id, supabase),
    fetchShopLeadData(shopId, user.id, supabase),
    getShopWorkerData(shopId, user.id, supabase),
  ]);

  // 4. Transform appointments to FullCalendar event format with artist color
  const events = appointments.map((apt) => {
    // Use worker color or fallback to theme primary color
    const baseColor = apt.worker_color || "#0de8cd"; // Theme primary color

    return {
      id: apt.id,
      title: apt.client_name || apt.title || "Appointment",
      start: `${apt.appointment_date}T${apt.start_time}`,
      end: `${apt.appointment_date}T${apt.end_time}`,
      backgroundColor: baseColor, // Pass artist color directly
      extendedProps: {
        clientName: apt.client_name,
        workerName: apt.worker_name,
        status: apt.status,
        workerColor: baseColor, // Store for CSS variable
      },
    };
  });

  return (
    <main className="min-h-screen app-canvas">
      <div className="page-container">
        <h1 className="text-4xl font-bold gradient-text-ink mb-8 text-center">
          My Calendar
        </h1>
        <WorkersProvider workers={workers}>
          <CalendarWrapper
            initialEvents={events}
            clients={clients}
            workers={workers}
            appointments={appointments}
          />
        </WorkersProvider>
      </div>
    </main>
  );
}
