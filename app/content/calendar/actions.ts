"use server";

import {
  createShopAppointment,
  deleteShopAppointment,
  updateShopAppointment,
} from "@/lib/supabase/data/appointment-data";
import { createClient } from "@/lib/supabase/server";
import { getActiveShopIdFallback } from "@/lib/utils/active-shop";
import { revalidatePath } from "next/cache";

// createAppointmentAction()
export async function createAppointmentAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not Authenticated");

  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) throw Error("No Shops Found Under User!");

  const appointmentData = {
    client_id: parseInt(formData.get("client_id") as string, 10),
    worker_id: formData.get("worker_id") as string || null,
    appointment_date: formData.get("appointment_date") as string,
    start_time: formData.get("start_time") as string,
    end_time: formData.get("end_time") as string,
    title: formData.get("title") as string,
    notes: formData.get("notes") as string,
    location: formData.get("location") as string,
    status: ((formData.get("status") as string) || "scheduled") as 'scheduled' | 'completed' | 'cancelled' | 'no-show',
  };

  // Validate status
  const validStatuses = ["scheduled", "completed", "cancelled", "no-show"];
  if (appointmentData.status && !validStatuses.includes(appointmentData.status)) {
    return { error: "Invalid status" };
  }

  // Validate required fields
  if (!appointmentData.client_id) {
    return { error: "Client is required to make an appointment!" };
  }

  if (!appointmentData.appointment_date) {
    return { error: "A date is required to make an appointment!" };
  }

  if (!appointmentData.start_time) {
    return { error: "Start time is required!" };
  }

  if (!appointmentData.end_time) {
    return { error: "End time is required!" };
  }

  try {
    const newAppointment = await createShopAppointment(
      shopId,
      user.id,
      appointmentData,
      supabase
    );

    revalidatePath("/content/calendar");
    return { success: true, appointment: newAppointment };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// updateAppointmentAction()
export async function updateAppointmentAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not Authenticated");

  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) throw Error("No Shops Found Under User!");

  const appointmentId = formData.get("appointment_id") as string;

  const appointmentData = {
    client_id: parseInt(formData.get("client_id") as string, 10),
    worker_id: formData.get("worker_id") as string || null,
    appointment_date: formData.get("appointment_date") as string,
    start_time: formData.get("start_time") as string,
    end_time: formData.get("end_time") as string,
    title: formData.get("title") as string,
    notes: formData.get("notes") as string,
    location: formData.get("location") as string,
    status: ((formData.get("status") as string) || "scheduled") as 'scheduled' | 'completed' | 'cancelled' | 'no-show',
  };

  // Validate status
  const validStatuses = ["scheduled", "completed", "cancelled", "no-show"];
  if (appointmentData.status && !validStatuses.includes(appointmentData.status)) {
    return { error: "Invalid status" };
  }

  // Validate required fields
  if (!appointmentId) {
    return { error: "Appointment ID is required!" };
  }

  if (!appointmentData.client_id) {
    return { error: "Client is required!" };
  }

  if (!appointmentData.appointment_date) {
    return { error: "A date is required!" };
  }

  if (!appointmentData.start_time) {
    return { error: "Start time is required!" };
  }

  if (!appointmentData.end_time) {
    return { error: "End time is required!" };
  }

  try {
    await updateShopAppointment(
      shopId,
      user.id,
      appointmentId,
      appointmentData,
      supabase
    );

    revalidatePath("/content/calendar");
    return { success: true };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// deleteAppointmentAction()
export async function deleteAppointmentAction(appointmentId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not Authenticated");

  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) throw Error("No Shops Found Under User!");

  try {
    await deleteShopAppointment(appointmentId, shopId, user.id, supabase);
    revalidatePath("/content/calendar");
    return { success: true };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}
