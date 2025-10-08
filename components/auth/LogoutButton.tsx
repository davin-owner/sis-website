"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useNavbar } from "@/lib/contexts/navbar-context";

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
      className={`${props.className} box-shadow-custom text-xl text-center pt-7 pb-7 transition-colors duration-200 hover:bg-red-600/20 hover:text-red-400`}
    >
      <i className="fi fi-ts-sign-out-alt" style={{ fontSize: '24px' }}></i>
      {isExpanded && <span className="ml-2">Logout</span>}
    </button>
  );
}
