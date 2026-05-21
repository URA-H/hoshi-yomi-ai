/**
 * 日命星の算出
 *
 * 日命星は冬至を陽遁、夏至を陰遁の起点とする60日サイクル内の干支で決まる。
 * 計算が煩雑なため、lunar-typescript の `getDayNineStar()` の結果を採用する。
 *
 * lunar-typescript の NineStar は中国玄空（玄空飛星）の流派に基づくが、
 * 九星気学の日命星と同じ index 体系（0=一白〜8=九紫）を使うため、
 * 同じ結果として扱える。
 */

import { Solar } from "lunar-typescript";
import type { KyuseiNumber, KyuseiStar } from "../types";
import { KYUSEI_BY_NUMBER } from "./constants";

export function calculateNichimeiseiNumber(date: Date): KyuseiNumber {
  const solar = Solar.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  const ns = solar.getLunar().getDayNineStar();
  const idx = ns.getIndex(); // 0-8
  return ((idx + 1) as KyuseiNumber);
}

export function calculateNichimeisei(date: Date): {
  star: KyuseiStar;
  number: KyuseiNumber;
} {
  const number = calculateNichimeiseiNumber(date);
  return { star: KYUSEI_BY_NUMBER[number], number };
}
