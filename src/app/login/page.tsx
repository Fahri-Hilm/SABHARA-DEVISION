"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppShell } from "@/components/layout/AppShell";
import { loginMemberAction, loginAdminAction } from "./actions";
import { ShieldCheck, Users, KeyRound, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [tab, setTab] = useState<"member" | "admin">("member");

  const [memberState, memberAction] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      try {
        await loginMemberAction(formData);
      } catch (e) {
        return { error: e instanceof Error ? e.message : "Gagal login" };
      }
      return null;
    },
    null,
  );

  const [adminState, adminAction] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      try {
        await loginAdminAction(formData);
      } catch (e) {
        return { error: e instanceof Error ? e.message : "Gagal login" };
      }
      return null;
    },
    null,
  );

  return (
    <AppShell>
      <main className="flex flex-1 items-center justify-center p-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="fade-up text-center space-y-2" style={{ animationDelay: "100ms" }}>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full glow-border bg-cyan-950/50">
              <ShieldCheck className="h-6 w-6 text-cyan-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-gradient glow-text">
              Sabhara Devision
            </h1>
            <p className="text-sm text-muted-foreground">Login untuk melapor duty</p>
          </div>

          <div className="fade-up glass-strong gradient-border rounded-xl p-6" style={{ animationDelay: "200ms" }}>
            <Tabs value={tab} onValueChange={(v) => setTab(v as "member" | "admin")}>
              <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
                <TabsTrigger value="member" className="gap-2 data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-300">
                  <Users className="h-4 w-4" />
                  Anggota
                </TabsTrigger>
                <TabsTrigger value="admin" className="gap-2 data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-300">
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="member" className="space-y-4 pt-6">
                <form action={memberAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="member-code" className="flex items-center gap-1.5 text-xs">
                      <KeyRound className="h-3 w-3" />
                      Kode Akses Anggota
                    </Label>
                    <Input
                      id="member-code"
                      name="code"
                      type="password"
                      placeholder="Masukkan kode akses"
                      autoComplete="off"
                      required
                      className="font-mono"
                    />
                  </div>
                  {memberState?.error && (
                    <p className="text-sm text-destructive fade-in">{memberState.error}</p>
                  )}
                  <Button type="submit" className="w-full gap-2">
                    Login Anggota
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 pt-6">
                <form action={adminAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-code" className="flex items-center gap-1.5 text-xs">
                      <KeyRound className="h-3 w-3" />
                      Kode Admin
                    </Label>
                    <Input
                      id="admin-code"
                      name="code"
                      type="password"
                      placeholder="Masukkan kode admin"
                      autoComplete="off"
                      required
                      className="font-mono"
                    />
                  </div>
                  {adminState?.error && (
                    <p className="text-sm text-destructive fade-in">{adminState.error}</p>
                  )}
                  <Button type="submit" variant="default" className="w-full gap-2">
                    Login Admin
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          <p className="fade-up text-center text-[10px] text-muted-foreground/50" style={{ animationDelay: "300ms" }}>
            Kepolisian Futuristic • Secure System
          </p>
        </div>
      </main>
    </AppShell>
  );
}
