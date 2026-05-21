import { describe, it, expect } from "vitest";
import { digitalRoot, calculateHonmeiseiNumber } from "./honmeisei";

describe("digitalRoot", () => {
  it.each([
    [1990, 1],
    [1985, 5],
    [2020, 4],
    [2026, 1],
    [1972, 1],
    [1955, 2],
  ] as const)("digitalRoot(%i) = %i", (n, expected) => {
    expect(digitalRoot(n)).toBe(expected);
  });

  it("zero treated as 9 (cycle wrap)", () => {
    // 数値根が 0 になるケースは、9 として扱う仕様
    expect(digitalRoot(0)).toBe(9);
  });
});

describe("calculateHonmeiseiNumber - 立春後（年内）", () => {
  // 公知の九星年表に基づく検証
  it.each([
    ["1990-06-15", 1], // 一白水星
    ["1985-06-15", 6], // 六白金星
    ["2020-06-15", 7], // 七赤金星
    ["1972-06-15", 1], // 一白水星
    ["1955-06-15", 9], // 九紫火星
  ] as const)("%s → %i", (dateStr, expected) => {
    const n = calculateHonmeiseiNumber(new Date(dateStr));
    expect(n).toBe(expected);
  });
});

describe("calculateHonmeiseiNumber - 立春境界補正", () => {
  it("1990-01-15 (立春前) → 1989 として扱う = 二黒(2)", () => {
    expect(calculateHonmeiseiNumber(new Date("1990-01-15"))).toBe(2);
  });

  it("1990-02-15 (立春後) → 1990 として扱う = 一白(1)", () => {
    expect(calculateHonmeiseiNumber(new Date("1990-02-15"))).toBe(1);
  });

  it("1989-12-31 → そのまま 1989 = 二黒(2)", () => {
    expect(calculateHonmeiseiNumber(new Date("1989-12-31"))).toBe(2);
  });
});
