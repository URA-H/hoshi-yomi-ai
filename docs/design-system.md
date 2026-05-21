---
date: "2026-05-21"
topic: Fortune AI - デザインシステム（東洋の書斎）
status: spec-v1
owner: creative
related:
  - secretary/notes/2026-05-21-final-design.md
  - note-writer/articles/2026-05-21-fortune-ai-copy-final.md
  - philosopher/critiques/2026-05-21-fortune-ai.md
  - historian/cases/2026-05-21-fortune-ai.md
target: 開発実装（Next.js 15 + Tailwind CSS + Framer Motion）
priority: 高
---

# Fortune AI - デザインシステム「東洋の書斎」

## 0. デザイン哲学

### 大原則
- **静謐 (Quiet)**: 派手・煽り・ハイテンションを避ける
- **思慮深さ (Contemplative)**: 「考えるための余白」を画面に持つ
- **東洋の静の美学**: 「動」より「余白」「間」「沈黙」
- **誠実さ (Honesty)**: 機能と装飾の境界を明確にする

### 回避するもの
- ❌ ネオン / 派手なグラデーション
- ❌ 3D効果 / 過度なグロー
- ❌ AI Purple/Pink グラデーション（占い業界の安易表現）
- ❌ パララックス過剰 / スクロールジャック
- ❌ Bouncy animation / Spring physics の過剰使用

### 参照スタイル系統
- **Minimal & Direct** + **E-Ink / Paper** のハイブリッド
- 「ダークモードの和紙」というメンタルモデル

---

## 1. カラーシステム — WCAG準拠レビュー

### 1.1 確定パレットのコントラスト検証

| 前景 | 背景 | コントラスト | WCAG | 用途可否 |
|------|------|-----------|------|--------|
| 白練 #F3F0E6 | 漆黒 #0D0D14 | **約16.5:1** | AAA | ✓ 本文・見出し全般 |
| 白練 #F3F0E6 | 墨染 #1A1A28 | **約14.4:1** | AAA | ✓ カード上の本文 |
| 金箔 #C9A84C | 漆黒 #0D0D14 | **約8.4:1** | AAA | ✓ 重要強調・小サイズ可 |
| 金箔 #C9A84C | 墨染 #1A1A28 | **約7.3:1** | AAA | ✓ カード上の強調 |
| 朱色 #C53D43 | 漆黒 #0D0D14 | **約3.8:1** | AA (Large) | ⚠ 18px以上 or 非テキスト要素のみ |
| 朱色 #C53D43 | 墨染 #1A1A28 | **約3.3:1** | UI Only | ⚠ ボタン背景・アイコン・ボーダーのみ |
| 藍色 #223A5E | 漆黒 #0D0D14 | **約1.6:1** | ✗ | ❌ テキスト不可。ボーダー・低重要装飾のみ |
| 紫紺 #5B3270 | 漆黒 #0D0D14 | **約1.8:1** | ✗ | ❌ テキスト不可。アクセント装飾のみ |

### 1.2 不足色の補完（テキスト可能なバリアント追加）

藍色・紫紺・朱色は深すぎてテキスト用途で使えない。明色版を追加:

| 追加色 | Hex | 用途 |
|--------|-----|------|
| **藍霞** (Aikasumi) | `#7BA0C8` | 藍色のテキスト可能版（コントラスト ~6.7:1 on 漆黒） |
| **薄紫** (Usumurasaki) | `#A78BBF` | 紫紺のテキスト可能版（紫微斗数の見出しに） |
| **朱明** (Shumei) | `#E07A7F` | 朱色のテキスト可能版（CTA文字・警告文に） |

### 1.3 セマンティックトークン体系

ハードコードされた hex を避け、用途別のトークンを定義する:

