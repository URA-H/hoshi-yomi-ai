import { cn } from "@/lib/utils";

/**
 * 占星術盤 — 北斗七星 / 紫微 / 干支環 を備えた魔法陣風エンブレム
 *
 * 「とんがり帽子のアトリエ」「無職転生」のような幻想的な占星術盤を意識し、
 * 多層のリングと干支 (Earthly Branches) の鏤刻で異世界感を出している。
 *
 * レイヤー (外 → 内):
 *  1. 外輪 (faint solid ring)
 *  2. 干支環 — 子丑寅卯辰巳午未申酉戌亥 を 30° 間隔で配置
 *     (子=北、卯=東、午=南、酉=西 という伝統的方位対応)
 *  3. 干支の間に小さな 4芒星
 *  4. 中輪 (dashed)
 *  5. 内接八芒星 (sacred geometry: 軸方向 + 45°回転の 2 正方形を重ねる)
 *  6. 四隅の方位軸 (cross of cardinals)
 *  7. 北斗七星 — 7 つの 4芒星 + 金線で連結
 *  8. 北極星への指示線 (dashed)
 *  9. 紫微 (Polaris) — 16 頂点の 8芒星 + 強い glow + twinkle
 *  10. 周囲の散光 (slow pulse, off-rhythm)
 */
