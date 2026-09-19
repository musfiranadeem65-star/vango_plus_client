"use client";
console.log("🔥🔥🔥 MY CHILDREN PAGE FILE IS RUNNING 🔥🔥🔥");
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
import { getActiveParentSubscription } from "@/lib/auth/types";
import { getPlanById } from "@/lib/subscription/plans";

import {
  createStudent,
  getStudentById,
  getStudentsByParentId,
  getStudentRouteAssignments,
  getRouteDetails,
  getDriverDetails,
  getStudentGuardians,
} from "@/services/studentService";

import type { Student } from "@/types/student";

type ChildStatus = "active" | "pending" | "inactive";

type GuardianStatus = "approved" | "pending";

interface ChildGuardian {
  id: number;
  name: string;
  relation: string;
  phone: string;
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

  loadingTransport?: boolean;
  loadingGuardians?: boolean;
}

function formatTime(timeString?: string | null): string {
  if (!timeString || timeString === "—") {
    return "—";
  }

  const value = String(timeString).trim();

  const amPmMatch = value.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
  );

  if (amPmMatch) {
    const hours = Number(amPmMatch[1]);
    const minutes = amPmMatch[2];
    const period = amPmMatch[3].toUpperCase();

    return `${String(hours).padStart(2, "0")}:${minutes} ${period}`;
  }

  const timeMatch = value.match(/(\d{1,2}):(\d{2})/);

  if (!timeMatch) {
    return value;
  }

  let hours = Number(timeMatch[1]);
  const minutes = timeMatch[2];

  if (!Number.isFinite(hours)) {
    return "—";
  }

  const period = hours >= 12 ? "PM" : "AM";

  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }

  return `${String(hours).padStart(2, "0")}:${minutes} ${period}`;
}

function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (
    parts[0][0] + parts[parts.length - 1][0]
  ).toUpperCase();
}

