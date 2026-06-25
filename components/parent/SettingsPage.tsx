"use client";

import { useState } from "react";
import { Bell, KeyRound, Save, UserCircle2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { PARENT_PROFILE } from "@/lib/parent/constants";

interface ToggleSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const profileName = user?.name ?? PARENT_PROFILE.name;
  const profileEmail = user?.email ?? "sarah.mitchell@email.com";

  const [notifications, setNotifications] = useState<ToggleSetting[]>([
    {
      id: "email",
      label: "Email Alerts",
      description: "Daily summaries and billing receipts via email.",
      enabled: true,
    },
    {
      id: "sms",
      label: "SMS Alerts",
      description: "Text messages for critical route changes only.",
      enabled: false,
    },
  ]);

  const toggle = (id: string) =>
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-6">
      <section>
        <h1 className="text-2xl font-bold text-foreground md:text-[32px] md:leading-10">
          Settings
        </h1>
        <p className="mt-1 font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
          Manage your profile, notifications and account security.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
          <UserCircle2 size={18} className="text-primary" />
          Profile Information
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="font-[family-name:var(--font-inter)] text-sm font-semibold text-foreground">
              Full Name
            </label>
            <input
              type="text"
              key={`name-${profileName}`}
              defaultValue={profileName}
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="font-[family-name:var(--font-inter)] text-sm font-semibold text-foreground">
              Email Address
            </label>
            <input
              type="email"
              key={`email-${profileEmail}`}
              defaultValue={profileEmail}
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="font-[family-name:var(--font-inter)] text-sm font-semibold text-foreground">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue="(555) 123-4567"
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-container"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
          <Bell size={18} className="text-primary" />
          Notification Preferences
        </h2>
        <ul className="mt-5 flex flex-col divide-y divide-border">
          {notifications.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="mt-0.5 font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                  {item.description}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={item.enabled}
                onClick={() => toggle(item.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
                  item.enabled ? "bg-primary" : "bg-surface-container-high"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                    item.enabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
          <KeyRound size={18} className="text-primary" />
          Change Password
        </h2>
        <div className="mt-5 flex flex-col gap-4">
          <div>
            <label className="font-[family-name:var(--font-inter)] text-sm font-semibold text-foreground">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="font-[family-name:var(--font-inter)] text-sm font-semibold text-foreground">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="font-[family-name:var(--font-inter)] text-sm font-semibold text-foreground">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-container"
          >
            <Save size={16} />
            Update Password
          </button>
        </div>
      </section>
    </div>
  );
}
