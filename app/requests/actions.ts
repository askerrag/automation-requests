"use server";

import { redirect } from "next/navigation";
import { type FormState } from "@/lib/forms";
import { parseRequestFields } from "@/lib/requests";
import { requireUser } from "@/lib/session";

const saveError = "Не удалось сохранить. Проверьте соединение и попробуйте снова.";

export async function createRequest(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = parseRequestFields(formData, false);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const { supabase, id } = await requireUser();
  const { error } = await supabase.from("requests").insert({
    user_id: id,
    title: parsed.title,
    description: parsed.description,
    category: parsed.category,
    status: "new",
  });

  if (error) {
    return { error: saveError };
  }

  redirect("/requests?notice=created");
}

export async function updateRequest(
  requestId: string,
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = parseRequestFields(formData, true);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("requests")
    .update({
      title: parsed.title,
      description: parsed.description,
      category: parsed.category,
      status: parsed.status,
    })
    .eq("id", requestId)
    .select("id");

  if (error) {
    return { error: saveError };
  }

  if (!data?.length) {
    return { error: "Заявка не найдена." };
  }

  redirect("/requests?notice=updated");
}
