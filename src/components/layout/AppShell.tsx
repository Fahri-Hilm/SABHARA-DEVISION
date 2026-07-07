"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListChecks, PlusCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/feed", label: "Feed", icon: ListChecks },
  { href: "/submit", label: "Duty", icon: PlusCircle },
  { href: "/admin/dashboard", label: "Admin", icon: ShieldCheck },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="scanline flex min-h-screen flex-1">
      <aside className="glass-strong glow-border fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r-0 lg:flex">
        <div className="border-b border-cyan-500/20 px-5 py-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
              <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-cyan-400/60" />
            </div>
            <div>
              <h1 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 glow-text">
                Sabhara
              </h1>
              <p className="font-mono text-[9px] text-cyan-500/50">DEVISION</p>
            </div>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {NAV_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all fade-up",
                  active
                    ? "bg-cyan-500/10 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.15)]"
                    : "text-cyan-400/60 hover:bg-cyan-500/5 hover:text-cyan-300",
                )}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
                )}
                <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-4">
          <div className="glow-border bg-panel-bg rounded-lg p-3 font-mono text-[10px] text-cyan-400/70">
            <div className="mb-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
              <span className="text-green-400">SYSTEM ONLINE</span>
            </div>
            <p>Kepolisian Futuristic</p>
            <p className="text-cyan-500/50">v1.0.0</p>
          </div>
        </div>
      </aside>

      <main className="mobile-nav-offset flex-1 overflow-y-auto lg:pl-60">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>

      <nav className="glass-strong glow-border fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t-0 lg:hidden safe-area-inset-bottom">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex h-16 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors",
                active ? "text-cyan-300" : "text-cyan-500/50",
              )}
            >
              <Icon className={cn("h-5 w-5 transition-transform", active && "scale-110")} />
              <span className="font-medium">{item.label}</span>
              {active && <span className="absolute bottom-1 h-0.5 w-6 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
