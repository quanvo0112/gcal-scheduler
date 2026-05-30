"use client";

import { signIn, signOut, useSession } from "next-auth/react";

import SchedulerForm from "./components/scheduler-form";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_40%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 text-slate-700">
        <div className="rounded-3xl border border-slate-200 bg-white/80 px-6 py-4 shadow-xl backdrop-blur">
          Checking session...
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#ecfeff_100%)] px-4">
        <section className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:p-10">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.03)_0%,rgba(255,255,255,0)_55%)]" />
          <div className="relative space-y-8">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">
                Google Calendar Scheduler
              </p>
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Sign in to schedule events with your calendar.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Connect your Google account to create calendar events safely and
                keep your access token available only after authentication.
              </p>
            </div>

            <button
              type="button"
              onClick={() => signIn("google")}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
                G
              </span>
              Sign in with Google
            </button>
          </div>
        </section>
      </main>
    );
  }

  const userName = session.user?.name ?? "Signed in user";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.10),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-slate-200 ring-4 ring-emerald-100">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={userName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-bold text-white">
                    {userName.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
                  Authenticated
                </p>
                <h1 className="text-lg font-semibold text-slate-950 sm:text-xl">
                  Welcome back, {userName}
                </h1>
                <p className="text-sm text-slate-600">
                  Your Google session is active. You can create calendar events
                  below.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950"
            >
              Sign out
            </button>
          </div>
        </header>

        <SchedulerForm />
      </div>
    </main>
  );
}
