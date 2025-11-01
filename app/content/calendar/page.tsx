// SERVER COMPONENT - Calendar page that renders on the server
// Fetches appointment, client, and worker data and passes to CalendarWrapper
import CalendarWrapper from "@/components/studio/CalendarWrapper.client";
import { createClient } from "@/lib/supabase/server";
import { getActiveShopIdFallback } from "@/lib/utils/active-shop";
import { redirect } from "next/navigation";
import { getShopAppointments } from "@/lib/supabase/data/appointment-data";
import { fetchShopLeadData } from "@/lib/supabase/data/shop-leads-data";
import { getShopWorkerData } from "@/lib/supabase/data/workers-data";

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

  // Helper to convert hex to rgba for translucent colors
  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Helper to determine if color is light or dark
  const isLightColor = (hex: string): boolean => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  // 4. Transform appointments to FullCalendar event format with proper contrast
  const events = appointments.map((apt) => {
    // Use worker color or fallback to theme primary color
    const baseColor = apt.worker_color || "#0de8cd"; // Theme primary color
    const backgroundColor = hexToRgba(baseColor, 0.75); // More opaque for better contrast

    // Use dark text for light colors, light text for dark colors
    const textColor = isLightColor(baseColor) ? "#1f2937" : "#ffffff";

    return {
      id: apt.id,
      title: apt.client_name || apt.title || "Appointment",
      start: `${apt.appointment_date}T${apt.start_time}`,
      end: `${apt.appointment_date}T${apt.end_time}`,
      backgroundColor,
      borderColor: baseColor,
      textColor,
      extendedProps: {
        clientName: apt.client_name,
        workerName: apt.worker_name,
        status: apt.status,
      },
    };
  });

  return (
    <main className="min-h-screen app-canvas">
      <div className="page-container">
        <h1 className="text-4xl font-bold gradient-text-ink mb-8 text-center">
          My Calendar
        </h1>
        <CalendarWrapper
          initialEvents={events}
          clients={clients}
          workers={workers}
          appointments={appointments}
        />
      </div>
    </main>
  );
}
