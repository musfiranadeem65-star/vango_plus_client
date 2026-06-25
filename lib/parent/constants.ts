import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";

export type ParentNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const PARENT_NAV_ITEMS: ParentNavItem[] = [
  { label: "Dashboard", href: "/parent/dashboard", icon: LayoutDashboard },
  { label: "My Children", href: "/parent/children", icon: Users },
  { label: "Schedule", href: "/parent/schedule", icon: CalendarDays },
  { label: "Subscription", href: "/parent/subscription", icon: Wallet },
  { label: "Guardians", href: "/parent/guardians", icon: ShieldCheck },
  { label: "Settings", href: "/parent/settings", icon: Settings },
];

export const PARENT_MOBILE_NAV_LABELS = [
  "Dashboard",
  "My Children",
  "Schedule",
  "Guardians",
  "Settings",
];

export const PARENT_PROFILE = {
  name: "Sarah Mitchell",
  firstName: "Sarah",
  initials: "SM",
};
