/**
 * 四柱（年柱・月柱・日柱・時柱）の算出
 *
 * lunar-typescript の EightChar を、本プロダクトの Pillar 型に詰め替える。
 * 出生時刻が不明な場合、時柱は null となり、十二運や時干の十神は計算しない。
 */

import { Solar } from "lunar-typescript";
import type { Pillar } from "../types";
import { getTwelveStage } from "./twelve-stages";
import {
  normalizeTianGan,
  normalizeDiZhi,
  normalizeWuXing,
  normalizeShiShen,
  yinYangOf,
} from "./normalize";

/**
 * 真太陽時に基づく Date から四柱を求める
 *
 * @param trueSolarTime - 真太陽時補正後の Date（出生時刻不明なら正午で渡す）
 * @param hasTime - 出生時刻が既知かどうか。false の場合、時柱は null
 * @returns 4本の柱と、日干（命式の中心）
 */
export function calculatePillars(
  trueSolarTime: Date,
  hasTime: boolean,
): {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar | null;
  dayMaster: ReturnType<typeof normalizeTianGan>;
} {
  const solar = Solar.fromYmdHms(
    trueSolarTime.getFullYear(),
    trueSolarTime.getMonth() + 1,
    trueSolarTime.getDate(),
    trueSolarTime.getHours(),
    trueSolarTime.getMinutes(),
    trueSolarTime.getSeconds(),
  );
  const eightChar = solar.getLunar().getEightChar();

  const dayMaster = normalizeTianGan(eightChar.getDayGan());

  // 年柱
  const yearTianGan = normalizeTianGan(eightChar.getYearGan());
  const yearDiZhi = normalizeDiZhi(eightChar.getYearZhi());
  const yearPillar: Pillar = {
    tianGan: yearTianGan,
    diZhi: yearDiZhi,
    wuXing: normalizeWuXing(eightChar.getYearWuXing()),
    yinYang: yinYangOf(yearTianGan),
    shiShen: normalizeShiShen(eightChar.getYearShiShenGan()),
    twelveStage: getTwelveStage(dayMaster, yearDiZhi),
  };

  // 月柱
  const monthTianGan = normalizeTianGan(eightChar.getMonthGan());
  const monthDiZhi = normalizeDiZhi(eightChar.getMonthZhi());
  const monthPillar: Pillar = {
    tianGan: monthTianGan,
    diZhi: monthDiZhi,
    wuXing: normalizeWuXing(eightChar.getMonthWuXing()),
    yinYang: yinYangOf(monthTianGan),
    shiShen: normalizeShiShen(eightChar.getMonthShiShenGan()),
    twelveStage: getTwelveStage(dayMaster, monthDiZhi),
  };

  // 日柱（日干自身は十神を持たない）
  const dayDiZhi = normalizeDiZhi(eightChar.getDayZhi());
  const dayPillar: Pillar = {
    tianGan: dayMaster,
    diZhi: dayDiZhi,
    wuXing: normalizeWuXing(eightChar.getDayWuXing()),
    yinYang: yinYangOf(dayMaster),
    shiShen: null,
    twelveStage: getTwelveStage(dayMaster, dayDiZhi),
  };

  // 時柱（不明なら null）
  let hourPillar: Pillar | null = null;
  if (hasTime) {
    const hourTianGan = normalizeTianGan(eightChar.getTimeGan());
    const hourDiZhi = normalizeDiZhi(eightChar.getTimeZhi());
    hourPillar = {
      tianGan: hourTianGan,
      diZhi: hourDiZhi,
      wuXing: normalizeWuXing(eightChar.getTimeWuXing()),
      yinYang: yinYangOf(hourTianGan),
      shiShen: normalizeShiShen(eightChar.getTimeShiShenGan()),
      twelveStage: getTwelveStage(dayMaster, hourDiZhi),
    };
  }

  return { yearPillar, monthPillar, dayPillar, hourPillar, dayMaster };
}
