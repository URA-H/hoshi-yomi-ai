/**
 * 流れ星 (彗星) のオーバーレイ。
 * SVG 全体を Hero 全幅 (viewBox 1920x1080) でカバーし、複数の彗星を散らす。
 * 各彗星は:
 *   - 細い fading trail (linear-gradient stroke)
 *   - bright head (small circle + glow)
 *   - 進行方向に向けて rotate
 *
 * 完全に静的 (CSS animation は付けない — チカチカは避ける)。
 */
export function ShootingStars() {
  // 各彗星の定義: 位置 (x, y), 角度 (deg), 全長 (px), 不透明度
  const comets = [
    { x: 280, y: 140, angle: 28, length: 160, opacity: 0.75 },
    { x: 1380, y: 200, angle: 35, length: 200, opacity: 0.85 },
    { x: 720, y: 90, angle: 22, length: 130, opacity: 0.65 },
    { x: 1180, y: 480, angle: 40, length: 180, opacity: 0.7 },
    { x: 420, y: 540, angle: 18, length: 140, opacity: 0.6 },
  ];

  return (
    <svg
      aria-hidden
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none"
    >
      <defs>
        {/* 彗星の trail グラデ — head 側から fade out */}
        <linearGradient id="comet-trail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FAFAF5" stopOpacity="1" />
          <stop offset="20%" stopColor="#F0E4C7" stopOpacity="0.75" />
          <stop offset="60%" stopColor="#C9A84C" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </linearGradient>
        {/* head の glow */}
        <radialGradient id="comet-head">
          <stop offset="0%" stopColor="#FAFAF5" stopOpacity="1" />
          <stop offset="40%" stopColor="#F0E4C7" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>
      </defs>

      {comets.map((c, i) => (
        <g
          key={i}
          transform={`translate(${c.x} ${c.y}) rotate(${c.angle})`}
          opacity={c.opacity}
        >
          {/* trail (head が右側、長く尾を引く) */}
          <line
            x1="0"
            y1="0"
            x2={-c.length}
            y2="0"
            stroke="url(#comet-trail)"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          {/* head の halo */}
          <circle cx="0" cy="0" r="6" fill="url(#comet-head)" />
          {/* head の核 */}
          <circle cx="0" cy="0" r="1.4" fill="#FAFAF5" />
        </g>
      ))}
    </svg>
  );
}
