"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/admin/Icon";
import { ADMIN_NAV_ITEMS } from "@/lib/admin/constants";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function AdminSidebar({ onNavigate, className }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-[var(--sidebar-width)] shrink-0 flex-col bg-primary-dark text-white",
        className
      )}
    >
      <div className="border-b border-white/10 px-6 py-6">
        <Link
          href="/admin/dashboard"
          onClick={onNavigate}
          className="inline-flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3" y="6" width="18" height="11" rx="2" fill="white" opacity="0.9" />
              <rect x="5" y="8" width="5" height="4" rx="1" fill="#2e75b6" />
              <circle cx="7" cy="18" r="2" fill="white" />
              <circle cx="17" cy="18" r="2" fill="white" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">VanGo Plus</p>
            <p className="text-xs text-white/70">Admin Portal</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const active = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-white/15 text-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon
                    name={item.icon}
                    filled={active}
                    className={active ? "text-secondary-fixed" : "text-white/80"}
                    size={20}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 px-6 py-5">
        <p className="font-[family-name:var(--font-inter)] text-xs uppercase tracking-wider text-white/50">
          Kinetic Education Transport
        </p>
        <p className="mt-1 text-sm text-white/70">Safe Rides, Happy Parents</p>
      </div>
    </aside>
  );
}
