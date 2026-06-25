"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  PencilLine,
  Plus,
  Power,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

interface StudentRecord {
  id: number;
  name: string;
  grade: string;
  section: string;
  parent: string;
  route: string;
  status: "Active" | "Inactive";
  initials: string;
}

const seedStudents: StudentRecord[] = [
  {
    id: 1,
    name: "Ava Thompson",
    grade: "Grade 4",
    section: "Class B",
    parent: "Maya Thompson",
    route: "North Loop",
    status: "Active",
    initials: "AT",
  },
  {
    id: 2,
    name: "Noah Bennett",
    grade: "Grade 5",
    section: "Class A",
    parent: "Liam Bennett",
    route: "West Ridge",
    status: "Active",
    initials: "NB",
  },
  {
    id: 3,
    name: "Sophia Carter",
    grade: "Grade 3",
    section: "Class C",
    parent: "Claire Carter",
    route: "Unassigned",
    status: "Inactive",
    initials: "SC",
  },
  {
    id: 4,
    name: "Liam Ortiz",
    grade: "Grade 6",
    section: "Class B",
    parent: "Daniel Ortiz",
    route: "Harbor View",
    status: "Active",
    initials: "LO",
  },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function StudentsManagementPage() {
  const [students, setStudents] = useState<StudentRecord[]>(seedStudents);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formGrade, setFormGrade] = useState("");
  const [formSection, setFormSection] = useState("");
  const [formParent, setFormParent] = useState("");
  const [formRoute, setFormRoute] = useState("");
  const [filter, setFilter] = useState("All Students");
  const [searchText, setSearchText] = useState("");

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesFilter =
        filter === "All Students" ||
        (filter === "Active" && student.status === "Active") ||
        (filter === "Inactive" && student.status === "Inactive");

      const matchesSearch = [student.name, student.parent, student.route]
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [students, filter, searchText]);

  function openAddStudent() {
    setFormMode("add");
    setEditingId(null);
    setFormName("");
    setFormGrade("");
    setFormSection("");
    setFormParent("");
    setFormRoute("");
    setIsDrawerOpen(true);
  }

  function openEditStudent(student: StudentRecord) {
    setFormMode("edit");
    setEditingId(student.id);
    setFormName(student.name);
    setFormGrade(student.grade);
    setFormSection(student.section);
    setFormParent(student.parent);
    setFormRoute(student.route);
    setIsDrawerOpen(true);
  }

  function toggleStatus(id: number) {
    setStudents((current) =>
      current.map((student) =>
        student.id === id
          ? { ...student, status: student.status === "Active" ? "Inactive" : "Active" }
          : student
      )
    );
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!formName.trim()) return;

    const route = formRoute || "Unassigned";

    if (formMode === "add") {
      setStudents((current) => [
        {
          id: Date.now(),
          name: formName.trim(),
          grade: formGrade || "—",
          section: formSection || "—",
          parent: formParent || "—",
          route,
          status: "Active",
          initials: getInitials(formName),
        },
        ...current,
      ]);
    } else if (editingId !== null) {
      setStudents((current) =>
        current.map((student) =>
          student.id === editingId
            ? {
                ...student,
                name: formName.trim(),
                grade: formGrade || student.grade,
                section: formSection || student.section,
                parent: formParent || student.parent,
                route,
                initials: getInitials(formName),
              }
            : student
        )
      );
    }

    setIsDrawerOpen(false);
  }

  return (
    <div
      className="mx-auto flex w-full max-w-7xl flex-col gap-6 rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-6 lg:p-8"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div className="flex flex-col gap-6">
        <section className="flex-1 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50/70">
          <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#0f2c4b]">Students</h1>
                <p className="text-sm text-slate-500">Keep transport records tidy and up to date.</p>
              </div>

              <button
                type="button"
                onClick={openAddStudent}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#005691] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004a7a]"
              >
                <Plus size={16} />
                Add Student
              </button>
            </div>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <label className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 shadow-sm">
                <Search size={18} className="text-slate-400" />
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  type="text"
                  placeholder="Search students..."
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>

              <div className="flex items-center gap-2">
                <label className="relative flex min-w-[180px] items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 shadow-sm">
                  <select
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    className="w-full appearance-none bg-transparent pr-6 outline-none"
                  >
                    <option>All Students</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 text-slate-400" />
                </label>

                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-100"
                  aria-label="Toggle filters"
                >
                  <SlidersHorizontal size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-[calc(100vh-24rem)] space-y-3 overflow-y-auto p-3 sm:p-4 lg:max-h-[calc(100vh-20rem)] lg:p-5">
            {filteredStudents.map((student) => (
              <article
                key={student.id}
                className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf5ff] text-sm font-semibold text-[#005691]">
                      {student.initials}
                    </div>

                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-semibold text-slate-900">{student.name}</h2>
                        <span className="text-sm text-slate-500">{student.grade} • {student.section}</span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Parent
                          </p>
                          <p className="text-sm font-medium text-slate-700">{student.parent}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Route
                          </p>
                          <p className="text-sm font-medium text-slate-700">{student.route}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      student.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {student.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openEditStudent(student)}
                    className="rounded-full border border-sky-100 bg-sky-50 p-2 text-sky-700 transition hover:bg-sky-100"
                    aria-label={`Edit ${student.name}`}
                  >
                    <PencilLine size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleStatus(student.id)}
                    className="rounded-full border border-sky-100 bg-sky-50 p-2 text-sky-700 transition hover:bg-sky-100"
                    aria-label={`Toggle ${student.name}`}
                  >
                    <Power size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md">
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto rounded-[24px] border border-slate-200 bg-white p-5 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#005691]">Quick Setup</p>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {formMode === "add" ? "Add Student" : "Edit Student"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100"
                  aria-label="Close add student form"
                >
                  <X size={18} />
                </button>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(event) => setFormName(event.target.value)}
                    placeholder="Enter student name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#005691] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Grade Level</label>
                  <div className="relative">
                    <select
                      value={formGrade}
                      onChange={(event) => setFormGrade(event.target.value)}
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#005691] focus:bg-white"
                    >
                      <option value="">Select Grade</option>
                      <option>Grade 3</option>
                      <option>Grade 4</option>
                      <option>Grade 5</option>
                      <option>Grade 6</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Class / Section</label>
                  <input
                    type="text"
                    value={formSection}
                    onChange={(event) => setFormSection(event.target.value)}
                    placeholder="e.g. Class 4-B"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#005691] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Parent / Guardian</label>
                  <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus-within:border-[#005691] focus-within:bg-white">
                    <Search size={16} className="text-slate-400" />
                    <input
                      type="text"
                      value={formParent}
                      onChange={(event) => setFormParent(event.target.value)}
                      placeholder="Search by name or ID"
                      className="w-full bg-transparent outline-none placeholder:text-slate-400"
                    />
                  </label>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Assign Route</label>
                  <div className="relative">
                    <select
                      value={formRoute}
                      onChange={(event) => setFormRoute(event.target.value)}
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#005691] focus:bg-white"
                    >
                      <option value="">Select a Route</option>
                      <option>North Loop</option>
                      <option>West Ridge</option>
                      <option>Harbor View</option>
                      <option>South Park</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-2xl bg-[#005691] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004a7a]"
                >
                  {formMode === "add" ? "Save Student Profile" : "Update Student"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="mx-auto block text-sm font-medium text-slate-500 transition hover:text-slate-700"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
