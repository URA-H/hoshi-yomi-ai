import { cn } from "@/lib/utils";

/**
 * 北斗七星 + 紫微 (Polaris) のエンブレム
 *
 * 紫微斗数の「紫微」は北極星を指す。北斗七星はその北極星を見つける道具として
 * 古来用いられた。Fortune AI の世界観そのものを 1 枚の星座図像で表現する。
 *
 * デザイン:
 *   - 二重の天球輪 (outer + dashed inner) で魔法陣風の枠
 *   - 12 方位の節点 (cardinal は大きめの 4芒星、inter-cardinal は小さな 4芒星)
 *   - N/S/E/W を結ぶ薄い十字の方位軸
 *   - 北斗七星の 7 つを 4芒星 (sparkle) として描く
 *   - 紫微 (Polaris) は 8芒星、最大サイズ + glow + twinkle
 *
 * 完全に静的な SVG。Server Component で問題なくレンダリングできる。
 */
export function ConstellationEmblem({
  className,
  size = 240,
}: {
  className?: string;
  size?: number;
}) {
  // 4芒星 (sparkle) — 中心 0,0 / 外半径 R / 内半径 r
  const sparkle4 = (R: number, r: number) =>
    `M 0,-${R} L ${r},-${r} L ${R},0 L ${r},${r} L 0,${R} L -${r},${r} L -${R},0 L -${r},-${r} Z`;

  // 8芒星 (Persian-style) — 16 頂点を交互に外/内半径で並べる
  const sparkle8 = (R: number, r: number) => {
    const sin225 = 0.3827;
    const cos225 = 0.9239;
    const sin45 = 0.7071;
    const points = [
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
          i === 0 ? `M ${x.toFixed(2)},${y.toFixed(2)}` : `L ${x.toFixed(2)},${y.toFixed(2)}`,
        )
        .join(" ") + " Z"
    );
  };

  // 12 方位の節点座標 (半径 105 from center (120,120))
  const outerNodes = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    return {
      idx: i,
      x: 120 + 105 * Math.sin(angle),
      y: 120 - 105 * Math.cos(angle),
      cardinal: i % 3 === 0, // 0/3/6/9 = N/E/S/W
    };
  });

  return (
    <svg
      role="img"
      aria-label="北斗七星と紫微の天球輪"
      width={size}
      height={size}
      viewBox="0 0 240 240"
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
          <stop offset="45%" stopColor="#A78BBF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#5B3270" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 天球外輪 (very faint) */}
      <circle
        cx="120"
        cy="120"
        r="115"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="0.5"
        opacity="0.18"
      />

      {/* 天球内輪 (dashed) */}
      <circle
        cx="120"
        cy="120"
        r="88"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="0.4"
        opacity="0.18"
        strokeDasharray="2,5"
      />

      {/* 4 方位の薄い十字線 (魔法陣の方位軸) */}
      <g stroke="#C9A84C" strokeWidth="0.25" opacity="0.12">
        <line x1="120" y1="15" x2="120" y2="225" />
        <line x1="15" y1="120" x2="225" y2="120" />
      </g>

      {/* 12 方位の節点 (4芒星) */}
      <g fill="#C9A84C">
        {outerNodes.map((n) => (
          <g
            key={n.idx}
            transform={`translate(${n.x.toFixed(2)}, ${n.y.toFixed(2)})`}
            opacity={n.cardinal ? 0.7 : 0.45}
          >
            <path d={n.cardinal ? sparkle4(4.5, 1.1) : sparkle4(2.5, 0.6)} />
          </g>
        ))}
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
        <line x1="75" y1="115" x2="75" y2="145" />
        <line x1="75" y1="145" x2="105" y2="145" />
        <line x1="105" y1="145" x2="105" y2="115" />
        <line x1="105" y1="115" x2="75" y2="115" />
        {/* 柄 (handle) */}
        <line x1="105" y1="115" x2="130" y2="110" />
        <line x1="130" y1="110" x2="155" y2="100" />
        <line x1="155" y1="100" x2="180" y2="92" />
      </g>

      {/* 北極星への指示線 (点線) */}
      <line
        x1="75"
        y1="115"
        x2="75"
        y2="55"
        stroke="#C9A84C"
        strokeWidth="0.35"
        strokeDasharray="1,4"
        opacity="0.3"
      />

      {/* 北斗七星 — glow halo */}
      <g>
        <circle cx="75" cy="115" r="7" fill="url(#emblem-star-glow)" />
        <circle cx="75" cy="145" r="7" fill="url(#emblem-star-glow)" />
        <circle cx="105" cy="145" r="7" fill="url(#emblem-star-glow)" />
        <circle cx="105" cy="115" r="7" fill="url(#emblem-star-glow)" />
        <circle cx="130" cy="110" r="6" fill="url(#emblem-star-glow)" />
        <circle cx="155" cy="100" r="6" fill="url(#emblem-star-glow)" />
        <circle cx="180" cy="92" r="6" fill="url(#emblem-star-glow)" />
      </g>

      {/* 北斗七星 — 4芒星本体 */}
      <g fill="#F3F0E6">
        <g transform="translate(75, 115)"><path d={sparkle4(5, 1.3)} /></g>
        <g transform="translate(75, 145)"><path d={sparkle4(5, 1.3)} /></g>
        <g transform="translate(105, 145)"><path d={sparkle4(5, 1.3)} /></g>
        <g transform="translate(105, 115)"><path d={sparkle4(5, 1.3)} /></g>
        <g transform="translate(130, 110)"><path d={sparkle4(4.5, 1.1)} /></g>
        <g transform="translate(155, 100)"><path d={sparkle4(4, 1)} /></g>
        <g transform="translate(180, 92)"><path d={sparkle4(3.5, 0.9)} /></g>
      </g>

      {/* 紫微 (Polaris) — 8芒星 + glow + twinkle */}
      <g className="constellation-twinkle">
        <circle cx="75" cy="45" r="24" fill="url(#emblem-polar-glow)" />
        <g transform="translate(75, 45)">
          <path
            d={sparkle8(14, 5.7)}
            fill="#F3F0E6"
            stroke="#C9A84C"
            strokeWidth="0.4"
            strokeOpacity="0.7"
          />
        </g>
        <circle cx="75" cy="45" r="2.4" fill="#F3F0E6" />
      </g>

      {/* 補助の散光 (周辺、別リズムで瞬く) */}
      <g className="star-soft-pulse" fill="#F3F0E6">
        <g transform="translate(40, 80)" opacity="0.55"><path d={sparkle4(1.6, 0.4)} /></g>
        <g transform="translate(200, 140)" opacity="0.5"><path d={sparkle4(1.4, 0.35)} /></g>
        <g transform="translate(35, 175)" opacity="0.55"><path d={sparkle4(1.6, 0.4)} /></g>
        <g transform="translate(190, 190)" opacity="0.45"><path d={sparkle4(1.3, 0.3)} /></g>
        <g transform="translate(120, 35)" opacity="0.5"><path d={sparkle4(1.4, 0.35)} /></g>
        <g transform="translate(160, 50)" opacity="0.45"><path d={sparkle4(1.2, 0.3)} /></g>
      </g>
    </svg>
  );
}
