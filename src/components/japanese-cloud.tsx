import { cn } from "@/lib/utils";

type Props = {
  /** ピクセル単位の幅。高さは比率で決まる */
  width?: number;
  /** 反転 (右流れ ↔ 左流れ) */
  flip?: boolean;
  className?: string;
};

/**
 * 琳派風の雲帯 (霞)。
 * 上下に波打つ細長い帯。上縁に金箔ライン、本体は白練の極薄塗り。
 * 過剰な装飾は避け、シルエットで日本画らしさを醸す。
 */
export function JapaneseCloud({
  width = 360,
  flip = false,
  className,
}: Props) {
  return (
    <svg
      role="presentation"
      aria-hidden
      viewBox="0 0 400 60"
      width={width}
      height={width * 0.15}
      preserveAspectRatio="none"
      className={cn("select-none", flip && "scale-x-[-1]", className)}
    >
      {/* 雲本体 (白練の極薄) */}
      <path
        d="M 5 38
           C 25 18 55 18 80 32
           C 105 22 145 22 175 33
           C 205 23 245 25 275 33
           C 305 25 345 27 380 36
           L 395 38
           L 395 48
           C 360 50 320 48 290 48
           C 250 48 210 48 175 48
           C 140 48 100 48 70 48
           C 45 48 20 48 5 48
           Z"
        fill="#F3F0E6"
        opacity="0.07"
      />

      {/* 上縁の金箔ライン (琳派の特徴) */}
      <path
        d="M 5 38
           C 25 18 55 18 80 32
           C 105 22 145 22 175 33
           C 205 23 245 25 275 33
           C 305 25 345 27 380 36
           L 395 38"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="0.8"
        opacity="0.32"
      />

      {/* 雲の末尾に小さな渦巻きアクセント (琳派の "千鳥雲" 風) */}
      <path
        d="M 380 36 Q 388 34 392 40 Q 388 44 384 42"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="0.8"
        opacity="0.35"
      />
    </svg>
  );
}
