import "server-only";

/**
 * 占術データ → AI 解釈テキスト の統合エントリ
 *
 * 流れ:
 *   1. CombinedFortuneData + period から構造化プロンプトを組み立て
 *   2. ANTHROPIC_API_KEY が設定済みなら callClaude を、未設定ならモックを使う
 *   3. validate-output の 3 段ガードを通して再生成 or 自動置換
 *   4. 失敗時はフォールバックテンプレート
 */

import type { CombinedFortuneData } from "../fortune/types";
import { buildFortunePrompt, type Period } from "./system-prompts";
import { generateWithGuardrails } from "./generate-with-guardrails";
import {
  callClaude,
  isApiKeyConfigured,
  type ModelTier,
} from "./claude-client";
import { mockClaude } from "./mock-claude";

type PeriodConfig = {
  model: ModelTier;
  maxTokens: number;
};

/**
 * 期間別のモデル + max_tokens 設定
 * 日本語 1 文字 ≈ 1.5-2 トークンで概算。出力目安の 2 倍程度を確保。
 */
const PERIOD_CONFIG: Record<Period, PeriodConfig> = {
  daily: { model: "haiku", maxTokens: 1500 },      // 400-600 字
  monthly: { model: "sonnet", maxTokens: 3000 },   // 800-1200 字
  yearly: { model: "sonnet", maxTokens: 5000 },    // 1500-2500 字
  decadal: { model: "sonnet", maxTokens: 8000 },   // 2500-4000 字
};

const FALLBACK_TEMPLATE = `この期間の解釈の準備中です。

下のデータ一覧では、三術が示している傾向と合致度を確認いただけます。
最終的な判断はご自身で。重要な医療・金融・法的判断は専門家にご相談ください。`;

export type FortuneReading = {
  /** 表示用テキスト本体 */
  text: string;
  /** "claude" = 実 API / "mock" = ローカルモック */
  source: "claude" | "mock";
  /** 再生成を含めた試行回数 */
  attempts: number;
  /** validate-output が検知したフラグ */
  flags: string[];
};

export async function generateFortuneReading(
  fortune: CombinedFortuneData,
  period: Period,
): Promise<FortuneReading> {
  const cfg = PERIOD_CONFIG[period];

  const approximationNote =
    fortune.shiWei.approximation === "time-unknown"
      ? "ユーザーは出生時刻不明です。紫微斗数の命宮や運限は概算であることを文中で軽く示唆してください。"
      : undefined;

  const promptRequest = buildFortunePrompt({
    period,
    divinationData: JSON.stringify(fortune, null, 2),
    approximationNote,
  });

  const useReal = isApiKeyConfigured();

  const caller = useReal
    ? (req: typeof promptRequest) => callClaude(req, cfg)
    : (req: typeof promptRequest) => Promise.resolve(mockClaude(req));

  const result = await generateWithGuardrails(
    promptRequest,
    caller,
    () => FALLBACK_TEMPLATE,
  );

  return {
    text: result.output,
    source: useReal ? "claude" : "mock",
    attempts: result.attempts,
    flags: result.finalFlags,
  };
}
