export function TerminalPanel() {
  return (
    <div className="flex flex-col items-center z-10 relative w-full px-4">
      <div className="glow-border bg-panel-bg backdrop-blur-md rounded-xl p-4 w-full max-w-[450px] font-mono text-[11px] tracking-widest text-cyan-400 flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute left-0 top-4 bottom-4 w-1 bg-cyan-500/20" />
        <div className="absolute right-0 top-4 bottom-4 w-1 bg-cyan-500/20" />

        <div className="flex justify-between items-center text-cyan-500 mb-2 border-b border-cyan-500/20 pb-2">
          <span>{">_ SYSTEM STATUS"}</span>
          <span className="glow-border px-3 py-1 rounded-full text-[9px] text-cyan-200">
            SECURE SYSTEM
          </span>
        </div>

        <div className="flex justify-between pl-2 pr-2">
          <span>{"> auth"}</span>
          <span className="text-cyan-100">[online]</span>
        </div>
        <div className="flex justify-between pl-2 pr-2">
          <span>{"> storage"}</span>
          <span className="text-cyan-100">[ready]</span>
        </div>
        <div className="flex justify-between pl-2 pr-2">
          <span>{"> cleanup_cron"}</span>
          <span className="text-green-400">[active]</span>
        </div>
        <div className="flex justify-between pl-2 pr-2">
          <span>{"> approval_workflow"}</span>
          <span className="text-cyan-100">[ready]</span>
        </div>

        <div className="mt-2 pl-2 text-cyan-500">
          {">_ "}
          <span className="animate-pulse bg-cyan-500 w-1.5 h-3 inline-block align-middle ml-1" />
        </div>
      </div>
    </div>
  );
}
