/**
 * 九星盤の構築
 *
 * 中央に置く星が決まれば、洛書の配置順で残り8星が一意に決まる。
 *
 * 後天定位（五黄中央）の配置:
 *   南東4  南9   南西2
 *   東3   中央5  西7
 *   北東8  北1   北西6
 *
 * 中央が C のとき、各方位の星は (C + offset) を 1..9 に正規化したもの。
 *
 *   方位        | 5中央 | C中央
 *   ------------|-------|--------
 *   中央        | 5     | C
 *   北西(乾)    | 6     | C + 1
 *   西(兌)      | 7     | C + 2
 *   北東(艮)    | 8     | C + 3
 *   南(離)      | 9     | C + 4
 *   北(坎)      | 1     | C + 5
 *   南西(坤)    | 2     | C + 6
 *   東(震)      | 3     | C + 7
 *   南東(巽)    | 4     | C + 8
 */

import { Solar } from "lunar-typescript";
import type { KyuseiBan, KyuseiNumber, Direction } from "../types";
import { ZHI_TO_JIEYUE } from "./constants";
import { calculateHonmeiseiNumber } from "./honmeisei";
import { calculateNichimeiseiNumber } from "./nichimeisei";

const OFFSET_TO_DIRECTION: Array<[number, Direction]> = [
  [1, "北西"],
  [2, "西"],
  [3, "北東"],
  [4, "南"],
  [5, "北"],
  [6, "南西"],
  [7, "東"],
  [8, "南東"],
];

function normalize(n: number): KyuseiNumber {
  let x = ((n - 1) % 9) + 1;
  if (x < 1) x += 9;
  return x as KyuseiNumber;
}

export function buildBan(centerNumber: KyuseiNumber): KyuseiBan {
  const positions = {
    中央: centerNumber,
  } as Record<Direction, KyuseiNumber>;
  for (const [offset, dir] of OFFSET_TO_DIRECTION) {
    positions[dir] = normalize(centerNumber + offset);
  }
  return {
    center: centerNumber,
    positions,
  };
}

/**
 * 年盤の中央星 = 立春補正年の本命星算式
 * （ある年に生まれた人の本命星は、その年の年盤中央と等価）
 */
export const calculateYearBanCenter = calculateHonmeiseiNumber;

/**
 * 月盤の中央星
 *   起点: 立春補正年の年盤中央
 *   オフセット: 節月（寅月=1, 丑月=12）ぶん逆行
 */
export function calculateMonthBanCenter(date: Date): KyuseiNumber {
  const yearCenter = calculateYearBanCenter(date);
  const group = (yearCenter - 1) % 3;
  const startStar = group === 0 ? 8 : group === 1 ? 5 : 2;

  const solar = Solar.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  const monthZhi = solar.getLunar().getEightChar().getMonthZhi();
  const jieyue = ZHI_TO_JIEYUE[monthZhi];

  return normalize(startStar - (jieyue - 1));
}

/** 日盤の中央星 = その日の日命星 */
export const calculateDayBanCenter = calculateNichimeiseiNumber;
