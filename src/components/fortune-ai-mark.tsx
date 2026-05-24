import { cn } from "@/lib/utils";
import { SealStar } from "./seal-star";

type Size = "sm" | "md" | "lg" | "xl";

// 高さ (px)。SVG「星」は縦長比 (120:160) なので幅は約 0.75 倍。
const heightPx: Record<Size, number> = {
  sm: 28,
  md: 56,
  lg: 96,
  xl: 144,
};

type Props = {
  size?: Size;
  /** 表示する一文字。`"星"` は篆書体 SVG で描画。それ以外は Yuji Boku で描画 */
  glyph?: string;
  className?: string;
  ariaLabel?: string;
};

/**
 * Fortune AI のブランドマーク。
 *
 * デフォルトは「星」を **篆書体 (小篆) 風のインライン SVG** で描画する。
 * 真の篆書体フォントは商用フォントしか無いため、SealStar コンポーネントで
 * 篆書の運筆 (均一な太さ + 丸い起筆収筆 + 縦長比) を再現している。
 *
 * 着色は currentColor で金箔単色、外側に金箔 + 紫紺の二重 drop-shadow glow。
 * 篆書の凛とした単純さを活かすため、グラデーション塗りは敢えて省略。
 *
 * `glyph` を変えると Yuji Boku フォントによるフォールバック表示になる。
 */
export function FortuneAIMark({
  size = "md",
  glyph = "星",
  className,
  ariaLabel = "Fortune AI",
}: Props) {
  const h = heightPx[size];

  if (glyph === "星") {
    return (
      <span
        role="img"
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center justify-center select-none",
          // 臙脂色 — 朱印 / 落款の深紅。dark cosmic 背景に映える
          "text-(--color-enji)",
          // 控えめな臙脂 glow + 紫紺の遠 glow
          "[filter:drop-shadow(0_0_8px_rgb(182_48_62/0.5))_drop-shadow(0_0_22px_rgb(91_50_112/0.3))]",
          className,
        )}
      >
        <SealStar size={h} ariaLabel={glyph} />
      </span>
    );
  }

  // フォールバック: Yuji Boku のテキスト描画
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={cn(
        "seal-mark inline-flex items-center justify-center select-none",
        className,
      )}
      style={{ fontSize: h }}
    >
      <span aria-hidden className="leading-none">
        {glyph}
      </span>
    </span>
  );
}
