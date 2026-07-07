import Link from "next/link";
import { createExportSignedUrl, listExportFiles } from "@/lib/mutations/export-cleanup-actions";
import { Download, FileText, History } from "lucide-react";
import { formatDate } from "@/lib/utils/format";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function ExportHistory() {
  const files = await listExportFiles();

  if (files.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        <History className="mb-2 inline h-4 w-4" />
        Belum ada riwayat export. Cron otomatis tiap hari 03:30 UTC (10:30 WIB) akan export & hapus duty lebih dari 14 hari.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map(async (f) => {
        const url = await createExportSignedUrl(f.name);
        return (
          <div
            key={f.name}
            className="flex items-center gap-3 rounded-md border border-border/40 bg-card/60 p-2"
          >
            <FileText className="h-4 w-4 text-cyan" />
            <div className="flex-1 min-w-0">
              <p className="truncate font-mono text-xs">{f.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {formatFileSize(f.size)} • {f.created_at ? formatDate(f.created_at) : ""}
              </p>
            </div>
            {url ? (
              <a
                href={url}
                download={f.name}
                className="rounded-md border border-cyan/30 bg-cyan/10 p-1.5 text-cyan transition-colors hover:bg-cyan/20"
                aria-label={`Download ${f.name}`}
              >
                <Download className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span className="text-xs text-muted-foreground">Gagal</span>
            )}
          </div>
        );
      })}
      <p className="pt-1 text-[10px] text-muted-foreground/70">
        Signed URL berlaku 1 jam. Klik untuk download.
      </p>
    </div>
  );
}
