"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addMemberAction, updateMemberAction } from "../actions";
import type { Member } from "@/types/db";

type MemberFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: Member | null;
};

export function MemberForm({ open, onOpenChange, member }: MemberFormProps) {
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(member);

  async function handleSubmit(formData: FormData) {
    setError(null);
    if (isEdit && member) {
      const result = await updateMemberAction(member.id, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
    } else {
      const result = await addMemberAction(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Anggota" : "Tambah Anggota"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              name="name"
              defaultValue={member?.name ?? ""}
              required
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rank">Pangkat</Label>
            <Input
              id="rank"
              name="rank"
              defaultValue={member?.rank ?? ""}
              maxLength={50}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="badge_number">Nomor Badge</Label>
            <Input
              id="badge_number"
              name="badge_number"
              defaultValue={member?.badge_number ?? ""}
              maxLength={50}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" defaultValue={member?.role ?? "member"}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Anggota</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">{isEdit ? "Simpan" : "Tambah"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
