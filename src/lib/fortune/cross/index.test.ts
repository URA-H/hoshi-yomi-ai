import { describe, it, expect } from "vitest";
import { calculateCrossAnalysis } from "./index";
import { calculateFortune } from "../index";

describe("calculateCrossAnalysis", () => {
  const baseInput = {
    birthDate: "1990-01-15",
    birthTime: "06:30",
    birthLongitude: 139.69,
    gender: "male" as const,
  };

  it("合致度はすべて 0..1 の範囲", () => {
    const f = calculateFortune(baseInput, "monthly", new Date("2026-05-21"));
    const r = calculateCrossAnalysis(f.meishiki, f.kyusei, f.shiWei);
    for (const d of r.domains) {
      expect(d.concordance).toBeGreaterThanOrEqual(0);
      expect(d.concordance).toBeLessThanOrEqual(1);
    }
  });

  it("信頼度はすべて 0..100 の範囲", () => {
    const f = calculateFortune(baseInput, "monthly", new Date("2026-05-21"));
    const r = calculateCrossAnalysis(f.meishiki, f.kyusei, f.shiWei);
    for (const d of r.domains) {
      expect(d.confidence).toBeGreaterThanOrEqual(0);
      expect(d.confidence).toBeLessThanOrEqual(100);
    }
  });

  it("方位ドメインは九星のみ評価 (推命/紫微は null)", () => {
    const f = calculateFortune(baseInput, "monthly", new Date("2026-05-21"));
    const r = calculateCrossAnalysis(f.meishiki, f.kyusei, f.shiWei);
    const dir = r.domains.find((d) => d.domain === "direction");
    expect(dir?.shichusuimei).toBeNull();
    expect(dir?.shiWei).toBeNull();
    expect(dir?.kyusei).not.toBeNull();
  });

  it("全 7 領域が含まれる", () => {
    const f = calculateFortune(baseInput, "monthly", new Date("2026-05-21"));
    const r = calculateCrossAnalysis(f.meishiki, f.kyusei, f.shiWei);
    const domains = r.domains.map((d) => d.domain).sort();
    expect(domains).toEqual([
      "career",
      "direction",
      "health",
      "personality",
      "relationship",
      "timing",
      "wealth",
    ]);
  });

  it("総合スコア・合致度も範囲内", () => {
    const f = calculateFortune(baseInput, "monthly", new Date("2026-05-21"));
    const r = calculateCrossAnalysis(f.meishiki, f.kyusei, f.shiWei);
    expect(r.overallScore).toBeGreaterThanOrEqual(0);
    expect(r.overallScore).toBeLessThanOrEqual(100);
    expect(r.overallConfidence).toBeGreaterThanOrEqual(0);
    expect(r.overallConfidence).toBeLessThanOrEqual(100);
  });
});
