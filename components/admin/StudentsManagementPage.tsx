"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  PencilLine,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { Guardian } from "@/types/guardian";
import { getGuardians } from "@/services/guardianService";
import { getStudents, updateStudent } from "@/services/studentService";

interface StudentRecord {
  id: number;
  name: string;
  grade: string;
  section: string;
  parent: string;
  parentUserId: number;
  route: string;
  status: "Active" | "Inactive";
  initials: string;
}


function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function StudentsManagementPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formGrade, setFormGrade] = useState("");
  const [formSection, setFormSection] = useState("");
  const [formParent, setFormParent] = useState("");
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [guardianSearch, setGuardianSearch] = useState("");
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [guardianLoading, setGuardianLoading] = useState(false);
  const [guardianError, setGuardianError] = useState<string | null>(null);
  const [guardianDropdownOpen, setGuardianDropdownOpen] = useState(false);
  const [formRoute, setFormRoute] = useState("");
  const [filter, setFilter] = useState("All Students");
  const [searchText, setSearchText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setSelectedGuardian(null);
    setGuardianSearch("");
    setFormRoute("");
    setIsSubmitting(false);
    setSubmitMessage(null);
    setSubmitError(null);
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
    setSelectedGuardian(guardians.find((guardian) => guardian.userId === student.parentUserId) ?? null);
    setGuardianSearch(student.parent);
    setIsSubmitting(false);
    setSubmitMessage(null);
    setSubmitError(null);
    setIsDrawerOpen(true);
  }

  useEffect(() => {
    let active = true;

    async function loadGuardians() {
      try {
        setGuardianLoading(true);
        setGuardianError(null);

        const result = await getGuardians();
        if (!active) return;

        setGuardians(result.filter((guardian) => guardian.status === "Approved"));
      } catch (error) {
        if (!active) return;
        setGuardianError(error instanceof Error ? error.message : "Unable to load guardians.");
      } finally {
        if (active) {
          setGuardianLoading(false);
        }
      }
    }

    loadGuardians();

    async function loadStudents() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const result = await getStudents();
        if (!active) return;

        setStudents(
          result.map((student) => ({
            id: student.id,
            name: student.name,
            grade: student.grade,
            section: student.section,
            parent: student.parentUserId.toString(),
            parentUserId: student.parentUserId,
            route: "Unassigned",
            status: (student.status === "Active" ? "Active" : "Inactive"),
            initials: getInitials(student.name),
          }))
        );
      } catch (error) {
        if (!active) return;
        setLoadError(error instanceof Error ? error.message : "Unable to load students.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadStudents();

    return () => {
      active = false;
    };
  }, []);

  const filteredGuardians = useMemo(
    () =>
      guardians.filter((guardian) =>
        guardian.name.toLowerCase().includes(guardianSearch.toLowerCase())
      ),
    [guardians, guardianSearch]
  );

  async function refreshStudentList() {
    try {
      setIsLoading(true);
      setLoadError(null);
      const result = await getStudents();
      setStudents(
        result.map((student) => ({
          id: student.id,
          name: student.name,
          grade: student.grade,
          section: student.section,
          parent: student.parentUserId.toString(),
          parentUserId: student.parentUserId,
          route: "Unassigned",
          status: student.status === "Active" ? "Active" : "Inactive",
          initials: getInitials(student.name),
        }))
      );
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load students.");
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleStatus(id: number) {
    const student = students.find((item) => item.id === id);
    if (!student) return;

    const previousStatus = student.status;
    const nextStatus = previousStatus === "Active" ? "Inactive" : "Active";
    setStatusUpdatingId(id);
    setSubmitError(null);
    setSubmitMessage(null);
    setStudents((current) =>
      current.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
    );

    try {
      await updateStudent(id, {
        parentUserId: student.parentUserId,
        name: student.name,
        grade: student.grade,
        section: student.section,
        status: nextStatus,
      });

      await refreshStudentList();
      setSubmitMessage("Student status updated successfully.");
    } catch (error) {
      setStudents((current) =>
        current.map((item) => (item.id === id ? { ...item, status: previousStatus } : item))
      );
      setSubmitError(error instanceof Error ? error.message : "Failed to update student status.");
    } finally {
      setStatusUpdatingId(null);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!formName.trim()) {
      setSubmitError("Student name is required.");
      return;
    }

    const route = formRoute || "Unassigned";

    if (formMode === "add") {
      if (!selectedGuardian) {
        setSubmitError("Please select a parent or guardian.");
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitMessage(null);

      const parentUserId = selectedGuardian.userId;

      try {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 15000);
    
        const response = await fetch("https://localhost:7270/api/Student", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            parentUserId,
            name: formName.trim(),
            grade: formGrade || "—",
            section: formSection || "—",
            status: "Active",
          }),
          signal: controller.signal,
        });
        window.clearTimeout(timeoutId);

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || `Request failed with status ${response.status}`);
        }

        setStudents((current) => [
          {
            id: data?.id ?? Date.now(),
            name: data?.name ?? formName.trim(),
            grade: (data?.grade ?? formGrade) || "—",
            section: (data?.section ?? formSection) || "—",
            parent: (selectedGuardian?.name ?? formParent) || "—",
            parentUserId,
            route,
            status: (data?.status as StudentRecord["status"]) || "Active",
            initials: getInitials(data?.name ?? formName.trim()),
          },
          ...current,
        ]);

        setSubmitMessage("Student created successfully.");
        setIsDrawerOpen(false);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          setSubmitError("The request timed out. Please try again.");
        } else {
          setSubmitError(error instanceof Error ? error.message : "Failed to create student.");
        }
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    if (editingId !== null) {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitMessage(null);

      const existingStatus = students.find((student) => student.id === editingId)?.status || "Active";
      const parentUserId = selectedGuardian
        ? selectedGuardian.userId
        : students.find((student) => student.id === editingId)?.parentUserId;

      if (!parentUserId) {
        setSubmitError("Please select a parent or guardian.");
        setIsSubmitting(false);
        return;
      }
      const route = formRoute || "Unassigned";

      try {
        await updateStudent(editingId, {
          parentUserId,
          name: formName.trim(),
          grade: formGrade || "—",
          section: formSection || "—",
          status: existingStatus,
        });

        setStudents((current) =>
          current.map((student) =>
            student.id === editingId
              ? {
                  ...student,
                  name: formName.trim(),
                  grade: formGrade || student.grade,
                  section: formSection || student.section,
                  parent: selectedGuardian?.name || formParent || student.parent,
                  parentUserId,
                  route,
                  initials: getInitials(formName),
                }
              : student
          )
        );

        setSubmitMessage("Student updated successfully.");
        setIsDrawerOpen(false);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "Failed to update student.");
      } finally {
        setIsSubmitting(false);
      }
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

              {submitMessage ? (
                <p className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                  {submitMessage}
                </p>
              ) : null}

              {submitError ? (
                <p className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700">
                  {submitError}
                </p>
              ) : null}

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
            {isLoading ? (
              <div className="rounded-[20px] border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                Loading students...
              </div>
            ) : loadError ? (
              <div className="rounded-[20px] border border-rose-200 bg-rose-50 p-8 text-center text-sm font-medium text-rose-700">
                {loadError}
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                No students found.
              </div>
            ) : (
              filteredStudents.map((student, index) => (
                <article
                  key={`${student.id}-${index}`}
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

                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Status
                      </label>
                      <select
                        value={student.status}
                        onChange={() => toggleStatus(student.id)}
                        disabled={statusUpdatingId === student.id}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#005691] focus:bg-white"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
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
                  </div>
                </article>
              ))
            )}
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

                <div className="relative">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Parent / Guardian</label>
                  <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus-within:border-[#005691] focus-within:bg-white">
                    <Search size={16} className="text-slate-400" />
                    <input
                      type="text"
                      value={formParent}
                      onChange={(event) => {
                        setFormParent(event.target.value);
                        setGuardianSearch(event.target.value);
                        if (selectedGuardian && event.target.value !== selectedGuardian.name) {
                          setSelectedGuardian(null);
                        }
                        setGuardianDropdownOpen(true);
                      }}
                      onFocus={() => setGuardianDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setGuardianDropdownOpen(false), 150)}
                      placeholder="Search by name"
                      className="w-full bg-transparent outline-none placeholder:text-slate-400"
                    />
                  </label>

                  {guardianDropdownOpen ? (
                    <div className="absolute left-0 right-0 z-10 mt-2 max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
                      {guardianLoading ? (
                        <div className="px-4 py-3 text-sm text-slate-500">Loading guardians...</div>
                      ) : guardianError ? (
                        <div className="px-4 py-3 text-sm text-rose-600">{guardianError}</div>
                      ) : filteredGuardians.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-slate-500">No approved guardians found.</div>
                      ) : (
                        filteredGuardians.map((guardian) => (
                          <button
                            key={guardian.userId}
                            type="button"
                            onMouseDown={() => {
                              setSelectedGuardian(guardian);
                              setFormParent(guardian.name);
                              setGuardianSearch(guardian.name);
                              setGuardianDropdownOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                          >
                            {guardian.name}
                          </button>
                        ))
                      )}
                    </div>
                  ) : null}
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

                {submitError ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                    {submitError}
                  </p>
                ) : null}

                {submitMessage && formMode === "add" ? (
                  <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                    {submitMessage}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-2xl bg-[#005691] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004a7a] disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isSubmitting
                    ? "Creating Student..."
                    : formMode === "add"
                      ? "Save Student Profile"
                      : "Update Student"}
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
