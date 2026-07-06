import { cn } from "@/lib/utils";

type FeedChannelProps = {
  title: string;
  subtitle?: string;
  count?: number;
  className?: string;
  children: React.ReactNode;
};

export function FeedChannel({ title, subtitle, count, className, children }: FeedChannelProps) {
  return (
    <section className={cn("flex flex-col", className)} data-testid="feed-channel">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="font-mono text-cyan">#</span>
          <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
          {typeof count === "number" && (
            <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
              {count}
            </span>
          )}
        </div>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </header>
      <div className="flex flex-col gap-3 p-4">{children}</div>
    </section>
  );
}
