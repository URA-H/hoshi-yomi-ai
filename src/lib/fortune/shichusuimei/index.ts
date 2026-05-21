/**
 * 四柱推命オーケストレーター
 *
 * BirthInput を受け取り、真太陽時補正 → 命式 → 五行 → 大運 を一気通貫で算出する。
 *
 * 出生時刻が未指定の場合:
 *  - 時柱は計算しない（null）
 *  - 大運も時辰に依存しないため通常通り算出
 *  - 真太陽時補正は均時差のみ反映（経度が不明な場合はそれも省略）
 */

import type { BirthInput, MeishikiResult } from "../types";
import {
  calculateTrueSolarTime,
  correctSummerTime,
  parseBirthDateTime,
} from "../solar-time";
import { calculatePillars } from "./pillars";
import { calculateWuXingBalance, calculateStrength } from "./wuxing";
import { calculateDaYun } from "./da-yun";
import { normalizeWuXing } from "./normalize";
import { GAN_TO_WU_XING } from "./gan-wuxing";

export function calculateMeishiki(input: BirthInput): MeishikiResult {
  // 1. 入力をパース、サマータイム補正
  const rawDateTime = parseBirthDateTime(input.birthDate, input.birthTime);
  const standardTime = correctSummerTime(rawDateTime);

  // 2. 真太陽時補正
  const solarResult = calculateTrueSolarTime(standardTime, input.birthLongitude);
  const trueSolarTime = solarResult.trueSolarTime;

  const hasTime = input.birthTime !== null;

  // 3. 四柱を求める
  const { yearPillar, monthPillar, dayPillar, hourPillar, dayMaster } =
    calculatePillars(trueSolarTime, hasTime);

  // 4. 五行バランス
  const activePillars = hourPillar
    ? [yearPillar, monthPillar, dayPillar, hourPillar]
    : [yearPillar, monthPillar, dayPillar];
  const wuXingBalance = calculateWuXingBalance(activePillars);

  // 5. 日干の五行
  const dayMasterWuXing = normalizeWuXing(GAN_TO_WU_XING[dayMaster]);
  const strength = calculateStrength(dayMasterWuXing, wuXingBalance);

  // 6. 大運
  const daYun = calculateDaYun(trueSolarTime, input.gender, dayMaster);

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster,
    wuXingBalance,
    daYun,
    strength,
  };
}
