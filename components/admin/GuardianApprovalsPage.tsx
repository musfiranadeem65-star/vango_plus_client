"use client";

import { useMemo, useState } from "react";
import {
  CheckSquare,
  Eye,
  FileText,
  Trash2,
  UserRound,
} from "lucide-react";

interface GuardianRequest {
  id: number;
  name: string;
  relation: string;
  status: "Pending" | "Approved" | "Rejected";
  students: string[];
  document: string;
  accent: "sky" | "mint" | "rose";
}

const seedRequests: GuardianRequest[] = [
  {
    id: 1,
    name: "Maya Thompson",
    relation: "Mother",
    status: "Pending",
    students: ["Emma Mitchell", "Liam Mitchell"],
    document: "CNIC",
    accent: "sky",
  },
  {
    id: 2,
    name: "Daniel Ortiz",
    relation: "Guardian (Grandfather)",
    status: "Approved",
    students: ["Sophia Ortiz"],
    document: "CNIC",
    accent: "mint",
  },
  {
    id: 3,
    name: "Rachel Kim",
    relation: "Step-Mother",
    status: "Rejected",
    students: ["Noah Kim"],
    document: "CNIC",
    accent: "rose",
  },
];

const filterStyles = {
  All: "bg-[#0B5394] text-white",
  Pending: "bg-[#FFF3E8] text-[#A85A00]",
  Approved: "bg-[#E8FFF6] text-[#1B7A4C]",
  Rejected: "bg-[#F3F4F6] text-[#4B5563]",
};

const dotStyles = {
  All: "bg-white",
  Pending: "bg-[#A85A00]",
  Approved: "bg-[#1B7A4C]",
  Rejected: "bg-[#4B5563]",
};

const accentStyles = {
  sky: "bg-[#EAF6FF] text-[#0B5394]",
  mint: "bg-[#EAFBF4] text-[#0F766E]",
  rose: "bg-[#FDECEC] text-[#B1454A]",
};

export function GuardianApprovalsPage() {
  const [requests, setRequests] = useState<GuardianRequest[]>(seedRequests);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filteredRequests = useMemo(() => {
    if (activeFilter === "All") return requests;
    return requests.filter((request) => request.status === activeFilter);
  }, [requests, activeFilter]);

  const toggleSelection = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  };

  const setStatus = (id: number, status: GuardianRequest["status"]) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
  };

  const approveSelected = () => {
    setRequests((current) =>
      current.map((request) =>
        selectedIds.includes(request.id) ? { ...request, status: "Approved" } : request
      )
    );
    setSelectedIds([]);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_15px_45px_rgba(15,23,42,0.06)]">
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-[28px]">Guardian Approvals</h2>
          </div>
        </header>

        <div className="px-3 py-4 sm:px-4 lg:px-5 lg:py-5">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(["All", "Pending", "Approved", "Rejected"] as const).map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive ? filterStyles[filter] : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${dotStyles[filter]}`} />
                  {filter}
                </button>
              );
            })}
          </div>

          <div className="mt-4 space-y-3">
            {filteredRequests.map((request) => {
              const checked = selectedIds.includes(request.id);
              return (
                <article
                  key={request.id}
                  className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentStyles[request.accent]}`}>
                        <UserRound size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{request.name}</h3>
                        <p className="text-sm text-slate-500">{request.relation}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSelection(request.id)}
                      className={`flex h-7 w-7 items-center justify-center rounded-md border transition ${
                        checked
                          ? "border-[#0B5394] bg-[#0B5394] text-white"
                          : "border-slate-200 bg-white text-slate-300"
                      }`}
                      aria-label={`Select ${request.name}`}
                    >
                      <CheckSquare size={16} />
                    </button>
                  </div>

                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Linked Students
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {request.students.map((student) => (
                        <span
                          key={student}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600"
                        >
                          {student}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{request.document}</p>
                          <p className="text-xs text-slate-500">Verified document</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-[#0B5394]"
                      >
                        <Eye size={15} />
                        View CNIC
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus(request.id, "Rejected")}
                      className="rounded-2xl border border-[#C2410C] bg-white px-3 py-2.5 text-sm font-semibold text-[#C2410C] transition hover:bg-[#FFF7ED]"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(request.id, "Approved")}
                      className="rounded-2xl bg-[#006666] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#005454]"
                    >
                      Approve
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {selectedIds.length > 0 ? (
        <div className="fixed inset-x-0 bottom-20 z-40 mx-auto flex w-[calc(100%-1.5rem)] max-w-2xl items-center justify-between rounded-full border border-slate-200 bg-slate-900 px-3 py-2.5 text-white shadow-lg sm:w-[calc(100%-2rem)]">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <Trash2 size={16} />
            </span>
            <span className="text-sm font-semibold">{selectedIds.length} selected</span>
          </div>
          <button
            type="button"
            onClick={approveSelected}
            className="rounded-full bg-[#006666] px-3 py-1.5 text-sm font-semibold text-white"
          >
            Approve All
          </button>
        </div>
      ) : null}
    </div>
  );
}
