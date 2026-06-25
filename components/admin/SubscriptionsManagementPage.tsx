"use client";

import { useMemo, useState } from "react";
import {
  ChevronRight,
  CircleDollarSign,
  Home,
  Menu,
  MessageCircleMore,
  Search,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";

interface SubscriptionRecord {
  id: number;
  parent: string;
  student: string;
  status: "Paid" | "Pending" | "Overdue";
  amount: string;
}

const subscriptions: SubscriptionRecord[] = [
  {
    id: 1,
    parent: "Saira Khan",
    student: "Student: Ayan Khan",
    status: "Paid",
    amount: "Rs. 8,500",
  },
  {
    id: 2,
    parent: "Ahmed Raza",
    student: "Students: Ali & Zoya",
    status: "Pending",
    amount: "Rs. 16,000",
  },
  {
    id: 3,
    parent: "Nadia Hassan",
    student: "Student: Rami Hassan",
    status: "Overdue",
    amount: "Rs. 12,000",
  },
];

const tabConfig = [
  { key: "All", label: "All", count: 48, active: true },
  { key: "Paid", label: "Paid", count: 32, pill: "bg-emerald-50 text-emerald-700" },
  { key: "Pending", label: "Pending", count: 12, pill: "bg-amber-50 text-amber-700" },
];

export function SubscriptionsManagementPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredSubscriptions = useMemo(() => {
    if (activeTab === "All") return subscriptions;
    return subscriptions.filter((item) => item.status === activeTab);
  }, [activeTab]);

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col bg-[#F8FAFC] px-3 pb-24 pt-3 sm:px-4 sm:pt-4 lg:px-6 lg:pb-8">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2 text-[#0B5394]">
              <ShieldCheck size={18} />
              <h1 className="text-base font-bold sm:text-lg">VanGo Plus</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5394] text-sm font-semibold text-white">
                AM
              </div>
            </div>
          </div>

          <div className="mt-5">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-[28px]">Subscriptions</h2>
            <p className="mt-1 text-sm text-slate-500">Manage billing and payment statuses</p>
          </div>

          <label className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 shadow-sm">
            <Search size={17} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search parent or student..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        </header>

        <div className="px-3 py-4 sm:px-4 lg:px-5 lg:py-5">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabConfig.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-white text-[#0B5394]" : "bg-slate-50 text-slate-600"
                  }`}
                >
                  <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? "bg-[#0B5394] text-white" : tab.pill ?? "bg-slate-100 text-slate-600"}`}>
                    {tab.count}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 space-y-3">
            {filteredSubscriptions.map((record) => {
              const statusStyles = {
                Paid: "bg-emerald-50 text-emerald-700",
                Pending: "bg-amber-50 text-amber-700",
                Overdue: "bg-rose-50 text-rose-700",
              };

              const amountStyles = {
                Paid: "text-[#0B5394]",
                Pending: "text-[#7C2D12]",
                Overdue: "text-[#7F1D1D]",
              };

              return (
                <article key={record.id} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{record.parent}</h3>
                      <p className="mt-1 text-sm text-slate-500">{record.student}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[record.status]}`}>
                      {record.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className={`text-xl font-bold ${amountStyles[record.status]}`}>{record.amount}</div>

                    <div className="flex items-center gap-2">
                      {record.status === "Paid" ? (
                        <button type="button" className="inline-flex items-center gap-1 text-sm font-semibold text-[#0F766E]">
                          View Detail
                          <ChevronRight size={16} />
                        </button>
                      ) : (
                        <>
                          {record.status === "Pending" ? (
                            <button
                              type="button"
                              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                              aria-label="Open chat"
                            >
                              <MessageCircleMore size={18} />
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="rounded-2xl bg-[#0B5394] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#084c7a]"
                          >
                            Mark Paid
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around border-t border-slate-200 bg-white px-2 py-3 shadow-[0_-12px_35px_rgba(15,23,42,0.06)] sm:px-4 lg:hidden">
        {[
          { label: "Dashboard", icon: Home },
          { label: "Students", icon: Users },
          { label: "Subscriptions", icon: Wallet, active: true },
          { label: "Attendance", icon: CircleDollarSign },
          { label: "Settings", icon: Settings },
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
