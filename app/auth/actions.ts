"use server";

import { redirect } from "next/navigation";
import { mapAuthError } from "@/lib/auth-errors";
import { type FormState } from "@/lib/forms";
import { createClient } from "@/lib/supabase/server";

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false as const, error: "Введите почту и пароль." };
  }

  if (!email.includes("@")) {
    return { ok: false as const, error: "Укажите корректную почту." };
  }

  if (password.length < 6) {
    return { ok: false as const, error: "Пароль должен быть не короче 6 символов." };
  }

  return { ok: true as const, email, password };
}

export async function signIn(_state: FormState, formData: FormData): Promise<FormState> {
  const credentials = readCredentials(formData);
  if (!credentials.ok) {
    return { error: credentials.error };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    return {
      error: mapAuthError(error.message, "Не удалось войти. Попробуйте ещё раз."),
    };
  }

  redirect("/requests");
}

export async function signUp(_state: FormState, formData: FormData): Promise<FormState> {
  const credentials = readCredentials(formData);
  if (!credentials.ok) {
    return { error: credentials.error };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    return {
      error: mapAuthError(error.message, "Не удалось создать аккаунт. Попробуйте ещё раз."),
    };
  }

  if (data.user && data.user.identities?.length === 0) {
    return { error: "Пользователь с таким email уже зарегистрирован." };
  }

  if (!data.session) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (signInError) {
      return {
        error: mapAuthError(
          signInError.message,
          "Аккаунт создан. Подтвердите почту по ссылке из письма, затем войдите.",
        ),
      };
    }
  }

  redirect("/requests");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