```css
/* src/app/globals.css */
:root {
  /* Base palette (raw) */
  --jp-shikkoku: 13 13 20;         /* #0D0D14 */
  --jp-sumizome: 26 26 40;         /* #1A1A28 */
  --jp-aiiro: 34 58 94;            /* #223A5E */
  --jp-aikasumi: 123 160 200;      /* #7BA0C8 */
  --jp-kinpaku: 201 168 76;        /* #C9A84C */
  --jp-shuiro: 197 61 67;          /* #C53D43 */
  --jp-shumei: 224 122 127;        /* #E07A7F */
  --jp-shikon: 91 50 112;          /* #5B3270 */
  --jp-usumurasaki: 167 139 191;   /* #A78BBF */
  --jp-shironeri: 243 240 230;     /* #F3F0E6 */

  /* Semantic tokens — これを各コンポーネントで使う */
  --color-bg-base: rgb(var(--jp-shikkoku));
  --color-bg-surface: rgb(var(--jp-sumizome));
  --color-bg-elevated: rgb(var(--jp-sumizome) / 0.7);
  --color-border-subtle: rgb(var(--jp-aiiro));
  --color-border-strong: rgb(var(--jp-kinpaku) / 0.4);

  --color-text-primary: rgb(var(--jp-shironeri));
  --color-text-secondary: rgb(var(--jp-shironeri) / 0.7);
  --color-text-muted: rgb(var(--jp-shironeri) / 0.5);

  --color-accent-emphasis: rgb(var(--jp-kinpaku));        /* 重要・合致度 */
  --color-accent-primary: rgb(var(--jp-aikasumi));        /* 主アクセント・リンク */
  --color-accent-shibun: rgb(var(--jp-usumurasaki));      /* 紫微斗数 */
  --color-accent-cta: rgb(var(--jp-shuiro));              /* CTA背景 */
  --color-accent-cta-text: rgb(var(--jp-shironeri));      /* CTAの上の文字 */
  --color-accent-warning: rgb(var(--jp-shumei));          /* 警告・凶方位 */

  /* Functional */
  --color-ring: rgb(var(--jp-kinpaku) / 0.5);
  --color-overlay: rgb(var(--jp-shikkoku) / 0.7);
}
```

### 1.4 Tailwind 設定

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 日本伝統色（直接利用は推奨しない、tokenを介す）
        shikkoku: 'rgb(var(--jp-shikkoku) / <alpha-value>)',
        sumizome: 'rgb(var(--jp-sumizome) / <alpha-value>)',
        aiiro: 'rgb(var(--jp-aiiro) / <alpha-value>)',
        aikasumi: 'rgb(var(--jp-aikasumi) / <alpha-value>)',
        kinpaku: 'rgb(var(--jp-kinpaku) / <alpha-value>)',
        shuiro: 'rgb(var(--jp-shuiro) / <alpha-value>)',
        shumei: 'rgb(var(--jp-shumei) / <alpha-value>)',
        shikon: 'rgb(var(--jp-shikon) / <alpha-value>)',
        usumurasaki: 'rgb(var(--jp-usumurasaki) / <alpha-value>)',
        shironeri: 'rgb(var(--jp-shironeri) / <alpha-value>)',

        // セマンティック（推奨利用）
        bg: {
          base: 'var(--color-bg-base)',
          surface: 'var(--color-bg-surface)',
          elevated: 'var(--color-bg-elevated)',
        },
        border: {
          subtle: 'var(--color-border-subtle)',
          strong: 'var(--color-border-strong)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        accent: {
          emphasis: 'var(--color-accent-emphasis)',
          primary: 'var(--color-accent-primary)',
          shibun: 'var(--color-accent-shibun)',
          cta: 'var(--color-accent-cta)',
          warning: 'var(--color-accent-warning)',
        },
      },
    },
  },
};

