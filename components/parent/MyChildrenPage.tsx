"use client";

import { useEffect, useState } from "react";
import {
  Bus,
  CalendarOff,
  CheckCircle2,
  ChevronRight,
  Clock,
  Lock,
  Phone,
  Plus,
  Route as RouteIcon,
  UserCog,
  X,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AddGuardianDrawer } from "@/components/parent/AddGuardianDrawer";
import { getPlanById } from "@/lib/subscription/plans";
import {
  createStudent,
  getStudentById,
  getStudentsByParentId,
} from "@/services/studentService";
import { getUserByEmail } from "@/services/userService";
import type { Student } from "@/types/student";

type ChildStatus = "active" | "pending";
type GuardianStatus = "approved" | "pending";

interface ChildGuardian {
  name: string;
  relation: string;
  initials: string;
  status: GuardianStatus;
  primary?: boolean;
}

interface Child {
  id: string;
  name: string;
  grade: string;
  initials: string;
  accent: "blue" | "teal" | "slate";
  status: ChildStatus;
  routeLabel: string;
  routeAssigned: boolean;
  transport: {
    route: string;
    driver: string;
    pickup: string;
    dropoff: string;
  };
  guardians: ChildGuardian[];
}

function mapStudentToChild(student: Student, accent: Child["accent"]): Child {
  const status = student.status.toLowerCase() === "active" ? "active" : "pending";
  return {
    id: String(student.id),
    name: student.name,
    grade: student.grade || "Unassigned",
    initials: getInitials(student.name),
    accent,
    status,
    routeLabel: "No Route Assigned",
    routeAssigned: false,
    transport: {
      route: "Awaiting Assignment",
      driver: "Awaiting Assignment",
      pickup: "—",
      dropoff: "—",
    },
    guardians: [],
  };
}

const initialChildren: Child[] = [];

const accentClasses: Record<Child["accent"], string> = {
  blue: "bg-primary text-white",
  teal: "bg-secondary text-white",
  slate: "bg-surface-container-high text-on-surface-variant",
};

