import {
  ABSOLUTELY_FORBIDDEN,
  STRONGLY_DISCOURAGED,
  TERM_REPLACEMENTS,
} from "./forbidden-terms";

export type ValidationStatus = "pass" | "regenerate" | "auto-replaced";

export type ValidationResult = {
  status: ValidationStatus;
  output: string;
  flags: string[];
};

/**
 * Three-tier output validation for Fortune AI generated text.
 *
 *  Tier A (ABSOLUTELY_FORBIDDEN)  → regenerate
 *  Tier B (STRONGLY_DISCOURAGED)  → regenerate
 *  Tier C (TERM_REPLACEMENTS)     → auto-replace, pass through
 *
 * @see docs/ai-safety-spec.md
 */
export function validateFortuneOutput(raw: string): ValidationResult {
  const flags: string[] = [];

  for (const term of ABSOLUTELY_FORBIDDEN) {
    if (raw.includes(term)) {
      flags.push(`FORBIDDEN: ${term}`);
      return { status: "regenerate", output: raw, flags };
    }
  }

  for (const term of STRONGLY_DISCOURAGED) {
    if (raw.includes(term)) {
      flags.push(`DISCOURAGED: ${term}`);
      return { status: "regenerate", output: raw, flags };
    }
  }

  let output = raw;
  for (const [bad, good] of TERM_REPLACEMENTS) {
    if (output.includes(bad)) {
      output = output.replaceAll(bad, good);
      flags.push(`REPLACED: ${bad} → ${good}`);
    }
  }

  return {
    status: flags.length > 0 ? "auto-replaced" : "pass",
    output,
    flags,
  };
}
