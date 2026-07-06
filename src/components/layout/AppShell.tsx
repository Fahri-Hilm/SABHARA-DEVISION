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
      <aside className="glass-strong fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-cyan/15 lg:flex">
        <div className="border-b border-cyan/15 px-5 py-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-cyan neon-glow" />
              <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-cyan/60" />
            </div>
            <div>
              <h1 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-cyan">
                Sabhara
              </h1>
              <p className="font-mono text-[9px] text-muted-foreground">DEVISION</p>
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
                    ? "bg-cyan/10 text-cyan neon-glow"
                    : "text-foreground/60 hover:bg-secondary/50 hover:text-foreground",
                )}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-cyan" />
                )}
                <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-4">
          <div className="rounded-lg border border-cyan/15 bg-secondary/30 p-3 font-mono text-[10px] text-muted-foreground">
            <div className="mb-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              <span className="text-success/80">SYSTEM ONLINE</span>
            </div>
            <p>Kepolisian Futuristic</p>
            <p className="text-cyan/60">v1.0.0</p>
          </div>
        </div>
      </aside>

      <main className="mobile-nav-offset flex-1 overflow-y-auto lg:pl-60">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>

      <nav className="glass-strong fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-cyan/15 lg:hidden safe-area-inset-bottom">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex h-16 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors",
                active ? "text-cyan" : "text-muted-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5 transition-transform", active && "scale-110")} />
              <span className="font-medium">{item.label}</span>
              {active && <span className="absolute bottom-1 h-0.5 w-6 rounded-full bg-cyan" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
