export function CenterBadge() {
  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center z-0">
      <div className="absolute inset-0 hud-circle-1" />
      <div className="absolute inset-4 hud-circle-2" />
      <div className="absolute inset-8 hud-circle-3" />

      <div className="absolute inset-12 border border-cyan-500/50 rounded-full flex flex-col items-center justify-center bg-cyan-900/20 backdrop-blur-sm shadow-[inset_0_0_50px_rgba(0,240,255,0.2)]">
        <div className="relative flex flex-col items-center justify-center mt-2">
          <svg
            viewBox="0 0 100 120"
            className="w-28 h-28 fill-cyan-950 stroke-cyan-400 drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]"
          >
            <path
              d="M 50 5 L 90 20 L 90 60 C 90 90 50 115 50 115 C 50 115 10 90 10 60 L 10 20 Z"
              strokeWidth="2"
            />
            <path
              d="M 50 12 L 82 25 L 82 58 C 82 82 50 104 50 104 C 50 104 18 82 18 58 L 18 25 Z"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <circle cx="50" cy="55" r="16" className="fill-transparent stroke-cyan-400" strokeWidth="1.5" />
            <path
              d="M 50 43 L 54 52 L 63 53 L 56 60 L 58 69 L 50 64 L 42 69 L 44 60 L 37 53 L 46 52 Z"
              className="fill-cyan-400"
            />
            <path d="M 30 70 Q 25 60 30 50" className="fill-transparent stroke-cyan-500" strokeWidth="1.5" />
            <path d="M 70 70 Q 75 60 70 50" className="fill-transparent stroke-cyan-500" strokeWidth="1.5" />
          </svg>

          <div className="absolute top-4 w-full text-center">
            <span className="text-cyan-200 font-display font-bold tracking-[0.2em] text-xs drop-shadow-[0_0_5px_#00f0ff]">
              POLICE
            </span>
          </div>
        </div>
      </div>

      <div className="absolute left-0 top-1/2 -translate-x-1/2 w-4 h-1 bg-cyan-400 shadow-[0_0_10px_#00f0ff]" />
      <div className="absolute right-0 top-1/2 translate-x-1/2 w-4 h-1 bg-cyan-400 shadow-[0_0_10px_#00f0ff]" />
      <div className="absolute top-0 left-1/2 -translate-y-1/2 h-4 w-1 bg-cyan-400 shadow-[0_0_10px_#00f0ff]" />
      <div className="absolute bottom-0 left-1/2 translate-y-1/2 h-4 w-1 bg-cyan-400 shadow-[0_0_10px_#00f0ff]" />
    </div>
  );
}
