import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { createClient } from "@/lib/supabase/client";

export const getInitials = (name: string) => {
  if (!name) return "??";
  return name.includes(" ")
    ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

export const logout = async (router: AppRouterInstance) => {
  const supabase = createClient();
  await supabase.auth.signOut();
  router.push("/");
  router.refresh();
};
