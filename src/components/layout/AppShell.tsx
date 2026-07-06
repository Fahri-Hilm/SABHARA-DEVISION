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
    <div className="flex min-h-full flex-1">
      <aside className="hidden w-60 shrink-0 border-r border-border/60 bg-sidebar lg:flex lg:flex-col">
        <div className="border-b border-border/60 px-4 py-5">
          <h1 className="font-display text-sm font-bold uppercase tracking-wider text-cyan">
            Sabhara Devision
          </h1>
          <p className="font-mono text-[10px] text-muted-foreground">Kepolisian Futuristic</p>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive(item.href)
                    ? "bg-primary/15 text-primary"
                    : "text-foreground/70 hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="mobile-nav-offset flex-1 overflow-y-auto">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-border/60 bg-background/95 backdrop-blur lg:hidden safe-area-inset-bottom">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-16 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors",
                isActive(item.href) ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
