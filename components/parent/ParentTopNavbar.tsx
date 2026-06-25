"use client";

import { Menu } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserMenu } from "@/components/auth/UserMenu";
import { PARENT_PROFILE } from "@/lib/parent/constants";
import { cn } from "@/lib/utils";

interface ParentTopNavbarProps {
  onMenuClick?: () => void;
  title?: string;
  className?: string;
}

export function ParentTopNavbar({
  onMenuClick,
  title = "VanGo Plus",
  className,
}: ParentTopNavbarProps) {
  const { user } = useAuth();
  const displayName = user?.name ?? PARENT_PROFILE.name;

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
          <Menu className="text-secondary" size={22} />
        </button>

        <div className="min-w-0">
          <p className="truncate text-xl font-extrabold text-primary">{title}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-tight text-foreground">
              {displayName}
            </p>
            <p className="text-xs text-on-surface-variant">Parent</p>
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
