"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { deactivateMemberAction, deleteMemberAction } from "../actions";
import { MemberForm } from "./MemberForm";
import type { Member } from "@/types/db";

export function MemberActions({ member }: { member: Member }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDeactivate() {
    setError(null);
    startTransition(async () => {
      const result = await deactivateMemberAction(member.id);
      if (result.error) setError(result.error);
      else setDeactivateOpen(false);
    });
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteMemberAction(member.id);
      if (result.error) setError(result.error);
      else setDeleteOpen(false);
    });
  }

  return (
    <>
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" onClick={() => setEditOpen(true)}>
          Edit
        </Button>
        {member.is_active ? (
          <Button size="sm" variant="ghost" onClick={() => setDeactivateOpen(true)}>
            Nonaktifkan
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => setEditOpen(true)}>
            Aktifkan
          </Button>
        )}
        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteOpen(true)}>
          Hapus
        </Button>
      </div>

      <MemberForm open={editOpen} onOpenChange={setEditOpen} member={member} />

      <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nonaktifkan Anggota</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Nonaktifkan <strong>{member.name}</strong>? Anggota tidak bisa login tapi riwayat duty tetap ada.
          </p>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeactivateOpen(false)}>
              Batal
            </Button>
            <Button type="button" onClick={handleDeactivate} disabled={pending}>
              {pending ? "Memproses..." : "Nonaktifkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Anggota</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Hapus permanen <strong>{member.name}</strong>? Hanya bisa jika belum punya riwayat duty.
          </p>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
              Batal
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={pending}>
              {pending ? "Memproses..." : "Hapus Permanen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
