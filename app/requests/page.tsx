import type { Metadata } from "next";
import Link from "next/link";
import {
  categoryLabel,
  formatCreatedAt,
  escapeLike,
  isCategory,
  isStatus,
  statusLabel,
  statuses,
  type RequestRow,
} from "@/lib/requests";
import { requireUser } from "@/lib/session";

type RequestListItem = Pick<RequestRow, "id" | "title" | "category" | "status" | "created_at">;

export const metadata: Metadata = { title: "Список" };

const notices: Record<string, string> = {
  created: "Заявка сохранена.",
  updated: "Изменения сохранены.",
};

const statusClass: Record<RequestRow["status"], string> = {
  new: "bg-stone-200 text-stone-800",
  in_progress: "bg-amber-100 text-amber-950",
  done: "bg-emerald-100 text-emerald-950",
};

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; notice?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const status = params.status && isStatus(params.status) ? params.status : "";
  const notice = params.notice ? notices[params.notice] : undefined;
  const { supabase } = await requireUser();

  let query = supabase
    .from("requests")
    .select("id, title, category, status, created_at")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("title", `%${escapeLike(q)}%`);
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  const requests = (data ?? []).flatMap((row) => {
    if (!isCategory(row.category) || !isStatus(row.status)) {
      return [];
    }

    return [
      {
        id: row.id,
        title: row.title,
        category: row.category,
        status: row.status,
        created_at: row.created_at,
      },
    ];
  });

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-5">
      {notice ? (
        <p role="status" className="rounded-lg bg-emerald-50 px-3 py-3 text-sm text-emerald-950">
          {notice}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <form className="flex flex-1 flex-col gap-3 sm:flex-row" method="get">
          <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm font-medium">
            Поиск по названию
            <input
              className="w-full rounded-lg border border-line bg-white px-3 py-3 text-base outline-none focus:border-accent"
              name="q"
              defaultValue={q}
              type="search"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium sm:w-48">
            Статус
            <select
              className="w-full rounded-lg border border-line bg-white px-3 py-3 text-base outline-none focus:border-accent"
              name="status"
              defaultValue={status}
            >
              <option value="">Все статусы</option>
              {statuses.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2 sm:items-end">
            <button
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg bg-accent px-4 text-base font-medium text-white sm:flex-none"
              type="submit"
            >
              Найти
            </button>
            {q || status ? (
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-line bg-white px-4 text-base"
                href="/requests"
              >
                Сбросить
              </Link>
            ) : null}
          </div>
        </form>
        <Link
          className="inline-flex min-h-12 items-center justify-center rounded-lg border border-accent px-4 text-base font-medium text-accent"
          href="/requests/new"
        >
          Новая заявка
        </Link>
      </div>

      {error ? (
        <p role="alert" className="rounded-lg bg-rose-50 px-3 py-3 text-sm text-rose-900">
          Не удалось загрузить заявки. Обновите страницу.
        </p>
      ) : requests.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-card px-4 py-8 text-center text-muted">
          {q || status ? "Ничего не найдено. Измените запрос или фильтр." : "Заявок пока нет."}
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-3 md:hidden">
            {requests.map((request) => (
              <li key={request.id}>
                <Link
                  className="block rounded-2xl border border-line bg-card p-4"
                  href={`/requests/${request.id}`}
                >
                  <RequestSummary request={request} />
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-hidden rounded-2xl border border-line bg-card md:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="border-b border-line text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Название</th>
                  <th className="px-4 py-3 font-medium">Категория</th>
                  <th className="px-4 py-3 font-medium">Дата создания</th>
                  <th className="px-4 py-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">
                      <Link className="font-medium hover:underline" href={`/requests/${request.id}`}>
                        {request.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{categoryLabel(request.category)}</td>
                    <td className="px-4 py-3">
                      <time dateTime={request.created_at}>{formatCreatedAt(request.created_at)}</time>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={request.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}

function RequestSummary({ request }: { request: RequestListItem }) {
  return (
    <span className="flex flex-col gap-2">
      <span className="text-base font-medium">{request.title}</span>
      <span className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <span>{categoryLabel(request.category)}</span>
        <time dateTime={request.created_at}>{formatCreatedAt(request.created_at)}</time>
        <StatusBadge status={request.status} />
      </span>
    </span>
  );
}

function StatusBadge({ status }: { status: RequestRow["status"] }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass[status]}`}>
      {statusLabel(status)}
    </span>
  );
}
