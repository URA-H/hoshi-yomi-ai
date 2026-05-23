import { describe, it, expect } from "vitest";
import { validateFortuneOutput } from "./validate-output";

describe("validateFortuneOutput", () => {
  describe("Tier A: 絶対NG → regenerate", () => {
    it.each([
      "先祖の祟りがあります",
      "除霊が必要です",
      "100%確実に成功します",
      "悪霊が見えます",
      "このままでは不幸になる流れです",
    ])("'%s' should trigger regenerate", (input) => {
      const r = validateFortuneOutput(input);
      expect(r.status).toBe("regenerate");
      expect(r.flags.length).toBeGreaterThan(0);
      expect(r.flags[0]).toMatch(/^FORBIDDEN:/);
    });

    it("flag should mention the matched term", () => {
      const r = validateFortuneOutput("先祖の祟りがあります");
      expect(r.flags.some((f) => f.includes("祟り"))).toBe(true);
    });
  });

  describe("Tier B: 強く避ける → regenerate", () => {
    it.each([
      "今月は大凶の月です",
      "奇跡が起こります",
      "宿命を受け入れて",
      "100パーセントの自信",
      "絶対的に信じてください",
      "運命的な出会いがあります",
    ])("'%s' should trigger regenerate", (input) => {
      const r = validateFortuneOutput(input);
      expect(r.status).toBe("regenerate");
      expect(r.flags[0]).toMatch(/^DISCOURAGED:/);
    });
  });

  describe("Tier A 拡張: 漢数字/英字バリアント", () => {
    it.each(["百パーセント当たる", "百％の精度"])(
      "'%s' should trigger regenerate",
      (input) => {
        const r = validateFortuneOutput(input);
        expect(r.status).toBe("regenerate");
        expect(r.flags[0]).toMatch(/^FORBIDDEN:/);
      },
    );
  });

  describe("Tier C: 自動置換", () => {
    it("信頼度 → 合致度", () => {
      const r = validateFortuneOutput("信頼度: 高");
      expect(r.status).toBe("auto-replaced");
      expect(r.output).toBe("合致度: 高");
    });

    it("複数語の連鎖置換", () => {
      const r = validateFortuneOutput("統計学に基づく予言です");
      expect(r.status).toBe("auto-replaced");
      expect(r.output).toBe("経験知の体系に基づく示唆です");
    });

    it("予知 → 示唆", () => {
      const r = validateFortuneOutput("AIによる未来予知");
      expect(r.status).toBe("auto-replaced");
      expect(r.output).toContain("示唆");
    });

    it("同一語の複数出現は1つの flag に出現回数を埋め込む", () => {
      const r = validateFortuneOutput("信頼度: 高 / 信頼度: 中 / 信頼度: 低");
      expect(r.status).toBe("auto-replaced");
      expect(r.output).toBe("合致度: 高 / 合致度: 中 / 合致度: 低");
      expect(r.flags).toEqual(["REPLACED(3): 信頼度 → 合致度"]);
    });
  });

  describe("安全な出力はそのまま通過", () => {
    it.each([
      "今週は慎重さが活きる時期と読めます。",
      "三術合致 — 動きやすい時期と読めます",
      "重要な判断は専門家にご相談ください。",
    ])("'%s' should pass", (input) => {
      const r = validateFortuneOutput(input);
      expect(r.status).toBe("pass");
      expect(r.flags).toHaveLength(0);
    });
  });
});
