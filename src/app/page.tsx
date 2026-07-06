import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function Home() {
  return (
    <AppShell>
      <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
        <div className="text-center space-y-2">
          <h1 className="font-display text-4xl font-bold neon-text">
            Kepolisian Futuristic
          </h1>
          <p className="font-display text-2xl font-semibold text-cyan">Sabhara Devision</p>
          <p className="text-sm text-muted-foreground">Sistem Laporan Duty</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-md border border-cyan/40 bg-primary/10 px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            Login Anggota
          </Link>
          <Link
            href="/feed"
            className="rounded-md border border-border px-6 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary"
          >
            Lihat Feed
          </Link>
        </div>
      </main>
    </AppShell>
  );
}
