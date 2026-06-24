"use client";

import { useState } from "react";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNavbar } from "@/components/admin/AdminTopNavbar";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:flex">
        <AdminSidebar />
      </div>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-primary-dark/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminTopNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 pb-28 pt-6 md:px-10 md:pb-10">{children}</main>
        <AdminMobileNav />
      </div>
    </div>
  );
}
