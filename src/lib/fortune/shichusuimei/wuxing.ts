/**
 * 五行バランスと身強身弱の判定
 *
 * 命式の各柱から五行を集計し、日干の五行が相対的に強いか弱いかを判定する。
 *
 * シンプルな素点計算を採用:
 *  - 各柱の天干: 2点
 *  - 各柱の地支（蔵干）: 1点
 *
 * 日干と同じ五行 + 日干を生じる五行（印）の合計が一定割合を超えると身強、
 * それ以外は身弱、中間は中和と判定する。
 *
 * これは流派により幅のある判定なので、本プロダクトでは「相対的な傾向を示す」
 * 範囲に留め、AI解釈側で慎重に扱う。
 */

import type {
  Pillar,
  WuXingBalance,
  WuXing,
  MeishikiResult,
} from "../types";

/** 五行の相生関係: key を生じるのは value */
const PRODUCED_BY: Record<WuXing, WuXing> = {
  木: "水",
  火: "木",
  土: "火",
  金: "土",
  水: "金",
};

/**
 * 五行バランスを集計する
 *
 * 蔵干の正確な五行を出すには地支ごとの table が必要なため、
 * lunar-typescript の HideGan を使ってもよいが、ここでは単純化して
 * 地支そのものの代表五行をカウントする。
 */
const DI_ZHI_WU_XING: Record<string, WuXing> = {
  子: "水",
  丑: "土",
  寅: "木",
  卯: "木",
  辰: "土",
  巳: "火",
  午: "火",
  未: "土",
  申: "金",
  酉: "金",
  戌: "土",
  亥: "水",
};

export function calculateWuXingBalance(pillars: Pillar[]): WuXingBalance {
  const balance: WuXingBalance = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const p of pillars) {
    balance[p.wuXing] += 2; // 天干
    const branchWuXing = DI_ZHI_WU_XING[p.diZhi];
    if (branchWuXing) balance[branchWuXing] += 1; // 地支
  }
  return balance;
}

/**
 * 身強・身弱・中和を判定する
 *
 * 日干と同じ五行 + 日干を生じる五行（印）の合計点が、
 * 全体の何割を占めるかで決める。
 */
export function calculateStrength(
  dayMasterWuXing: WuXing,
  balance: WuXingBalance,
): MeishikiResult["strength"] {
  const total = balance.木 + balance.火 + balance.土 + balance.金 + balance.水;
  if (total === 0) return "中和";

  const supportingWuXing = PRODUCED_BY[dayMasterWuXing];
  const supportScore = balance[dayMasterWuXing] + balance[supportingWuXing];
  const ratio = supportScore / total;

  if (ratio >= 0.5) return "身強";
  if (ratio <= 0.3) return "身弱";
  return "中和";
}