export default config;
```

---

## 2. グラデーション・テクスチャ レシピ

### 2.1 「夜空に和紙」背景（メイン）

```css
.bg-yozora-washi {
  background-color: rgb(var(--jp-shikkoku));
  background-image:
    /* 微細な和紙テクスチャ（SVG noise） */
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.94 0 0 0 0 0.9 0 0 0 0.015 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"),
    /* 中央から外への極薄光彩 */
    radial-gradient(ellipse at 50% 30%, rgb(var(--jp-aiiro) / 0.15) 0%, transparent 60%);
  background-size: 200px 200px, 100% 100%;
}
```

### 2.2 「金箔散らし」アクセント装飾

カード上部や見出し付近に使う、上品な金の散り:

```css
.deco-kinpaku-chiri::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 12% 18%, rgb(var(--jp-kinpaku) / 0.3) 0%, transparent 0.5%),
    radial-gradient(circle at 78% 28%, rgb(var(--jp-kinpaku) / 0.25) 0%, transparent 0.4%),
    radial-gradient(circle at 35% 65%, rgb(var(--jp-kinpaku) / 0.2) 0%, transparent 0.6%),
    radial-gradient(circle at 88% 82%, rgb(var(--jp-kinpaku) / 0.28) 0%, transparent 0.3%);
}
```

### 2.3 「墨の滲み」セクション区切り

```css
.divider-sumi {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgb(var(--jp-kinpaku) / 0.3) 30%,
    rgb(var(--jp-kinpaku) / 0.5) 50%,
    rgb(var(--jp-kinpaku) / 0.3) 70%,
    transparent 100%
  );
  position: relative;
}
.divider-sumi::after {
  content: '';
  position: absolute;
  inset: -2px 30% -2px 30%;
  background: rgb(var(--jp-kinpaku) / 0.05);
  filter: blur(3px);
}
```

### 2.4 「格子模様（麻の葉）」装飾オーバーレイ

ヒーロー背景の超薄レイヤーとして:

```html
<!-- /public/textures/asanoha.svg として配置 -->
<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <pattern id="asanoha" patternUnits="userSpaceOnUse" width="60" height="60">
    <g stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.08">
      <path d="M30 0 L60 17 L60 43 L30 60 L0 43 L0 17 Z"/>
      <path d="M30 0 L30 60 M0 17 L60 43 M0 43 L60 17"/>
    </g>
  </pattern>
  <rect width="100%" height="100%" fill="url(#asanoha)"/>
</svg>
```

```tsx
<div className="absolute inset-0 text-kinpaku" style={{ backgroundImage: "url('/textures/asanoha.svg')" }} />
```

### 2.5 「朱印」ブランドロゴ用スタンプ風

```css
.stamp-shuin {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--jp-shuiro));
  color: rgb(var(--jp-shironeri));
  font-family: 'Shippori Mincho B1', serif;
  font-weight: 600;
  letter-spacing: 0.1em;
  border-radius: 4px;
  /* 朱印らしいノイズと欠け感 */
  box-shadow:
    inset 0 0 0 2px rgb(var(--jp-shuiro)),
    inset 0 0 0 3px rgb(var(--jp-shironeri) / 0.15);
  filter: contrast(0.95);
}
```

---

## 3. タイポグラフィシステム

### 3.1 フォント定義

```typescript
// src/app/fonts.ts
import localFont from 'next/font/local';
import { Zen_Old_Mincho, Zen_Kaku_Gothic_New, Shippori_Mincho_B1 } from 'next/font/google';

