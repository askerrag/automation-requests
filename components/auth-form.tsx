"use client";

import { useActionState, useEffect, useRef, type FormEvent } from "react";
import Link from "next/link";
import { type FormState } from "@/lib/forms";

const fieldClass =
  "w-full rounded-lg border border-line bg-white px-3 py-3 text-base text-foreground outline-none focus:border-accent";

export function AuthForm({
  action,
  title,
  submitLabel,
  pendingLabel,
  passwordAutoComplete,
  alternateHref,
  alternateText,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  title: string;
  submitLabel: string;
  pendingLabel: string;
  passwordAutoComplete: "current-password" | "new-password";
  alternateHref: string;
  alternateText: string;
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
      <div>
        <p className="text-sm text-muted">Автоматизация</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
      </div>

      {state.error ? (
        <p role="alert" className="rounded-lg bg-rose-50 px-3 py-3 text-sm text-rose-900">
          {state.error}
        </p>
      ) : null}

      <label className="flex flex-col gap-1 text-sm font-medium">
        Электронная почта
        <input
          className={fieldClass}
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={pending}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Пароль
        <input
          className={fieldClass}
          name="password"
          type="password"
          autoComplete={passwordAutoComplete}
          minLength={6}
          required
          disabled={pending}
        />
      </label>

      <button
        className="inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-4 text-base font-medium text-white disabled:opacity-60"
        type="submit"
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? pendingLabel : submitLabel}
      </button>

      <Link className="text-sm text-accent underline-offset-2 hover:underline" href={alternateHref}>
        {alternateText}
      </Link>
    </form>
  );
}
