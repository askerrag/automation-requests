import type { Metadata } from "next";
import { signUp } from "@/app/auth/actions";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Регистрация" };

export default function RegisterPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
      <div className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6">
        <AuthForm
          action={signUp}
          title="Регистрация"
          submitLabel="Создать аккаунт"
          pendingLabel="Создание…"
          passwordAutoComplete="new-password"
          alternateHref="/login"
          alternateText="Уже есть аккаунт? Войти"
        />
      </div>
    </main>
  );
}