const accentCycle: Child["accent"][] = ["blue", "teal", "slate"];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function MyChildrenPage() {
  const { user } = useAuth();
  const subscription = user?.subscription;
  const plan = subscription ? getPlanById(subscription.planId) : undefined;
  const maxChildren = plan?.maxChildren ?? 0;

  const [children, setChildren] = useState<Child[]>(initialChildren);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addChildOpen, setAddChildOpen] = useState(false);
  const [guardianDrawerOpen, setGuardianDrawerOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formGrade, setFormGrade] = useState("");
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [childrenError, setChildrenError] = useState<string | null>(null);
  const [saveChildrenError, setSaveChildrenError] = useState<string | null>(null);
  const [isSavingChild, setIsSavingChild] = useState(false);
  const [resolvedParentId, setResolvedParentId] = useState<number | null>(null);

  const selected = children.find((child) => child.id === selectedId) ?? null;

  const canAddChild = Boolean(subscription) && children.length < maxChildren;
  const limitMessage = !subscription
    ? "Subscribe to a plan to add children."
    : children.length >= maxChildren
      ? `Your ${plan?.name} plan allows up to ${maxChildren} ${
          maxChildren === 1 ? "child" : "children"
        }. Upgrade to add more.`
      : "";

  useEffect(() => {
    if (!user?.email) return;

    let isMounted = true;
    const fetchParentAccount = async () => {
      setChildrenError(null);
      setLoadingChildren(true);

      try {
        const account = await getUserByEmail(user.email);
        if (!account?.id) {
          throw new Error("Unable to determine your account. Please refresh and try again.");
        }

        const role = String(account.role ?? "").trim().toLowerCase();
        if (role !== "parent") {
          throw new Error("Unable to determine your account. Please refresh and try again.");
        }

        if (isMounted) {
          setResolvedParentId(Number(account.id));
        }
      } catch (error) {
        if (isMounted) {
          setChildrenError(error instanceof Error ? error.message : "Unable to determine your account. Please refresh and try again.");
          setResolvedParentId(null);
        }
      } finally {
        if (isMounted) {
          setLoadingChildren(false);
        }
      }
    };

    void fetchParentAccount();
    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  useEffect(() => {
    if (!resolvedParentId) return;

    let isMounted = true;
    const fetchChildren = async () => {
      setLoadingChildren(true);
      setChildrenError(null);

      try {
        const students = await getStudentsByParentId(resolvedParentId);
        const mappedChildren = students.map((student, index) =>
          mapStudentToChild(student, accentCycle[index % accentCycle.length])
        );
        if (isMounted) {
          setChildren(mappedChildren);
          setSelectedId(mappedChildren[0]?.id ?? null);
        }
      } catch (error) {
        if (isMounted) {
          setChildrenError(error instanceof Error ? error.message : "Unable to load children.");
        }
      } finally {
        if (isMounted) {
          setLoadingChildren(false);
        }
      }
    };

    void fetchChildren();
    return () => {
      isMounted = false;
    };
  }, [resolvedParentId]);

  async function handleAddChild() {
    const name = formName.trim();
    if (!name || !resolvedParentId) return;

    setIsSavingChild(true);
    setSaveChildrenError(null);

    try {
      const payload = {
        parentUserId: resolvedParentId,
        name,
        grade: formGrade.trim() || "Unassigned",
        section: formGrade.trim() || "Unassigned",
        status: "Pending",
      };
      const createdStudent = await createStudent(payload);
      const newChild = mapStudentToChild(createdStudent, accentCycle[children.length % accentCycle.length]);
      setChildren((prev) => [...prev, newChild]);
      setSelectedId(newChild.id);
      setFormName("");
      setFormGrade("");
      setAddChildOpen(false);
    } catch (error) {
      setSaveChildrenError(error instanceof Error ? error.message : "Unable to add child.");
    } finally {
      setIsSavingChild(false);
    }
  }

  async function handleSelectChild(childId: string) {
    setSelectedId(childId);
    if (!user?.id) return;

    try {
      const student = await getStudentById(Number(childId));
      setChildren((current) =>
        current.map((child) =>
          child.id === childId
            ? {
                ...child,
                ...mapStudentToChild(student, child.accent),
              }
            : child
        )
      );
    } catch {
      // keep current child data if detail fetch fails
    }
  }

  async function handleSaveGuardian(data: {
    name: string;
    relation: string;
    phone: string;
    note?: string;
  }) {
    // Guardian save is not implemented yet.
    return Promise.resolve();
  }

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-[32px] md:leading-10">
            My Children
          </h1>
          <p className="mt-1 font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
            Manage transport details and guardians for your students.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-1.5 sm:items-end">
          <button
            type="button"
            onClick={() => setAddChildOpen(true)}
            disabled={!canAddChild}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-container disabled:pointer-events-none disabled:opacity-50"
          >
            {canAddChild ? <Plus size={18} /> : <Lock size={16} />}
            Add Child
          </button>
          {limitMessage ? (
            <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-tertiary">
              {limitMessage}
            </p>
          ) : (
            <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
              {children.length} of {maxChildren} children used
            </p>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <section className="flex flex-col gap-4">
          {loadingChildren ? (
            <div className="rounded-2xl border border-border bg-surface p-6 text-center text-sm font-medium text-on-surface-variant">
              Loading children...
            </div>
          ) : childrenError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-700">
              {childrenError}
            </div>
          ) : (
            <>
              {children.map((child) => {
                const isSelected = child.id === selected?.id;
                return (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => setSelectedId(child.id)}
                    className={`flex items-center gap-4 rounded-2xl border bg-surface p-4 text-left shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] ${
                      isSelected ? "border-primary ring-1 ring-primary" : "border-border"
                    }`}
                  >
                    <span
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-base font-bold ${accentClasses[child.accent]}`}
                    >
                      {child.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate text-base font-bold text-foreground">{child.name}</h3>
                        {child.status === "active" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-2.5 py-1 text-xs font-semibold text-on-secondary-container">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-fixed px-2.5 py-1 text-xs font-semibold text-tertiary">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                        {child.grade}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
                        {child.routeAssigned ? (
                          <Bus size={14} className="text-primary" />
                        ) : (
                          <Clock size={14} className="text-tertiary" />
                        )}
                        <span>{child.routeLabel}</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="shrink-0 text-muted" />
                  </button>
                );
              })}
            </>
          )}
        </section>

        {selected ? (
          <aside className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-4">
            <span
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${accentClasses[selected.accent]}`}
            >
              {selected.initials}
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">{selected.name}</h2>
              <p className="font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
                {selected.grade}
              </p>
            </div>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <RouteIcon size={16} className="text-primary" />
              Transport Information
            </h3>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-surface-bright p-3">
                <dt className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                  Assigned Route
                </dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">
                  {selected.transport.route}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-bright p-3">
                <dt className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                  Assigned Driver
                </dt>
                <dd className="mt-1 flex items-center gap-1 text-sm font-semibold text-foreground">
                  {selected.transport.driver}
                  {selected.routeAssigned ? (
                    <CheckCircle2 size={14} className="text-secondary" />
                  ) : null}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-bright p-3">
                <dt className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                  Pickup Time
                </dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">
                  {selected.transport.pickup}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-bright p-3">
                <dt className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                  Drop-off Time
                </dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">
                  {selected.transport.dropoff}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <UserCog size={16} className="text-primary" />
                Authorized Guardians
              </h3>
              <button
                type="button"
                onClick={() => setGuardianDrawerOpen(true)}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-secondary transition hover:bg-surface-container-low"
              >
                <Plus size={14} />
                Add
              </button>
            </div>
            {selected.guardians.length === 0 ? (
              <p className="mt-3 rounded-xl bg-surface-bright p-4 font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                No guardians added yet. Add a guardian to authorize pickups.
              </p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {selected.guardians.map((guardian) => (
                  <li
                    key={guardian.name}
                    className="flex items-center gap-3 rounded-xl bg-surface-bright p-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-xs font-bold text-primary">
                      {guardian.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {guardian.name}
                        </p>
                        {guardian.status === "approved" ? (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-on-secondary-container">
                            <CheckCircle2 size={11} />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-tertiary-fixed px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-tertiary">
                            <Clock size={11} />
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                        {guardian.relation}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-secondary transition hover:bg-surface-container-high"
                      aria-label={`Call ${guardian.name}`}
                    >
                      <Phone size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-tertiary-fixed bg-tertiary-fixed/40 py-2.5 text-sm font-semibold text-tertiary transition hover:bg-tertiary-fixed/60"
          >
            <CalendarOff size={16} />
            Report Absence for Today
          </button>
        </aside>
      ) : null}
      </div>

      {addChildOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setAddChildOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md rounded-2xl bg-surface shadow-xl">
            <header className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold text-foreground">Add Child</h2>
              <button
                type="button"
                onClick={() => setAddChildOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface-container-low"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </header>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddChild();
              }}
              className="flex flex-col gap-5 px-6 py-6"
            >
              <div>
                <label className="font-[family-name:var(--font-inter)] text-sm font-semibold text-foreground">
                  Child&apos;s Full Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter child's full name"
                  className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>

              <div>
                <label className="font-[family-name:var(--font-inter)] text-sm font-semibold text-foreground">
                  Grade / Class
                </label>
                <input
                  type="text"
                  value={formGrade}
                  onChange={(e) => setFormGrade(e.target.value)}
                  placeholder="e.g. Grade 4-B"
                  className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-start gap-2 rounded-xl bg-surface-bright p-3">
                <Clock size={16} className="mt-0.5 shrink-0 text-muted" />
                <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                  New children start as Pending until a route is assigned by the
                  admin.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddChildOpen(false)}
                  className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formName.trim()}
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-container disabled:pointer-events-none disabled:opacity-50"
                >
                  Add Child
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <AddGuardianDrawer
        open={guardianDrawerOpen}
        onClose={() => setGuardianDrawerOpen(false)}
        onSave={handleSaveGuardian}
      />
    </div>
  );
}
