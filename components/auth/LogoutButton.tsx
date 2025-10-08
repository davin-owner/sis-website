"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function LogoutButton(props: { className: string }) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Button className={props.className} onClick={logout}>
      Logout
    </Button>
  );
}