export function ConstellationEmblem({
  className,
  size = 320,
}: {
  className?: string;
  size?: number;
}) {
  // 4芒星 (sparkle) — 中心 0,0 / 外半径 R / 内半径 r
  const sparkle4 = (R: number, r: number) =>
    `M 0,-${R} L ${r},-${r} L ${R},0 L ${r},${r} L 0,${R} L -${r},${r} L -${R},0 L -${r},-${r} Z`;

  // 8芒星 (Persian-style ornate star)
  const sparkle8 = (R: number, r: number) => {
    const sin225 = 0.3827;
    const cos225 = 0.9239;
    const sin45 = 0.7071;
    const points: [number, number][] = [
      [0, -R],
      [r * sin225, -r * cos225],
      [R * sin45, -R * sin45],
      [r * cos225, -r * sin225],
      [R, 0],
      [r * cos225, r * sin225],
      [R * sin45, R * sin45],
      [r * sin225, r * cos225],
      [0, R],
      [-r * sin225, r * cos225],
      [-R * sin45, R * sin45],
      [-r * cos225, r * sin225],
      [-R, 0],
      [-r * cos225, -r * sin225],
      [-R * sin45, -R * sin45],
      [-r * sin225, -r * cos225],
    ];
    return (
      points
        .map(([x, y], i) =>
          i === 0
            ? `M ${x.toFixed(2)},${y.toFixed(2)}`
            : `L ${x.toFixed(2)},${y.toFixed(2)}`,
        )
        .join(" ") + " Z"
    );
  };

  // 干支 (Earthly Branches): 子から始まり時計回り。子=北、卯=東、午=南、酉=西
  const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

  // 干支の配置 (radius 148, viewBox 320x320, center 160,160)
  const branchPositions = branches.map((kanji, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    return {
      kanji,
      x: 160 + 148 * Math.sin(angle),
      y: 160 - 148 * Math.cos(angle),
      cardinal: i % 3 === 0,
    };
  });

  // 干支間の小さな節点 (radius 130, 12 箇所の中間に各 1 つ → 全 12 箇所)
  const interNodes = Array.from({ length: 12 }, (_, i) => {
    const angle = ((i * 30 + 15) * Math.PI) / 180; // 干支の中間
    return {
      x: 160 + 130 * Math.sin(angle),
      y: 160 - 130 * Math.cos(angle),
    };
  });

  // 内接八芒星 (sacred geometry) - 2 つの正方形を 45° で重ねる
  // r=88 の円に内接 → 軸方向正方形の頂点は (cx±r/√2, cy±r/√2) = (cx±62.2, cy±62.2)
  // 45°回転正方形の頂点は (cx, cy±r), (cx±r, cy) = (160,72), (248,160), (160,248), (72,160)

  return (
    <svg
      role="img"
      aria-label="占星術盤 — 北斗七星と紫微と十二支"
      width={size}
      height={size}
      viewBox="0 0 320 320"
      className={cn("select-none", className)}
    >
      <defs>
        <radialGradient id="emblem-star-glow">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="1" />
          <stop offset="40%" stopColor="#C9A84C" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="emblem-polar-glow">
          <stop offset="0%" stopColor="#F3F0E6" stopOpacity="1" />
          <stop offset="15%" stopColor="#C9A84C" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#A78BBF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#5B3270" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="emblem-rim-glow">
          <stop offset="0%" stopColor="#5B3270" stopOpacity="0" />
          <stop offset="80%" stopColor="#5B3270" stopOpacity="0" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.12" />
        </radialGradient>
      </defs>

      {/* 全体に薄い紫紺の magic-circle 雰囲気 backdrop */}
      <circle cx="160" cy="160" r="155" fill="url(#emblem-rim-glow)" />

      {/* 外輪 (solid) */}
      <circle
        cx="160"
        cy="160"
        r="155"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="0.6"
        opacity="0.22"
      />
      {/* 干支環の内側境界 */}
      <circle
        cx="160"
        cy="160"
        r="138"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="0.35"
        opacity="0.18"
      />

      {/* 干支 12 文字 */}
      <g
        fill="#C9A84C"
        style={{ fontFamily: "var(--font-decorative), 'Shippori Mincho B1', serif" }}
      >
        {branchPositions.map((b) => (
          <text
            key={b.kanji}
            x={b.x.toFixed(2)}
            y={b.y.toFixed(2)}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="14"
            fontWeight="600"
            opacity={b.cardinal ? 0.85 : 0.65}
          >
            {b.kanji}
          </text>
        ))}
      </g>

      {/* 干支間の小さな節点 */}
      <g fill="#C9A84C" opacity="0.4">
        {interNodes.map((n, i) => (
          <g key={i} transform={`translate(${n.x.toFixed(2)}, ${n.y.toFixed(2)})`}>
            <path d={sparkle4(2.2, 0.55)} />
          </g>
        ))}
      </g>

      {/* 中輪 (dashed) */}
      <circle
        cx="160"
        cy="160"
        r="118"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="0.4"
        opacity="0.18"
        strokeDasharray="2,5"
      />

      {/* 内接八芒星 (2 正方形を 45° で重ねる — sacred geometry) */}
      <g stroke="#C9A84C" strokeWidth="0.45" fill="none" opacity="0.18">
        {/* 軸方向の正方形 */}
        <polygon points="98,98 222,98 222,222 98,222" />
        {/* 45° 回転の正方形 */}
        <polygon points="160,72 248,160 160,248 72,160" />
      </g>

      {/* 内輪 (faint solid) */}
      <circle
        cx="160"
        cy="160"
        r="88"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="0.35"
        opacity="0.14"
      />

      {/* 方位軸十字 */}
      <g stroke="#C9A84C" strokeWidth="0.25" opacity="0.1">
        <line x1="160" y1="20" x2="160" y2="300" />
        <line x1="20" y1="160" x2="300" y2="160" />
      </g>

      {/* 北斗七星の連結線 (柄杓型) */}
      <g
        stroke="#C9A84C"
        strokeWidth="0.7"
        fill="none"
        opacity="0.42"
        strokeLinecap="round"
      >
        {/* 升 (bowl) */}
        <line x1="140" y1="175" x2="140" y2="200" />
        <line x1="140" y1="200" x2="165" y2="200" />
        <line x1="165" y1="200" x2="165" y2="175" />
        <line x1="165" y1="175" x2="140" y2="175" />
        {/* 柄 (handle) */}
        <line x1="165" y1="175" x2="187" y2="172" />
        <line x1="187" y1="172" x2="209" y2="167" />
        <line x1="209" y1="167" x2="231" y2="160" />
      </g>

      {/* 北極星への指示線 (点線) */}
      <line
        x1="140"
        y1="175"
        x2="140"
        y2="105"
        stroke="#C9A84C"
        strokeWidth="0.35"
        strokeDasharray="1,4"
        opacity="0.3"
      />

      {/* 北斗七星 — glow halo */}
      <g>
        <circle cx="140" cy="175" r="7" fill="url(#emblem-star-glow)" />
        <circle cx="140" cy="200" r="7" fill="url(#emblem-star-glow)" />
        <circle cx="165" cy="200" r="7" fill="url(#emblem-star-glow)" />
        <circle cx="165" cy="175" r="7" fill="url(#emblem-star-glow)" />
        <circle cx="187" cy="172" r="6" fill="url(#emblem-star-glow)" />
        <circle cx="209" cy="167" r="6" fill="url(#emblem-star-glow)" />
        <circle cx="231" cy="160" r="6" fill="url(#emblem-star-glow)" />
      </g>

      {/* 北斗七星 — 4芒星本体 */}
      <g fill="#F3F0E6">
        <g transform="translate(140, 175)"><path d={sparkle4(5, 1.3)} /></g>
        <g transform="translate(140, 200)"><path d={sparkle4(5, 1.3)} /></g>
        <g transform="translate(165, 200)"><path d={sparkle4(5, 1.3)} /></g>
        <g transform="translate(165, 175)"><path d={sparkle4(5, 1.3)} /></g>
        <g transform="translate(187, 172)"><path d={sparkle4(4.5, 1.1)} /></g>
        <g transform="translate(209, 167)"><path d={sparkle4(4, 1)} /></g>
        <g transform="translate(231, 160)"><path d={sparkle4(3.5, 0.9)} /></g>
      </g>

      {/* 紫微 (Polaris) — 8芒星 + glow + twinkle */}
      <g className="constellation-twinkle">
        <circle cx="140" cy="105" r="28" fill="url(#emblem-polar-glow)" />
        <g transform="translate(140, 105)">
          <path
            d={sparkle8(16, 6.6)}
            fill="#F3F0E6"
            stroke="#C9A84C"
            strokeWidth="0.45"
            strokeOpacity="0.75"
          />
        </g>
        <circle cx="140" cy="105" r="2.8" fill="#F3F0E6" />
      </g>

      {/* 補助の散光 (周辺、別リズムで瞬く) */}
      <g className="star-soft-pulse" fill="#F3F0E6">
        <g transform="translate(55, 100)" opacity="0.55"><path d={sparkle4(1.8, 0.45)} /></g>
        <g transform="translate(270, 195)" opacity="0.5"><path d={sparkle4(1.6, 0.4)} /></g>
        <g transform="translate(55, 235)" opacity="0.55"><path d={sparkle4(1.8, 0.45)} /></g>
        <g transform="translate(260, 250)" opacity="0.45"><path d={sparkle4(1.5, 0.35)} /></g>
        <g transform="translate(175, 60)" opacity="0.5"><path d={sparkle4(1.6, 0.4)} /></g>
        <g transform="translate(245, 90)" opacity="0.45"><path d={sparkle4(1.4, 0.35)} /></g>
        <g transform="translate(95, 270)" opacity="0.5"><path d={sparkle4(1.6, 0.4)} /></g>
      </g>
    </svg>
  );
}
