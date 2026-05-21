/**
 * 統合占術エントリポイント
 *
 * BirthInput + 期間 から、3術 + クロス分析を含む CombinedFortuneData を返す。
 * AI プロンプトはこの構造を見ることで、解釈と合致度を統合的に表現できる。
 */

import type {
  BirthInput,
  CombinedFortuneData,
  PeriodType,
} from "./types";
import {
  calculateTrueSolarTime,
  correctSummerTime,
  parseBirthDateTime,
} from "./solar-time";
import { calculateMeishiki } from "./shichusuimei";
import { calculateKyusei } from "./kyusei";
import { calculateShiWei } from "./shibun";
import { calculateCrossAnalysis } from "./cross";

export function calculateFortune(
  input: BirthInput,
  periodType: PeriodType,
  targetDate: Date = new Date(),
): CombinedFortuneData {
  // 真太陽時補正の結果は別途返したいので個別に算出
  const rawDateTime = parseBirthDateTime(input.birthDate, input.birthTime);
  const standardTime = correctSummerTime(rawDateTime);
  const trueSolarTime =
    input.birthLongitude !== null
      ? calculateTrueSolarTime(standardTime, input.birthLongitude)
      : null;

  const meishiki = calculateMeishiki(input);
  const kyusei = calculateKyusei(input, targetDate);
  const shiWei = calculateShiWei(input, targetDate);
  const crossAnalysis = calculateCrossAnalysis(meishiki, kyusei, shiWei);

  return {
    birthInput: input,
    trueSolarTime,
    meishiki,
    kyusei,
    shiWei,
    crossAnalysis,
    periodType,
    targetDate: targetDate.toISOString().slice(0, 10),
  };
}
