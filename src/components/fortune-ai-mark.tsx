import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";
const dim: Record<Size, number> = { sm: 32, md: 48, lg: 64 };

type Props = {
  size?: Size;
  glyph?: string;
  className?: string;
};

/**
 * 朱印-style brand mark. The glyph is configurable so the marketing team can
 * settle on the final character (易 / 占 / 命 / 術) without editing components.
 */
export function FortuneAIMark({ size = "md", glyph = "易", className }: Props) {
  const px = dim[size];
  return (
    <div
      aria-label="Fortune AI"
      role="img"
      className={cn(
        "stamp-shuin font-decorative inline-flex items-center justify-center select-none",
        className,
      )}
      style={{ width: px, height: px, fontSize: Math.round(px * 0.5) }}
    >
      <span aria-hidden className="leading-none">
        {glyph}
      </span>
    </div>
  );
}
