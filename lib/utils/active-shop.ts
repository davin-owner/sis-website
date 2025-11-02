"use server";
// this is going to keep and store the active shop and possible sending
// the data fetch to the server update the last active
// with using the cookies to fetch the server

// call getActiveShopID and if that fails use fall back
//  maybe a if statement

//  - Use getActiveShopId() when you KNOW there's a cookie (most requests)
//   - Use getActiveShopWithFallback() on first load or after logout

import { cookies } from "next/headers";
import { verifyShopAccess } from "./access-control";
import { SupabaseClient } from "@supabase/supabase-js";

// read cookie
export async function getActiveShopId() {
  // read the table and get the uui
  // return it as a var

  // read cookie

  const cookieStore = await cookies();

  if (cookieStore.has("activeShop")) {
    return cookieStore.get("activeShop")?.value;
  } else {
    return null;
  }
}

// try to read cookie if no cookie querey db

export async function getActiveShopIdFallback(
  userId: string,
  supabase: SupabaseClient
) {
  const cookieStore = await cookies();

  if (cookieStore.has("activeShop")) {
    return cookieStore.get("activeShop")?.value;
  } else {
    if (!userId) throw new Error("userId is required");
    const { data: activeShopdData } = await supabase
      .from("shop_users")
      .select("shop_id")
      .eq("user_id", userId)
      .order("last_accessed_at", { ascending: false })
      .single();

    // cookieStore.set({
    //   name: "activeShop",
    //   value: activeShopdData?.shop_id,
    //   httpOnly: true,
    //   path: "/",
    // });

    return activeShopdData?.shop_id;
  }
}

// set last accessed and cookie
export async function setActiveShopId(
  userId: string,
  shopId: string,
  supabase: SupabaseClient
) {
  if (!userId) throw new Error("userId is required");
  if (!shopId) throw new Error("shopId is required");

  // 2. Verify access
  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  const latestActiveShopTime = new Date();

  const cookieStore = await cookies();

  await supabase
    .from("shop_users")
    .update({
      last_accessed_at: latestActiveShopTime,
    })
    .eq("shop_id", shopId)
    .eq("user_id", userId)
    .select();

  cookieStore.set({
    name: "activeShop",
    value: shopId,
    httpOnly: true,
    path: "/",
  });

  return null;
}
