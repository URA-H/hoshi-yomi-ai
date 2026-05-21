/**
 * 占術内部用語 → UI ラベルの翻訳レイヤー
 *
 * 内部データには「大凶」「五黄殺」など、コピーガイドで禁じている語が含まれる。
 * UI に直接渡すと validate-output のガードをすり抜けるため、表示用文字列は
 * 必ずこのモジュールを通して変換する。
 *
 * 設計:
 *   - intensity: UI の視覚的階調 (色・アイコン分岐用)
 *   - display:   ユーザーが最初に目にする短いラベル (煽り表現ゼロ)
 *   - detail:    補足説明 (ツールチップ等)
 *   - technical: 内部用語 (AI プロンプトや開発者向けログでのみ使用)
 *
 * @see docs/copy-guide.md §5 用語集
 */

import type {
  DirectionFortune,
  DirectionResult,
  TwelveStage,
  MeishikiResult,
} from "./types";

// ============================================================
// 方位の吉凶
// ============================================================

export type DirectionIntensity =
  | "neutral"
  | "mild-favor"
  | "favor"
  | "strong-favor"
  | "mild-caution"
  | "caution"
  | "strong-caution";

export type FormattedDirection = {
  /** 視覚階調 */
  intensity: DirectionIntensity;
  /** ユーザー向けの短い表示 */
  display: string;
  /** ツールチップ/詳細パネルなどでの説明 */
  detail: string | null;
  /** 内部用語 (UI 直接出力禁止) */
  technical: string | null;
};

const FORTUNE_TO_INTENSITY: Record<DirectionFortune, DirectionIntensity> = {
  大吉: "strong-favor",
  吉: "favor",
  小吉: "mild-favor",
  中立: "neutral",
  小凶: "mild-caution",
  凶: "caution",
  大凶: "strong-caution",
};

const FORTUNE_TO_DISPLAY: Record<DirectionFortune, string> = {
  大吉: "好機の方位",
  吉: "動きやすい方位",
  小吉: "穏やかな方位",
  中立: "中立の方位",
  小凶: "やや気を配る方位",
  凶: "注意を向けたい方位",
  大凶: "慎重を要する方位",
};

/** 凶の理由 (五黄殺/暗剣殺/本命殺/本命的殺) → 婉曲な説明 */
const REASON_DETAIL: Record<string, string> = {
  五黄殺: "五黄星が位置する方位 — 内側のゆらぎが出やすい時期",
  暗剣殺: "五黄星の対面 — 予期しない出来事への備えが活きる",
  本命殺: "本命星が位置する方位 — 自分との向き合いが必要になりやすい",
  本命的殺: "本命殺の対面 — 自分の意図と周囲のリズムがずれやすい",
};

/**
 * `DirectionResult` を UI 表示用に整形する
 */
export function formatDirectionResult(r: DirectionResult): FormattedDirection {
  return {
    intensity: FORTUNE_TO_INTENSITY[r.fortune],
    display: FORTUNE_TO_DISPLAY[r.fortune],
    detail: r.reason ? formatReason(r.reason) : null,
    technical: r.reason,
  };
}

function formatReason(rawReason: string): string {
  // 複数理由 "五黄殺 + 本命殺" の形式に対応
  const parts = rawReason.split(/\s*\+\s*/);
  return parts
    .map((p) => REASON_DETAIL[p.trim()] ?? p.trim())
    .join(" / ");
}

// ============================================================
// 十二運
// ============================================================

/**
 * 十二運の体感的階調 (色やアイコン分岐用)。
 * 名称そのものは伝統的占術用語なので、UI に「臨官」等と出すこと自体は問題ない。
 * ここでは強度のみ補助情報として返す。
 */
export type TwelveStageMood = "rising" | "peak" | "settled" | "low" | "dormant";

const TWELVE_STAGE_MOOD: Record<TwelveStage, TwelveStageMood> = {
  長生: "rising",
  沐浴: "rising",
  冠帯: "rising",
  臨官: "peak",
  帝旺: "peak",
  衰: "settled",
  病: "low",
  死: "low",
  墓: "dormant",
  絶: "dormant",
  胎: "dormant",
  養: "rising",
};

export function moodOfTwelveStage(stage: TwelveStage): TwelveStageMood {
  return TWELVE_STAGE_MOOD[stage];
}

// ============================================================
// 身強・身弱
// ============================================================

/**
 * 「身強」「身弱」「中和」は伝統的な四柱推命用語。UI で表示する場合の
 * 婉曲な言い換え。表示しない選択肢も多いので、必要時のみ使う。
 */
export function describeStrength(strength: MeishikiResult["strength"]): string {
  switch (strength) {
    case "身強":
      return "前に出る力が強めの命式";
    case "身弱":
      return "周囲との調和が活きる命式";
    case "中和":
      return "バランスが取れた命式";
  }
}
