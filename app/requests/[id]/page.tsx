import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateRequest } from "@/app/requests/actions";
import { RequestForm } from "@/components/request-form";
import { isCategory, isStatus, type RequestRow } from "@/lib/requests";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Заявка" };

export default async function EditRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("requests")
    .select("id, title, description, category, status, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (error.code === "22P02") {
      notFound();
    }

    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-5">
        <p role="alert" className="rounded-lg bg-rose-50 px-3 py-3 text-sm text-rose-900">
          Не удалось открыть заявку. Обновите страницу.
        </p>
        <Link className="text-accent underline-offset-2 hover:underline" href="/requests">
          К списку
        </Link>
      </main>
    );
  }

  if (!data || !isCategory(data.category) || !isStatus(data.status)) {
    notFound();
  }

  const request: RequestRow = {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    status: data.status,
    created_at: data.created_at,
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-5">
      <h1 className="text-2xl font-semibold tracking-tight">Редактирование заявки</h1>
      <div className="rounded-2xl border border-line bg-card p-5">
        <RequestForm action={updateRequest.bind(null, request.id)} mode="edit" initial={request} />
      </div>
    </main>
  );
}
