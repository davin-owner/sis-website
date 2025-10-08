"use client";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function LogoutButton(props: { className: string }) {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button className={props.className} onClick={logout}>
      Logout
    </Button>
  );
}
