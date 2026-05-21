import "server-only";

import { validateFortuneOutput, type ValidationResult } from "./validate-output";
import type { StructuredPrompt } from "./system-prompts";

const MAX_RETRIES = 2;

/** LLM 呼び出しに渡される構造化リクエスト */
export type LLMRequest = StructuredPrompt;

/**
 * LLM 呼び出し関数のシグネチャ。
 *
 * 実装側 (`callClaude` など) では Anthropic SDK の `messages.create` を
 * 以下のように組み立てる:
 *
 *   await client.messages.create({
 *     model,
 *     max_tokens,
 *     system: [
 *       { type: "text", text: req.stableSystem,
 *         cache_control: { type: "ephemeral" } },  // ←キャッシュ
 *       { type: "text", text: req.dynamicSystem },
 *     ],
 *     messages: [{ role: "user", content: req.userMessage }],
 *   });
 *
 * stableSystem は約1000トークンの定型ヘッダー。`cache_control` を付けることで
 * 5分TTL内の同一プロンプトに対する入力コストが 1/10 になる。
 */
export type LLMCaller = (req: LLMRequest) => Promise<string>;

export type GuardrailResult = {
  output: string;
  attempts: number;
  finalFlags: string[];
};

/**
 * 3層出力検証 + 限定的な再生成 + フォールバック。
 *
 *  - Tier C (auto-replace) hits → 置換適用済みの出力を返す
 *  - Tier A/B hits             → 最大 MAX_RETRIES 回まで再生成
 *  - 再生成も失敗              → fallback() を返す（事前生成された安全テンプレート）
 *
 * @see docs/ai-safety-spec.md
 */
export async function generateWithGuardrails(
  request: LLMRequest,
  callLLM: LLMCaller,
  fallback: () => string,
): Promise<GuardrailResult> {
  let current: LLMRequest = request;
  let lastValidation: ValidationResult | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const raw = await callLLM(current);
    const validation = validateFortuneOutput(raw);
    lastValidation = validation;

    if (validation.status === "pass" || validation.status === "auto-replaced") {
      return {
        output: validation.output,
        attempts: attempt + 1,
        finalFlags: validation.flags,
      };
    }

    // 再生成: dynamicSystem に「直前の出力を避ける」指示を追加。
    // stableSystem は一切触らない (= キャッシュを温存)。
    current = {
      ...current,
      dynamicSystem: appendNegativeFeedback(
        current.dynamicSystem,
        raw,
        validation.flags,
      ),
    };
  }

  return {
    output: fallback(),
    attempts: MAX_RETRIES + 1,
    finalFlags: lastValidation?.flags ?? ["fallback-used"],
  };
}

function appendNegativeFeedback(
  dynamicSystem: string,
  badOutput: string,
  flags: string[],
): string {
  return `${dynamicSystem}

# 直前の出力で問題があった点
以下の出力には禁止語が含まれていました。同じ表現を繰り返さないでください。

検出されたフラグ:
${flags.map((f) => "- " + f).join("\n")}

避けるべき出力（参考、繰り返さない）:
> ${badOutput.replace(/\n/g, "\n> ").slice(0, 800)}`;
}
