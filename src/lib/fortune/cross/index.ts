/**
 * クロス分析オーケストレーター
 *
 * 三術の生データから領域別評価を取り、合致度と信頼度を計算する。
 * AIに渡すサマリーフィールドは「合致度の事実」のみを述べ、解釈は AI 側で行う。
 *
 * 合致度 (concordance): スコアが中央値の±1以内に収まる占術数の割合 (0..1)
 * 信頼度 (confidence): 評価可能だった占術の数 × 合致度 を反映した 0-100 スコア
 *
 * 注意:
 *  - 「信頼度」という語は内部用語。AI 出力時には「合致度」に統一すること
 *    (docs/copy-guide.md, lib/ai/forbidden-terms.ts の TERM_REPLACEMENTS 参照)
 */

import type {
  MeishikiResult,
  KyuseiResult,
  ShiWeiResult,
  AnalysisDomain,
  DomainAssessment,
  CrossAnalysisDomain,
  CrossAnalysisResult,
} from "../types";
import { assessMeishiki, assessKyusei, assessShiWei } from "./assessors";

const ALL_DOMAINS: readonly AnalysisDomain[] = [
  "personality",
  "career",
  "wealth",
  "relationship",
  "health",
  "timing",
  "direction",
];

export function calculateCrossAnalysis(
  meishiki: MeishikiResult,
  kyusei: KyuseiResult,
  shiwei: ShiWeiResult,
): CrossAnalysisResult {
  const domains: CrossAnalysisDomain[] = ALL_DOMAINS.map((domain) => {
    const m = assessMeishiki(meishiki, domain);
    const k = assessKyusei(kyusei, domain);
    const s = assessShiWei(shiwei, domain);

    const present = [m, k, s].filter(
      (x): x is DomainAssessment => x !== null,
    );

    if (present.length === 0) {
      return {
        domain,
        shichusuimei: null,
        kyusei: null,
        shiWei: null,
        confidence: 0,
        concordance: 0,
        summary: "対応する占術なし",
      };
    }

    const scores = present.map((x) => x.score);
    const median = computeMedian(scores);

    const within = present.filter((x) => Math.abs(x.score - median) <= 1).length;
    const concordance = within / present.length;
    // 評価された占術の数 × 合致度 を 50/50 で混ぜる
    const completeness = present.length / 3;
    const confidence = Math.round(
      (completeness * 0.5 + concordance * 0.5) * 100,
    );

    return {
      domain,
      shichusuimei: m,
      kyusei: k,
      shiWei: s,
      confidence,
      concordance,
      summary: buildSummary(domain, scores, concordance, present.length),
    };
  });

  // 全体の集計
  const validDomains = domains.filter((d) => d.confidence > 0);
  const avgScore =
    validDomains.reduce((acc, d) => {
      const all = [d.shichusuimei, d.kyusei, d.shiWei].filter(
        (x): x is DomainAssessment => x !== null,
      );
      const avg = all.reduce((a, b) => a + b.score, 0) / (all.length || 1);
      return acc + avg;
    }, 0) / (validDomains.length || 1);
  const overallScore = Math.round((avgScore / 5) * 100);

  const avgConfidence =
    validDomains.reduce((acc, d) => acc + d.confidence, 0) /
    (validDomains.length || 1);
  const overallConfidence = Math.round(avgConfidence);

  const sortedByConfidence = [...validDomains].sort(
    (a, b) => b.confidence - a.confidence,
  );
  const strongestDomain =
    sortedByConfidence[0]?.domain ?? domains[0]?.domain ?? "personality";
  const weakestDomain =
    sortedByConfidence[sortedByConfidence.length - 1]?.domain ??
    domains[0]?.domain ??
    "personality";

  return {
    domains,
    overallScore,
    overallConfidence,
    strongestDomain,
    weakestDomain,
  };
}

/**
 * 各領域のサマリー文を生成する。「合致度の事実」のみを述べ、価値判断は避ける。
 */
function buildSummary(
  domain: AnalysisDomain,
  scores: readonly number[],
  concordance: number,
  count: number,
): string {
  const concordancePhrase =
    concordance >= 0.99
      ? count === 3
        ? "三術合致"
        : count === 2
          ? "二術合致"
          : "一術示唆"
      : concordance >= 0.66
        ? "二術が同方向を示唆"
        : "見方が分かれる";
  return `${domainLabel(domain)}: ${concordancePhrase} (スコア ${scores.join("/")})`;
}

/**
 * 任意要素数に対応する中央値計算。
 * 奇数なら中央の値、偶数なら中央 2 値の平均。
 */
function computeMedian(values: readonly number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function domainLabel(d: AnalysisDomain): string {
  return {
    personality: "性格・本質",
    career: "仕事運",
    wealth: "財運",
    relationship: "恋愛・対人",
    health: "健康",
    timing: "時期判断",
    direction: "方位・行動",
  }[d];
}
