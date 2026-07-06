"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cleanupOldPhotosAction } from "@/lib/mutations/cleanup-actions";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function ManualCleanupButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ cleaned: number; errors: string[] } | null>(null);

  function handleCleanup() {
    startTransition(async () => {
      const r = await cleanupOldPhotosAction();
      if (r.errors.length > 0 && r.cleaned === 0) {
        toast.error(`Gagal: ${r.errors[0]}`);
      } else {
        toast.success(`${r.cleaned} foto dibersihkan`);
        setResult({ cleaned: r.cleaned, errors: r.errors });
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={handleCleanup} disabled={pending} variant="outline" size="sm">
        <Trash2 className="h-4 w-4" />
        {pending ? "Membersihkan..." : "Jalankan Cleanup"}
      </Button>
      {result && (
        <span className="font-mono text-xs text-muted-foreground">
          Terakhir: {result.cleaned} foto{result.errors.length > 0 ? ` (${result.errors.length} error)` : ""}
        </span>
      )}
    </div>
  );
}
