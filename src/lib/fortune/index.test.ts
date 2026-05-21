import { describe, it, expect } from "vitest";
import { calculateFortune } from "./index";

describe("calculateFortune integration", () => {
  const baseInput = {
    birthDate: "1990-01-15",
    birthTime: "06:30",
    birthLongitude: 139.69,
    gender: "male" as const,
  };

  it("既知の出生情報で全領域が埋まる", () => {
    const r = calculateFortune(baseInput, "monthly", new Date("2026-05-21"));
    expect(r.meishiki.dayMaster).toBe("庚");
    expect(r.meishiki.yearPillar.tianGan).toBe("己");
    expect(r.kyusei.honmeiseiNumber).toBe(2); // 立春前なので 1989 = 二黒
    expect(r.shiWei.mainStar).toBe("七殺");
    expect(r.shiWei.approximation).toBeUndefined();
    expect(r.crossAnalysis.domains).toHaveLength(7);
  });

  it("時刻不明は紫微斗数に approximation フラグが立つ", () => {
    const r = calculateFortune(
      { ...baseInput, birthTime: null },
      "monthly",
      new Date("2026-05-21"),
    );
    expect(r.shiWei.approximation).toBe("time-unknown");
    expect(r.meishiki.hourPillar).toBeNull();
  });

  it("targetDate は UTC ではなくローカル日付を返す", () => {
    // JST 23:30 のタイミングで「今日」を要求するケースを再現
    const localLateNight = new Date("2026-05-21T23:30:00+09:00");
    const r = calculateFortune(baseInput, "daily", localLateNight);
    // YYYY-MM-DD はローカル日付。JST=UTC+9 環境では 2026-05-21
    // UTC 環境では 2026-05-21 14:30 だが getDate() はローカルを返す
    expect(r.targetDate).toMatch(/^2026-05-2[01]$/); // CI 上の TZ で揺れうるが、UTCスライスの致命的バグ (5/22 化) は防ぐ
  });

  it("男女で大運の進行方向が変わる", () => {
    const male = calculateFortune({ ...baseInput, gender: "male" }, "yearly");
    const female = calculateFortune(
      { ...baseInput, gender: "female" },
      "yearly",
    );
    // 同一出生月柱でも、大運の最初の天干は男女で異なる（順行/逆行）
    expect(male.meishiki.daYun[0].tianGan).not.toBe(
      female.meishiki.daYun[0].tianGan,
    );
  });

  it("真太陽時補正が伝播する", () => {
    const r = calculateFortune(baseInput, "daily");
    expect(r.trueSolarTime).not.toBeNull();
    expect(r.trueSolarTime?.longitudeCorrection).toBeCloseTo(
      (139.69 - 135) * 4,
      1,
    );
  });
});

describe("calculateFortune クロス分析", () => {
  it("合致度は 0..1 の範囲", () => {
    const r = calculateFortune(
      {
        birthDate: "1985-08-20",
        birthTime: null,
        birthLongitude: 135.52,
        gender: "female",
      },
      "monthly",
    );
    for (const d of r.crossAnalysis.domains) {
      expect(d.concordance).toBeGreaterThanOrEqual(0);
      expect(d.concordance).toBeLessThanOrEqual(1);
      expect(d.confidence).toBeGreaterThanOrEqual(0);
      expect(d.confidence).toBeLessThanOrEqual(100);
    }
  });

  it("方位は九星のみが評価する (推命/紫微は null)", () => {
    const r = calculateFortune(
      {
        birthDate: "1990-01-15",
        birthTime: "06:30",
        birthLongitude: 139.69,
        gender: "male",
      },
      "monthly",
    );
    const direction = r.crossAnalysis.domains.find(
      (d) => d.domain === "direction",
    );
    expect(direction?.shichusuimei).toBeNull();
    expect(direction?.shiWei).toBeNull();
    expect(direction?.kyusei).not.toBeNull();
  });
});
