"use client";

import { useActionState, useEffect, useRef, type FormEvent } from "react";
import Link from "next/link";
import { type FormState } from "@/lib/forms";
import { categories, statuses, type Category, type Status } from "@/lib/requests";

const fieldClass =
  "w-full rounded-lg border border-line bg-white px-3 py-3 text-base text-foreground outline-none focus:border-accent disabled:bg-stone-50";

export function RequestForm({
  action,
  mode,
  initial,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  mode: "create" | "edit";
  initial?: {
    title: string;
    description: string;
    category: Category;
    status: Status;
  };
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });
  const lock = useRef(false);

  useEffect(() => {
    if (!pending) {
      lock.current = false;
    }
  }, [pending, state]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    if (pending || lock.current) {
      event.preventDefault();
      return;
    }
    lock.current = true;
  }

  return (
    <form
      action={formAction}
      onSubmitCapture={onSubmit}
      onReset={(event) => event.preventDefault()}
      className="flex flex-col gap-4"
    >
      {state.error ? (
        <p role="alert" className="rounded-lg bg-rose-50 px-3 py-3 text-sm text-rose-900">
          {state.error}
        </p>
      ) : null}

      <label className="flex flex-col gap-1 text-sm font-medium">
        Название
        <input
          className={fieldClass}
          name="title"
          defaultValue={initial?.title}
          required
          disabled={pending}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Описание задачи
        <textarea
          className={`${fieldClass} min-h-32 resize-y`}
          name="description"
          defaultValue={initial?.description}
          required
          disabled={pending}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Категория
        <select
          className={fieldClass}
          name="category"
          defaultValue={initial?.category ?? ""}
          required
          disabled={pending}
        >
          <option value="" disabled>
            Выберите категорию
          </option>
          {categories.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      {mode === "edit" ? (
        <label className="flex flex-col gap-1 text-sm font-medium">
          Статус
          <select
            className={fieldClass}
            name="status"
            defaultValue={initial?.status ?? "new"}
            required
            disabled={pending}
          >
            {statuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="text-sm text-muted">Новая заявка получит статус «Новая».</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          className="inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-4 text-base font-medium text-white disabled:opacity-60"
          type="submit"
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? "Сохранение…" : mode === "create" ? "Создать заявку" : "Сохранить"}
        </button>
        <Link
          className="inline-flex min-h-12 items-center justify-center rounded-lg border border-line px-4 text-base"
          href="/requests"
        >
          К списку
        </Link>
      </div>
    </form>
  );
}
