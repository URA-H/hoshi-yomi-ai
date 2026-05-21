import { validateFortuneOutput, type ValidationResult } from "./validate-output";

const MAX_RETRIES = 2;

/**
 * Wrap an LLM call with three-tier output validation and bounded regeneration.
 *
 * - On Tier C (auto-replace) hits the result is returned with replacements applied.
 * - On Tier A/B hits, regenerate up to MAX_RETRIES times.
 * - If retries exhaust, return the fallback template so the user is never shown raw output.
 *
 * The actual Claude call is injected so the API key, model, and stream/non-stream
 * behavior can be configured by the caller.
 *
 * @see docs/ai-safety-spec.md
 */
export async function generateWithGuardrails(
  systemPrompt: string,
  callLLM: (prompt: string) => Promise<string>,
  fallback: () => string,
): Promise<{ output: string; attempts: number; finalFlags: string[] }> {
  let prompt = systemPrompt;
  let lastValidation: ValidationResult | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const raw = await callLLM(prompt);
    const validation = validateFortuneOutput(raw);
    lastValidation = validation;

    if (validation.status === "pass" || validation.status === "auto-replaced") {
      return {
        output: validation.output,
        attempts: attempt + 1,
        finalFlags: validation.flags,
      };
    }

    prompt = appendNegativeExample(prompt, raw, validation.flags);
  }

  return {
    output: fallback(),
    attempts: MAX_RETRIES + 1,
    finalFlags: lastValidation?.flags ?? ["fallback-used"],
  };
}

function appendNegativeExample(
  prompt: string,
  badOutput: string,
  flags: string[],
): string {
  return `${prompt}

# 直前の出力で問題があった点
以下の出力には禁止語が含まれていました。同じ表現を繰り返さないでください。

検出されたフラグ:
${flags.map((f) => "- " + f).join("\n")}

避けるべき出力（参考、繰り返さない）:
> ${badOutput.replace(/\n/g, "\n> ").slice(0, 800)}`;
}
