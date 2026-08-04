"use client";

import type { Student } from "@/types/student";

interface StudentTableProps {
  students: Student[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  loading: boolean;
  error: string | null;
}

function getStatusBadgeClasses(status: string) {
  const normalized = status?.toLowerCase();

  if (normalized === "active") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (normalized === "inactive") {
    return "bg-rose-100 text-rose-700";
  }

  return "bg-slate-100 text-slate-700";
}

export function StudentTable({
  students,
  searchTerm,
  onSearchChange,
  loading,
  error,
}: StudentTableProps) {
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Student List</h2>
          <p className="text-sm text-slate-500">Browse students from the connected backend.</p>
        </div>

        <label className="w-full sm:w-72">
          <span className="sr-only">Search students</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by student name"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#005691] focus:bg-white"
          />
        </label>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
          Loading students...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-10 text-center text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
          No students found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-3 font-semibold">ID</th>
                <th className="px-3 py-3 font-semibold">Name</th>
                <th className="px-3 py-3 font-semibold">Parent User ID</th>
                <th className="px-3 py-3 font-semibold">Grade</th>
                <th className="px-3 py-3 font-semibold">Section</th>
                <th className="px-3 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="transition hover:bg-slate-50">
                  <td className="px-3 py-3 text-slate-700">{student.id}</td>
                  <td className="px-3 py-3 font-medium text-slate-900">{student.name}</td>
                  <td className="px-3 py-3 text-slate-700">{student.parentUserId}</td>
                  <td className="px-3 py-3 text-slate-700">{student.grade}</td>
                  <td className="px-3 py-3 text-slate-700">{student.section}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClasses(student.status)}`}
                    >
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
