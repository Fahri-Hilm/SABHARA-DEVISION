import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { buttonVariants } from "@/components/ui/button";
import { ShieldCheck, ListChecks, ArrowRight, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <AppShell>
      <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6 py-16">
        <div className="fade-up text-center space-y-3" style={{ animationDelay: "100ms" }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan/80">
            <ShieldCheck className="h-3 w-3" />
            Secure System
          </div>
        </div>

        <div className="fade-up space-y-2 text-center" style={{ animationDelay: "200ms" }}>
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
            <span className="text-gradient neon-text">KEPOLISIAN</span>
          </h1>
          <h2 className="font-display text-3xl font-semibold text-foreground/90 sm:text-4xl">
            FUTURISTIC
          </h2>
          <p className="font-mono text-lg text-cyan neon-text sm:text-xl">
            SABHARA DEVISION
          </p>
        </div>

        <p className="fade-up max-w-md text-center text-sm text-muted-foreground" style={{ animationDelay: "300ms" }}>
          Sistem Laporan Duty Anggota Divisi Sabhara — Real-time tracking, approval workflow, auto-cleanup.
        </p>

        <div className="fade-up flex flex-wrap gap-3" style={{ animationDelay: "400ms" }}>
          <Link
            href="/login"
            className="group relative overflow-hidden rounded-lg border border-cyan/40 bg-cyan/10 px-6 py-3 text-sm font-medium text-cyan transition-all hover:bg-cyan/20 hover:neon-glow"
          >
            <span className="relative z-10 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Login Anggota
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          <Link
            href="/feed"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-border/60 bg-secondary/30 text-foreground/80 hover:bg-secondary hover:text-foreground",
            )}
          >
            <ListChecks className="h-4 w-4" />
            Lihat Feed
          </Link>
        </div>

        <div
          className="fade-up glass mt-8 w-full max-w-md rounded-lg p-4 font-mono text-xs"
          style={{ animationDelay: "500ms" }}
        >
          <div className="mb-2 flex items-center gap-1.5 text-cyan/70">
            <Terminal className="h-3 w-3" />
            <span className="text-[10px] uppercase tracking-widest">System Status</span>
          </div>
          <div className="space-y-1 text-muted-foreground">
            <div className="flex justify-between">
              <span>&gt; auth</span>
              <span className="text-success">[online]</span>
            </div>
            <div className="flex justify-between">
              <span>&gt; storage</span>
              <span className="text-success">[ready]</span>
            </div>
            <div className="flex justify-between">
              <span>&gt; cleanup_cron</span>
              <span className="text-success">[active]</span>
            </div>
            <div className="flex justify-between">
              <span>&gt; approval_workflow</span>
              <span className="text-cyan">[ready]</span>
            </div>
            <div className="pt-1 text-cyan/60">
              <span className="cursor-blink">{">_"}</span>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
