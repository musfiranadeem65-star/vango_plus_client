"use client";

import { useEffect, useState } from "react";
import { StudentTable } from "@/components/StudentTable";
import { getStudents } from "@/services/studentService";
import type { Student } from "@/types/student";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStudents() {
      try {
        setLoading(true);
        setError(null);
        const data = await getStudents();

        if (isMounted) {
          setStudents(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load students.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadStudents();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#005691]">Student Management</p>
              <h1 className="text-2xl font-semibold text-slate-900">Students</h1>
              <p className="mt-1 text-sm text-slate-500">
                View the live student list from the ASP.NET backend.
              </p>
            </div>
          </div>
        </div>

        <StudentTable
          students={students}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          loading={loading}
          error={error}
        />
      </div>
    </main>
  );
}
