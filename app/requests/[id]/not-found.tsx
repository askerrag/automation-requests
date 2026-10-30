import Link from "next/link";

export default function RequestNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-5">
      <h1 className="text-2xl font-semibold">Заявка не найдена</h1>
      <p className="text-muted">Такой заявки нет среди ваших.</p>
      <Link className="text-accent underline-offset-2 hover:underline" href="/requests">
        К списку
      </Link>
    </main>
  );
}
