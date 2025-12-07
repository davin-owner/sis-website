"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserSafe } from "@/lib/auth/get-user-safe";
import { revalidatePath } from "next/cache";

/**
 * Update user profile (email, phone)
 */
export async function updateUserProfileAction(formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const user = await getUserSafe(supabase);
  if (!user) {
    return { error: "Not authenticated" };
  }

  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  // Validate inputs
  if (!email?.trim()) {
    return { error: "Email is required" };
  }

  try {
    // Update user email in auth (requires email confirmation)
    if (email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: email,
      });

      if (emailError) {
        return { error: emailError.message };
      }
    }

    // Update phone if changed
    if (phone !== user.phone) {
      const { error: phoneError } = await supabase.auth.updateUser({
        phone: phone,
      });

      if (phoneError) {
        return { error: phoneError.message };
      }
    }

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { error: "Failed to update profile" };
  }
}

/**
 * Update shop settings (shop name, etc.)
 */
export async function updateShopSettingsAction(formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const user = await getUserSafe(supabase);
  if (!user) {
    return { error: "Not authenticated" };
  }

  const shopId = formData.get("shop_id") as string;
  const shopName = formData.get("shop_name") as string;

  // Validate inputs
  if (!shopId || !shopName?.trim()) {
    return { error: "Shop name is required" };
  }

  try {
    // Check if user has permission to edit this shop
    const { data: userShop, error: permError } = await supabase
      .from("user_shops")
      .select("role")
      .eq("user_id", user.id)
      .eq("shop_id", shopId)
      .single();

    if (permError || !userShop) {
      return { error: "You don't have permission to edit this shop" };
    }

    // Only owners and admins can change shop settings
    if (userShop.role !== "owner" && userShop.role !== "admin") {
      return { error: "Only owners and admins can change shop settings" };
    }

    // Update shop
    const { error: updateError } = await supabase
      .from("shops")
      .update({ shop_name: shopName })
      .eq("id", shopId);

    if (updateError) {
      return { error: updateError.message };
    }

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating shop:", error);
    return { error: "Failed to update shop settings" };
  }
}
