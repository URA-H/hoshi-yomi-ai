/**
 * Sanity tests for the output validator.
 * Run with: pnpm test (after adding a runner — currently a reference spec).
 */
import { validateFortuneOutput } from "./validate-output";

// --- Tier A: ABSOLUTELY_FORBIDDEN ---

{
  const r = validateFortuneOutput("先祖の祟りがあります");
  console.assert(r.status === "regenerate", "祟り should regenerate");
  console.assert(r.flags.some((f) => f.includes("祟り")), "flag should mention 祟り");
}

{
  const r = validateFortuneOutput("除霊が必要です");
  console.assert(r.status === "regenerate", "除霊 should regenerate");
}

{
  const r = validateFortuneOutput("100%確実に成功します");
  console.assert(r.status === "regenerate", "100% should regenerate");
}

// --- Tier B: STRONGLY_DISCOURAGED ---

{
  const r = validateFortuneOutput("今月は大凶の月です");
  console.assert(r.status === "regenerate", "大凶 should regenerate");
}

// --- Tier C: TERM_REPLACEMENTS ---

{
  const r = validateFortuneOutput("信頼度: 高");
  console.assert(r.status === "auto-replaced", "信頼度 should auto-replace");
  console.assert(r.output === "合致度: 高", "expected 合致度: 高, got: " + r.output);
}

{
  const r = validateFortuneOutput("統計学に基づく予言です");
  console.assert(r.status === "auto-replaced", "should auto-replace twice");
  console.assert(
    r.output === "経験知の体系に基づく示唆です",
    "expected normalized phrase, got: " + r.output,
  );
}

// --- Pass through ---

{
  const r = validateFortuneOutput("今週は慎重さが活きる時期と読めます。");
  console.assert(r.status === "pass", "safe output should pass");
  console.assert(r.flags.length === 0, "no flags expected");
}

console.log("validate-output: all assertions evaluated");
