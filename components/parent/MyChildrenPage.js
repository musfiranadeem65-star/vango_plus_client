"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MyChildrenPage;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var AuthProvider_1 = require("@/components/auth/AuthProvider");
var AddGuardianDrawer_1 = require("@/components/parent/AddGuardianDrawer");
var plans_1 = require("@/lib/subscription/plans");
var studentService_1 = require("@/services/studentService");
function mapStudentToChild(student, accent) {
    var status = student.status.toLowerCase() === "active" ? "active" : "pending";
    return {
        id: String(student.id),
        name: student.name,
        grade: student.grade || "Unassigned",
        initials: getInitials(student.name),
        accent: accent,
        status: status,
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
var initialChildren = [];
var accentClasses = {
    blue: "bg-primary text-white",
    teal: "bg-secondary text-white",
    slate: "bg-surface-container-high text-on-surface-variant",
};
var accentCycle = ["blue", "teal", "slate"];
function getInitials(name) {
    var parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0)
        return "?";
    if (parts.length === 1)
        return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function MyChildrenPage() {
    var _a, _b;
    var user = (0, AuthProvider_1.useAuth)().user;
    var subscription = user === null || user === void 0 ? void 0 : user.subscription;
    var plan = subscription ? (0, plans_1.getPlanById)(subscription.planId) : undefined;
    var maxChildren = (_a = plan === null || plan === void 0 ? void 0 : plan.maxChildren) !== null && _a !== void 0 ? _a : 0;
    var _c = (0, react_1.useState)(initialChildren), children = _c[0], setChildren = _c[1];
    var _d = (0, react_1.useState)(null), selectedId = _d[0], setSelectedId = _d[1];
    var _e = (0, react_1.useState)(false), addChildOpen = _e[0], setAddChildOpen = _e[1];
    var _f = (0, react_1.useState)(false), guardianDrawerOpen = _f[0], setGuardianDrawerOpen = _f[1];
    var _g = (0, react_1.useState)(""), formName = _g[0], setFormName = _g[1];
    var _h = (0, react_1.useState)(""), formGrade = _h[0], setFormGrade = _h[1];
    var _j = (0, react_1.useState)(true), loadingChildren = _j[0], setLoadingChildren = _j[1];
    var _k = (0, react_1.useState)(null), childrenError = _k[0], setChildrenError = _k[1];
    var _l = (0, react_1.useState)(null), saveChildrenError = _l[0], setSaveChildrenError = _l[1];
    var _m = (0, react_1.useState)(false), isSavingChild = _m[0], setIsSavingChild = _m[1];
    var selected = (_b = children.find(function (child) { return child.id === selectedId; })) !== null && _b !== void 0 ? _b : null;
    var canAddChild = Boolean(subscription) && children.length < maxChildren;
    var limitMessage = !subscription
        ? "Subscribe to a plan to add children."
        : children.length >= maxChildren
            ? "Your ".concat(plan === null || plan === void 0 ? void 0 : plan.name, " plan allows up to ").concat(maxChildren, " ").concat(maxChildren === 1 ? "child" : "children", ". Upgrade to add more.")
            : "";
    function loadChildren() {
        return __awaiter(this, void 0, void 0, function () {
            var students, mappedChildren, error_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(user === null || user === void 0 ? void 0 : user.id)) {
                            setChildrenError("Unable to determine your account. Please refresh and try again.");
                            setLoadingChildren(false);
                            return [2 /*return*/];
                        }
                        setLoadingChildren(true);
                        setChildrenError(null);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, (0, studentService_1.getStudentsByParentId)(user.id)];
                    case 2:
                        students = _c.sent();
                        mappedChildren = students.map(function (student, index) {
                            return mapStudentToChild(student, accentCycle[index % accentCycle.length]);
                        });
                        setChildren(mappedChildren);
                        setSelectedId((_b = (_a = mappedChildren[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _c.sent();
                        setChildrenError(error_1 instanceof Error ? error_1.message : "Unable to load children.");
                        return [3 /*break*/, 5];
                    case 4:
                        setLoadingChildren(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    (0, react_1.useEffect)(function () {
        loadChildren();
    }, [user === null || user === void 0 ? void 0 : user.id]);
    function handleAddChild() {
        return __awaiter(this, void 0, void 0, function () {
            var name, payload, createdStudent, newChild_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = formName.trim();
                        if (!name || !(user === null || user === void 0 ? void 0 : user.id))
                            return [2 /*return*/];
                        setIsSavingChild(true);
                        setSaveChildrenError(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        payload = {
                            parentUserId: user.id,
                            name: name,
                            grade: formGrade.trim() || "Unassigned",
                            section: formGrade.trim() || "Unassigned",
                            status: "Pending",
                        };
                        return [4 /*yield*/, (0, studentService_1.createStudent)(payload)];
                    case 2:
                        createdStudent = _a.sent();
                        newChild_1 = mapStudentToChild(createdStudent, accentCycle[children.length % accentCycle.length]);
                        setChildren(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newChild_1], false); });
                        setSelectedId(newChild_1.id);
                        setFormName("");
                        setFormGrade("");
                        setAddChildOpen(false);
                        return [3 /*break*/, 5];
                    case 3:
                        error_2 = _a.sent();
                        setSaveChildrenError(error_2 instanceof Error ? error_2.message : "Unable to add child.");
                        return [3 /*break*/, 5];
                    case 4:
                        setIsSavingChild(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function handleSelectChild(childId) {
        return __awaiter(this, void 0, void 0, function () {
            var student_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setSelectedId(childId);
                        if (!(user === null || user === void 0 ? void 0 : user.id))
                            return [2 /*return*/];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, studentService_1.getStudentById)(Number(childId))];
                    case 2:
                        student_1 = _b.sent();
                        setChildren(function (current) {
                            return current.map(function (child) {
                                return child.id === childId
                                    ? __assign(__assign({}, child), mapStudentToChild(student_1, child.accent)) : child;
                            });
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function handleSaveGuardian(data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Guardian save is not implemented yet.
                return [2 /*return*/, Promise.resolve()];
            });
        });
    }
    return (<div className="mx-auto flex max-w-[1400px] flex-col gap-6">
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
          <button type="button" onClick={function () { return setAddChildOpen(true); }} disabled={!canAddChild} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-container disabled:pointer-events-none disabled:opacity-50">
            {canAddChild ? <lucide_react_1.Plus size={18}/> : <lucide_react_1.Lock size={16}/>}
            Add Child
          </button>
          {limitMessage ? (<p className="font-[family-name:var(--font-inter)] text-xs font-medium text-tertiary">
              {limitMessage}
            </p>) : (<p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
              {children.length} of {maxChildren} children used
            </p>)}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <section className="flex flex-col gap-4">
          {loadingChildren ? (<div className="rounded-2xl border border-border bg-surface p-6 text-center text-sm font-medium text-on-surface-variant">
              Loading children...
            </div>) : childrenError ? (<div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-700">
              {childrenError}
            </div>) : (<>
              {children.map(function (child) {
                var isSelected = child.id === (selected === null || selected === void 0 ? void 0 : selected.id);
                return (<button key={child.id} type="button" onClick={function () { return setSelectedId(child.id); }} className={"flex items-center gap-4 rounded-2xl border bg-surface p-4 text-left shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] ".concat(isSelected ? "border-primary ring-1 ring-primary" : "border-border")}>
                    <span className={"flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-base font-bold ".concat(accentClasses[child.accent])}>
                      {child.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate text-base font-bold text-foreground">{child.name}</h3>
                        {child.status === "active" ? (<span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-2.5 py-1 text-xs font-semibold text-on-secondary-container">
                            Active
                          </span>) : (<span className="inline-flex items-center gap-1 rounded-full bg-tertiary-fixed px-2.5 py-1 text-xs font-semibold text-tertiary">
                            Pending
                          </span>)}
                      </div>
                      <p className="mt-0.5 font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                        {child.grade}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
                        {child.routeAssigned ? (<lucide_react_1.Bus size={14} className="text-primary"/>) : (<lucide_react_1.Clock size={14} className="text-tertiary"/>)}
                        <span>{child.routeLabel}</span>
                      </div>
                    </div>
                    <lucide_react_1.ChevronRight size={18} className="shrink-0 text-muted"/>
                  </button>);
            })}
            </>)}
        </section>

        {selected ? (<aside className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-4">
            <span className={"flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ".concat(accentClasses[selected.accent])}>
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
              <lucide_react_1.Route size={16} className="text-primary"/>
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
                  {selected.routeAssigned ? (<lucide_react_1.CheckCircle2 size={14} className="text-secondary"/>) : null}
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
                <lucide_react_1.UserCog size={16} className="text-primary"/>
                Authorized Guardians
              </h3>
              <button type="button" onClick={function () { return setGuardianDrawerOpen(true); }} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-secondary transition hover:bg-surface-container-low">
                <lucide_react_1.Plus size={14}/>
                Add
              </button>
            </div>
            {selected.guardians.length === 0 ? (<p className="mt-3 rounded-xl bg-surface-bright p-4 font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                No guardians added yet. Add a guardian to authorize pickups.
              </p>) : (<ul className="mt-3 flex flex-col gap-2">
                {selected.guardians.map(function (guardian) { return (<li key={guardian.name} className="flex items-center gap-3 rounded-xl bg-surface-bright p-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-xs font-bold text-primary">
                      {guardian.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {guardian.name}
                        </p>
                        {guardian.status === "approved" ? (<span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-on-secondary-container">
                            <lucide_react_1.CheckCircle2 size={11}/>
                            Approved
                          </span>) : (<span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-tertiary-fixed px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-tertiary">
                            <lucide_react_1.Clock size={11}/>
                            Pending
                          </span>)}
                      </div>
                      <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                        {guardian.relation}
                      </p>
                    </div>
                    <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-secondary transition hover:bg-surface-container-high" aria-label={"Call ".concat(guardian.name)}>
                      <lucide_react_1.Phone size={15}/>
                    </button>
                  </li>); })}
              </ul>)}
          </div>

          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border border-tertiary-fixed bg-tertiary-fixed/40 py-2.5 text-sm font-semibold text-tertiary transition hover:bg-tertiary-fixed/60">
            <lucide_react_1.CalendarOff size={16}/>
            Report Absence for Today
          </button>
        </aside>) : null}
      </div>

      {addChildOpen ? (<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Close" onClick={function () { return setAddChildOpen(false); }} className="absolute inset-0 bg-black/40 backdrop-blur-sm"/>
          <div className="relative w-full max-w-md rounded-2xl bg-surface shadow-xl">
            <header className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold text-foreground">Add Child</h2>
              <button type="button" onClick={function () { return setAddChildOpen(false); }} className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface-container-low" aria-label="Close">
                <lucide_react_1.X size={20}/>
              </button>
            </header>

            <form onSubmit={function (e) {
                e.preventDefault();
                handleAddChild();
            }} className="flex flex-col gap-5 px-6 py-6">
              <div>
                <label className="font-[family-name:var(--font-inter)] text-sm font-semibold text-foreground">
                  Child&apos;s Full Name
                </label>
                <input type="text" value={formName} onChange={function (e) { return setFormName(e.target.value); }} placeholder="Enter child's full name" className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary" autoFocus/>
              </div>

              <div>
                <label className="font-[family-name:var(--font-inter)] text-sm font-semibold text-foreground">
                  Grade / Class
                </label>
                <input type="text" value={formGrade} onChange={function (e) { return setFormGrade(e.target.value); }} placeholder="e.g. Grade 4-B" className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"/>
              </div>

              <div className="flex items-start gap-2 rounded-xl bg-surface-bright p-3">
                <lucide_react_1.Clock size={16} className="mt-0.5 shrink-0 text-muted"/>
                <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                  New children start as Pending until a route is assigned by the
                  admin.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={function () { return setAddChildOpen(false); }} className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface-container-low">
                  Cancel
                </button>
                <button type="submit" disabled={!formName.trim()} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-container disabled:pointer-events-none disabled:opacity-50">
                  Add Child
                </button>
              </div>
            </form>
          </div>
        </div>) : null}

      <AddGuardianDrawer_1.AddGuardianDrawer open={guardianDrawerOpen} onClose={function () { return setGuardianDrawerOpen(false); }} onSave={handleSaveGuardian}/>
    </div>);
}
