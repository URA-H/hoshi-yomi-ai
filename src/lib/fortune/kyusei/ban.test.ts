import { describe, it, expect } from "vitest";
import { buildBan } from "./ban";

describe("buildBan", () => {
  it("五黄中央 → 後天定位盤", () => {
    // SE=4 S=9 SW=2 / E=3 C=5 W=7 / NE=8 N=1 NW=6
    const b = buildBan(5);
    expect(b.center).toBe(5);
    expect(b.positions.北西).toBe(6);
    expect(b.positions.西).toBe(7);
    expect(b.positions.北東).toBe(8);
    expect(b.positions.南).toBe(9);
    expect(b.positions.北).toBe(1);
    expect(b.positions.南西).toBe(2);
    expect(b.positions.東).toBe(3);
    expect(b.positions.南東).toBe(4);
  });

  it("一白中央 → 各方位は C+offset を 1..9 にラップ", () => {
    const b = buildBan(1);
    expect(b.center).toBe(1);
    expect(b.positions.北西).toBe(2);
    expect(b.positions.西).toBe(3);
    expect(b.positions.北東).toBe(4);
    expect(b.positions.南).toBe(5);
    expect(b.positions.北).toBe(6);
    expect(b.positions.南西).toBe(7);
    expect(b.positions.東).toBe(8);
    expect(b.positions.南東).toBe(9);
  });

  it("九紫中央 → ラップアラウンド検証", () => {
    const b = buildBan(9);
    // 9+1=10 → 1, 9+2=11 → 2, ..., 9+8=17 → 8
    expect(b.positions.北西).toBe(1);
    expect(b.positions.南東).toBe(8);
  });

  it("中央自身は中央以外には現れない", () => {
    for (let c = 1; c <= 9; c++) {
      const b = buildBan(c as 1);
      const others = Object.entries(b.positions).filter(
        ([dir]) => dir !== "中央",
      );
      expect(others.every(([, n]) => n !== c)).toBe(true);
    }
  });

  it("全方位の星番号が 1..9 のユニークな組み合わせ", () => {
    const b = buildBan(3);
    const all = [
      b.center,
      b.positions.北,
      b.positions.北東,
      b.positions.東,
      b.positions.南東,
      b.positions.南,
      b.positions.南西,
      b.positions.西,
      b.positions.北西,
    ];
    expect(new Set(all).size).toBe(9);
  });
});
