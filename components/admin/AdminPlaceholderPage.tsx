export function AdminPlaceholderPage({
  title,
}: {
  title: string;
}) {
  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-surface p-8 text-center shadow-[var(--shadow-card)]">
      <h1 className="text-2xl font-bold text-primary-dark">{title}</h1>
      <p className="mt-2 text-muted">This section is coming soon.</p>
    </div>
  );
}
