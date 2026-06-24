export type AdminNavItem = {
  label: string;
  href: string;
  icon: string;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
  { label: "Students", href: "/admin/students", icon: "group" },
  { label: "Drivers", href: "/admin/drivers", icon: "directions_bus" },
  { label: "Routes", href: "/admin/routes", icon: "alt_route" },
  { label: "Guardians", href: "/admin/guardians", icon: "family_restroom" },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: "payments" },
  { label: "Alerts", href: "/admin/alerts", icon: "notifications" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

export const ADMIN_PROFILE = {
  name: "Admin",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB08cUobOp2-1ka4pZ9UNQ2784XogGm0cZBnDwZuSLU5wy67vULd8gUnH8YvlWu73FVnHIdDWMkaFK2-IaPi8MpayVM8P5r5BJjrg1Fx0mH_4chW5SEjlZMlit98_QDfmC6_ztoNezYyGq2Z4_xwNWgUTW0tlglkTwvipzE7PhN-lOIFPOD2U6_5wZs0FdZ1DMHhWApfkzv7QemU5kh9-sppFvUr-tNsmEtk8lR9n8T056PBsCu5qScjut4P6H2zE2pM0rbtZJcK2RS",
};

export const DASHBOARD_STATS = [
  {
    icon: "group",
    value: "124",
    label: "Students",
    tone: "primary" as const,
  },
  {
    icon: "directions_bus",
    value: "18",
    label: "Drivers",
    tone: "secondary" as const,
  },
  {
    icon: "family_restroom",
    value: "06",
    label: "Pending",
    tone: "tertiary" as const,
    badge: "URGENT",
  },
  {
    icon: "payments",
    value: "12",
    label: "Subs Due",
    tone: "neutral" as const,
  },
];

export const GUARDIAN_APPROVALS = [
  {
    id: "1",
    name: "Sarah Mitchell",
    child: "Leo Mitchell (Grade 4)",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD7uNDlsxZmJjlH0_7f7bYB2XwTQlxziNFKYVBxkS92v__5sdCyt1pzl2bvL-ecnf0MaXr8GPYfes0vDpFQ5kYWfluna7he6YMflQ-YSD6qbd29AlRVHEhCGvuMtb94qaf4DCkVfgRJKay6CnH7_woJ_WMlUptTytCWv16nEfRWIRuXQZWmbTvceZcQPff1j05rBMKGqZ9pEyjP09sbH_Zg9reKjiKzalCtx13VCdwwPSNOXG53bdcw-0PTdKAiibaW9U7pRr_oo41H",
    requestedAt: "Oct 24, 2023",
    status: "Pending",
  },
  {
    id: "2",
    name: "David Chen",
    child: "Mia Chen (Grade 1)",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD3g9JFl3P7ZrE7da_QS_ciMCm_1qwzAfoxIwzYYMF8YiHITGPDysRSTGJI0PIi4f_Yjci02NEvRpCT2DFBxVgf6fK4LwdWSG5zPe6p-H0vH63tA4BOlcKZXe3drwdJgA0RomcOoknITfq-cEYaNy0FXQ92l5a8L5wokLOTxggutyqmbebRyvf6fu84zA_5VddhycjuFEggr7wf5AgM3joqgtqRBChLhDIMg4_kjU_OY6ho66OUIrg5sKJm5N5YAiNPw7GtPu6O-AKw",
    requestedAt: "Oct 23, 2023",
    status: "Pending",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    child: "Sofia Rodriguez (Grade 3)",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2oOyoue7thlMb1-a7llgbMOiChB3bwTFxVFHLqVEepVVwIolDCvjfN8FdPurR9_ICTwJeX1tiblnd6YkImlmSN1-UxXxV4ujTnRg62bcgcJZJ_-kq2vsnfYPkcDTwWO6Se7jlLUOvEjkcGcKnMjPRedAu67wi7AjdvONC1VmZ9PmTsKGC4bErvHb6AySsxdlDYVAT5GAXt2gIXyA3m5A88DMMWSlICzYbndsh1OSJgmCLNiTrbjyLrFq8YpG9cANUk_s2gwIyBLdP",
    requestedAt: "Oct 22, 2023",
    status: "Pending",
  },
];

export const RECENT_ROUTES = [
  {
    id: "042",
    name: "Northview Academy AM",
    driver: "Marcus J.",
    students: 12,
    status: "Completed",
    time: "7:45 AM",
  },
  {
    id: "112",
    name: "Westside Prep PM",
    driver: "Sarah Jenkins",
    students: 18,
    status: "Delayed",
    time: "3:10 PM",
  },
  {
    id: "087",
    name: "Southside Charter",
    driver: "Elena R.",
    students: 15,
    status: "Active",
    time: "8:00 AM",
  },
  {
    id: "056",
    name: "Central Elementary",
    driver: "Robert Chen",
    students: 9,
    status: "Scheduled",
    time: "2:30 PM",
  },
];

export const TRANSPORT_ACTIVITY = [
  {
    icon: "person_pin_circle",
    title: "Route #042 Completed",
    subtitle: "Driver: Marcus J. • 12 Students",
    status: "Success",
    tone: "primary" as const,
    filled: false,
  },
  {
    icon: "child_care",
    title: "Pickup Delayed",
    subtitle: "Route #112 • Heavy Traffic",
    status: "Alert",
    tone: "alert" as const,
    filled: true,
  },
  {
    icon: "verified",
    title: "Driver Checked In",
    subtitle: "Driver: Elena R. • Van B-402",
    status: "Active",
    tone: "neutral" as const,
    filled: false,
  },
];

export const WEEKLY_TRANSPORT_DATA = [
  { day: "Mon", trips: 42 },
  { day: "Tue", trips: 38 },
  { day: "Wed", trips: 45 },
  { day: "Thu", trips: 41 },
  { day: "Fri", trips: 47 },
  { day: "Sat", trips: 12 },
  { day: "Sun", trips: 8 },
];

export const ON_TIME_DATA = [92, 88, 94, 91, 96, 93, 95];

export const ROUTE_STATUS_DATA = [
  { label: "On Time", value: 68, color: "var(--secondary)" },
  { label: "Delayed", value: 18, color: "var(--tertiary)" },
  { label: "Completed", value: 14, color: "var(--primary-container)" },
];
