export const categories = [
  { value: "bot", label: "Бот" },
  { value: "integration", label: "Интеграция" },
  { value: "report", label: "Отчёт" },
  { value: "other", label: "Другое" },
] as const;

export const statuses = [
  { value: "new", label: "Новая" },
  { value: "in_progress", label: "В работе" },
  { value: "done", label: "Завершена" },
] as const;

export type Category = (typeof categories)[number]["value"];
export type Status = (typeof statuses)[number]["value"];

export type RequestRow = {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: Status;
  created_at: string;
};

const categoryValues = new Set<string>(categories.map((item) => item.value));
const statusValues = new Set<string>(statuses.map((item) => item.value));

export function isCategory(value: string): value is Category {
  return categoryValues.has(value);
}

export function isStatus(value: string): value is Status {
  return statusValues.has(value);
}

export function categoryLabel(value: Category) {
  return categories.find((item) => item.value === value)?.label ?? value;
}

export function statusLabel(value: Status) {
  return statuses.find((item) => item.value === value)?.label ?? value;
}

export function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Moscow",
  }).format(new Date(value));
}

export function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

export function parseRequestFields(formData: FormData, withStatus: boolean) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!title || !description || !isCategory(category) || (withStatus && !isStatus(status))) {
    return {
      ok: false as const,
      error: withStatus
        ? "Заполните название, описание, категорию и статус."
        : "Заполните название, описание и категорию.",
    };
  }

  return {
    ok: true as const,
    title,
    description,
    category,
    status: withStatus && isStatus(status) ? status : ("new" as const),
  };
}
