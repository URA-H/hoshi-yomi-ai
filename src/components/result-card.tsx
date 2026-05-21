import type { ReactNode } from "react";
import { ConcordanceBadge, type ConcordanceLevel } from "./concordance-badge";
import { Divider } from "./divider";
import { cn } from "@/lib/utils";

type Props = {
  period: string;
  concordance: ConcordanceLevel;
  title: string;
  body: ReactNode;
  advice: ReactNode;
  children?: ReactNode;
  className?: string;
};

/**
 * Result card — the canonical layout for a fortune reading.
 *
 * The component intentionally forces:
 *  - A concordance level (color + symbol + text)
 *  - A constructive `advice` block, so every reading offers a way forward
 *  - A standing disclaimer footer pointing decisions back to the user
 *
 * This structure was agreed across philosophy / history / copy reviews
 * (see docs/philosophy-review.md and docs/copy-guide.md).
 */
export function ResultCard({
  period,
  concordance,
  title,
  body,
  advice,
  children,
  className,
}: Props) {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-sm border border-(--color-border-subtle) bg-(--color-bg-surface)",
        className,
      )}
    >
      {/* 上部金線 */}
      <div className="h-px bg-gradient-to-r from-transparent via-(--color-accent-emphasis)/50 to-transparent" />

      <div className="relative p-8 md:p-10">
        <div className="deco-kinpaku-chiri pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative space-y-(--spacing-ma-md)">
          <header className="space-y-3">
            <p className="font-mincho text-(length:--text-caption) tracking-(--tracking-jp-decorative) text-(--color-text-muted) uppercase">
              {period}
            </p>
            <ConcordanceBadge level={concordance} />
            <h2 className="font-mincho text-(length:--text-h2) tracking-(--tracking-jp-normal) text-(--color-text-primary)">
              {title}
            </h2>
          </header>

          <Divider />

          <div className="font-gothic text-(length:--text-body-lg) tracking-(--tracking-jp-normal) text-(--color-text-primary)">
            {body}
          </div>

          <section className="rounded-sm border-l-2 border-(--color-accent-emphasis)/60 bg-(--color-bg-elevated) px-5 py-4">
            <h3 className="font-mincho text-(length:--text-h3) text-(--color-accent-emphasis) mb-2">
              向き合い方
            </h3>
            <div className="font-gothic text-(length:--text-body) text-(--color-text-secondary)">
              {advice}
            </div>
          </section>

          {children}

          <p className="font-gothic text-(length:--text-micro) text-(--color-text-muted) leading-relaxed">
            最終的な判断はご自身でなさってください。
            重要な医療・金融・法的判断は、占いではなく専門家にご相談ください。
          </p>
        </div>
      </div>
    </article>
  );
}
