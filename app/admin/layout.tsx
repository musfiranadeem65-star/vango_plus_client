import { AdminShell } from "@/components/admin/AdminShell";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard role="admin">
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  );
}
