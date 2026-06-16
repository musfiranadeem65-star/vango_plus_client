export default function DriverDashboardPlaceholder() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="rounded-xl bg-surface p-8 shadow-[var(--shadow-card)] text-center max-w-md">
        <h1 className="text-2xl font-bold text-driver">Driver Dashboard</h1>
        <p className="mt-2 text-muted">Coming next — you&apos;re signed in as driver.</p>
        <a href="/login" className="mt-4 inline-block text-sm text-primary hover:underline">
          Back to Login
        </a>
      </div>
    </div>
  );
}
