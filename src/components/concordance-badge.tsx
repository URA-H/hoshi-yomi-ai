import { cn } from "@/lib/utils";

export type ConcordanceLevel = "three" | "two" | "one";

const config: Record<
  ConcordanceLevel,
  {
    dots: string;
    label: string;
    description: string;
    className: string;
  }
> = {
  three: {
    dots: "⚪︎⚪︎⚪︎",
    label: "三術合致",
    description: "三つの占術が同じ方向を示しています",
    className:
      "text-(--color-accent-emphasis) border-(--color-accent-emphasis)/50 bg-(--color-accent-emphasis)/10",
  },
  two: {
    dots: "⚪︎⚪︎○",
    label: "二術合致",
    description: "二つの占術が一致しています",
    className:
      "text-(--color-accent-primary) border-(--color-accent-primary)/40 bg-(--color-accent-primary)/8",
  },
  one: {
    dots: "⚪︎○○",
    label: "一術示唆",
    description: "一つの占術の見方です",
    className:
      "text-(--color-text-secondary) border-(--color-border-subtle) bg-(--color-bg-elevated)",
  },
};

type Props = {
  level: ConcordanceLevel;
  showLabel?: boolean;
  className?: string;
};

/**
 * Concordance badge — visualizes how many of the three Eastern divinations
 * agree. Color + symbol + text is intentional (color is never the sole
 * channel, for color-blindness accessibility).
 *
 * See docs/copy-guide.md §2.5 for the canonical micro-copy.
 */
export function ConcordanceBadge({ level, showLabel = true, className }: Props) {
  const c = config[level];
  return (
    <div
      role="img"
      aria-label={`${c.label}: ${c.description}`}
      className={cn(
        "inline-flex items-center gap-2 rounded-sm border px-3 py-1.5",
        "font-mincho text-(length:--text-caption) tracking-(--tracking-jp-wide)",
        c.className,
        className,
      )}
    >
      <span className="font-decorative text-base leading-none" aria-hidden>
        {c.dots}
      </span>
      {showLabel && <span>{c.label}</span>}
    </div>
  );
}
