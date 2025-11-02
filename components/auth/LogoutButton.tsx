"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useNavbar } from "@/lib/contexts/navbar-context";
import { LogOut } from 'lucide-react';

export function LogoutButton(props: { className: string }) {
  const router = useRouter();
  const { isExpanded } = useNavbar();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={logout}
      className={`${props.className} box-shadow-custom text-xl py-6 transition-colors duration-200 hover:bg-red-600/20 hover:text-red-400 flex items-center justify-center gap-2`}
    >
      <LogOut size={24} />
      {isExpanded && <span>Logout</span>}
    </button>
  );
}