function mapStudentToChild(
  student: Student,
  accent: Child["accent"]
): Child {
  const normalizedStatus = String(
    student.status ?? ""
  )
    .trim()
    .toLowerCase();

  const status: ChildStatus =
    normalizedStatus === "active"
      ? "active"
      : normalizedStatus === "inactive"
        ? "inactive"
        : "pending";

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

const accentClasses: Record<
  Child["accent"],
  string
> = {
  blue: "bg-primary text-white",
  teal: "bg-secondary text-white",
  slate:
    "bg-surface-container-high text-on-surface-variant",
};

const accentCycle: Child["accent"][] = [
  "blue",
  "teal",
  "slate",
];

export default function MyChildrenPage() {
  const { user } = useAuth();

  const subscription =
    getActiveParentSubscription(user);

  const plan = subscription
    ? getPlanById(subscription.planId)
    : undefined;

  const maxChildren = plan?.maxChildren ?? 0;

  const [children, setChildren] = useState<Child[]>(
    []
  );

  const [selectedId, setSelectedId] = useState<
    string | null
  >(null);

  const [addChildOpen, setAddChildOpen] =
    useState(false);

  const [guardianDrawerOpen, setGuardianDrawerOpen] =
    useState(false);

  const [formName, setFormName] = useState("");

  const [formGrade, setFormGrade] = useState("");

  const [loadingChildren, setLoadingChildren] =
    useState(true);

  const [childrenError, setChildrenError] =
    useState<string | null>(null);

  const [saveChildrenError, setSaveChildrenError] =
    useState<string | null>(null);

  const [isSavingChild, setIsSavingChild] =
    useState(false);

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "pending" | "inactive"
  >("all");

  const [transportError, setTransportError] =
    useState<string | null>(null);

  const [guardiansError, setGuardiansError] =
    useState<string | null>(null);

  const [absenceMessage, setAbsenceMessage] =
    useState<string | null>(null);

  const selected =
    children.find(
      (child) => child.id === selectedId
    ) ?? null;

  const filteredChildren =
    statusFilter === "all"
      ? children
      : children.filter(
          (child) =>
            child.status === statusFilter
        );

  const canAddChild =
    Boolean(subscription) &&
    children.length < maxChildren;

  const limitMessage = !subscription
    ? "Subscribe to a plan to add children."
    : children.length >= maxChildren
      ? `Your ${plan?.name} plan allows up to ${maxChildren} ${
          maxChildren === 1
            ? "child"
            : "children"
        }. Upgrade to add more.`
      : "";

  /*
   * -------------------------------------------------------
   * LOAD TRANSPORT DETAILS
   * -------------------------------------------------------
   */

  async function loadTransportDetails(
    studentId: number
  ) {
    console.log(
      "[MyChildrenPage] Loading transport for student:",
      studentId
    );

    setTransportError(null);

    setChildren((current) =>
      current.map((child) =>
        child.id === String(studentId)
          ? {
              ...child,
              loadingTransport: true,
            }
          : child
      )
    );

    try {
      console.log(
        "[MyChildrenPage] Calling getStudentRouteAssignments()"
      );

      const assignments =
        await getStudentRouteAssignments();

      console.log(
        "[MyChildrenPage] Route assignments:",
        assignments
      );

      const assignment = assignments.find(
        (item) =>
          Number(item.studentId) ===
          Number(studentId)
      );

      console.log(
        "[MyChildrenPage] Matching assignment:",
        assignment
      );

      if (!assignment) {
        setChildren((current) =>
          current.map((child) =>
            child.id === String(studentId)
              ? {
                  ...child,
                  transport: {
                    route:
                      "Awaiting Assignment",
                    driver:
                      "Awaiting Assignment",
                    pickup: "—",
                    dropoff: "—",
                  },
                  routeLabel:
                    "No Route Assigned",
                  routeAssigned: false,
                  loadingTransport: false,
                }
              : child
          )
        );

        return;
      }

      const assignmentStatus = String(
        assignment.status ?? ""
      )
        .trim()
        .toLowerCase();

      if (
        assignmentStatus &&
        assignmentStatus !== "active"
      ) {
        setChildren((current) =>
          current.map((child) =>
            child.id === String(studentId)
              ? {
                  ...child,
                  transport: {
                    route:
                      "Awaiting Assignment",
                    driver:
                      "Awaiting Assignment",
                    pickup: formatTime(
                      assignment.pickupTime
                    ),
                    dropoff: formatTime(
                      assignment.dropoffTime
                    ),
                  },
                  routeLabel:
                    "No Route Assigned",
                  routeAssigned: false,
                  loadingTransport: false,
                }
              : child
          )
        );

        return;
      }

      const routeId = Number(
        assignment.routeId
      );

      if (
        !Number.isFinite(routeId) ||
        routeId <= 0
      ) {
        throw new Error(
          "Route assignment was found, but route ID is invalid."
        );
      }

      console.log(
        "[MyChildrenPage] Calling getRouteDetails():",
        routeId
      );

      const routeDetails =
        await getRouteDetails(routeId);

      console.log(
        "[MyChildrenPage] Route details:",
        routeDetails
      );

      const routeName =
        String(routeDetails.name ?? "").trim() ||
        "Assigned Route";

      let driverName =
        "Awaiting Assignment";

      const rawDriverId = routeDetails.driverId;

      const driverId =
      rawDriverId === null || rawDriverId === undefined
       ? null
       : Number(rawDriverId);

      if (
        driverId !== null &&
        Number.isFinite(driverId) &&
        driverId > 0
      ) {
        console.log(
          "[MyChildrenPage] Calling getDriverDetails():",
          driverId
        );

        const driverDetails =
          await getDriverDetails(driverId);

        console.log(
          "[MyChildrenPage] Driver details:",
          driverDetails
        );

        driverName =
          String(
            driverDetails.name ?? ""
          ).trim() || "Assigned Driver";
      }

      setChildren((current) =>
        current.map((child) =>
          child.id === String(studentId)
            ? {
                ...child,

                transport: {
                  route: routeName,
                  driver: driverName,
                  pickup: formatTime(
                    assignment.pickupTime
                  ),
                  dropoff: formatTime(
                    assignment.dropoffTime
                  ),
                },

                routeLabel: routeName,
                routeAssigned: true,
                loadingTransport: false,
              }
            : child
        )
      );

      console.log(
        "[MyChildrenPage] Transport details successfully applied."
      );
    } catch (error) {
      console.error(
        "[MyChildrenPage] Transport API error:",
        error
      );

      setTransportError(
        error instanceof Error
          ? error.message
          : "Unable to load transport details."
      );

      setChildren((current) =>
        current.map((child) =>
          child.id === String(studentId)
            ? {
                ...child,
                loadingTransport: false,
              }
            : child
        )
      );
    }
  }

  /*
   * -------------------------------------------------------
   * LOAD GUARDIANS
   * -------------------------------------------------------
   */

  async function loadGuardians(
    studentId: number
  ) {
    console.log(
      "[MyChildrenPage] Loading guardians for student:",
      studentId
    );

    setGuardiansError(null);

    setChildren((current) =>
      current.map((child) =>
        child.id === String(studentId)
          ? {
              ...child,
              loadingGuardians: true,
            }
          : child
      )
    );

    try {
      const guardiansList =
        await getStudentGuardians(studentId);

      console.log(
        "[MyChildrenPage] Guardians response:",
        guardiansList
      );

      const mappedGuardians: ChildGuardian[] =
        guardiansList.map((guardian) => ({
          id: Number(guardian.id),

          name:
            String(
              guardian.name ?? ""
            ).trim() || "Guardian",

          relation:
            String(
              guardian.relation ?? ""
            ).trim() || "Guardian",

          phone:
            String(
              guardian.phone ?? ""
            ).trim(),

          status:
            String(
              guardian.status ?? ""
            )
              .trim()
              .toLowerCase() ===
            "approved"
              ? "approved"
              : "pending",
        }));

      setChildren((current) =>
        current.map((child) =>
          child.id === String(studentId)
            ? {
                ...child,
                guardians:
                  mappedGuardians,
                loadingGuardians: false,
              }
            : child
        )
      );
    } catch (error) {
      console.error(
        "[MyChildrenPage] Guardian API error:",
        error
      );

      setGuardiansError(
        error instanceof Error
          ? error.message
          : "Unable to load guardians."
      );

      setChildren((current) =>
        current.map((child) =>
          child.id === String(studentId)
            ? {
                ...child,
                guardians: [],
                loadingGuardians: false,
              }
            : child
        )
      );
    }
  }

  /*
   * -------------------------------------------------------
   * INITIAL CHILDREN LOAD
   * -------------------------------------------------------
   *
   * IMPORTANT:
   * First we load children.
   * Then we only set selectedId.
   *
   * Transport and guardians are NOT loaded here.
   * They are loaded by the selectedId useEffect below.
   */

  useEffect(() => {
    const rawParentUserId = user?.id;

    const parentUserId =
      Number(rawParentUserId);

    console.log(
      "[MyChildrenPage] Auth user:",
      user
    );

    console.log(
      "[MyChildrenPage] parentUserId:",
      parentUserId,
      "raw:",
      rawParentUserId,
      "raw type:",
      typeof rawParentUserId
    );

    if (
      !Number.isFinite(parentUserId) ||
      parentUserId <= 0
    ) {
      console.error(
        "[MyChildrenPage] Invalid parentUserId:",
        rawParentUserId
      );

      setChildrenError(
        "Unable to identify the logged-in parent."
      );

      setLoadingChildren(false);

      return;
    }

    let active = true;

    async function fetchChildren() {
      setLoadingChildren(true);
      setChildrenError(null);

      try {
        console.log(
          "[MyChildrenPage] Calling getStudentsByParentId:",
          parentUserId
        );

        const students =
          await getStudentsByParentId(
            parentUserId
          );

        console.log(
          "[MyChildrenPage] Students received:",
          students
        );

        if (!active) {
          return;
        }

        const mappedChildren =
          students.map(
            (student, index) =>
              mapStudentToChild(
                student,
                accentCycle[
                  index %
                    accentCycle.length
                ]
              )
          );

        console.log(
          "[MyChildrenPage] Mapped children:",
          mappedChildren
        );

        console.log(
          "[MyChildrenPage] Mapped children length:",
          mappedChildren.length
        );

        console.log(
          "[MyChildrenPage] About to set children..."
        );

        /*
         * Set children first.
         */
        setChildren(mappedChildren);

        console.log(
          "[MyChildrenPage] Children state set. Now getting first child..."
        );

        /*
         * Select first child.
         *
         * Transport and guardian APIs will be
         * triggered by the selectedId useEffect.
         */
        const firstChild =
          mappedChildren[0];

        console.log(
          "[MyChildrenPage] FIRST CHILD OBJECT:",
          firstChild
        );

        const firstChildId =
          firstChild?.id ?? null;

        console.log(
          "[MyChildrenPage] FIRST CHILD ID BEING SET:",
          firstChildId
        );

        setSelectedId(firstChildId);

        console.log(
          "[MyChildrenPage] setSelectedId called with:",
          firstChildId
        );
      } catch (error) {
        console.error(
          "[MyChildrenPage] Failed to load children:",
          error
        );

        if (active) {
          setChildrenError(
            error instanceof Error
              ? error.message
              : "Unable to load children."
          );
        }
      } finally {
        if (active) {
          setLoadingChildren(false);
        }
      }
    }

    void fetchChildren();

    return () => {
      active = false;
    };
  }, [user?.id]);

  /*
   * -------------------------------------------------------
   * LOAD SELECTED CHILD DETAILS
   * -------------------------------------------------------
   *
   * IMPORTANT FIX:
   *
   * This runs AFTER selectedId changes and React has
   * the children state available.
   *
   * So transport and guardians can safely update
   * the correct child.
   */

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    const studentId =
      Number(selectedId);

    if (
      !Number.isFinite(studentId) ||
      studentId <= 0
    ) {
      console.error(
        "[MyChildrenPage] Invalid selected student ID:",
        selectedId
      );

      return;
    }

    console.log(
      "[MyChildrenPage] Loading details for selected student:",
      studentId
    );

    void Promise.all([
      loadTransportDetails(studentId),
      loadGuardians(studentId),
    ]);
  }, [selectedId]);

  /*
   * -------------------------------------------------------
   * ADD CHILD
   * -------------------------------------------------------
   */

  async function handleAddChild() {
    const name = formName.trim();

    const parentUserId =
      Number(user?.id);

    if (!name) {
      setSaveChildrenError(
        "Child name is required."
      );

      return;
    }

    if (
      !Number.isFinite(parentUserId) ||
      parentUserId <= 0
    ) {
      setSaveChildrenError(
        "Unable to identify the logged-in parent."
      );

      return;
    }

    setIsSavingChild(true);
    setSaveChildrenError(null);

    try {
      const payload = {
        parentUserId,
        name,
        grade:
          formGrade.trim() ||
          "Unassigned",
        section:
          formGrade.trim() ||
          "Unassigned",
        status: "Pending",
      };

      console.log(
        "[MyChildrenPage] Creating child:",
        payload
      );

      const createdStudent =
        await createStudent(payload);

      console.log(
        "[MyChildrenPage] Created student:",
        createdStudent
      );

      const newChild =
        mapStudentToChild(
          createdStudent,
          accentCycle[
            children.length %
              accentCycle.length
          ]
        );

      setChildren((prev) => [
        ...prev,
        newChild,
      ]);

      /*
       * Selecting the new child will automatically
       * trigger the selectedId useEffect.
       */
      setSelectedId(newChild.id);

      setFormName("");
      setFormGrade("");
      setAddChildOpen(false);
    } catch (error) {
      console.error(
        "[MyChildrenPage] Add child error:",
        error
      );

      setSaveChildrenError(
        error instanceof Error
          ? error.message
          : "Unable to add child."
      );
    } finally {
      setIsSavingChild(false);
    }
  }

  /*
   * -------------------------------------------------------
   * SELECT CHILD
   * -------------------------------------------------------
   */

  async function handleSelectChild(
    childId: string
  ) {
    console.log(
      "[MyChildrenPage] Child selected:",
      childId
    );

    const studentId =
      Number(childId);

    if (
      !Number.isFinite(studentId) ||
      studentId <= 0
    ) {
      console.error(
        "[MyChildrenPage] Invalid student ID:",
        childId
      );

      return;
    }

    /*
     * Changing selectedId will automatically load
     * transport and guardian information.
     */
    setSelectedId(childId);

    setTransportError(null);
    setGuardiansError(null);

    try {
      console.log(
        "[MyChildrenPage] Calling getStudentById:",
        studentId
      );

      const student =
        await getStudentById(studentId);

      console.log(
        "[MyChildrenPage] Student detail:",
        student
      );

      setChildren((current) =>
        current.map((child) =>
          child.id === childId
            ? {
                ...child,

                name:
                  student.name ||
                  child.name,

                grade:
                  student.grade ||
                  child.grade,

                initials:
                  getInitials(
                    student.name ||
                      child.name
                  ),
              }
            : child
        )
      );
    } catch (error) {
      console.error(
        "[MyChildrenPage] getStudentById failed:",
        error
      );
    }
  }

  /*
   * -------------------------------------------------------
   * GUARDIAN SAVE
   * -------------------------------------------------------
   */

  async function handleSaveGuardian(data: {
    name: string;
    relation: string;
    phone: string;
    note?: string;
  }) {
    if (!selected) {
      throw new Error(
        "Please select a child first."
      );
    }

    console.log(
      "[MyChildrenPage] Guardian data received:",
      data
    );

    console.warn(
      "[MyChildrenPage] Guardian POST API is not available in the supplied studentService.ts."
    );

    setGuardianDrawerOpen(false);

    await loadGuardians(
      Number(selected.id)
    );
  }

  /*
   * -------------------------------------------------------
   * ABSENCE
   * -------------------------------------------------------
   */

  async function handleReportAbsence() {
    if (!selected) {
      return;
    }

    setAbsenceMessage(null);

    console.warn(
      "[MyChildrenPage] Absence API is not available in the supplied services."
    );

    setAbsenceMessage(
      "Absence reporting API is not connected yet."
    );
  }

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      {/* HEADER */}

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
            onClick={() => {
              setSaveChildrenError(null);
              setAddChildOpen(true);
            }}
            disabled={!canAddChild}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-container disabled:pointer-events-none disabled:opacity-50"
          >
            {canAddChild ? (
              <Plus size={18} />
            ) : (
              <Lock size={16} />
            )}

            Add Child
          </button>

          {limitMessage ? (
            <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-tertiary">
              {limitMessage}
            </p>
          ) : (
            <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
              {children.length} of{" "}
              {maxChildren} children used
            </p>
          )}
        </div>
      </section>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        {/* CHILDREN LIST */}

        <section className="flex flex-col gap-4">
          {loadingChildren ? (
            <div className="rounded-2xl border border-border bg-surface p-6 text-center text-sm font-medium text-on-surface-variant">
              Loading children...
            </div>
          ) : childrenError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-700">
              {childrenError}
            </div>
          ) : children.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-6 text-center text-sm font-medium text-on-surface-variant">
              No children found.
            </div>
          ) : (
            <>
              {/* FILTERS */}

              <div className="flex items-center gap-2">
                {(
                  [
                    "all",
                    "active",
                    "pending",
                    "inactive",
                  ] as const
                ).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() =>
                      setStatusFilter(
                        filter
                      )
                    }
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                      statusFilter ===
                      filter
                        ? "bg-primary text-white"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* CHILD CARDS */}

              {filteredChildren.map(
                (child) => {
                  const isSelected =
                    child.id ===
                    selected?.id;

                  return (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() =>
                        void handleSelectChild(
                          child.id
                        )
                      }
                      className={`flex items-center gap-4 rounded-2xl border bg-surface p-4 text-left shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] ${
                        isSelected
                          ? "border-primary ring-1 ring-primary"
                          : "border-border"
                      }`}
                    >
                      <span
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-base font-bold ${
                          accentClasses[
                            child.accent
                          ]
                        }`}
                      >
                        {child.initials}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="truncate text-base font-bold text-foreground">
                            {child.name}
                          </h3>

                          {child.status ===
                          "active" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-2.5 py-1 text-xs font-semibold text-on-secondary-container">
                              Active
                            </span>
                          ) : child.status ===
                            "inactive" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
                              Inactive
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
                            <Bus
                              size={14}
                              className="text-primary"
                            />
                          ) : (
                            <Clock
                              size={14}
                              className="text-tertiary"
                            />
                          )}

                          <span>
                            {child.routeLabel}
                          </span>
                        </div>
                      </div>

                      <ChevronRight
                        size={18}
                        className="shrink-0 text-muted"
                      />
                    </button>
                  );
                }
              )}
            </>
          )}
        </section>

        {/* RIGHT SIDE DETAILS */}

        {selected ? (
          <aside className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            {/* STUDENT HEADER */}

            <div className="flex items-center gap-4">
              <span
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
                  accentClasses[
                    selected.accent
                  ]
                }`}
              >
                {selected.initials}
              </span>

              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {selected.name}
                </h2>

                <p className="font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
                  {selected.grade}
                </p>
              </div>
            </div>

            {/* TRANSPORT */}

            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <RouteIcon
                  size={16}
                  className="text-primary"
                />

                Transport Information
              </h3>

              {selected.loadingTransport ? (
                <div className="mt-3 rounded-xl bg-surface-bright p-4 text-center font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                  Loading transport details...
                </div>
              ) : transportError ? (
                <div className="mt-3 rounded-xl bg-red-50 p-4 font-[family-name:var(--font-inter)] text-xs font-medium text-red-700">
                  {transportError}
                </div>
              ) : (
                <dl className="mt-3 grid grid-cols-2 gap-3">
                  {/* ROUTE */}

                  <div className="rounded-xl bg-surface-bright p-3">
                    <dt className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                      Assigned Route
                    </dt>

                    <dd className="mt-1 text-sm font-semibold text-foreground">
                      {
                        selected
                          .transport
                          .route
                      }
                    </dd>
                  </div>

                  {/* DRIVER */}

                  <div className="rounded-xl bg-surface-bright p-3">
                    <dt className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                      Assigned Driver
                    </dt>

                    <dd className="mt-1 flex items-center gap-1 text-sm font-semibold text-foreground">
                      {
                        selected
                          .transport
                          .driver
                      }

                      {selected.routeAssigned ? (
                        <CheckCircle2
                          size={14}
                          className="text-secondary"
                        />
                      ) : null}
                    </dd>
                  </div>

                  {/* PICKUP */}

                  <div className="rounded-xl bg-surface-bright p-3">
                    <dt className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                      Pickup Time
                    </dt>

                    <dd className="mt-1 text-sm font-semibold text-foreground">
                      {
                        selected
                          .transport
                          .pickup
                      }
                    </dd>
                  </div>

                  {/* DROPOFF */}

                  <div className="rounded-xl bg-surface-bright p-3">
                    <dt className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                      Drop-off Time
                    </dt>

                    <dd className="mt-1 text-sm font-semibold text-foreground">
                      {
                        selected
                          .transport
                          .dropoff
                      }
                    </dd>
                  </div>
                </dl>
              )}
            </div>

            {/* GUARDIANS */}

            <div>
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <UserCog
                    size={16}
                    className="text-primary"
                  />

                  Authorized Guardians
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setGuardianDrawerOpen(
                      true
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-secondary transition hover:bg-surface-container-low"
                >
                  <Plus size={14} />

                  Add
                </button>
              </div>

              {selected.loadingGuardians ? (
                <p className="mt-3 rounded-xl bg-surface-bright p-4 font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                  Loading guardians...
                </p>
              ) : guardiansError ? (
                <p className="mt-3 rounded-xl bg-red-50 p-4 font-[family-name:var(--font-inter)] text-xs font-medium text-red-700">
                  {guardiansError}
                </p>
              ) : selected.guardians
                  .length === 0 ? (
                <p className="mt-3 rounded-xl bg-surface-bright p-4 font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                  No guardians added yet.
                  Add a guardian to
                  authorize pickups.
                </p>
              ) : (
                <ul className="mt-3 flex flex-col gap-2">
                  {selected.guardians.map(
                    (guardian) => {
                      const initials =
                        getInitials(
                          guardian.name
                        );

                      return (
                        <li
                          key={guardian.id}
                          className="flex items-center gap-3 rounded-xl bg-surface-bright p-3"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-xs font-bold text-primary">
                            {initials}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {
                                  guardian.name
                                }
                              </p>

                              {guardian.status ===
                              "approved" ? (
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-on-secondary-container">
                                  <CheckCircle2
                                    size={11}
                                  />

                                  Approved
                                </span>
                              ) : (
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-tertiary-fixed px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-tertiary">
                                  <Clock
                                    size={11}
                                  />

                                  Pending
                                </span>
                              )}
                            </div>

                            <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                              {
                                guardian.relation
                              }
                            </p>
                          </div>

                          {guardian.phone ? (
                            <a
                              href={`tel:${guardian.phone}`}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-secondary transition hover:bg-surface-container-high"
                              aria-label={`Call ${guardian.name}`}
                            >
                              <Phone size={15} />
                            </a>
                          ) : null}
                        </li>
                      );
                    }
                  )}
                </ul>
              )}
            </div>

            {/* ABSENCE */}

            <div>
              <button
                type="button"
                onClick={() =>
                  void handleReportAbsence()
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-tertiary-fixed bg-tertiary-fixed/40 py-2.5 text-sm font-semibold text-tertiary transition hover:bg-tertiary-fixed/60"
              >
                <CalendarOff size={16} />

                Report Absence for Today
              </button>

              {absenceMessage ? (
                <p className="mt-2 text-center text-xs font-medium text-tertiary">
                  {absenceMessage}
                </p>
              ) : null}
            </div>
          </aside>
        ) : null}
      </div>

      {/* ADD CHILD MODAL */}

      {addChildOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            onClick={() =>
              setAddChildOpen(false)
            }
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md rounded-2xl bg-surface shadow-xl">
            <header className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold text-foreground">
                Add Child
              </h2>

              <button
                type="button"
                onClick={() =>
                  setAddChildOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface-container-low"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </header>

            <form
              onSubmit={(event) => {
                event.preventDefault();

                void handleAddChild();
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
                  onChange={(event) =>
                    setFormName(
                      event.target.value
                    )
                  }
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
                  onChange={(event) =>
                    setFormGrade(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Grade 4-B"
                  className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {saveChildrenError ? (
                <p className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
                  {saveChildrenError}
                </p>
              ) : null}

              <div className="flex items-start gap-2 rounded-xl bg-surface-bright p-3">
                <Clock
                  size={16}
                  className="mt-0.5 shrink-0 text-muted"
                />

                <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                  New children start as
                  Pending until a route is
                  assigned by the admin.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setAddChildOpen(false)
                  }
                  className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface-container-low"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    !formName.trim() ||
                    isSavingChild
                  }
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-container disabled:pointer-events-none disabled:opacity-50"
                >
                  {isSavingChild
                    ? "Adding..."
                    : "Add Child"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* GUARDIAN DRAWER */}

      <AddGuardianDrawer
        open={guardianDrawerOpen}
        onClose={() =>
          setGuardianDrawerOpen(false)
        }
        onSave={handleSaveGuardian}
      />
    </div>
  );
}