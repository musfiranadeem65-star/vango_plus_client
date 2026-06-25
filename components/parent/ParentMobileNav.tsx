"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PARENT_MOBILE_NAV_LABELS,
  PARENT_NAV_ITEMS,
} from "@/lib/parent/constants";
import { cn } from "@/lib/utils";

export function ParentMobileNav() {
  const pathname = usePathname();
  const mobileItems = PARENT_NAV_ITEMS.filter((item) =>
    PARENT_MOBILE_NAV_LABELS.includes(item.label)
  );

  return (
    <nav className="fixed bottom-0 left-0 z-40 flex h-20 w-full items-center justify-around border-t border-outline-variant bg-surface shadow-lg lg:hidden">
      {mobileItems.map((item) => {
        const active = pathname === item.href;
        const ItemIcon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center px-3 py-1 transition-all active:scale-90",
              active ? "font-bold text-secondary" : "text-on-surface-variant"
            )}
          >
            <ItemIcon size={22} />
            <span className="mt-0.5 font-[family-name:var(--font-inter)] text-xs font-semibold">
              {item.label === "Dashboard" ? "Home" : item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
