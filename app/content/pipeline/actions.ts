"use server";

import {
  createShopClient,
  deleteShopClient,
  updateClientStage,
  updateShopClient,
} from "@/lib/supabase/data/shop-leads-data";
import { createClient } from "@/lib/supabase/server";
import { getActiveShopIdFallback } from "@/lib/utils/active-shop";
import { isValidPhoneNumber } from "@/lib/utils/utils";
import { revalidatePath } from "next/cache";

// use getactiveshop id and pass it the shop id and then give it to that funciton

// createClientAction()
export async function createClientAction(formData: FormData) {
  /*
  were going to need the shopid
  the user id
  formdata or known as client data
  call create client() with the client data passed to it
  */

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not Authenticated");

  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) throw Error("No Shops Found Under User!");

  const clientData = {
    name: (formData.get("client_name") as string)?.trim() || "",
    contact_email: (formData.get("client_contact_email") as string)?.trim() || "",
    contact_phone: (formData.get("client_contact_phone") as string)?.trim() || "",
    artists: (formData.get("client_prefered_artists") as string)?.trim() || "",
    session_count: parseInt(
      (formData.get("client_session_count") as string) || "0",
      10
    ),
    deposit_status: (formData.get("client_deposit_status") as string)?.trim() || "pending",
    notes: (formData.get("client_notes") as string)?.trim() || "",
  };

  // Validate name
  if (!clientData.name) {
    return { error: "Client name is required" };
  }
  if (clientData.name.length < 2) {
    return { error: "Client name must be at least 2 characters" };
  }
  if (clientData.name.length > 100) {
    return { error: "Client name must be less than 100 characters" };
  }

  // Must have email OR phone
  if (!clientData.contact_email && !clientData.contact_phone) {
    return { error: "Please provide either email or phone number" };
  }

  // Validate email format if provided
  if (clientData.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.contact_email)) {
    return { error: "Invalid email format" };
  }

  // Validate phone number if provided
  if (clientData.contact_phone && !isValidPhoneNumber(clientData.contact_phone)) {
    return { error: "Invalid phone number format" };
  }

  // Validate deposit status
  const validStatuses = ["pending", "paid", "partial", "none"];
  if (!validStatuses.includes(clientData.deposit_status)) {
    return { error: "Invalid deposit status" };
  }

  // Validate session count
  if (clientData.session_count < 0 || clientData.session_count > 1000) {
    return { error: "Session count must be between 0 and 1000" };
  }

  // Validate notes length
  if (clientData.notes && clientData.notes.length > 1000) {
    return { error: "Notes must be less than 1000 characters" };
  }
  try {
    const newClient = await createShopClient(shopId, user.id, clientData, supabase);

    revalidatePath("/content/pipeline");
    return { success: true, client: newClient };
  } catch (error: any) {
    // Handle Supabase errors and standard errors
    const errorMessage = error?.message || error?.error_description || String(error);
    console.error('Create client error:', errorMessage, error);
    return { error: errorMessage };
  }
}

export async function updateClientAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not Authenticated");

  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) throw Error("No Shops Found Under User!");

  const clientId = formData.get("client_id") as string;

  if (!clientId) {
    return { error: "Client ID is required" };
  }

  const clientData = {
    name: (formData.get("client_name") as string)?.trim() || "",
    contact_email: (formData.get("client_contact_email") as string)?.trim() || "",
    contact_phone: (formData.get("client_contact_phone") as string)?.trim() || "",
    artists: (formData.get("client_prefered_artists") as string)?.trim() || "",
    session_count: parseInt(
      (formData.get("client_session_count") as string) || "0",
      10
    ),
    deposit_status: (formData.get("client_deposit_status") as string)?.trim() || "pending",
    notes: (formData.get("client_notes") as string)?.trim() || "",
  };

  // Validate name
  if (!clientData.name) {
    return { error: "Client name is required" };
  }
  if (clientData.name.length < 2) {
    return { error: "Client name must be at least 2 characters" };
  }
  if (clientData.name.length > 100) {
    return { error: "Client name must be less than 100 characters" };
  }

  // Must have email OR phone
  if (!clientData.contact_email && !clientData.contact_phone) {
    return { error: "Please provide either email or phone number" };
  }

  // Validate email format if provided
  if (clientData.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.contact_email)) {
    return { error: "Invalid email format" };
  }

  // Validate phone number if provided
  if (clientData.contact_phone && !isValidPhoneNumber(clientData.contact_phone)) {
    return { error: "Invalid phone number format" };
  }

  // Validate deposit status
  const validStatuses = ["pending", "paid", "partial", "none"];
  if (!validStatuses.includes(clientData.deposit_status)) {
    return { error: "Invalid deposit status" };
  }

  // Validate session count
  if (clientData.session_count < 0 || clientData.session_count > 1000) {
    return { error: "Session count must be between 0 and 1000" };
  }

  // Validate notes length
  if (clientData.notes && clientData.notes.length > 1000) {
    return { error: "Notes must be less than 1000 characters" };
  }

  try {
    await updateShopClient(shopId, user.id, clientId, clientData, supabase);
    revalidatePath("/content/pipeline");
    return { success: true };
  } catch (error: any) {
    const errorMessage = error?.message || error?.error_description || String(error);
    console.error('Update client error:', errorMessage, error);
    return { error: errorMessage };
  }
}

export async function updateClientStageAction(
  clientId: string,
  newStage: string,
  newSortOrder: number
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not Authenticated");

  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) throw Error("No Shops Found Under User!");

  try {
    await updateClientStage(clientId, shopId, user.id, newStage, newSortOrder,supabase);
    revalidatePath('/content/pipeline');
    return{success:true}
  } catch (error: any) {
    const errorMessage = error?.message || error?.error_description || String(error);
    console.error('Update client stage error:', errorMessage, error);
    return {error: errorMessage}
  }
}

export async function deleteClientAction(clientId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
     if (!user) throw new Error("Not Authenticated");

    const shopId = await getActiveShopIdFallback(user.id, supabase);

    await deleteShopClient(clientId, shopId, user.id, supabase);
    revalidatePath('/content/pipeline');
    return { success: true };
  }



