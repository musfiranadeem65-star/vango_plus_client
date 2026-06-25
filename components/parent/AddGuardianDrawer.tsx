"use client";

import { ShieldCheck, UploadCloud, X } from "lucide-react";

interface AddGuardianDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function AddGuardianDrawer({ open, onClose }: AddGuardianDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-surface shadow-xl">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">Add New Guardian</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface-container-low"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </header>

        <form className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6">
          <div>
            <label className="font-[family-name:var(--font-inter)] text-sm font-semibold text-foreground">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter guardian's legal name"
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="font-[family-name:var(--font-inter)] text-sm font-semibold text-foreground">
              Relationship
            </label>
            <select className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary">
              <option>Select relationship</option>
              <option>Parent</option>
              <option>Uncle / Aunt</option>
              <option>Grandparent</option>
              <option>Family Friend</option>
              <option>Neighbor</option>
            </select>
          </div>

          <div>
            <label className="font-[family-name:var(--font-inter)] text-sm font-semibold text-foreground">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="(555) 000-0000"
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="font-[family-name:var(--font-inter)] text-sm font-semibold text-foreground">
              Identity Document (Driver&apos;s License or ID)
            </label>
            <div className="mt-2 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-outline-variant bg-surface-bright px-4 py-8 text-center">
              <UploadCloud size={26} className="text-muted" />
              <p className="text-sm font-semibold text-foreground">
                Click to upload or drag &amp; drop
              </p>
              <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                JPG, PNG or PDF (max 5MB)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-surface-bright p-3">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-muted" />
            <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
              By adding this guardian, you authorize them to pick up your children and
              share pickup information with them via SMS.
            </p>
          </div>
        </form>

        <footer className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface-container-low"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-container"
          >
            Save Guardian
          </button>
        </footer>
      </aside>
    </div>
  );
}
