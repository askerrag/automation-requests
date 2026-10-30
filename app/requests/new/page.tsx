import type { Metadata } from "next";
import { createRequest } from "@/app/requests/actions";
import { RequestForm } from "@/components/request-form";

export const metadata: Metadata = { title: "Новая заявка" };

export default function NewRequestPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-5">
      <h1 className="text-2xl font-semibold tracking-tight">Новая заявка</h1>
      <div className="rounded-2xl border border-line bg-card p-5">
        <RequestForm action={createRequest} mode="create" />
      </div>
    </main>
  );
}
