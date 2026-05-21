/**
 * Fortune AI — Output safety lexicon
 *
 * Three-tier defense aligned with:
 *  - 霊感商法救済新法 (2023): 「祟り」「呪い」等の困惑類型を禁止
 *  - 景品表示法: 優良誤認・有利誤認の回避
 *  - 消費者契約法: 困惑類型での契約取消
 *  - Internal copy style guide (docs/copy-guide.md)
 *
 * Full spec: docs/ai-safety-spec.md
 */

/**
 * Tier A — Absolutely forbidden.
 * Output containing any of these triggers full regeneration.
 * These map to language patterns prohibited under 霊感商法救済新法.
 */
export const ABSOLUTELY_FORBIDDEN = [
  // 霊感商法系
  "祟り",
  "呪い",
  "悪霊",
  "悪い霊",
  "霊障",
  "因縁",
  "除霊",
  "お祓い",
  "祈祷が必要",
  "先祖の祟り",
  "水子の祟り",
  "因縁を切る",

  // 不安煽り系
  "このままでは不幸になる",
  "家族に災いが及ぶ",
  "取り返しがつかなくなる",
  "すぐに行動しないと",
  "今行動しないと手遅れ",
  "重大な災い",

  // 断定的予言
  "100%",
  "絶対に当たる",
  "必ず起こる",
  "確実に",

  // 虚偽の権威付け
  "科学的に証明された",
  "統計学的に正しい",
  "医学的に",
] as const;

/**
 * Tier B — Strongly discouraged.
 * Output containing these triggers regeneration.
 * Rooted in landing-page advertising-law risk and ethics review.
 */
export const STRONGLY_DISCOURAGED = [
  // 過剰な確実性
  "間違いなく",
  "断言できます",

  // 過剰演出
  "奇跡",
  "神秘の力",
  "宇宙からのメッセージ",
  "宿命",

  // 凶の煽り
  "大凶",
  "厄災",
  "厄日",
  "凶日",
  "破滅",

  // 課金誘導匂わせ
  "プレミアムプランで真実が",
] as const;

/**
 * Tier C — Auto-replace.
 * Unifies vocabulary with the copy style guide.
 * Order matters: longer phrases first to avoid partial-match collisions.
 */
export const TERM_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  // 用語統一(順番に意味あり: 長いものから)
  ["科学的根拠", "伝統的な体系"],
  ["未来予測", "傾向の読み解き"],
  ["信頼度スコア", "合致度"],
  ["信頼度", "合致度"],
  ["的中率", "合致度"],
  ["統計学", "経験知の体系"],
  ["予言", "示唆"],
  ["予知", "示唆"],
  ["大吉", "動きやすい時期"],
  ["絶好調", "動きやすい時期"],
  ["最強運", "好機の時期"],
  ["災い", "注意の必要な局面"],
];
