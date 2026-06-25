"use client";

import {
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCircle2,
  Compass,
  Home,
  MapPin,
  MessageCircleMore,
  Navigation,
  Plus,
  Route,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";

function ParentDashboardPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fb] px-3 pb-24 pt-3 text-slate-900 sm:px-4 sm:pt-4 lg:px-6 lg:pb-8">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
        <header className="border-b border-slate-200 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#0B5394]">
              <ShieldCheck size={18} />
              <h1 className="text-base font-bold sm:text-lg">VanGo Plus</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
                aria-label="Notifications"
              >
                <Bell size={18} />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5394] text-sm font-semibold text-white">
                SR
              </div>
            </div>
          </div>

          <div className="mt-5">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-[28px]">Hello, Sarah 👋</h2>
            <p className="mt-1 text-sm text-slate-500">Your children are in safe hands today.</p>
          </div>
        </header>

        <main className="space-y-4 px-3 py-4 sm:px-4 lg:px-5 lg:py-5">
          <section className="flex items-start justify-between gap-3 rounded-[24px] border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Subscription Renewal</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Your monthly plan expires in 3 days. Renew now to avoid service interruption.
                </p>
              </div>
            </div>
            <button type="button" className="text-sm font-semibold text-amber-800">
              RENEW
            </button>
          </section>

          <section className="space-y-3">
            <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF6FF] text-sm font-semibold text-[#0B5394]">
                    L
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Leo</h3>
                    <p className="text-sm text-slate-500">ROUTE #42B</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#0B5394] px-3 py-1.5 text-xs font-semibold text-white">
                  <Navigation size={13} />
                  Picked Up
                </span>
              </div>

              <div className="mt-4 rounded-[20px] bg-slate-50 p-3">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <MapPin size={16} className="text-slate-500" />
                  <span>Current Location: Park Avenue</span>
                </div>
                <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                  <span>Pickup: 7:45 AM</span>
                  <span>Est. Drop: 8:15 AM</span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[62%] rounded-full bg-[#0B5394]" />
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <button type="button" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F766E]">
                  <Compass size={16} />
                  View Live Map
                </button>
              </div>
            </article>

            <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAFBF4] text-sm font-semibold text-[#0F766E]">
                    M
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Maya</h3>
                    <p className="text-sm text-slate-500">ROUTE #15A</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 size={13} />
                  Dropped Safely
                </span>
              </div>

              <p className="mt-4 text-center text-sm text-slate-700">
                Maya was dropped off at St. Mary&apos;s School at 8:02 AM.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button type="button" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  View History
                </button>
                <button type="button" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Notify Driver
                </button>
              </div>
            </article>

            <article className="flex items-center justify-between rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">No Morning Trips</h3>
                  <p className="text-sm text-slate-500">Scheduled for 3:30 PM</p>
                </div>
              </div>
              <span className="rounded-full bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">
                Not Started
              </span>
            </article>
          </section>

          <section>
            <h3 className="mb-3 text-lg font-semibold text-slate-900">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Add Guardian", icon: Plus, accent: "bg-emerald-100 text-emerald-700" },
                { label: "Pay Fee", icon: Wallet, accent: "bg-amber-100 text-amber-700" },
                { label: "View Schedule", icon: CalendarDays, accent: "bg-sky-100 text-sky-700" },
                { label: "Contact Support", icon: MessageCircleMore, accent: "bg-violet-100 text-violet-700" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    className="flex flex-col items-center justify-center gap-2 rounded-[20px] border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.accent}`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around border-t border-slate-200 bg-white px-2 py-3 shadow-[0_-12px_35px_rgba(15,23,42,0.06)] sm:px-4 lg:hidden">
        {[
          { label: "Home", icon: Home, active: true },
          { label: "Children", icon: Users },
          { label: "Schedule", icon: Route },
          { label: "Alerts", icon: Bell },
          { label: "Profile", icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              className={`flex flex-col items-center gap-1 rounded-xl px-2 py-1 text-[11px] font-semibold ${
                item.active ? "text-[#0F766E]" : "text-slate-500"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default ParentDashboardPage;
