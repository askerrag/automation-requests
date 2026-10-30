import type { Metadata } from "next";
import { signIn } from "@/app/auth/actions";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Вход" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
      <div className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6">
        <AuthForm
          action={signIn}
          title="Вход"
          submitLabel="Войти"
          pendingLabel="Вход…"
          passwordAutoComplete="current-password"
          alternateHref="/register"
          alternateText="Нет аккаунта? Зарегистрироваться"
        />
      </div>
    </main>
  );
}
