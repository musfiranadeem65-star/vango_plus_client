"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import type { Subscription } from "@/types/subscription";
import { getSubscriptions, getSubscriptionById, updateSubscriptionStatus } from "@/services/subscriptionService";

export function SubscriptionsManagementPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [receiptRecord, setReceiptRecord] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await getSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unable to load subscriptions.");
    } finally {
      setIsLoading(false);
    }
  }

  const filteredSubscriptions = useMemo(() => {
    const byTab = activeTab === "All" ? subscriptions : subscriptions.filter((s) => s.status === activeTab);
    if (!searchQuery.trim()) return byTab;
    const q = searchQuery.toLowerCase();
    return byTab.filter((s) =>
      (s.parentName ?? "").toLowerCase().includes(q) || (s.studentName ?? "").toLowerCase().includes(q)
    );
  }, [subscriptions, activeTab, searchQuery]);

  async function markPaid(id: number) {
    setProcessingId(id);
    setErrorMessage("");
    try {
      await updateSubscriptionStatus(id, { status: "Paid" });
      // update UI optimistically
      setSubscriptions((current) => current.map((s) => (s.id === id ? { ...s, status: "Paid" } : s)));
      // refresh
      await loadData();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unable to mark paid.");
    } finally {
      setProcessingId(null);
    }
  }

  async function openReceipt(id: number) {
    setErrorMessage("");
    try {
      const detail = await getSubscriptionById(id);
      setReceiptRecord(detail);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unable to load subscription detail.");
    }
  }

  const counts = useMemo(() => {
    const all = subscriptions.length;
    const paid = subscriptions.filter((s) => s.status === "Paid").length;
    const pending = subscriptions.filter((s) => s.status === "Pending").length;
    return { all, paid, pending };
  }, [subscriptions]);

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parent or student..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        </header>

        <div className="px-3 py-4 sm:px-4 lg:px-5 lg:py-5">
          {errorMessage ? (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[{ key: "All", label: "All", count: counts.all }, { key: "Paid", label: "Paid", count: counts.paid, pill: "bg-emerald-50 text-emerald-700" }, { key: "Pending", label: "Pending", count: counts.pending, pill: "bg-amber-50 text-amber-700" }].map((tab) => {
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
            {isLoading ? (
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">Loading subscriptions...</div>
            ) : (
              filteredSubscriptions.map((record) => {
                const statusStyles: Record<string, string> = {
                  Paid: "bg-emerald-50 text-emerald-700",
                  Pending: "bg-amber-50 text-amber-700",
                  Overdue: "bg-rose-50 text-rose-700",
                };

                const amountStyles: Record<string, string> = {
                  Paid: "text-[#0B5394]",
                  Pending: "text-[#7C2D12]",
                  Overdue: "text-[#7F1D1D]",
                };

                return (
                  <article key={record.id} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{record.parentName}</h3>
                        <p className="mt-1 text-sm text-slate-500">{record.studentName}</p>
                        {record.planName ? (
                          <p className="mt-1 text-sm text-slate-500">{record.planName}</p>
                        ) : null}
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[record.status]}`}>
                        {record.status}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className={`text-xl font-bold ${amountStyles[record.status]}`}>{record.price ?? ""}</div>

                      <div className="flex items-center gap-2">
                        {record.status === "Paid" ? (
                          <button
                            type="button"
                            onClick={() => openReceipt(record.id)}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#0F766E]"
                          >
                            View Detail
                            <ChevronRight size={16} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => markPaid(record.id)}
                            disabled={processingId === record.id}
                            className="rounded-2xl bg-[#0B5394] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#084c7a] disabled:opacity-50"
                          >
                            {processingId === record.id ? "Processing..." : "Mark Paid"}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
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
                  <span className="text-sm font-semibold text-slate-800">#VG-{String(receiptRecord.id).padStart(5, "0")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Parent</span>
                  <span className="text-sm font-semibold text-slate-800">{receiptRecord.parentName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Student</span>
                  <span className="text-sm font-semibold text-slate-800">{receiptRecord.studentName ?? ""}</span>
                </div>
                {receiptRecord.planName ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Plan</span>
                    <span className="text-sm font-semibold text-slate-800">{receiptRecord.planName}</span>
                  </div>
                ) : null}
                {receiptRecord.startedAt ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Started At</span>
                    <span className="text-sm font-semibold text-slate-800">{new Date(receiptRecord.startedAt).toLocaleDateString()}</span>
                  </div>
                ) : null}
                {receiptRecord.paymentMethod ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Payment Method</span>
                    <span className="text-sm font-semibold text-slate-800">{receiptRecord.paymentMethod}</span>
                  </div>
                ) : null}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Status</span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">{receiptRecord.status}</span>
                </div>

                <div className="my-3 border-t border-dashed border-slate-200" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-slate-700">Amount Paid</span>
                  <span className="text-xl font-bold text-[#0B5394]">{receiptRecord.amount}</span>
                </div>

                <p className="pt-2 text-center text-xs text-slate-400">Thank you for your payment.</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
