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
import { Trash2 } from "lucide-react";
import { deleteDutyAction } from "@/lib/mutations/duty-actions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { DutyReportWithMember } from "@/lib/supabase/queries";

type DeleteButtonProps = {
  report: DutyReportWithMember;
  isAdmin: boolean;
};

function isWithinOneHour(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 60 * 60 * 1000;
}

export function DeleteButton({ report, isAdmin }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const withinHour = isWithinOneHour(report.created_at);
  if (!isAdmin && !withinHour) return null;

  function handleDelete() {
    startTransition(async () => {
      queryClient.setQueriesData<{ reports: DutyReportWithMember[] }>(
        { queryKey: ["duty-reports"] },
        (old) => {
          if (!old) return old;
          return { ...old, reports: old.reports.filter((r) => r.id !== report.id) };
        },
      );
      const result = await deleteDutyAction(report.id);
      if (result.error) {
        toast.error(result.error);
        queryClient.invalidateQueries({ queryKey: ["duty-reports"] });
      } else {
        toast.success("Laporan dihapus");
        setOpen(false);
      }
    });
  }

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        className="text-destructive"
        onClick={() => setOpen(true)}
        data-testid="delete-btn"
      >
        <Trash2 className="h-4 w-4" />
        Hapus
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Laporan Duty</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Hapus laporan duty <strong>{report.members.name}</strong> ({report.duty_date})?
            {!isAdmin && withinHour && " Dapat dihapus karena masih dalam 1 jam pertama."}
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={pending}>
              {pending ? "Memproses..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
