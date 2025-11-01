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
    name: formData.get("client_name") as string,
    contact_email: formData.get("client_contact_email") as string,
    contact_phone: formData.get("client_contact_phone") as string,
    artists: formData.get("client_prefered_artists") as string,
    session_count: parseInt(
      (formData.get("client_session_count") as string) || "0",
      10
    ),
    deposit_status: formData.get("client_deposit_status") as string,
    notes: formData.get("client_notes") as string,
  };

  // validate phone number
  if (
    clientData.contact_phone &&
    !isValidPhoneNumber(clientData.contact_phone)
  ) {
    return { error: "Invalid Phone Number format" };
  }

  // validate form for client
  if (!clientData.name) {
    return { error: "Client name is required" };
  }

  // Must have email OR phone
  if (!clientData.contact_email && !clientData.contact_phone) {
    return { error: "Please provide either email or phone number" };
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
  const clientData = {
    name: formData.get("client_name") as string,
    contact_email: formData.get("client_contact_email") as string,
    contact_phone: formData.get("client_contact_phone") as string,
    artists: formData.get("client_prefered_artists") as string,
    session_count: parseInt(
      (formData.get("client_session_count") as string) || "0",
      10
    ),
    deposit_status: formData.get("client_deposit_status") as string,
    notes: formData.get("client_notes") as string,
  };

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



