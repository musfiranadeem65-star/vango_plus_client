"use client";

import { useState } from "react";
import { Save } from "lucide-react";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-lg font-semibold text-[#0B5394]">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function SettingsManagementPage() {
  const [schoolName, setSchoolName] = useState("St. Andrews International");
  const [contactPerson, setContactPerson] = useState("Robert Wilson");
  const [address, setAddress] = useState("123 North Avenue, Suite 4, London, UK");
  const [monthlyAmount, setMonthlyAmount] = useState("4500");
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [port, setPort] = useState("587");
  const [encryption, setEncryption] = useState("TLS");
  const [senderEmail, setSenderEmail] = useState("notifications@vangoplus.com");
  const [currentPassword, setCurrentPassword] = useState("********");
  const [newPassword, setNewPassword] = useState("********");
  const [confirmPassword, setConfirmPassword] = useState("********");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-[28px]">Settings</h2>
          </div>
        </header>

        <div className="space-y-4 px-3 py-4 sm:px-4 lg:px-5 lg:py-5">
          <SettingsSection title="School Information">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">School Name</label>
              <input
                value={schoolName}
                onChange={(event) => setSchoolName(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Contact Person</label>
              <input
                value={contactPerson}
                onChange={(event) => setContactPerson(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">School Address</label>
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
              />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B5394] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#084c7a]"
            >
              <Save size={16} />
              Save Changes
            </button>
          </SettingsSection>

          <SettingsSection title="Fee Settings">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Monthly Amount (Rs.)</label>
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus-within:border-[#0B5394] focus-within:bg-white">
                <span className="mr-2 text-sm font-semibold text-slate-500">₹</span>
                <input
                  value={monthlyAmount}
                  onChange={(event) => setMonthlyAmount(event.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none"
                />
              </div>
              <p className="mt-2 text-sm text-slate-500">This amount will be applied to all active student subscriptions.</p>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B5394] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#084c7a]"
            >
              <Save size={16} />
              Save Changes
            </button>
          </SettingsSection>

          <SettingsSection title="Email Configuration (SMTP)">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">SMTP Host</label>
              <input
                value={smtpHost}
                onChange={(event) => setSmtpHost(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Port</label>
                <input
                  value={port}
                  onChange={(event) => setPort(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Encryption</label>
                <select
                  value={encryption}
                  onChange={(event) => setEncryption(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                >
                  <option>TLS</option>
                  <option>SSL</option>
                  <option>None</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Sender Email</label>
              <input
                value={senderEmail}
                onChange={(event) => setSenderEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
              />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B5394] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#084c7a]"
            >
              <Save size={16} />
              Save Changes
            </button>
          </SettingsSection>

          <SettingsSection title="Change Password">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
              />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B5394] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#084c7a]"
            >
              <Save size={16} />
              Save Changes
            </button>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
