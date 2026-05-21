/**
 * iztro 出力の正規化
 *
 * iztro の ja-JP ロケールでは宮名が「兄弟」「夫妻」のように「宮」サフィックスなし
 * で返ってくる。本プロダクトでは types.ts の PalaceName に揃えるため、
 * 宮を補い、用語ゆれ（僕役→交友 / 祿→禄 / 德→徳）を吸収する。
 */

import type { PalaceName } from "../types";

/**
 * iztro の palace.name (ja-JP) → 本プロダクトの PalaceName
 */
const PALACE_ALIAS: Record<string, PalaceName> = {
  // ja-JP (iztro) → our type
  命宮: "命宮",
  兄弟: "兄弟宮",
  夫妻: "夫妻宮",
  子女: "子女宮",
  財帛: "財帛宮",
  疾厄: "疾厄宮",
  遷移: "遷移宮",
  僕役: "交友宮", // 中国式: 僕役 / 日本式: 交友
  交友: "交友宮",
  官祿: "官禄宮", // 祿 → 禄
  官禄: "官禄宮",
  田宅: "田宅宮",
  福德: "福徳宮", // 德 → 徳
  福徳: "福徳宮",
  父母: "父母宮",
};

export function normalizePalaceName(raw: string): PalaceName {
  const v = PALACE_ALIAS[raw];
  if (!v) {
    throw new Error(`Unknown palace name from iztro: ${raw}`);
  }
  return v;
}

/**
 * 出生時刻(HH:MM)を iztro の timeIndex (0-12) に変換する
 *
 *   00:00-00:59 → 0  （早子時）
 *   01:00-02:59 → 1  （丑時）
 *   03:00-04:59 → 2  （寅時）
 *   ...
 *   21:00-22:59 → 11 （亥時）
 *   23:00-23:59 → 12 （晩子時）
 *
 * 時刻不明の場合は呼び出し側で 6 (午時 11:00-12:59) などのデフォルトを採用する
 * か、本関数を呼ばずに別ハンドリングする。
 */
export function timeToIndex(hour: number): number {
  if (hour < 0 || hour > 23) throw new RangeError(`hour out of range: ${hour}`);
  // floor((h+1)/2) で 0..12 になる
  return Math.floor((hour + 1) / 2);
}
