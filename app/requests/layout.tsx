import { signOut } from "@/app/auth/actions";
import { requireUser } from "@/lib/session";

export default async function RequestsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { email } = await requireUser();

  return (
    <>
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-lg font-semibold leading-tight">Заявки</p>
            {email ? <p className="truncate text-sm text-muted">{email}</p> : null}
          </div>
          <form action={signOut}>
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-white px-3 text-sm"
              type="submit"
            >
              Выйти
            </button>
          </form>
        </div>
      </header>
      {children}
    </>
  );
}
