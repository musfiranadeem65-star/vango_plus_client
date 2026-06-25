"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { PARENT_NAV_ITEMS } from "@/lib/parent/constants";
import { cn } from "@/lib/utils";

interface ParentSidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function ParentSidebar({ onNavigate, className }: ParentSidebarProps) {
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
          href="/parent/dashboard"
          onClick={onNavigate}
          className="inline-flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <ShieldCheck size={22} className="text-secondary-fixed" />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">VanGo Plus</p>
            <p className="text-xs text-white/70">Parent Portal</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-1">
          {PARENT_NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const ItemIcon = item.icon;

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
                  <ItemIcon
                    size={20}
                    className={active ? "text-secondary-fixed" : "text-white/80"}
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
        <p className="mt-1 text-sm text-white/70">Your children, in safe hands</p>
      </div>
    </aside>
  );
}
