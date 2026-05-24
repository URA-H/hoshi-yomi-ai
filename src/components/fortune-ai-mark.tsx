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
 * 星読みAI のブランドマーク。
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
  ariaLabel = "星読みAI",
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
          // 多層 glow で「ぼやーっと光る」表情を作る:
          //   layer 1: 朱明 (lighter pink) の極近 inner glow — 文字を内側から照らす
          //   layer 2: 臙脂の中間 glow — 朱印らしい深紅の発光
          //   layer 3: 臙脂の広い拡散 — ガラス越しのような滲み
          //   layer 4: 紫紺の遠 atmospheric glow — 背景と溶け合う霧
          "[filter:drop-shadow(0_0_3px_rgb(224_122_127/0.85))_drop-shadow(0_0_12px_rgb(224_122_127/0.55))_drop-shadow(0_0_28px_rgb(182_48_62/0.55))_drop-shadow(0_0_56px_rgb(91_50_112/0.35))]",
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
