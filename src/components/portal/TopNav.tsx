"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Activity, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "HOME", icon: Home },
  { href: "/feed", label: "DUTY REPORTS", icon: FileText },
  { href: "/admin/dashboard", label: "ANALYSIS", icon: Activity },
  { href: "/admin/roster", label: "SETTINGS", icon: Settings },
  { href: "/login", label: "PROFILE", icon: User },
];

export function TopNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="flex items-center justify-center pt-8 z-10 w-full relative px-4">
      <div className="glow-border bg-panel-bg backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-3 sm:gap-6 text-xs sm:text-sm tracking-wider font-semibold overflow-x-auto max-w-full">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full transition-all whitespace-nowrap",
                active
                  ? "text-cyan-50 bg-cyan-600/40 shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                  : "text-cyan-400/70 hover:text-cyan-200",
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
