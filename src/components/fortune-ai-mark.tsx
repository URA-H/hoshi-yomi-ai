import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl";

// 文字サイズ (px) - 赤枠を廃止したのでフレーム寸法は不要、文字自体のサイズを直接定義
const fontPx: Record<Size, number> = {
  sm: 28, // navbar/footer 用
  md: 56, // 中間
  lg: 96, // Hero 用
  xl: 144, // 特別演出
};

type Props = {
  size?: Size;
  /** 表示する一文字。デフォルト「星」(占星術の中核モチーフ) */
  glyph?: string;
  /** 追加クラス */
  className?: string;
  /** スクリーンリーダー用ラベル */
  ariaLabel?: string;
};

/**
 * Fortune AI のブランドマーク。
 *
 * 赤い stamp フレームを廃止し、Yuji Boku (筆書) の「星」一字を金箔色で
 * 単独表示する。文字そのものをロゴとして扱う和洋折衷の判子的アプローチ。
 *
 * - フォント: var(--font-seal) → Yuji Boku
 * - 着色: 金箔 → 朱明 → 金箔 のグラデ、テキストクリップ
 * - エフェクト: 金箔の glow + 紫紺の遠 glow
 */
export function FortuneAIMark({
  size = "md",
  glyph = "星",
  className,
  ariaLabel = "Fortune AI",
}: Props) {
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={cn(
        "seal-mark inline-flex items-center justify-center select-none",
        className,
      )}
      style={{ fontSize: fontPx[size] }}
    >
      <span aria-hidden className="leading-none">
        {glyph}
      </span>
    </span>
  );
}
