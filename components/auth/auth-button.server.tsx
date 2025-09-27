/**
 * AUTH BUTTON (.server) - Server-Side Authentication Status Display
 *
 * This server component checks authentication status and displays appropriate buttons.
 * Shows user info + logout when authenticated, or login/signup buttons when not.
 *
 * Features:
 * - Server-side authentication check with Supabase
 * - Conditional rendering based on auth status
 * - Integrates with logout functionality
 * - Clean button styling with shadcn/ui
 */
import Link from "next/link";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
