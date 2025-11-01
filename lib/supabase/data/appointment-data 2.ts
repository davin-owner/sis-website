/*
the data file that will call the database funtions from here so we can
pass this to the pages and call the functions
*/

import { Appointment, AppointmentWithDetails } from "@/lib/database";
import { verifyShopAccess } from "@/lib/utils/access-control";
import { SupabaseClient } from "@supabase/supabase-js";

// Get all appointments for a shop with client and worker details
export async function getShopAppointments(
  shopId: string,
  userId: string,
  supabase: SupabaseClient
): Promise<AppointmentWithDetails[]> {
  // 1. Validate inputs
  if (!shopId) throw new Error("shop_id is required");
  if (!userId) throw new Error("user_id is required");

  // 2. Verify access
  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  // 3. Query data with JOINs to get client and worker names
  const { data, error } = await supabase
    .from("appointments")
    .select(`
      *,
      shop_leads!appointments_client_id_fkey (
        name
      ),
      shop_workers (
        first_name,
        last_name,
        color
      )
    `)
    .eq("shop_id", shopId);

  if (error) throw error;

  // 4. Transform the nested data into flat structure with type safety
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appointments: AppointmentWithDetails[] = data.map((apt: any) => {
    // Extract nested data
    const clientName = apt.shop_leads?.name || "Unknown Client";
    const workerName = apt.shop_workers
      ? `${apt.shop_workers.first_name} ${apt.shop_workers.last_name}`.trim()
      : undefined;
    const workerColor = apt.shop_workers?.color || undefined;

    // Remove nested objects from the apt object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { shop_leads, shop_workers, ...baseAppointment } = apt;

    return {
      ...baseAppointment,
      client_name: clientName,
      worker_name: workerName,
      worker_color: workerColor,
    } as AppointmentWithDetails;
  });

  return appointments;
}

// Create a shop appointment
export async function createShopAppointment(
  shopId: string,
  userId: string,
  appointmentData: Partial<Appointment>,
  supabase: SupabaseClient
): Promise<Appointment> {
  if (!shopId) throw new Error("shopId is requrired");
  if (!userId) throw new Error("userId is required");

  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  const { data: newAppointment, error: appointmentError } = await supabase
    .from("appointments")
    .insert({
      shop_id: shopId,
      client_id: appointmentData.client_id,
      worker_id: appointmentData.worker_id,
      appointment_date: appointmentData.appointment_date,
      start_time: appointmentData.start_time,
      end_time: appointmentData.end_time,
      title: appointmentData.title,
      notes: appointmentData.notes,
      location: appointmentData.location,
      status: appointmentData.status || 'scheduled',
    })
    .select()
    .single();

  if (appointmentError) {
    throw appointmentError;
  }

  return newAppointment as Appointment;
}

// Update appointment info
export async function updateShopAppointment(
  shopId: string,
  userId: string,
  appointmentId: string,
  appointmentData: Partial<Appointment>,
  supabase: SupabaseClient
): Promise<Appointment> {
  if (!shopId) throw new Error("shopId is requrired");
  if (!userId) throw new Error("userId is required");
  if (!appointmentId) throw new Error("appointmentId is required");

  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  const { data: updatedAppointmentData, error: appointmentError } =
    await supabase
      .from("appointments")
      .update({
        client_id: appointmentData.client_id,
        worker_id: appointmentData.worker_id,
        appointment_date: appointmentData.appointment_date,
        start_time: appointmentData.start_time,
        end_time: appointmentData.end_time,
        title: appointmentData.title,
        notes: appointmentData.notes,
        location: appointmentData.location,
        status: appointmentData.status,
      })
      .eq("id", appointmentId)
      .eq("shop_id", shopId)
      .select()
      .single();

  if (appointmentError) {
    throw appointmentError;
  }

  return updatedAppointmentData as Appointment;
}

// Delete an appointment from shop
export async function deleteShopAppointment(
  appointmentId: string,
  shopId: string,
  userId: string,
  supabase: SupabaseClient
) {
  // 1. Verify access
  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  // 2. Delete where BOTH match
  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", appointmentId)
    .eq("shop_id", shopId); // ← Security!

  if (error) throw error;
}
