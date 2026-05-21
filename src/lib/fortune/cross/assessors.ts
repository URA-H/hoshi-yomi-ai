/**
 * 三術の領域別アセッサ
 *
 * 各占術の生データから、領域(personality/career/wealth/relationship/health/
 * timing/direction)ごとに 1-5 のスコアと根拠文を抽出する。
 *
 * 設計方針:
 *  - スコアは「現時点の追い風/向かい風の度合い」(1=注意/5=好機) を表す概算
 *  - 占術の本質を歪めないよう、ヒューリスティックはシンプルに保つ
 *  - 詳細な解釈は AI 側のシステムプロンプトに任せ、ここではフレームを与える
 *  - スコアが算出できないドメインは null を返す
 */

import type {
  MeishikiResult,
  KyuseiResult,
  ShiWeiResult,
  AnalysisDomain,
  DomainAssessment,
  ShiShen,
} from "../types";

// ============================================================
// 四柱推命: 領域 → 評価
// ============================================================

const WEALTH_SHI_SHEN: ReadonlySet<ShiShen> = new Set(["正財", "偏財"]);
const CAREER_SHI_SHEN: ReadonlySet<ShiShen> = new Set(["正官", "偏官"]);
const RELATION_SHI_SHEN: ReadonlySet<ShiShen> = new Set([
  "正官",
  "偏官",
  "正財",
  "偏財",
]);

function countShiShenInPillars(
  m: MeishikiResult,
  target: ReadonlySet<ShiShen>,
): number {
  const pillars = [m.yearPillar, m.monthPillar, m.dayPillar, m.hourPillar];
  return pillars.reduce<number>((acc, p) => {
    if (p && p.shiShen && target.has(p.shiShen)) acc += 1;
    return acc;
  }, 0);
}

/** 五行バランスの偏り係数 (0=均整 / 1=極端) */
function wuxingImbalance(m: MeishikiResult): number {
  const vals = Object.values(m.wuXingBalance);
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  const total = vals.reduce((a, b) => a + b, 0) || 1;
  return (max - min) / total;
}

export function assessMeishiki(
  m: MeishikiResult,
  domain: AnalysisDomain,
): DomainAssessment | null {
  switch (domain) {
    case "personality": {
      // 強弱で軸となる傾向。極端であるほどスコアは中央から外れる
      const score = m.strength === "中和" ? 4 : 3;
      return {
        score,
        reasoning: `日干 ${m.dayMaster} (${m.strength})。五行偏り係数 ${wuxingImbalance(m).toFixed(2)}`,
      };
    }
    case "career": {
      const officials = countShiShenInPillars(m, CAREER_SHI_SHEN);
      const score = Math.min(5, 2 + officials);
      return {
        score,
        reasoning: `正官/偏官 ${officials} 個。月柱 ${m.monthPillar.tianGan}${m.monthPillar.diZhi}/${m.monthPillar.shiShen ?? "—"}`,
      };
    }
    case "wealth": {
      const wealth = countShiShenInPillars(m, WEALTH_SHI_SHEN);
      const score = Math.min(5, 2 + wealth);
      return {
        score,
        reasoning: `正財/偏財 ${wealth} 個`,
      };
    }
    case "relationship": {
      const relStars = countShiShenInPillars(m, RELATION_SHI_SHEN);
      const hourTag = m.hourPillar?.shiShen ?? "—";
      const score = Math.min(5, 2 + Math.floor(relStars / 2));
      return {
        score,
        reasoning: `配偶星候補 ${relStars} 個 / 時柱の十神 ${hourTag}`,
      };
    }
    case "health": {
      // 偏りが少ないほど健康面のバランスがよい
      const imbalance = wuxingImbalance(m);
      const score =
        imbalance < 0.25 ? 5 : imbalance < 0.4 ? 4 : imbalance < 0.55 ? 3 : 2;
      return {
        score,
        reasoning: `五行偏り ${imbalance.toFixed(2)}`,
      };
    }
    case "timing": {
      // 直近の大運の十二運強度から
      const dy = m.daYun[0];
      if (!dy) return null;
      const strongStages = new Set(["長生", "冠帯", "臨官", "帝旺"]);
      const weakStages = new Set(["死", "墓", "絶"]);
      const score = strongStages.has(dy.twelveStage)
        ? 4
        : weakStages.has(dy.twelveStage)
          ? 2
          : 3;
      return {
        score,
        reasoning: `大運 ${dy.startAge}歳〜 ${dy.tianGan}${dy.diZhi} (${dy.shiShen}/${dy.twelveStage})`,
      };
    }
    case "direction":
      // 四柱推命は方位を扱わない
      return null;
  }
}

