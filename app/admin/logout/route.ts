import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
