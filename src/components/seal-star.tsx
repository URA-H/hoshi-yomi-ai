import { cn } from "@/lib/utils";

/**
 * 「星」字を篆書体 (小篆) 風に描いたインライン SVG。
 *
 * 構成:
 *   - 上半: 日 (太陽) — 楕円 + 中央の横画
 *   - 下半: 生 (生長) — 中央縦画 + 上下の横画 (反り) + 左右の枝画
 *
 * 篆書の特徴:
 *   - 均一な太さ
 *   - 丸い起筆・収筆 (stroke-linecap="round")
 *   - 縦長の比率
 *   - 端部の反り (上横画は若干 U 字、下横画は逆 U 字)
 *
 * 色は外部 CSS の seal-mark クラスから流れ込む linear-gradient を
 * 使用するため、currentColor 経由でブラシ色を継承する。
 */
export function SealStar({
  size = 96,
  className,
  ariaLabel = "星",
}: {
  size?: number;
  className?: string;
  ariaLabel?: string;
}) {
  // SVG 自体は 120x160 の縦長比 (篆書らしい比率)
  // strokeWidth は viewBox 上の単位。実表示で 5-6% 程度の太さ
  const sw = 7.5;

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={size * (120 / 160)}
      height={size}
      viewBox="0 0 120 160"
      className={cn("select-none", className)}
    >
      <title>{ariaLabel}</title>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 日 (太陽) — 上半部 */}
        {/* 楕円の外周 */}
        <ellipse cx="60" cy="36" rx="26" ry="18" />
        {/* 中央の横画 (内部のアクセント) */}
        <line x1="42" y1="36" x2="78" y2="36" />

        {/* 生 (生長) — 下半部 */}
        {/* 上の横画 — 若干反って sprout の上端を表す */}
        <path d="M 32 80 Q 60 73 88 80" />

        {/* 中央の長い縦画 — 字の背骨 */}
        <line x1="60" y1="60" x2="60" y2="140" />

        {/* 左の枝画 — 上下で短い縦 */}
        <line x1="42" y1="92" x2="42" y2="118" />
        {/* 右の枝画 */}
        <line x1="78" y1="92" x2="78" y2="118" />

        {/* 下の横画 — 篆書らしく反って end が跳ね上がる */}
        <path d="M 22 132 Q 60 142 98 132" />
      </g>
    </svg>
  );
}
