import type { CrossAnalysisResult, AnalysisDomain } from "@/lib/fortune/types";
import { ConcordanceBadge } from "@/components/concordance-badge";
import { Divider } from "@/components/divider";

const DOMAIN_LABEL: Record<AnalysisDomain, string> = {
  personality: "性格・本質",
  career: "仕事運",
  wealth: "財運",
  relationship: "恋愛・対人",
  health: "健康",
  timing: "時期判断",
  direction: "方位・行動",
};

/** スコアと中央値から、この領域がどのレベルで合致したかを 3 段階で導く */
function concordanceLevel(concordance: number, count: number) {
  if (count === 3 && concordance >= 0.99) return "three" as const;
  if (count >= 2 && concordance >= 0.66) return "two" as const;
  return "one" as const;
}

export function CrossSummary({ cross }: { cross: CrossAnalysisResult }) {
  return (
    <section
      aria-labelledby="cross-title"
      className="rounded-sm border border-(--color-border-subtle) bg-(--color-bg-surface) p-6 md:p-8 space-y-(--spacing-ma-md)"
    >
      <header>
        <p className="font-mincho text-(length:--text-caption) tracking-(--tracking-jp-decorative) text-(--color-text-muted) uppercase">
          クロス分析
        </p>
        <h2
          id="cross-title"
          className="font-mincho text-(length:--text-h2) tracking-(--tracking-jp-normal) mt-1"
        >
          三術の合致度
        </h2>
      </header>

      <Divider />

      <div className="grid gap-3">
        {cross.domains.map((d) => {
          const presentCount = [d.shichusuimei, d.kyusei, d.shiWei].filter(
            (x) => x !== null,
          ).length;
          if (presentCount === 0) return null;

          const level = concordanceLevel(d.concordance, presentCount);

          return (
            <div
              key={d.domain}
              className="rounded-sm border border-(--color-border-subtle) bg-(--color-bg-elevated) p-4"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="font-mincho text-(length:--text-body) tracking-(--tracking-jp-normal)">
                  {DOMAIN_LABEL[d.domain]}
                </h3>
                <ConcordanceBadge level={level} />
              </div>
              <p className="font-gothic text-(length:--text-caption) text-(--color-text-secondary)">
                {d.summary}
              </p>
            </div>
          );
        })}
      </div>

      <p className="text-(length:--text-micro) text-(--color-text-muted) leading-relaxed">
        合致度は「三術の解釈の重なり度合い」を示すもので、未来の確実性を保証するものではありません。
      </p>
    </section>
  );
}
