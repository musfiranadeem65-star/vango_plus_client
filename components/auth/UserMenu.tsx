"use client";

import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ROLE_LABELS } from "@/lib/auth/constants";

function initialsFromName(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase() || "U";
  }
  return (email?.[0] ?? "U").toUpperCase();
}

interface UserMenuProps {
  trigger?: React.ReactNode;
  align?: "left" | "right";
}

export function UserMenu({ trigger, align = "right" }: UserMenuProps) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const displayName = user?.name ?? user?.email ?? "User";
  const initials = initialsFromName(user?.name, user?.email);
  const settingsHref = user?.role === "admin" ? "/admin/settings" : "/parent/settings";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        {trigger ?? (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
            {initials}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-card-hover)] ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {displayName}
              </p>
              <p className="truncate font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">
                {user ? ROLE_LABELS[user.role] : ""}
              </p>
            </div>
          </div>
          <Link
            href={settingsHref}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 border-b border-border px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-surface-container-low"
          >
            <Settings size={16} className="text-on-surface-variant" />
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-error transition-colors hover:bg-error/5"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
