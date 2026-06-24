"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/admin/Icon";
import { ADMIN_NAV_ITEMS } from "@/lib/admin/constants";
import { cn } from "@/lib/utils";

export function AdminMobileNav() {
  const pathname = usePathname();
  const mobileItems = ADMIN_NAV_ITEMS.filter((item) =>
    ["Dashboard", "Students", "Routes", "Alerts", "Settings"].includes(item.label)
  );

  return (
    <nav className="fixed bottom-0 left-0 z-40 flex h-20 w-full items-center justify-around border-t border-outline-variant bg-surface pb-safe shadow-lg lg:hidden">
      {mobileItems.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center px-3 py-1 transition-all active:scale-90",
              active ? "font-bold text-secondary" : "text-on-surface-variant"
            )}
          >
            <Icon name={item.icon} filled={active} size={22} />
            <span className="mt-0.5 font-[family-name:var(--font-inter)] text-xs font-semibold">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
