import { cn } from "@/lib/utils";

type MemberAvatarProps = {
  name: string;
  rank?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_CLASS: Record<NonNullable<MemberAvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function MemberAvatar({ name, rank, size = "md", className }: MemberAvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-cyan/40 bg-secondary font-mono font-semibold text-cyan",
        SIZE_CLASS[size],
        className,
      )}
      aria-label={`${name}${rank ? `, ${rank}` : ""}`}
      title={`${name}${rank ? `, ${rank}` : ""}`}
    >
      {getInitials(name)}
    </div>
  );
}
