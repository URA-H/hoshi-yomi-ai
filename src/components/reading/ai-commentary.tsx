import type { CombinedFortuneData } from "@/lib/fortune/types";
import type { Period } from "@/lib/ai/system-prompts";
import { generateFortuneReading } from "@/lib/ai/generate-fortune-reading";

/**
 * AI 解釈セクション (Async Server Component)
 *
 * Suspense 境界の内側で読み込まれる。Claude 呼び出しが終わるまでブロックするが、
 * 親ページの他のセクション (構造化データ) は先に HTML として届く。
 */
export async function AICommentary({
  fortune,
  period,
}: {
  fortune: CombinedFortuneData;
  period: Period;
}) {
  const reading = await generateFortuneReading(fortune, period);

  return (
    <section className="rounded-sm border border-(--color-accent-emphasis)/30 bg-(--color-bg-surface) p-6 md:p-8 reading-fade-in">
      <div className="flex items-center justify-between gap-3 mb-(--spacing-ma-sm)">
        <p className="font-mincho text-(length:--text-caption) tracking-(--tracking-jp-decorative) text-(--color-accent-emphasis) uppercase">
          AI 統合解釈
        </p>
        {reading.source === "mock" && (
          <span className="font-gothic text-(length:--text-micro) text-(--color-text-muted) border border-(--color-border-subtle) rounded-sm px-2 py-0.5">
            デモ表示
          </span>
        )}
      </div>
      <div className="font-gothic text-(length:--text-body-lg) text-(--color-text-primary) leading-[1.85] tracking-(--tracking-jp-normal) whitespace-pre-wrap">
        {reading.text}
      </div>
    </section>
  );
}
