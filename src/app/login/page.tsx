"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppShell } from "@/components/layout/AppShell";
import { loginMemberAction, loginAdminAction } from "./actions";
import { ShieldCheck, Users } from "lucide-react";

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
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 rounded-lg border border-border/60 bg-card/80 p-6">
          <div className="space-y-1 text-center">
            <h1 className="font-display text-2xl font-bold neon-text">Sabhara Devision</h1>
            <p className="text-sm text-muted-foreground">Login untuk melapor duty</p>
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as "member" | "admin")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="member" className="gap-2">
                <Users className="h-4 w-4" />
                Anggota
              </TabsTrigger>
              <TabsTrigger value="admin" className="gap-2">
                <ShieldCheck className="h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="member" className="space-y-4 pt-4">
              <form action={memberAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="member-code">Kode Akses Anggota</Label>
                  <Input
                    id="member-code"
                    name="code"
                    type="password"
                    placeholder="Masukkan kode akses"
                    autoComplete="off"
                    required
                  />
                </div>
                {memberState?.error && (
                  <p className="text-sm text-destructive">{memberState.error}</p>
                )}
                <Button type="submit" className="w-full">
                  Login Anggota
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4 pt-4">
              <form action={adminAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-code">Kode Admin</Label>
                  <Input
                    id="admin-code"
                    name="code"
                    type="password"
                    placeholder="Masukkan kode admin"
                    autoComplete="off"
                    required
                  />
                </div>
                {adminState?.error && (
                  <p className="text-sm text-destructive">{adminState.error}</p>
                )}
                <Button type="submit" variant="default" className="w-full">
                  Login Admin
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </AppShell>
  );
}
