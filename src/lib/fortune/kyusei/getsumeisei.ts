/**
 * 月命星の算出
 *
 * 月命星は本命星のグループと節月から決まる。
 *
 *   本命星グループ:
 *     A: 一白・四緑・七赤 → 寅月始まり 八白(8)
 *     B: 二黒・五黄・八白 → 寅月始まり 五黄(5)
 *     C: 三碧・六白・九紫 → 寅月始まり 二黒(2)
 *
 *   月命星 = 各グループの開始星から、節月ごとに1ずつ減じる（逆行）
 *
 * 節月は立春(寅月)を起点に12ヶ月。
 */

import { Solar } from "lunar-typescript";
import type { KyuseiNumber, KyuseiStar } from "../types";
import { KYUSEI_BY_NUMBER, ZHI_TO_JIEYUE } from "./constants";

const START_STAR_BY_GROUP: Record<number, number> = {
  0: 8, // 一・四・七
  1: 5, // 二・五・八
  2: 2, // 三・六・九
};

/**
 * その出生日の節月番号（寅月=1, 卯月=2, ..., 丑月=12）を返す
 */
function getJieyueNumber(date: Date): number {
  const solar = Solar.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  const eightChar = solar.getLunar().getEightChar();
  const monthZhi = eightChar.getMonthZhi();
  const num = ZHI_TO_JIEYUE[monthZhi];
  if (!num) {
    throw new Error(`Unknown 月支: ${monthZhi}`);
  }
  return num;
}

export function calculateGetsumeiseiNumber(
  honmeiNumber: KyuseiNumber,
  date: Date,
): KyuseiNumber {
  const group = (honmeiNumber - 1) % 3;
  const startStar = START_STAR_BY_GROUP[group];
  const jieyue = getJieyueNumber(date);

  // 開始星から (節月-1) だけ逆行（減じる）
  let n = startStar - (jieyue - 1);
  while (n < 1) n += 9;
  while (n > 9) n -= 9;
  return n as KyuseiNumber;
}

export function calculateGetsumeisei(
  honmeiNumber: KyuseiNumber,
  date: Date,
): { star: KyuseiStar; number: KyuseiNumber } {
  const number = calculateGetsumeiseiNumber(honmeiNumber, date);
  return { star: KYUSEI_BY_NUMBER[number], number };
}
