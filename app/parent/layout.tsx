import { AuthGuard } from "@/components/auth/AuthGuard";
import { ParentShell } from "@/components/parent/ParentShell";

export default function ParentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard role="parent">
      <ParentShell>{children}</ParentShell>
    </AuthGuard>
  );
}
