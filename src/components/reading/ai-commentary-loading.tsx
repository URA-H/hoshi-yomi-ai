/**
 * AI 解釈セクションのローディングスケルトン
 *
 * 「東洋の書斎」のトーンに合わせ、派手な shimmer は避けて控えめな pulse のみ。
 * 実体と同じレイアウト寸法を取ることで、入れ替わり時の Cumulative Layout Shift
 * を防ぐ。
 */
export function AICommentaryLoading() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="rounded-sm border border-(--color-accent-emphasis)/30 bg-(--color-bg-surface) p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-(--spacing-ma-sm)">
        <p className="font-mincho text-(length:--text-caption) tracking-(--tracking-jp-decorative) text-(--color-accent-emphasis) uppercase">
          AI 統合解釈
        </p>
        <span className="font-gothic text-(length:--text-micro) text-(--color-text-muted)">
          解釈を準備中...
        </span>
      </div>

      <div className="space-y-3 animate-pulse">
        <SkeletonLine width="55%" />
        <SkeletonLine width="100%" />
        <SkeletonLine width="92%" />
        <SkeletonLine width="78%" />
        <div className="h-2" />
        <SkeletonLine width="45%" emphasised />
        <SkeletonLine width="100%" />
        <SkeletonLine width="85%" />
        <SkeletonLine width="60%" />
      </div>

      <p className="mt-(--spacing-ma-md) font-gothic text-(length:--text-micro) text-(--color-text-muted)">
        ※ 三術のデータを統合中。10秒前後でこの欄に解釈が表示されます。
      </p>
    </section>
  );
}

function SkeletonLine({
  width,
  emphasised,
}: {
  width: string;
  emphasised?: boolean;
}) {
  return (
    <div
      className={`h-3 rounded-sm ${
        emphasised
          ? "bg-(--color-accent-emphasis)/25"
          : "bg-(--color-bg-elevated)"
      }`}
      style={{ width }}
      aria-hidden
    />
  );
}
