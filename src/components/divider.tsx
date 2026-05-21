import { cn } from "@/lib/utils";

/**
 * Sumi-bokashi style divider. Use to separate sections within a result card,
 * or between major LP sections.
 */
export function Divider({ className }: { className?: string }) {
  return <div role="separator" aria-hidden className={cn("divider-sumi my-(--spacing-ma-md)", className)} />;
}
