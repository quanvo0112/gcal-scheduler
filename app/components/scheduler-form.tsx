"use client";

import { FormEvent, useMemo, useState } from "react";

type FormState = {
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
};

type ApiResponse = {
  message?: string;
  error?: string;
  eventUrl?: string;
};

const initialForm: FormState = {
  title: "",
  description: "",
  startDateTime: "",
  endDateTime: "",
};

export default function SchedulerForm() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [form, setForm] = useState<FormState>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const containerClasses = useMemo(() => {
    if (theme === "dark") {
      return {
        page: "bg-slate-950 text-slate-100",
        card: "border-slate-800 bg-slate-900/70",
        label: "text-slate-200",
        input:
          "border-slate-700 bg-slate-950/60 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400/40",
        helper: "text-slate-400",
        toggle:
          "border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800",
      };
    }

    return {
      page: "bg-slate-100 text-slate-900",
      card: "border-slate-200 bg-white/90",
      label: "text-slate-700",
      input:
        "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/30",
      helper: "text-slate-500",
      toggle:
        "border-slate-300 bg-white text-slate-800 hover:bg-slate-100",
    };
  }, [theme]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/calendar/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: form.title,
          description: form.description,
          startDateTime: new Date(form.startDateTime).toISOString(),
          endDateTime: new Date(form.endDateTime).toISOString(),
        }),
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(data.error || "Unable to create event.");
      }

      setStatus({
        type: "success",
        message: data.eventUrl
          ? `Event created. View it here: ${data.eventUrl}`
          : "Event created successfully.",
      });
      setForm(initialForm);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      setStatus({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section
      className={`relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-14 transition-colors duration-300 ${containerClasses.page}`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-20 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -right-32 -bottom-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
      </div>

      <div
        className={`relative w-full max-w-2xl rounded-2xl border p-6 shadow-2xl backdrop-blur-sm sm:p-8 ${containerClasses.card}`}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className={`text-sm font-medium ${containerClasses.helper}`}>
              Google Calendar Scheduler
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Create an event in seconds
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${containerClasses.toggle}`}
          >
            {theme === "light" ? "Switch to Dark" : "Switch to Light"}
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="title"
              className={`mb-2 block text-sm font-medium ${containerClasses.label}`}
            >
              Event Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              className={`w-full rounded-xl border px-3 py-2.5 outline-none ring-2 ring-transparent transition ${containerClasses.input}`}
              placeholder="Team sync, product demo, coffee chat..."
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className={`mb-2 block text-sm font-medium ${containerClasses.label}`}
            >
              Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              rows={4}
              className={`w-full rounded-xl border px-3 py-2.5 outline-none ring-2 ring-transparent transition ${containerClasses.input}`}
              placeholder="Optional notes, agenda, location..."
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="startDateTime"
                className={`mb-2 block text-sm font-medium ${containerClasses.label}`}
              >
                Start Date & Time
              </label>
              <input
                id="startDateTime"
                type="datetime-local"
                required
                value={form.startDateTime}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, startDateTime: event.target.value }))
                }
                className={`w-full rounded-xl border px-3 py-2.5 outline-none ring-2 ring-transparent transition ${containerClasses.input}`}
              />
            </div>

            <div>
              <label
                htmlFor="endDateTime"
                className={`mb-2 block text-sm font-medium ${containerClasses.label}`}
              >
                End Date & Time
              </label>
              <input
                id="endDateTime"
                type="datetime-local"
                required
                value={form.endDateTime}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, endDateTime: event.target.value }))
                }
                className={`w-full rounded-xl border px-3 py-2.5 outline-none ring-2 ring-transparent transition ${containerClasses.input}`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Creating Event..." : "Create Calendar Event"}
          </button>
        </form>

        {status ? (
          <div
            role="status"
            className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
              status.type === "success"
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                : "border-rose-500/50 bg-rose-500/10 text-rose-300"
            }`}
          >
            {status.message}
          </div>
        ) : null}
      </div>
    </section>
  );
}