export const zenOldMincho = Zen_Old_Mincho({
  weight: ['400', '500', '600', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mincho',
  preload: true,
});

export const zenKakuGothic = Zen_Kaku_Gothic_New({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-gothic',
  preload: true,
});

export const shipporiMincho = Shippori_Mincho_B1({
  weight: ['400', '600', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-decorative',
  preload: false, // 装飾用なので必要時のみ
});
```

### 3.2 タイプスケール（東洋の書斎流）

縦書き文化を尊重し、**コントラストは控えめ、行間は広め**:

| トークン | サイズ | line-height | font-weight | 用途 |
|---------|------|-----------|----|------|
| `text-display` | 48 / 56 / 64px (clamp) | 1.3 | 600 (Mincho) | LP Hero |
| `text-h1` | 32px | 1.5 | 600 (Mincho) | ページタイトル |
| `text-h2` | 24px | 1.55 | 500 (Mincho) | セクション見出し |
| `text-h3` | 20px | 1.6 | 500 (Mincho) | サブ見出し |
| `text-body-lg` | 18px | 1.85 | 400 (Gothic) | 占術レポート本文 |
| `text-body` | 16px | 1.8 | 400 (Gothic) | 通常本文 |
| `text-caption` | 14px | 1.7 | 400 (Gothic) | 補足・注意書き |
| `text-micro` | 12px | 1.6 | 500 (Gothic) | バッジ・タグ |
| `text-decorative` | clamp(20, 4vw, 32) | 1.6 | 600 (Shippori) | 朱印ロゴ・装飾 |

### 3.3 Tailwind プラグイン定義

```typescript
// tailwind.config.ts (theme.extend に追加)
fontFamily: {
  mincho: ['var(--font-mincho)', 'Zen Old Mincho', 'serif'],
  gothic: ['var(--font-gothic)', 'Zen Kaku Gothic New', 'sans-serif'],
  decorative: ['var(--font-decorative)', 'Shippori Mincho B1', 'serif'],
},
fontSize: {
  'display': ['clamp(3rem, 5vw, 4rem)', { lineHeight: '1.3', fontWeight: '600' }],
  'h1': ['2rem', { lineHeight: '1.5', fontWeight: '600' }],
  'h2': ['1.5rem', { lineHeight: '1.55', fontWeight: '500' }],
  'h3': ['1.25rem', { lineHeight: '1.6', fontWeight: '500' }],
  'body-lg': ['1.125rem', { lineHeight: '1.85', fontWeight: '400' }],
  'body': ['1rem', { lineHeight: '1.8', fontWeight: '400' }],
  'caption': ['0.875rem', { lineHeight: '1.7', fontWeight: '400' }],
  'micro': ['0.75rem', { lineHeight: '1.6', fontWeight: '500' }],
},
letterSpacing: {
  /* 日本語は文字間を広めに取ると上品 */
  'jp-tight': '0.02em',
  'jp-normal': '0.04em',
  'jp-wide': '0.08em',
  'jp-decorative': '0.15em',
},
```

### 3.4 推奨組み合わせ例

```tsx
// 見出し
<h1 className="font-mincho text-h1 tracking-jp-normal text-text-primary">
  今月の運勢
</h1>

// 本文（占術レポート）
<p className="font-gothic text-body-lg tracking-jp-normal text-text-primary leading-[1.85]">
  今月は慎重さが活きる時期と読めます。
</p>

// 注意書き
<p className="font-gothic text-caption text-text-muted tracking-jp-normal">
  ※ 重要な医療・金融判断は専門家にご相談ください。
</p>
```

---

## 4. コアコンポーネント設計

### 4.1 「合致度バッジ」

```tsx
// src/components/concordance-badge.tsx
import { cn } from '@/lib/utils';

type ConcordanceLevel = 'three' | 'two' | 'one';

const config = {
  three: {
    dots: '⚪︎⚪︎⚪︎',
    label: '三術合致',
    description: '三つの占術が同じ方向を示しています',
    color: 'text-kinpaku border-kinpaku/50 bg-kinpaku/10',
  },
  two: {
    dots: '⚪︎⚪︎○',
    label: '二術合致',
    description: '二つの占術が一致しています',
    color: 'text-aikasumi border-aikasumi/40 bg-aikasumi/8',
  },
  one: {
    dots: '⚪︎○○',
    label: '一術示唆',
    description: '一つの占術の見方です',
    color: 'text-text-secondary border-border-subtle bg-bg-elevated',
  },
} as const;

export function ConcordanceBadge({ level, showLabel = true }: { level: ConcordanceLevel; showLabel?: boolean }) {
  const c = config[level];
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-sm border px-3 py-1.5',
        'font-mincho text-caption tracking-jp-wide',
        c.color
      )}
      role="img"
      aria-label={`${c.label}: ${c.description}`}
    >
      <span className="font-decorative text-base leading-none">{c.dots}</span>
      {showLabel && <span>{c.label}</span>}
    </div>
  );
}
```

**意図:**
- ピル型ではなく **角を立てた矩形** (`rounded-sm`) で書状感
- ドット表記は装飾フォントで雰囲気を出す
- 各レベルで色を変えるが、**字も併用** して色覚バリアフリー
- aria-label に full description を入れる

### 4.2 「結果カード」

```tsx
// src/components/result-card.tsx
export function ResultCard({
  period,
  concordance,
  title,
  body,
  advice,
  children,
}: {
  period: string;
  concordance: 'three' | 'two' | 'one';
  title: string;
  body: string;
  advice: string;
  children?: React.ReactNode;
}) {
  return (
    <article className="relative overflow-hidden rounded-sm border border-border-subtle bg-bg-surface">
      {/* 上部の金箔ライン */}
      <div className="h-px bg-gradient-to-r from-transparent via-kinpaku/50 to-transparent" />

      <div className="relative p-8 md:p-10">
        {/* 金箔散らし装飾 */}
        <div className="deco-kinpaku-chiri pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative space-y-6">
          {/* ヘッダー */}
          <header className="space-y-3">
            <p className="font-mincho text-caption tracking-jp-decorative text-text-muted uppercase">
              {period}
            </p>
            <ConcordanceBadge level={concordance} />
            <h2 className="font-mincho text-h2 tracking-jp-normal text-text-primary">
              {title}
            </h2>
          </header>

          {/* 墨の滲み区切り */}
          <div className="divider-sumi" aria-hidden />

          {/* 本文 */}
          <p className="font-gothic text-body-lg leading-[1.85] tracking-jp-normal text-text-primary">
            {body}
          </p>

          {/* 建設的なアドバイス（必須セクション） */}
          <section className="rounded-sm border-l-2 border-kinpaku/60 bg-bg-elevated px-5 py-4">
            <h3 className="font-mincho text-h3 text-accent-emphasis mb-2">
              向き合い方
            </h3>
            <p className="font-gothic text-body text-text-secondary">
              {advice}
            </p>
          </section>

          {children}

          {/* 免責の固定表示 */}
          <p className="font-gothic text-micro text-text-muted leading-relaxed">
            最終的な判断はご自身でなさってください。
            重要な医療・金融・法的判断は、占いではなく専門家にご相談ください。
          </p>
        </div>
      </div>
    </article>
  );
}
```

**意図:**
- 「上部の金線」「金箔散らし」「墨の滲み区切り」「左ボーダーの強調」で和の書状感
- 「向き合い方」は構造的に分離し、**凶でも建設的提案を必ず伴う**設計を強制
- 免責が常に末尾に出る（哲学者・歴史学者の合意済み）

### 4.3 CTA ボタン

3階層を定義:

```tsx
// src/components/button.tsx
const variants = {
  primary: cn(
    'bg-accent-cta text-accent-cta-text',
    'hover:bg-shuiro/85 active:bg-shuiro/95',
    'shadow-sm shadow-shuiro/20'
  ),
  secondary: cn(
    'bg-transparent text-text-primary',
    'border border-kinpaku/50',
    'hover:bg-kinpaku/10 hover:border-kinpaku/70',
    'active:bg-kinpaku/15'
  ),
  ghost: cn(
    'bg-transparent text-text-secondary',
    'hover:text-text-primary hover:bg-bg-elevated',
  ),
} as const;

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-sm',
        'font-mincho tracking-jp-wide font-medium',
        'transition-colors duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinpaku/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        size === 'sm' && 'min-h-[40px] px-4 text-caption',
        size === 'md' && 'min-h-[44px] px-6 text-body',  // 44px = 触覚最小
        size === 'lg' && 'min-h-[52px] px-8 text-body-lg',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