// ============================================================
// 九星気学: 領域 → 評価
// ============================================================

export function assessKyusei(
  k: KyuseiResult,
  domain: AnalysisDomain,
): DomainAssessment | null {
  switch (domain) {
    case "personality":
      return {
        score: 4,
        reasoning: `本命星 ${k.honmeisei}`,
      };
    case "career":
      return {
        score: 3,
        reasoning: `月命星 ${k.getsumeisei}`,
      };
    case "wealth":
      // 九星は財運を直接扱わないが、本命と日盤の関係で概算
      return {
        score: 3,
        reasoning: `本命星 ${k.honmeisei} と日盤中央 ${k.dayBan.center}`,
      };
    case "relationship":
      return {
        score: 3,
        reasoning: `月命星 ${k.getsumeisei} と日命星 ${k.nichimeisei}`,
      };
    case "health":
      return {
        score: 3,
        reasoning: `日命星 ${k.nichimeisei}`,
      };
    case "timing":
      // 年盤中央が本命星に対して相生関係なら追い風
      return {
        score: 3,
        reasoning: `年盤中央 ${k.yearBan.center} / 月盤中央 ${k.monthBan.center}`,
      };
    case "direction": {
      // 方位は九星の得意分野。凶方位の数で評価
      const bad = k.directions.filter((d) => d.fortune !== "中立").length;
      const score = bad === 0 ? 5 : bad <= 2 ? 4 : bad <= 3 ? 3 : 2;
      const reasons = k.directions
        .filter((d) => d.fortune !== "中立")
        .map((d) => `${d.direction}:${d.reason}`)
        .join(" / ");
      return {
        score,
        reasoning: `要注意方位 ${bad} ヶ所${reasons ? `(${reasons})` : ""}`,
      };
    }
  }
}

// ============================================================
// 紫微斗数: 領域 → 評価
// ============================================================

/** 主星の数で素朴に評価する: 多いほど豊か(=動きが大きい) */
function palaceScore(
  s: ShiWeiResult,
  palaceName: import("../types").PalaceName,
): number {
  const p = s.palaces.find((x) => x.name === palaceName);
  const count = p?.majorStars.length ?? 0;
  if (count === 0) return 3;
  if (count === 1) return 4;
  return 5;
}

export function assessShiWei(
  s: ShiWeiResult,
  domain: AnalysisDomain,
): DomainAssessment | null {
  switch (domain) {
    case "personality": {
      const score = palaceScore(s, "命宮");
      return {
        score,
        reasoning: `命宮の主星 ${s.mainStar} / 命主 ${s.soul}`,
      };
    }
    case "career": {
      const score = palaceScore(s, "官禄宮");
      const p = s.palaces.find((x) => x.name === "官禄宮");
      return {
        score,
        reasoning: `官禄宮 主星 ${p?.majorStars.join(",") || "—"}`,
      };
    }
    case "wealth": {
      const score = palaceScore(s, "財帛宮");
      const p = s.palaces.find((x) => x.name === "財帛宮");
      return {
        score,
        reasoning: `財帛宮 主星 ${p?.majorStars.join(",") || "—"}`,
      };
    }
    case "relationship": {
      const score = palaceScore(s, "夫妻宮");
      const p = s.palaces.find((x) => x.name === "夫妻宮");
      return {
        score,
        reasoning: `夫妻宮 主星 ${p?.majorStars.join(",") || "—"}`,
      };
    }
    case "health": {
      const p = s.palaces.find((x) => x.name === "疾厄宮");
      const count = p?.majorStars.length ?? 0;
      // 疾厄宮は主星が空のほうが落ち着きを示す解釈もあり、ここでは中央寄り
      const score = count === 0 ? 4 : count === 1 ? 3 : 3;
      return {
        score,
        reasoning: `疾厄宮 主星 ${p?.majorStars.join(",") || "—"}`,
      };
    }
    case "timing": {
      const decade = s.currentDecade;
      if (!decade) return null;
      const score = decade.majorStars.length >= 1 ? 4 : 3;
      return {
        score,
        reasoning: `大限 ${decade.startAge}-${decade.endAge}歳 ${decade.palace} (${decade.majorStars.join(",") || "—"})`,
      };
    }
    case "direction":
      // 紫微斗数は方位を直接扱わない
      return null;
  }
}
