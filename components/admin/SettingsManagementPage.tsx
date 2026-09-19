"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  getSchoolSettings,
  updateSchoolSettings,
  changeUserPassword,
} from "@/services/settingService";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingsSection({
  title,
  children,
}: SettingsSectionProps) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-lg font-semibold text-[#0B5394]">
        {title}
      </h3>

      <div className="mt-4 space-y-4">
        {children}
      </div>
    </section>
  );
}

export function SettingsManagementPage() {
  const { user } = useAuth();

  // General settings
  const [schoolName, setSchoolName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [address, setAddress] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [senderEmail, setSenderEmail] = useState("");

  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [settingsStatus, setSettingsStatus] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

  // Change password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordStatus, setPasswordStatus] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

  const [isSavingPassword, setIsSavingPassword] =
    useState(false);

  // -----------------------------------------
  // Load school settings from backend
  // -----------------------------------------
  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoadingSettings(true);
        setSettingsStatus(null);

        const data = await getSchoolSettings();

        setSchoolName(data.schoolName ?? "");
        setContactPerson(data.contactPerson ?? "");
        setAddress(data.schoolAddress ?? "");
        setMonthlyAmount(
          data.monthlyAmount !== undefined &&
            data.monthlyAmount !== null
            ? String(data.monthlyAmount)
            : ""
        );
        setSenderEmail(data.senderEmail ?? "");
      } catch (error) {
        console.error("Failed to load school settings:", error);

        setSettingsStatus({
          type: "error",
          message: "Unable to load school settings.",
        });
      } finally {
        setIsLoadingSettings(false);
      }
    }

    loadSettings();
  }, []);

  // -----------------------------------------
  // Save General Settings
  // -----------------------------------------
  async function handleSaveSettings() {
    setSettingsStatus(null);

    if (!schoolName.trim()) {
      setSettingsStatus({
        type: "error",
        message: "School Name is required.",
      });
      return;
    }

    const amount = Number(monthlyAmount);

    if (!Number.isFinite(amount) || amount < 0) {
      setSettingsStatus({
        type: "error",
        message: "Monthly Amount must be zero or greater.",
      });
      return;
    }

    try {
      setIsSavingSettings(true);

      const updated = await updateSchoolSettings({
        schoolName: schoolName.trim(),
        contactPerson: contactPerson.trim(),
        schoolAddress: address.trim(),
        monthlyAmount: amount,
        senderEmail: senderEmail.trim(),
      });

      // Update fields with backend response
      setSchoolName(updated.schoolName ?? "");
      setContactPerson(updated.contactPerson ?? "");
      setAddress(updated.schoolAddress ?? "");
      setMonthlyAmount(
        updated.monthlyAmount !== undefined &&
          updated.monthlyAmount !== null
          ? String(updated.monthlyAmount)
          : ""
      );
      setSenderEmail(updated.senderEmail ?? "");

      setSettingsStatus({
        type: "success",
        message: "Settings saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save school settings:", error);

      setSettingsStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save school settings.",
      });
    } finally {
      setIsSavingSettings(false);
    }
  }

  // -----------------------------------------
  // Change Password
  // -----------------------------------------
  async function handleChangePassword() {
    setPasswordStatus(null);

    if (!user) {
      setPasswordStatus({
        type: "error",
        message: "You must be signed in.",
      });
      return;
    }

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordStatus({
        type: "error",
        message: "Please fill in all password fields.",
      });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordStatus({
        type: "error",
        message:
          "New password must be at least 6 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: "error",
        message: "New passwords do not match.",
      });
      return;
    }

    try {
      setIsSavingPassword(true);

      await changeUserPassword({
        email: user.email,
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setPasswordStatus({
        type: "success",
        message: "Password updated successfully.",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to change password:", error);

      setPasswordStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to change password.",
      });
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)]">

        {/* Header */}
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-[28px]">
              Settings
            </h2>
          </div>
        </header>

        <div className="space-y-4 px-3 py-4 sm:px-4 lg:px-5 lg:py-5">

          {/* ===================================== */}
          {/* GENERAL SETTINGS */}
          {/* ===================================== */}

          <SettingsSection title="General Settings">

            {isLoadingSettings ? (
              <p className="text-sm text-slate-500">
                Loading settings...
              </p>
            ) : (
              <>
                {/* School Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    School Name
                  </label>

                  <input
                    value={schoolName}
                    onChange={(event) =>
                      setSchoolName(event.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Contact Person
                  </label>

                  <input
                    value={contactPerson}
                    onChange={(event) =>
                      setContactPerson(event.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                  />
                </div>

                {/* School Address */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    School Address
                  </label>

                  <textarea
                    value={address}
                    onChange={(event) =>
                      setAddress(event.target.value)
                    }
                    rows={3}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                  />
                </div>

                {/* Monthly Amount */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Monthly Amount (Rs.)
                  </label>

                  <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus-within:border-[#0B5394] focus-within:bg-white">
                    <span className="mr-2 text-sm font-semibold text-slate-500">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={monthlyAmount}
                      onChange={(event) =>
                        setMonthlyAmount(event.target.value)
                      }
                      className="w-full bg-transparent text-sm text-slate-700 outline-none"
                    />
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    This amount will be applied to all active
                    student subscriptions.
                  </p>
                </div>

                {/* Sender Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Sender Email
                  </label>

                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(event) =>
                      setSenderEmail(event.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    Notifications to parents will be sent from
                    this address.
                  </p>
                </div>

                {/* Status */}
                {settingsStatus ? (
                  <p
                    className={`text-sm font-medium ${
                      settingsStatus.type === "success"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {settingsStatus.message}
                  </p>
                ) : null}

                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B5394] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#084c7a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} />

                  {isSavingSettings
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </>
            )}
          </SettingsSection>

          {/* ===================================== */}
          {/* CHANGE PASSWORD */}
          {/* ===================================== */}

          <SettingsSection title="Change Password">

            {/* Current Password */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Current Password
              </label>

              <input
                type="password"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
              />
            </div>

            {/* Password Status */}
            {passwordStatus ? (
              <p
                className={`text-sm font-medium ${
                  passwordStatus.type === "success"
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {passwordStatus.message}
              </p>
            ) : null}

            {/* Password Save Button */}
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={isSavingPassword}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B5394] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#084c7a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />

              {isSavingPassword
                ? "Saving..."
                : "Save Changes"}
            </button>

          </SettingsSection>
        </div>
      </div>
    </div>
  );
}