**意図:**
- 主CTAは朱色（東洋の「印」「決定」の色）
- セカンダリは金箔の細いボーダー（書状の罫線）
- ボタン形状は `rounded-sm` で書状感（pill 形は使わない）
- フォントは Mincho で凜とした印象
- 最小タップ領域 44px を守る

---

## 5. アニメーション原則（東洋の静）

### 5.1 基本原則

| 要素 | 推奨値 | 理由 |
|------|------|------|
| **Duration** | 250-400ms | 派手な150ms禁止。少し遅め=思慮深さ |
| **Easing** | `cubic-bezier(0.22, 0.61, 0.36, 1)` (easeOutCubic) | 一呼吸置く感じ |
| **同時アニメ要素** | 1-2個まで | 散漫を避ける |
| **Reduced motion** | 即座 fade 切替に置換 | 必須対応 |
| **Bounce / Spring** | 使わない | 軽薄になる |

### 5.2 Framer Motion トランジション・プリセット

```typescript
// src/lib/motion.ts
import type { Transition, Variants } from 'framer-motion';

export const easeShoseki: Transition = {
  duration: 0.35,
  ease: [0.22, 0.61, 0.36, 1],
};

export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: easeShoseki },
};

export const reveal: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      ...easeShoseki,
      staggerChildren: 0.08,  // 適度な階差
    },
  },
};

// 占術結果のストリーミング表示用
export const inkBloom: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] },
  },
};
```

