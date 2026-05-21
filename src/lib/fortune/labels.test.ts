import { describe, it, expect } from "vitest";
import {
  formatDirectionResult,
  describeStrength,
  moodOfTwelveStage,
} from "./labels";

describe("formatDirectionResult", () => {
  it("中立はそのまま中立として返す", () => {
    const r = formatDirectionResult({
      direction: "北",
      fortune: "中立",
      reason: null,
    });
    expect(r.intensity).toBe("neutral");
    expect(r.display).toBe("中立の方位");
    expect(r.detail).toBeNull();
    expect(r.technical).toBeNull();
  });

  it("大凶は『慎重を要する方位』に変換され、煽り語を含まない", () => {
    const r = formatDirectionResult({
      direction: "南",
      fortune: "大凶",
      reason: "五黄殺",
    });
    expect(r.intensity).toBe("strong-caution");
    expect(r.display).toBe("慎重を要する方位");
    expect(r.display).not.toMatch(/大凶|凶/);
    expect(r.detail).toContain("五黄星");
    expect(r.technical).toBe("五黄殺");
  });

  it("複数理由の連結 (五黄殺 + 本命殺) を整形できる", () => {
    const r = formatDirectionResult({
      direction: "北西",
      fortune: "大凶",
      reason: "五黄殺 + 本命殺",
    });
    expect(r.detail).toContain("五黄星");
    expect(r.detail).toContain("本命星");
    expect(r.detail).toContain("/");
  });

  it("未知の理由はフォールバックして素通し (display は煽らない)", () => {
    const r = formatDirectionResult({
      direction: "東",
      fortune: "凶",
      reason: "歳破",
    });
    expect(r.display).toBe("注意を向けたい方位");
    expect(r.detail).toBe("歳破");
  });
});

describe("moodOfTwelveStage", () => {
  it.each([
    ["長生", "rising"],
    ["臨官", "peak"],
    ["帝旺", "peak"],
    ["衰", "settled"],
    ["死", "low"],
    ["墓", "dormant"],
  ] as const)("%s → %s", (stage, expected) => {
    expect(moodOfTwelveStage(stage)).toBe(expected);
  });
});

describe("describeStrength", () => {
  it("身強/身弱/中和を煽り抜きで言い換える", () => {
    expect(describeStrength("身強")).not.toMatch(/凶/);
    expect(describeStrength("身弱")).not.toMatch(/弱い/);
    expect(describeStrength("中和")).toBe("バランスが取れた命式");
  });
});
