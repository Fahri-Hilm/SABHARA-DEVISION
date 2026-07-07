"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { exportAndCleanupOldReportsAction } from "@/lib/mutations/export-cleanup-actions";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function ManualExportButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ exported: number; deleted: number; csvPath: string | null } | null>(null);

  function handleExport() {
    if (!confirm("Export CSV & hapus duty >14 hari? Data duty yang dihapus tidak bisa dikembalikan.")) {
      return;
    }
    startTransition(async () => {
      const r = await exportAndCleanupOldReportsAction();
      if (r.errors.length > 0 && r.exported === 0) {
        toast.error(`Gagal: ${r.errors[0]}`);
      } else {
        toast.success(`Export ${r.exported} duty ke CSV, ${r.deleted} dihapus`);
        setResult({ exported: r.exported, deleted: r.deleted, csvPath: r.csvPath });
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={handleExport} disabled={pending} variant="outline" size="sm">
        <Trash2 className="h-4 w-4" />
        {pending ? "Memproses..." : "Export & Hapus >14 Hari"}
      </Button>
      {result && (
        <span className="font-mono text-xs text-muted-foreground">
          {result.exported > 0
            ? `Export: ${result.exported} duty, hapus: ${result.deleted}`
            : "Tidak ada duty >14 hari"}
        </span>
      )}
    </div>
  );
}
