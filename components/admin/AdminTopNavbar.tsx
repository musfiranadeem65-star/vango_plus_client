"use client";

import Image from "next/image";
import { Icon } from "@/components/admin/Icon";
import { ADMIN_PROFILE } from "@/lib/admin/constants";
import { cn } from "@/lib/utils";

interface AdminTopNavbarProps {
  onMenuClick?: () => void;
  title?: string;
  className?: string;
}

export function AdminTopNavbar({
  onMenuClick,
  title = "VanGo Plus",
  className,
}: AdminTopNavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between gap-4",
        "border-b border-outline-variant bg-surface px-4 shadow-sm",
        "md:px-10",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-full p-2 transition-transform hover:bg-surface-container-low active:scale-95 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Icon name="menu" className="text-secondary" size={22} />
        </button>

        <div className="hidden min-w-0 lg:block">
          <p className="truncate text-xl font-extrabold text-primary">{title}</p>
        </div>

        <div className="relative hidden max-w-md flex-1 md:block">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            size={20}
          />
          <input
            type="search"
            placeholder="Search students, routes, drivers..."
            className={cn(
              "h-10 w-full min-w-[240px] rounded-lg border border-outline-variant bg-surface-bright",
              "pl-10 pr-4 text-sm outline-none transition-all",
              "focus:border-primary focus:ring-2 focus:ring-primary/20"
            )}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="relative rounded-full p-2 transition-colors hover:bg-surface-container-low"
          aria-label="Notifications"
        >
          <Icon name="notifications" className="text-on-surface-variant" size={22} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-tertiary" />
        </button>

        <button
          type="button"
          className="hidden rounded-lg border border-outline-variant px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-fixed/40 sm:inline-flex sm:items-center sm:gap-2"
        >
          <Icon name="contact_support" size={18} />
          Broadcast
        </button>

        <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary-container">
          <Image
            src={ADMIN_PROFILE.avatar}
            alt="Admin profile"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
