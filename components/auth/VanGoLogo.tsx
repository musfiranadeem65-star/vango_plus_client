import Link from "next/link";

export function VanGoLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/login" className="inline-flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="6" width="18" height="11" rx="2" fill="white" opacity="0.9" />
          <rect x="5" y="8" width="5" height="4" rx="1" fill="#2e75b6" />
          <circle cx="7" cy="18" r="2" fill="white" />
          <circle cx="17" cy="18" r="2" fill="white" />
        </svg>
      </div>
      <div>
        <p className={compact ? "text-lg font-bold text-white" : "text-xl font-bold text-white"}>
          VanGo Plus
        </p>
        {!compact && (
          <p className="text-sm text-white/80">Safe Rides, Happy Parents</p>
        )}
      </div>
    </Link>
  );
}
