/**
 * 本命星の算出
 *
 * 九星気学の年は立春で切り替わる。立春前に生まれた場合は前年扱い。
 *
 * 計算式:
 *   year_digit_sum = 各桁の和を1桁になるまで足し続ける（数値根）
 *   honmei_number = 11 - year_digit_sum
 *   ※ 結果が10になる場合は1にする（1〜9に正規化）
 */

import { Solar } from "lunar-typescript";
import type { KyuseiNumber, KyuseiStar } from "../types";
import { KYUSEI_BY_NUMBER } from "./constants";

/**
 * 数値根: 各桁を再帰的に足し合わせて1桁にする
 *   1990 → 1+9+9+0 = 19 → 1+9 = 10 → 1+0 = 1
 */
export function digitalRoot(n: number): number {
  let x = Math.abs(n);
  while (x >= 10) {
    let sum = 0;
    while (x > 0) {
      sum += x % 10;
      x = Math.floor(x / 10);
    }
    x = sum;
  }
  return x === 0 ? 9 : x;
}

/**
 * 立春補正後の九星年を取得する
 *
 * 立春は年により 2/3〜2/5 で変動するため、その年の正確な立春日時を
 * lunar-typescript から取得して比較する。
 */
export function getKyuseiYear(date: Date): number {
  const solar = Solar.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  const lunar = solar.getLunar();

  // その年の立春を取得
  const jieQiTable = lunar.getJieQiTable();
  const risshun = jieQiTable["立春"];

  if (!risshun) {
    // 立春情報が取れない場合の保守的な fallback (2/4 で切る)
    return date.getMonth() === 0 ||
      (date.getMonth() === 1 && date.getDate() < 4)
      ? date.getFullYear() - 1
      : date.getFullYear();
  }

  // 立春日時より前なら前年扱い
  const risshunDate = new Date(
    risshun.getYear(),
    risshun.getMonth() - 1,
    risshun.getDay(),
    risshun.getHour(),
    risshun.getMinute(),
    risshun.getSecond(),
  );

  if (date < risshunDate) {
    return date.getFullYear() - 1;
  }
  return date.getFullYear();
}

/**
 * 本命星番号を求める（立春補正込み）
 */
export function calculateHonmeiseiNumber(date: Date): KyuseiNumber {
  const year = getKyuseiYear(date);
  const root = digitalRoot(year);
  let n = 11 - root;
  if (n > 9) n -= 9;
  if (n < 1) n += 9;
  return n as KyuseiNumber;
}

export function calculateHonmeisei(date: Date): {
  star: KyuseiStar;
  number: KyuseiNumber;
} {
  const number = calculateHonmeiseiNumber(date);
  return { star: KYUSEI_BY_NUMBER[number], number };
}
