import { cn } from "@/lib/utils";

/**
 * セクション間に置く装飾区切り。
 * 金線が左右に伸び、中央に菱形の glowing dot を配置する。
 * 「東洋の書斎」の装丁本にある章頭のフラリッシュを意識。
 */
export function OrnamentFlourish({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("ornament-flourish my-(--spacing-ma-lg)", className)}
    >
      <div className="ornament-flourish-diamond" />
    </div>
  );
}
