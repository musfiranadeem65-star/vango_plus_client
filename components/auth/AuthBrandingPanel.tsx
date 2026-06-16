import { VanGoLogo } from "./VanGoLogo";

export function AuthBrandingPanel() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#2e75b6] via-[#1e5a8f] to-[#0d9488] p-12 text-white">
      <VanGoLogo />

      <div className="space-y-6">
        <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden>
            <rect x="20" y="35" width="80" height="45" rx="8" fill="white" opacity="0.15" />
            <rect x="28" y="42" width="22" height="16" rx="3" fill="white" opacity="0.9" />
            <rect x="55" y="42" width="22" height="16" rx="3" fill="white" opacity="0.5" />
            <rect x="82" y="42" width="10" height="16" rx="3" fill="white" opacity="0.3" />
            <circle cx="35" cy="82" r="8" fill="white" opacity="0.9" />
            <circle cx="85" cy="82" r="8" fill="white" opacity="0.9" />
            <path
              d="M50 20 L70 20 L75 35 L45 35 Z"
              fill="white"
              opacity="0.7"
            />
          </svg>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">School transport, simplified</h2>
          <p className="text-white/80 max-w-sm mx-auto text-base leading-relaxed">
            Track pickups, manage routes, and keep parents informed — all in one friendly platform.
          </p>
        </div>
      </div>

      <p className="text-sm text-white/60">
        © {new Date().getFullYear()} VanGo Plus. All rights reserved.
      </p>
    </div>
  );
}
