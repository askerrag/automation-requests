import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const id = data?.claims?.sub;

  if (!id) {
    redirect("/login");
  }

  const emailClaim = data.claims.email;
  const email = typeof emailClaim === "string" ? emailClaim : "";

  return { supabase, id, email };
}
