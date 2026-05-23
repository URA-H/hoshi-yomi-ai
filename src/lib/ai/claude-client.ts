import "server-only";

/**
 * Anthropic SDK アダプタ
 *
 * - stableSystem に `cache_control: { type: "ephemeral" }` を付与
 *   (5分 TTL のプロンプトキャッシュ — Sonnet 4.6 では最低 2048 トークンで効く。
 *    本プロジェクトの STABLE_SYSTEM_HEADER は Few-shot 例込みでこの閾値を超えるため、
 *    リクエスト 2 回目以降は入力単価が ~1/10 になる)
 * - dynamicSystem は通常テキスト
 * - userMessage は messages[0].content (キャッシュ対象外、毎回新規)
 *
 * モデル選定:
 *   - 日運:           Haiku 4.5 (高速・低コスト)
 *   - 月運/年運/大運:  Sonnet 4.6 (推論深度が必要)
 */

import Anthropic from "@anthropic-ai/sdk";
import type { LLMRequest } from "./generate-with-guardrails";

export type ModelTier = "haiku" | "sonnet";

const MODEL_IDS: Record<ModelTier, string> = {
  haiku: "claude-haiku-4-5",
  sonnet: "claude-sonnet-4-6",
};

// SDK は ANTHROPIC_API_KEY 環境変数を自動読み込み。
// 遅延初期化することで、キー未設定時のローカル開発でモジュール読み込みを失敗させない。
let cachedClient: Anthropic | null = null;
function getClient(): Anthropic {
  if (!cachedClient) {
    cachedClient = new Anthropic();
  }
  return cachedClient;
}

export function isApiKeyConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export type CallClaudeOptions = {
  model: ModelTier;
  maxTokens: number;
};

export type CallClaudeMetrics = {
  inputTokens: number;
  outputTokens: number;
  cacheReadInputTokens: number;
  cacheCreationInputTokens: number;
};

/**
 * 1ショット (非ストリーミング) で Claude を呼ぶ。
 * 戻り値は生のテキスト本体のみ。テレメトリは別チャネルで拾いたい場合は
 * `callClaudeWithMetrics` を使う。
 */
export async function callClaude(
  request: LLMRequest,
  options: CallClaudeOptions,
): Promise<string> {
  const { text } = await callClaudeWithMetrics(request, options);
  return text;
}

/**
 * メトリクス込みで Claude を呼ぶ。キャッシュヒット率を確認したいときに使う。
 * `metrics.cacheReadInputTokens > 0` ならキャッシュ命中。
 */
export async function callClaudeWithMetrics(
  request: LLMRequest,
  options: CallClaudeOptions,
): Promise<{ text: string; metrics: CallClaudeMetrics }> {
  const response = await getClient().messages.create({
    model: MODEL_IDS[options.model],
    max_tokens: options.maxTokens,
    system: [
      {
        type: "text",
        text: request.stableSystem,
        cache_control: { type: "ephemeral" },
      },
      {
        type: "text",
        text: request.dynamicSystem,
      },
    ],
    messages: [
      {
        role: "user",
        content: request.userMessage,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const text = textBlock && textBlock.type === "text" ? textBlock.text : "";

  return {
    text,
    metrics: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      cacheReadInputTokens: response.usage.cache_read_input_tokens ?? 0,
      cacheCreationInputTokens: response.usage.cache_creation_input_tokens ?? 0,
    },
  };
}
