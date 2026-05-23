import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { generateFortuneReading } from "./generate-fortune-reading";
import { calculateFortune } from "../fortune";

describe("generateFortuneReading (mock path)", () => {
  const originalKey = process.env.ANTHROPIC_API_KEY;

  beforeEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
  });

  afterEach(() => {
    if (originalKey === undefined) {
      delete process.env.ANTHROPIC_API_KEY;
    } else {
      process.env.ANTHROPIC_API_KEY = originalKey;
    }
  });

  const input = {
    birthDate: "1990-01-15",
    birthTime: "06:30",
    birthLongitude: 139.69,
    gender: "male" as const,
  };

  it("API キー未設定時は source: 'mock' を返す", async () => {
    const fortune = calculateFortune(input, "monthly", new Date("2026-05-21"));
    const r = await generateFortuneReading(fortune, "monthly");
    expect(r.source).toBe("mock");
    expect(r.text.length).toBeGreaterThan(0);
  });

  it("モック出力は禁止語を含まない", async () => {
    const fortune = calculateFortune(input, "monthly", new Date("2026-05-21"));
    const r = await generateFortuneReading(fortune, "monthly");
    expect(r.text).not.toMatch(/祟り|呪い|除霊|100%|科学的に証明|大凶/);
  });

  it("モック出力は validate-output のガードを通過する", async () => {
    const fortune = calculateFortune(input, "monthly", new Date("2026-05-21"));
    const r = await generateFortuneReading(fortune, "monthly");
    // attempts=1, flags=[] なら 3 段ガードで素通り
    expect(r.attempts).toBe(1);
    expect(r.flags).toEqual([]);
  });

  it.each(["daily", "monthly", "yearly", "decadal"] as const)(
    "period=%s でも結果を返す",
    async (period) => {
      const fortune = calculateFortune(input, period, new Date("2026-05-21"));
      const r = await generateFortuneReading(fortune, period);
      expect(r.source).toBe("mock");
      expect(r.text).toMatch(/合致|示唆/);
    },
  );

  it("時刻不明時は approximation 注記がプロンプトに入る (副作用としてモックは無関係に動く)", async () => {
    const fortune = calculateFortune(
      { ...input, birthTime: null },
      "monthly",
      new Date("2026-05-21"),
    );
    expect(fortune.shiWei.approximation).toBe("time-unknown");
    const r = await generateFortuneReading(fortune, "monthly");
    expect(r.source).toBe("mock");
  });
});
