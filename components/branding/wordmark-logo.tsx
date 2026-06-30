import { cn } from "@/lib/utils";

interface WordmarkLogoProps {
  className?: string;
  compact?: boolean;
}

export function WordmarkLogo({ className, compact = false }: WordmarkLogoProps) {
  return (
    <div className={cn("leading-none select-none", className)} aria-label="Ô Diên One">
      <p
        className={cn(
          "font-black tracking-tight text-gradient",
          compact ? "text-lg" : "text-3xl sm:text-5xl"
        )}
      >
        Ô DIÊN
      </p>
      <p
        className={cn(
          "font-semibold tracking-[0.26em] uppercase text-foreground/90",
          compact ? "text-[10px]" : "text-xs sm:text-sm"
        )}
      >
        ONE
      </p>
    </div>
  );
}
