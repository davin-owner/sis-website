import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Check if user has a shop
        const { data: shops } = await supabase
          .from("shops_tables")
          .select("shop_id")
          .eq("shop_owner", user.id)
          .limit(1);

        // If user has a shop, go to dashboard; otherwise go to onboarding
        if (shops && shops.length > 0) {
          redirect("/dashboard");
        } else {
          redirect("/onboarding");
        }
      }

      // Fallback if no user found
      redirect("/dashboard");
    } else {
      // redirect the user to an error page with some instructions
      redirect(`/auth/error?error=${encodeURIComponent(error?.message || "Verification failed")}`);
    }
  }

  // redirect the user to an error page with some instructions
  redirect(`/auth/error?error=No token hash or type`);
}
