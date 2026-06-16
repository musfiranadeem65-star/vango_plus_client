import { AuthBrandingPanel } from "@/components/auth/AuthBrandingPanel";
import { VanGoLogo } from "@/components/auth/VanGoLogo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AuthBrandingPanel />

      <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-10 sm:px-8">
        <div className="mb-8 lg:hidden">
          <div className="rounded-2xl bg-gradient-to-br from-[#2e75b6] to-[#0d9488] p-6 text-center">
            <VanGoLogo compact />
            <p className="mt-2 text-sm text-white/80">Safe Rides, Happy Parents</p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
