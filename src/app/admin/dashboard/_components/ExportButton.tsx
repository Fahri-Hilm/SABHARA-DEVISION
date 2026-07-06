"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { exportDutyCsvAction } from "@/lib/mutations/export-actions";
import { toast } from "sonner";
import { Download } from "lucide-react";

export function ExportButton() {
  const [pending, startTransition] = useTransition();
  const [lastFilename, setLastFilename] = useState<string | null>(null);

  function handleExport() {
    startTransition(async () => {
      const result = await exportDutyCsvAction();
      if (result.error || !result.csv || !result.filename) {
        toast.error(result.error ?? "Gagal export");
        return;
      }
      const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setLastFilename(result.filename);
      toast.success(`Export: ${result.filename}`);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={handleExport} disabled={pending} variant="outline" size="sm">
        <Download className="h-4 w-4" />
        {pending ? "Mengexport..." : "Export CSV"}
      </Button>
      {lastFilename && (
        <span className="font-mono text-xs text-muted-foreground">{lastFilename}</span>
      )}
    </div>
  );
}
