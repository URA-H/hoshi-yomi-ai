# 星読みAI（Hoshi-yomi AI）

> 四柱推命・九星気学・紫微斗数 — 東洋の三占術を AI で横断的に読み解く Web アプリ。生年月日と出生情報から、三術それぞれの命式を計算し、Claude API が合致点と相違点をふまえて統合コメンタリーを書きます。

[![Tech: Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Tech: React 19](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Tech: Claude API](https://img.shields.io/badge/Anthropic-Claude-cc785c)](https://www.anthropic.com/)
[![Tech: TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6)](https://www.typescriptlang.org/)
[![Tech: Tailwind v4](https://img.shields.io/badge/Tailwind-v4-06B6D4)](https://tailwindcss.com/)
[![Tests: Vitest](https://img.shields.io/badge/Vitest-4.1-6E9F18)](https://vitest.dev/)

---

## 目次

- [どんなアプリか](#どんなアプリか)
- [スクリーンショット / デモ動画](#スクリーンショット--デモ動画)
- [使っている技術](#使っている技術)
- [アーキテクチャ](#アーキテクチャ)
- [仕組みの中身](#仕組みの中身)
  - [1. 東洋占術 3 種のロジック実装](#1-東洋占術-3-種のロジック実装)
  - [2. AI 出力の安全設計（3層ガードレール）](#2-ai-出力の安全設計3層ガードレール)
  - [3. Claude API のコスト最適化](#3-claude-api-のコスト最適化)
  - [4. デザインシステム「東洋の書斎」](#4-デザインシステム東洋の書斎)
- [主な機能](#主な機能)
- [ディレクトリ構成](#ディレクトリ構成)
- [ローカルで動かす](#ローカルで動かす)
- [開発で詰まったところ](#開発で詰まったところ)
- [今後やりたいこと](#今後やりたいこと)
- [このリポジトリについて](#このリポジトリについて)
- [ライセンス・注意事項](#ライセンス注意事項)

---

## どんなアプリか

**星読みAI** は、東洋占術 3 種を組み合わせて「合致と相違から人物像を立体的に描く」ことを目指した Web アプリです。

- **四柱推命**: 生年月日時から命式（年柱・月柱・日柱・時柱）を立てて、十干十二支・五行バランスを計算
- **九星気学**: 本命星を割り出し、傾向と相性軸を提示
- **紫微斗数**: 命盤を構築し、命宮を中心とした主要宮の配置を読み解く
- **AI による横断コメンタリー**: Claude が三術の結果を受け取り、**合致するシグナル / 相違するシグナル** を整理した上で、断定しない口調で統合所感を生成

占いという領域に対しては、断定や不安煽りを徹底的に避ける設計（後述）を入れています。

---

## スクリーンショット / デモ動画

| 画面 | 説明 |
|------|------|
| ![Landing](./docs/screenshots/landing.png) | ランディング（夜空ビジュアルと篆書体のロゴ） |
| ![Birth Form](./docs/screenshots/birth-form.png) | 生年月日・出生情報の入力フォーム |
| ![Reading](./docs/screenshots/reading.png) | 三術の結果と AI コメンタリー |
| ![Cross](./docs/screenshots/cross-summary.png) | 三術の合致 / 相違サマリー |

- **デモ動画（2〜3分）**: `docs/demo.mp4`（撮影予定）

---

## 使っている技術

| カテゴリ | 採用技術 |
|----------|----------|
| フレームワーク | **Next.js 16** (App Router) / **React 19** |
| 言語 | TypeScript 5 |
| スタイル | Tailwind CSS v4 |
| バリデーション | Zod 4 |
| アニメーション | motion (Framer Motion 後継) |
| AI | **Anthropic Claude API** (`@anthropic-ai/sdk` 0.98) |
| 四柱推命 / 旧暦 | lunar-typescript |
| 紫微斗数 | iztro |
| 九星気学 | 自前実装 |
| テスト | Vitest 4 |

---

## アーキテクチャ

```
              ┌────────────────────────┐
              │  Browser (User)        │
              └──────────┬─────────────┘
                         │  生年月日・出生地
              ┌──────────▼─────────────┐
              │ Next.js 16 (App Router) │
              │  - /birth   入力フォーム │
              │  - /reading 結果表示     │
              │  - /api/fortune/generate │
              └──────────┬─────────────┘
                         │
       ┌─────────────────┼──────────────────┐
       │                 │                  │
┌──────▼────────┐ ┌──────▼────────┐ ┌──────▼────────────┐
│ 四柱推命       │ │ 九星気学       │ │ 紫微斗数           │
│ (lunar-ts)    │ │ (自前)         │ │ (iztro)            │
└──────┬────────┘ └──────┬────────┘ └──────┬────────────┘
       │                 │                  │
       └────────┬────────┴──────────────────┘
                │  三術の結果（構造化データ）
       ┌────────▼──────────────────────────────┐
       │ Claude API (generate-with-guardrails)   │
       │  - 3層ガードレール                      │
       │  - プロンプトキャッシュ                  │
       │  - 失敗時はモック fallback                │
       └─────────────────────────────────────────┘
```

- 占術の計算は **server-only** に閉じ込めて、ブラウザに API キーが漏れないようにしています
- Claude 呼び出しは Server Action（`actions.ts`）からのみ。フロントは結果のストリームを待つだけ

---

## 仕組みの中身

### 1. 東洋占術 3 種のロジック実装

[`src/lib/fortune/`](./src/lib/fortune/)

入出力を `FortuneInput` / `FortuneResult` で型付けして、3 つの占術を同じ形に揃えています。**合致 / 相違分析** はこの揃った構造に対して走るため、占術固有の表記揺れに引きずられません。

| 占術 | ライブラリ | 実装場所 |
|------|-----------|------------|
| 四柱推命 | lunar-typescript | [`src/lib/fortune/`](./src/lib/fortune/) |
| 紫微斗数 | iztro | [`src/lib/fortune/`](./src/lib/fortune/) |
| 九星気学 | スクラッチ実装 | [`src/lib/fortune/`](./src/lib/fortune/) |

旧暦変換、出生時刻が不明な場合の扱い、海外出生時のタイムゾーン補正（[`solar-time.ts`](./src/lib/fortune/solar-time.ts)）など、東洋占術特有の前処理も切り出してあります。

`__smoketest__.ts` と Vitest テスト（`*.test.ts`）で命式の計算が安定しているかを確認しています。

---

### 2. AI 出力の安全設計（3層ガードレール）

[`src/lib/ai/generate-with-guardrails.ts`](./src/lib/ai/generate-with-guardrails.ts)

このアプリで一番気を遣った部分です。占いは **霊感商法救済新法**（2023年）や景品表示法・消費者契約法と隣接する領域のため、Claude の出力に対して 3 段階の防御を入れています。

#### 第1層: システムプロンプトでポリシーを与える

[`src/lib/ai/system-prompts.ts`](./src/lib/ai/system-prompts.ts)

「断定しない」「不安を煽らない」「最終決定はユーザーに委ねる」というルールを system プロンプトに固定。Few-shot で具体例も付与します。

#### 第2層: 禁止語彙リスト（3階層）

[`src/lib/ai/forbidden-terms.ts`](./src/lib/ai/forbidden-terms.ts)

```typescript
// Tier A: 絶対NG（出力されたら再生成）
export const ABSOLUTELY_FORBIDDEN = [
  "祟り", "呪い", "悪霊", "霊障", "因縁",
  "除霊", "お祓い", "祈祷が必要",
  "このままでは不幸になる", "取り返しがつかなくなる",
  "100%", "絶対に当たる", "必ず起こる",
  "科学的に証明された", "○○大学の研究で",
  // ...
];

// Tier B: 文脈次第（要警告）
// Tier C: スタイル違反（軽微）
```

霊感商法救済新法の困惑類型・優良誤認に該当しうる語彙を Tier A、煽り寄りの語彙を Tier B、コピーガイドのスタイル違反を Tier C に整理しています。

#### 第3層: 出力後バリデーション + 限定的な再生成

[`src/lib/ai/validate-output.ts`](./src/lib/ai/validate-output.ts)

生成された文字列を Tier A/B/C に照らして検査し、Tier A が出たら最大 2 回まで再生成。3 回目でも引っかかった場合は **モックの安全出力にフォールバック** します。

```
[Claude 出力] ─→ validateFortuneOutput()
                   │
        ┌──────────┴───────────┐
        ▼                      ▼
   合格 → そのまま返す    Tier A 検知 → 再生成 (max 2)
                              │
                              ▼
                         失敗 → mockClaude
                            （定型の安全な所感）
```

#### 関連ドキュメント

仕様の全体は [`docs/ai-safety-spec.md`](./docs/ai-safety-spec.md)、占い領域の法規制まとめは [`docs/regulations.md`](./docs/regulations.md) にあります。

---

### 3. Claude API のコスト最適化

[`src/lib/ai/claude-client.ts`](./src/lib/ai/claude-client.ts)

- **Prompt caching** — 約 1,000 トークンの定型システムプロンプトに `cache_control: { type: "ephemeral" }` を付けて、5 分 TTL のキャッシュを効かせています。同じ system が連続するときは入力コストが約 1/10
- **モックモード** — `ANTHROPIC_API_KEY` が未設定のときは決定論的な [`mockClaude`](./src/lib/ai/mock-claude.ts) が動作し、API コスト 0 で開発・テストできます
- **モデル選定** — 占いコメンタリーは Sonnet 系で十分という判断（Opus は使用していません）

---

### 4. デザインシステム「東洋の書斎」

[`docs/design-system.md`](./docs/design-system.md)

占いアプリにありがちな派手・煽り系のビジュアルを避け、**静謐 / 論理性と神秘性の両立 / 婉曲** をトーン&マナーの原則に据えました。

- 篆書体の「星」をインライン SVG で描き、ロゴマークに採用
- 夜空のグラデーション + nebula + 流れ星 + 地平線グローでファンタジー感を演出
- 干支環・八芒星のエンブレム、雲帯、卦線 divider など、占星術盤や東洋意匠の要素をモジュラーに配置
- ボタン・カードのレベル、影、間、モーション量まで [`design-system.md`](./docs/design-system.md) で規定

WCAG コントラスト監査もこのスペック内に含めています。

---

## 主な機能

| 機能 | 説明 |
|------|------|
| 生年月日入力フォーム | 出生時刻不明・出生地（タイムゾーン補正）に対応 |
| 四柱推命の命式表示 | 年/月/日/時の柱、十干十二支、五行バランス |
| 九星気学の本命星表示 | 本命星と傾向、相性軸 |
| 紫微斗数の命盤表示 | 命盤・命宮を中心とした主要宮の配置 |
| 三術 cross 分析 | 合致するシグナル / 相違するシグナルの整理 |
| AI コメンタリー（ストリーミング） | 構造化データ部分を先に描画 → Claude の出力を Suspense で後追い |
| 法的ページ | 免責事項 / プライバシー / 利用規約 |

---

## ディレクトリ構成

```
fortune-app/
├── src/
│   ├── app/
│   │   ├── page.tsx              # ランディング
│   │   ├── birth/                # 生年月日入力（Server Actions）
│   │   ├── reading/              # 結果表示
│   │   ├── api/fortune/generate/ # API Route (Claude 呼び出し)
│   │   ├── legal/                # 免責 / プライバシー / 利用規約
│   │   └── globals.css
│   │
│   ├── lib/
│   │   ├── fortune/              # 四柱推命 / 九星気学 / 紫微斗数 / cross 分析
│   │   ├── ai/                   # Claude クライアント + 3層ガードレール
│   │   ├── forms/                # Zod スキーマ + Birth セッション
│   │   └── motion.ts             # アニメーション原則
│   │
│   └── components/
│       ├── reading/              # 結果カード（命式 / cross / AI コメンタリー）
│       ├── seal-star.tsx         # 篆書体ロゴ
│       ├── shooting-stars.tsx    # 流れ星
│       ├── constellation-emblem.tsx
│       └── ...
│
├── docs/
│   ├── design-system.md          # デザイントークン / コンポーネント / WCAG
│   ├── ai-safety-spec.md         # 3層ガードレールの仕様
│   ├── regulations.md            # 景表法 / 霊感商法救済新法 / 特商法
│   ├── copy-guide.md             # LP / 製品内コピー
│   ├── philosophy-review.md      # 哲学的レビュー
│   └── history-review.md         # 競合・占い市場の歴史
│
└── public/
    └── textures/                 # 夜空・雲のテクスチャ
```

---

## ローカルで動かす

### 前提

- Node.js 20+ / pnpm
- （任意）Anthropic API キー — 未設定でもモックモードで動作します

### 起動

```bash
git clone https://github.com/URA-H/hoshi-yomi-ai.git
cd hoshi-yomi-ai
pnpm install

cp .env.example .env.local        # 必要なら ANTHROPIC_API_KEY を記入
pnpm dev
```

→ http://localhost:3000

### モックモード

`.env.local` で `ANTHROPIC_API_KEY` を未設定のままにすると、決定論的なモック出力が動作します。Claude API キーを発行する前でも UI とフロー全体を試せます。

### テスト

```bash
pnpm test            # 単発
pnpm test:watch      # ウォッチ
```

Vitest が `src/lib/fortune/*.test.ts`（占術ロジック）と `src/lib/ai/*.test.ts`（ガードレール・バリデーション）を回します。

---

## 開発で詰まったところ

#### 1. AI に「占いをさせる」ことの難しさ

最初は素の Claude にいきなり「四柱推命で占って」と投げていましたが、断定的すぎたり、不安を煽る言い回しが混ざったりするケースがありました。

→ 占術の計算は **すべてコード側で済ませて構造化データとして渡す**、Claude には **そのデータの「読み」だけをさせる** という分担に整理。霊感商法救済新法の禁止類型を Tier A 禁止語として明示し、出力後バリデーションと再生成ループを付けたことで、安定して安全側の出力が得られるようになりました。

#### 2. 三術の表記揺れと合致判定

四柱推命 / 九星気学 / 紫微斗数は、伝統的に使う語彙も着眼点もバラバラです。「これは合致と言っていいのか」を機械的に判定する基準を作るのに時間を割きました。

→ 三術の結果を一度 `FortuneResult` という共通の中間構造に揃え、その上で **シグナル単位での比較** を行う設計に整理。占術固有の表現は表示直前で UI ラベルに変換するパイプラインを別途用意し、計算と表示を分離しました。

#### 3. Next.js 16 / React 19 のリリース直後採用

メジャーバージョン直後で公開情報が少なく、特に Server Actions と Suspense を組み合わせたストリーミング描画でハマりました。

→ AI コメンタリーの生成中は構造化データ部分を先に描画し、Claude の出力は `<Suspense>` で後追いさせる構成に。`AGENTS.md` にも「training data とは違うバージョン」と明記して、AI 補助も鵜呑みにしないようにしています。

#### 4. デザインの方向性が定まるまでの試行錯誤

コミット履歴を見るとわかりますが、和風（大観テイスト）と異世界感（魔法陣テイスト）を行ったり来たりしました。

→ 最終的に「東洋の書斎」というキーワードに収束。篆書体ロゴ、夜空 + 流れ星、干支環エンブレム、卦線 divider という静かなファンタジー方向に落ち着きました。

---

## 今後やりたいこと

- [ ] 出生時刻不明時の精度改善（時柱の扱い）
- [ ] 結果のシェア用 OGP 画像生成
- [ ] cross 分析の重み付けカスタマイズ
- [ ] 履歴保存（現状はセッション保持のみ）

---

## このリポジトリについて

個人開発の作品として作ったものです。本番運用はしておらず、ローカル起動・コード閲覧・デモ動画とスクリーンショットで内容を確認できる構成になっています。

## ライセンス・注意事項

- 本プロジェクトは学習・個人開発目的のものです
- 表示される占術結果や AI コメンタリーは、診断や予言ではありません
- 重大な意思決定は、占いの結果ではなくご自身の判断と専門家への相談で行ってください
