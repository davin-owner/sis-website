/**
 * SETTINGS PAGE - User and shop settings management
 *
 * Features:
 * - Update user profile (email, phone)
 * - Update shop settings (shop name) - requires owner/admin role
 * - View current role and permissions
 *
 * Authentication:
 * - Protected route: Users must be logged in
 * - Role-based access: Only owners/admins can edit shop settings
 */
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getActiveShop } from "@/lib/supabase/data/user-shops";
import { getActiveShopIdFallback } from "@/lib/utils/active-shop";
import SettingsPageClient from "@/components/shared/SettingsPage.client";

export default async function SettingsPage() {
  const supabase = await createClient();

  // 1. Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 2. Get active shop
  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) {
    redirect("/onboarding");
  }

  // 3. Fetch shop data and user role in parallel for faster loading
  const [activeShop, { data: userShop }] = await Promise.all([
    getActiveShop(user.id, shopId, supabase),
    supabase
      .from("shop_users")
      .select("role")
      .eq("user_id", user.id)
      .eq("shop_id", shopId)
      .single(),
  ]);

  if (!activeShop) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-dvh app-canvas">
      <div className="page-container">
        <h1 className="gradient-text-ink text-4xl font-bold mb-8">Settings</h1>

        <SettingsPageClient
          user={user}
          shop={activeShop}
          userRole={userShop?.role || null}
        />
      </div>
    </div>
  );
}
