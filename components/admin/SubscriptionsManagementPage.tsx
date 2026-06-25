"use client";

import { useMemo, useState } from "react";
import {
  ChevronRight,
  Search,
  X,
} from "lucide-react";

interface SubscriptionRecord {
  id: number;
  parent: string;
  student: string;
  status: "Paid" | "Pending" | "Overdue";
  amount: string;
}

const seedSubscriptions: SubscriptionRecord[] = [
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
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(seedSubscriptions);
  const [activeTab, setActiveTab] = useState("All");
  const [receiptRecord, setReceiptRecord] = useState<SubscriptionRecord | null>(null);

  const filteredSubscriptions = useMemo(() => {
    if (activeTab === "All") return subscriptions;
    return subscriptions.filter((item) => item.status === activeTab);
  }, [subscriptions, activeTab]);

  function markPaid(id: number) {
    setSubscriptions((current) =>
      current.map((item) => (item.id === id ? { ...item, status: "Paid" } : item))
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div>
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
                        <button
                          type="button"
                          onClick={() => setReceiptRecord(record)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-[#0F766E]"
                        >
                          View Detail
                          <ChevronRight size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => markPaid(record.id)}
                          className="rounded-2xl bg-[#0B5394] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#084c7a]"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {receiptRecord ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setReceiptRecord(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-sm">
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-xl">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-[#0B5394] px-5 py-4 text-white">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Payment Receipt</p>
                  <h3 className="mt-1 text-lg font-bold">VanGo Plus</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setReceiptRecord(null)}
                  className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10"
                  aria-label="Close receipt"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 px-5 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Receipt No.</span>
                  <span className="text-sm font-semibold text-slate-800">
                    #VG-{String(receiptRecord.id).padStart(5, "0")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Parent</span>
                  <span className="text-sm font-semibold text-slate-800">{receiptRecord.parent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{receiptRecord.student.split(":")[0]}</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {receiptRecord.student.split(":")[1]?.trim() ?? receiptRecord.student}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Status</span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    {receiptRecord.status}
                  </span>
                </div>

                <div className="my-3 border-t border-dashed border-slate-200" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-slate-700">Amount Paid</span>
                  <span className="text-xl font-bold text-[#0B5394]">{receiptRecord.amount}</span>
                </div>

                <p className="pt-2 text-center text-xs text-slate-400">
                  Thank you for your payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