### 5.3 reduced-motion 対応

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 6. レイアウト・スペーシング

### 6.1 8pt グリッド + 「間」尊重

```typescript
// tailwind.config.ts
spacing: {
  'ma-xs': '0.5rem',    // 8px - 隣接要素
  'ma-sm': '1rem',      // 16px - 関連要素
  'ma-md': '1.5rem',    // 24px - 段落間
  'ma-lg': '2.5rem',    // 40px - セクション内
  'ma-xl': '4rem',      // 64px - セクション間
  'ma-2xl': '6rem',     // 96px - 章間
},
```

「ma（間）」というプレフィックスで日本的な余白思想を保持。

### 6.2 コンテンツ幅

| 要素 | 最大幅 | 用途 |
|------|------|------|
| `max-w-prose` | 65ch | レポート本文 |
| `max-w-2xl` | 672px | フォーム・ダイアログ |
| `max-w-4xl` | 896px | 結果ページ全体 |
| `max-w-6xl` | 1152px | LP・ダッシュボード |

### 6.3 ブレークポイント

```typescript
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
```

---

## 7. 装飾要素の実装方針

### 7.1 SVGアセット一覧（要作成 or 入手）

| ファイル | 用途 | サイズ | 入手方法 |
|---------|------|------|--------|
| `/textures/washi-noise.svg` | 和紙テクスチャ（背景） | inline SVG filter | 上記コード使用 |
| `/textures/asanoha.svg` | 麻の葉格子模様 | パターン | 上記コード使用 |
| `/textures/sumi-stroke-h.svg` | 横方向の墨ストローク | 区切り装飾 | 自作 or 素材サイト |
| `/textures/sumi-stroke-v.svg` | 縦方向の墨ストローク | 装飾 | 同上 |
| `/logo/fortune-ai-mark.svg` | ブランドマーク（朱印風） | 32x32, 64x64 | 自作 |
| `/icons/dipper.svg` | 紫微（北斗七星）アイコン | 24x24 | 自作 |
| `/icons/hexagram.svg` | 八卦アイコン | 24x24 | 自作 |

### 7.2 装飾の使用ルール

- **1画面に主要装飾は2つまで**: 和紙背景 + 1要素 が上限
- **装飾は最背面に**: z-index 0、コンテンツは z-10 以上
- **彩度低めで**: opacity 0.05〜0.15
- **アニメは禁止**: 装飾はあくまで静的、動かさない

### 7.3 朱印ロゴの実装例

