import "server-only";

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
  // 真太陽時補正
  const rawDateTime = parseBirthDateTime(input.birthDate, input.birthTime);
  const standardTime = correctSummerTime(rawDateTime);
  const trueSolarTime =
    input.birthLongitude !== null
      ? calculateTrueSolarTime(standardTime, input.birthLongitude)
      : null;

  const meishiki = calculateMeishiki(input);
  const kyusei = calculateKyusei(input, targetDate);
  const shiWei = calculateShiWei(input, targetDate, {
    trueSolarTime: trueSolarTime?.trueSolarTime ?? null,
  });
  const crossAnalysis = calculateCrossAnalysis(meishiki, kyusei, shiWei);

  return {
    birthInput: input,
    trueSolarTime,
    meishiki,
    kyusei,
    shiWei,
    crossAnalysis,
    periodType,
    targetDate: formatLocalDate(targetDate),
  };
}

/**
 * Date をローカルタイムゾーンの YYYY-MM-DD に整形する
 * (toISOString() は UTC で日付がズレるため使用不可)
 */
function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
