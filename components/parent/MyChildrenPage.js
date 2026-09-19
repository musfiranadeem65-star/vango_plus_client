"use client";

console.log("🔥🔥🔥 MY CHILDREN PAGE JS IS RUNNING 🔥🔥🔥");

import React, { useEffect, useState } from "react";
import {
  Plus,
  Lock,
  Bus,
  Clock,
  ChevronRight,
  Route as RouteIcon,
  CheckCircle2,
  UserCog,
  X,
  Phone,
  CalendarOff,
} from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import { AddGuardianDrawer } from "@/components/parent/AddGuardianDrawer";
import { getPlanById } from "@/lib/subscription/plans";

import {
  getStudentsByParentId,
  getStudentById,
  createStudent,
  getStudentRouteAssignments,
  getRouteDetails,
  getDriverDetails,
} from "@/services/studentService";

const initialChildren = [];

const accentClasses = {
  blue: "bg-primary text-white",
  teal: "bg-secondary text-white",
  slate: "bg-surface-container-high text-on-surface-variant",
};

const accentCycle = ["blue", "teal", "slate"];

function getInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "?";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (
    String(parts[0][0] || "") + String(parts[parts.length - 1][0] || "")
  ).toUpperCase();
}

/* ---------------------------------------------------------
   Convert backend student into UI child
--------------------------------------------------------- */
function mapStudentToChild(student, accent) {
  const status =
    String(student?.status || "").toLowerCase() === "active"
      ? "active"
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

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */
function getValue(object, ...keys) {
  if (!object || typeof object !== "object") return undefined;

  for (const key of keys) {
    if (
      object[key] !== undefined &&
      object[key] !== null &&
      object[key] !== ""
    ) {
      return object[key];
    }
  }

  return undefined;
}

function formatTime(value) {
  if (!value) return "—";

  const text = String(value).trim();

  if (!text) return "—";

  /*
    Handles:
    07:30
    07:30:00
    2026-09-17T07:30:00
  */
  const match = text.match(/(?:T|\s)(\d{1,2}:\d{2})(?::\d{2})?/);

  if (match) {
    return match[1];
  }

  if (/^\d{1,2}:\d{2}(?::\d{2})?$/.test(text)) {
    return text.substring(0, 5);
  }

  return text;
}

/* ---------------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------------- */
export default function MyChildrenPage() {
  const { user } = useAuth();

  const subscription = user?.subscription;
  const plan = subscription
    ? getPlanById(subscription.planId)
    : undefined;

  const maxChildren = plan?.maxChildren ?? 0;

  const [children, setChildren] = useState(initialChildren);
  const [selectedId, setSelectedId] = useState(null);

  const [addChildOpen, setAddChildOpen] = useState(false);
  const [guardianDrawerOpen, setGuardianDrawerOpen] = useState(false);

  const [formName, setFormName] = useState("");
  const [formGrade, setFormGrade] = useState("");

  const [loadingChildren, setLoadingChildren] = useState(true);
  const [childrenError, setChildrenError] = useState(null);

  const [saveChildrenError, setSaveChildrenError] = useState(null);
  const [isSavingChild, setIsSavingChild] = useState(false);

  const [transportLoading, setTransportLoading] = useState(false);

  const selected =
    children.find((child) => child.id === selectedId) || null;

  const canAddChild =
    Boolean(subscription) && children.length < maxChildren;

  const limitMessage = !subscription
    ? "Subscribe to a plan to add children."
    : children.length >= maxChildren
      ? `Your ${plan?.name} plan allows up to ${maxChildren} ${
          maxChildren === 1 ? "child" : "children"
        }. Upgrade to add more.`
      : "";

  /* -------------------------------------------------------
     LOAD TRANSPORT FOR A CHILD
  ------------------------------------------------------- */
  async function loadTransportDetails(studentId) {
    console.log(
      "🚍 [MyChildrenPage] loadTransportDetails START:",
      studentId
    );

    setTransportLoading(true);

    try {
      console.log(
        "🚍 [MyChildrenPage] Calling getStudentRouteAssignments():",
        studentId
      );

      const assignments = await getStudentRouteAssignments();

      console.log(
        "🚍 [MyChildrenPage] getStudentRouteAssignments RESPONSE:",
        assignments
      );

      if (!Array.isArray(assignments)) {
        console.warn(
          "⚠️ [MyChildrenPage] Assignments response is not an array"
        );
        return;
      }

      /* ---------------------------------------------------
         Find assignment for CURRENT child
      --------------------------------------------------- */
      const assignment = assignments.find((item) => {
        const assignmentStudentId = Number(
          getValue(item, "studentId", "StudentId")
        );

        return assignmentStudentId === Number(studentId);
      });

      console.log(
        "🚍 [MyChildrenPage] Selected assignment:",
        assignment
      );

      if (!assignment) {
        console.warn(
          "⚠️ No transport assignment found for student:",
          studentId
        );

        setChildren((current) =>
          current.map((child) =>
            child.id === String(studentId)
              ? {
                  ...child,
                  routeAssigned: false,
                  routeLabel: "No Route Assigned",
                  transport: {
                    route: "Awaiting Assignment",
                    driver: "Awaiting Assignment",
                    pickup: "—",
                    dropoff: "—",
                  },
                }
              : child
          )
        );

        return;
      }

      console.log(
        "🚍 [MyChildrenPage] Transport assignment:",
        assignment
      );

      const routeId = Number(
        getValue(assignment, "routeId", "RouteId")
      );

      const pickupTime = getValue(
        assignment,
        "pickupTime",
        "PickupTime"
      );

      const dropoffTime = getValue(
        assignment,
        "dropoffTime",
        "DropoffTime"
      );

      let route = null;
      let driver = null;

      /* ---------------------------------------------------
         LOAD ROUTE
      --------------------------------------------------- */
      if (Number.isFinite(routeId) && routeId > 0) {
        try {
          console.log(
            "🛣️ [MyChildrenPage] Loading route:",
            routeId
          );

          route = await getRouteDetails(routeId);

          console.log(
            "🛣️ [MyChildrenPage] Route response:",
            route
          );
        } catch (routeError) {
          console.error(
            "❌ [MyChildrenPage] Route loading failed:",
            routeError
          );
        }
      }

      /* ---------------------------------------------------
         GET DRIVER ID FROM ROUTE
      --------------------------------------------------- */
      const driverId = Number(
        getValue(
          route,
          "driverId",
          "DriverId"
        )
      );

      /* ---------------------------------------------------
         LOAD DRIVER
      --------------------------------------------------- */
      if (Number.isFinite(driverId) && driverId > 0) {
        try {
          console.log(
            "👨‍✈️ [MyChildrenPage] Loading driver:",
            driverId
          );

          driver = await getDriverDetails(driverId);

          console.log(
            "👨‍✈️ [MyChildrenPage] Driver response:",
            driver
          );
        } catch (driverError) {
          console.error(
            "❌ [MyChildrenPage] Driver loading failed:",
            driverError
          );
        }
      }

      /* ---------------------------------------------------
         ROUTE NAME
      --------------------------------------------------- */
      const routeName =
        getValue(
          route,
          "name",
          "Name",
          "routeName",
          "RouteName"
        ) ||
        getValue(
          assignment,
          "routeName",
          "RouteName"
        ) ||
        `Route ${routeId || ""}`.trim();

      /* ---------------------------------------------------
         DRIVER NAME
      --------------------------------------------------- */
      const driverName =
        getValue(
          driver,
          "name",
          "Name",
          "driverName",
          "DriverName",
          "fullName",
          "FullName"
        ) ||
        getValue(
          route,
          "driverName",
          "DriverName"
        ) ||
        "Driver Assigned";

      const finalTransport = {
        route: routeName || "Assigned Route",
        driver: driverName || "Driver Assigned",
        pickup: formatTime(pickupTime),
        dropoff: formatTime(dropoffTime),
      };

      console.log(
        "🚍 [MyChildrenPage] Final transport values:",
        finalTransport
      );

      /* ---------------------------------------------------
         UPDATE CHILD
      --------------------------------------------------- */
      setChildren((current) =>
        current.map((child) => {
          if (child.id !== String(studentId)) {
            return child;
          }

          return {
            ...child,

            routeAssigned: true,

            routeLabel: finalTransport.route,

            transport: finalTransport,
          };
        })
      );

      console.log(
        "✅ [MyChildrenPage] Transport details applied."
      );
    } catch (error) {
      console.error(
        "❌ [MyChildrenPage] loadTransportDetails ERROR:",
        error
      );
    } finally {
      setTransportLoading(false);
    }
  }

  /* -------------------------------------------------------
     LOAD CHILDREN
  ------------------------------------------------------- */
  async function loadChildren() {
    console.log("🔥 [MyChildrenPage] loadChildren START");

    if (!user?.id) {
      setChildrenError(
        "Unable to determine your account. Please refresh and try again."
      );

      setLoadingChildren(false);

      return;
    }

    setLoadingChildren(true);
    setChildrenError(null);

    try {
      console.log(
        "👨‍👩‍👧 [MyChildrenPage] Calling getStudentsByParentId:",
        user.id
      );

      const students = await getStudentsByParentId(user.id);

      console.log(
        "👨‍👩‍👧 [MyChildrenPage] Students received:",
        students
      );

      const mappedChildren = students.map((student, index) =>
        mapStudentToChild(
          student,
          accentCycle[index % accentCycle.length]
        )
      );

      console.log(
        "👨‍👩‍👧 [MyChildrenPage] Mapped children:",
        mappedChildren
      );

      setChildren(mappedChildren);

      const firstChildId = mappedChildren[0]?.id ?? null;

      console.log(
        "🔥🔥🔥 [MyChildrenPage] FIRST CHILD ID BEING SET:",
        firstChildId
      );

      setSelectedId(firstChildId);

      /* ---------------------------------------------------
         IMPORTANT:
         Load transport after children are received
      --------------------------------------------------- */
      if (firstChildId) {
        console.log(
          "🚍 [MyChildrenPage] Loading transport for first child:",
          firstChildId
        );

        await loadTransportDetails(Number(firstChildId));
      }
    } catch (error) {
      console.error(
        "❌ [MyChildrenPage] loadChildren ERROR:",
        error
      );

      setChildrenError(
        error instanceof Error
          ? error.message
          : "Unable to load children."
      );
    } finally {
      setLoadingChildren(false);
    }
  }

  /* -------------------------------------------------------
     INITIAL LOAD
  ------------------------------------------------------- */
  useEffect(() => {
    console.log(
      "🔥 [MyChildrenPage] useEffect RUNNING, user ID:",
      user?.id
    );

    if (user?.id) {
      loadChildren();
    }
  }, [user?.id]);

  /* -------------------------------------------------------
     SELECT CHILD
  ------------------------------------------------------- */
  async function handleSelectChild(childId) {
    console.log(
      "👧 [MyChildrenPage] Child selected:",
      childId
    );

    setSelectedId(childId);

    /* Load fresh student */
    if (user?.id) {
      try {
        const student = await getStudentById(Number(childId));

        setChildren((current) =>
          current.map((child) =>
            child.id === childId
              ? {
                  ...child,
                  ...mapStudentToChild(
                    student,
                    child.accent
                  ),
                  transport: child.transport,
                  routeAssigned: child.routeAssigned,
                  routeLabel: child.routeLabel,
                }
              : child
          )
        );
      } catch (error) {
        console.error(
          "⚠️ [MyChildrenPage] Student details failed:",
          error
        );
      }
    }

    /* Load transport for selected child */
    await loadTransportDetails(Number(childId));
  }

  /* -------------------------------------------------------
     ADD CHILD
  ------------------------------------------------------- */
  async function handleAddChild() {
    const name = formName.trim();

    if (!name || !user?.id) {
      return;
    }

    setIsSavingChild(true);
    setSaveChildrenError(null);

    try {
      const payload = {
        parentUserId: user.id,
        name,
        grade: formGrade.trim() || "Unassigned",
        section: formGrade.trim() || "Unassigned",
        status: "Pending",
      };

      const createdStudent = await createStudent(payload);

      const newChild = mapStudentToChild(
        createdStudent,
        accentCycle[children.length % accentCycle.length]
      );

      setChildren((prev) => [...prev, newChild]);

      setSelectedId(newChild.id);

      setFormName("");
      setFormGrade("");
      setAddChildOpen(false);
    } catch (error) {
      setSaveChildrenError(
        error instanceof Error
          ? error.message
          : "Unable to add child."
      );
    } finally {
      setIsSavingChild(false);
    }
  }

  async function handleSaveGuardian() {
    return Promise.resolve();
  }

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */
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
            onClick={() => setAddChildOpen(true)}
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
              {children.length} of {maxChildren} children used
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
          ) : (
            <>
              {children.map((child) => {
                const isSelected =
                  child.id === selected?.id;

                return (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() =>
                      handleSelectChild(child.id)
                    }
                    className={`flex items-center gap-4 rounded-2xl border bg-surface p-4 text-left shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] ${
                      isSelected
                        ? "border-primary ring-1 ring-primary"
                        : "border-border"
                    }`}
                  >
                    <span
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-base font-bold ${
                        accentClasses[child.accent]
                      }`}
                    >
                      {child.initials}
                    </span>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate text-base font-bold text-foreground">
                          {child.name}
                        </h3>

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
              })}
            </>
          )}
        </section>

        {/* SELECTED CHILD DETAILS */}
        {selected ? (
          <aside className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">

            {/* CHILD INFO */}
            <div className="flex items-center gap-4">
              <span
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
                  accentClasses[selected.accent]
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

                {transportLoading ? (
                  <span className="ml-auto text-xs font-normal text-muted">
                    Loading...
                  </span>
                ) : null}
              </h3>

              <dl className="mt-3 grid grid-cols-2 gap-3">

                {/* ROUTE */}
                <div className="rounded-xl bg-surface-bright p-3">
                  <dt className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                    Assigned Route
                  </dt>

                  <dd className="mt-1 text-sm font-semibold text-foreground">
                    {selected.transport?.route ||
                      "Awaiting Assignment"}
                  </dd>
                </div>

                {/* DRIVER */}
                <div className="rounded-xl bg-surface-bright p-3">
                  <dt className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                    Assigned Driver
                  </dt>

                  <dd className="mt-1 flex items-center gap-1 text-sm font-semibold text-foreground">
                    {selected.transport?.driver ||
                      "Awaiting Assignment"}

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
                    {selected.transport?.pickup || "—"}
                  </dd>
                </div>

                {/* DROP OFF */}
                <div className="rounded-xl bg-surface-bright p-3">
                  <dt className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                    Drop-off Time
                  </dt>

                  <dd className="mt-1 text-sm font-semibold text-foreground">
                    {selected.transport?.dropoff || "—"}
                  </dd>
                </div>

              </dl>
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
                    setGuardianDrawerOpen(true)
                  }
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
                        <p className="truncate text-sm font-semibold text-foreground">
                          {guardian.name}
                        </p>

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

            {/* ABSENCE */}
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
                  onChange={(e) =>
                    setFormName(e.target.value)
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
                  onChange={(e) =>
                    setFormGrade(e.target.value)
                  }
                  placeholder="e.g. Grade 4-B"
                  className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {saveChildrenError ? (
                <p className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700">
                  {saveChildrenError}
                </p>
              ) : null}

              <div className="flex items-start gap-2 rounded-xl bg-surface-bright p-3">
                <Clock
                  size={16}
                  className="mt-0.5 shrink-0 text-muted"
                />

                <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                  New children start as Pending until a route is assigned by the admin.
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
                    !formName.trim() || isSavingChild
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