```tsx
export function FortuneAIMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 32, md: 48, lg: 64 };
  return (
    <div
      className="stamp-shuin font-decorative inline-flex items-center justify-center"
      style={{ width: sizes[size], height: sizes[size] }}
      aria-label="Fortune AI"
    >
      <span className="text-base leading-none">易</span>
    </div>
  );
}
```

文字は「占」「易」「術」「命」など占術ロゴで一字選び。

---

## 8. ダークモード戦略

**Fortune AI はダーク専用**だが、以下を遵守:

- `prefers-color-scheme` を尊重しつつデフォルトdark
- ライトモード対応は今期スコープ外（将来検討）
- システムカラー設定:
  ```tsx
  // app/layout.tsx
  <html className="dark" lang="ja" suppressHydrationWarning>
  ```

---

## 9. アクセシビリティ チェックリスト（リリース前）

### 必須
- [ ] すべての本文テキスト ≥ 4.5:1
- [ ] 大見出し ≥ 3:1
- [ ] フォーカスリング `focus-visible:ring-2 ring-kinpaku/50` を全インタラクティブ要素に
- [ ] アイコンボタンには `aria-label`
- [ ] 合致度バッジは **色 + 文字 + ドット数** の3重表現
- [ ] `prefers-reduced-motion` 対応
- [ ] フォントは最低 16px（モバイル）
- [ ] タッチ領域 ≥ 44px
- [ ] キーボードフォーカス順序が視覚順序と一致

### 推奨
- [ ] Dynamic Type / フォント拡大に追従
- [ ] スクリーンリーダーで占術結果が論理的に読み上げられる
- [ ] エラーメッセージは `role="alert"`
- [ ] 「合致度」「示唆」など独自用語にはツールチップ付与

---

## 10. 実装チェックリスト

### Phase 0: 基礎（最初の1日）
- [ ] `src/app/globals.css` にCSS変数とユーティリティ登録
- [ ] `tailwind.config.ts` 拡張
- [ ] `src/app/fonts.ts` 作成
- [ ] `src/lib/motion.ts` 作成
- [ ] `src/lib/utils.ts` の `cn()` ヘルパー

### Phase 1: 装飾アセット
- [ ] `/public/textures/washi-noise.svg`
- [ ] `/public/textures/asanoha.svg`
- [ ] `/public/textures/sumi-stroke-h.svg`
- [ ] `/public/logo/fortune-ai-mark.svg`

### Phase 2: コアコンポーネント
- [ ] `<Button>` (3 variants × 3 sizes)
- [ ] `<ConcordanceBadge>` (3 levels)
- [ ] `<ResultCard>` (with disclaimer baked in)
- [ ] `<Divider>` (sumi style)
- [ ] `<FortuneAIMark>` (logo)

### Phase 3: ページパターン
- [ ] LP Hero セクション
- [ ] 占術結果ページ
- [ ] ダッシュボード
- [ ] 設定・契約管理ページ

---

## 11. 次のアクション

- [ ] このデザインシステムを Storybook 化（任意）
- [ ] Figma で主要画面のモック化（任意）
- [ ] 既存「東洋の書斎」コンセプトと矛盾する箇所がないか開発側で確認
- [ ] ロゴ用の漢字を最終決定（「易」「占」「命」「術」候補）

---

## 12. 観察ノート

### 占い × 投資SaaS の並行運営者にとっての視覚戦略
- StockLens は**信頼感・データ視覚化**が軸（恐らく青系のクリーンUI）
- Fortune AI は**静謐・伝統・思慮深さ**が軸（和の墨×金）
- → **完全に別世界観として分離可能** な設計になっており、ブランド分離戦略上も健全

### このデザインシステムが体現する事業姿勢
- 派手にしない = 「煽らない」姿勢の可視化
- 余白を活かす = 「ユーザーの考える時間」を尊重
- 伝統色 = 「占術への敬意」
- AI Purple/Pink を避ける = 「ChatGPT Wrapper の安易さ」との明確な距離
