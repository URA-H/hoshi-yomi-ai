import type {
  KyuseiStar,
  KyuseiNumber,
  Direction,
  WuXing,
} from "../types";

/** 九星の番号 → 星名 */
export const KYUSEI_BY_NUMBER: Record<KyuseiNumber, KyuseiStar> = {
  1: "一白水星",
  2: "二黒土星",
  3: "三碧木星",
  4: "四緑木星",
  5: "五黄土星",
  6: "六白金星",
  7: "七赤金星",
  8: "八白土星",
  9: "九紫火星",
};

/** 九星 → 五行 */
export const KYUSEI_WU_XING: Record<KyuseiNumber, WuXing> = {
  1: "水",
  2: "土",
  3: "木",
  4: "木",
  5: "土",
  6: "金",
  7: "金",
  8: "土",
  9: "火",
};

/** 八方位 + 中央。後天定位（5が中央のとき）の位置順 */
export const DIRECTIONS: readonly Direction[] = [
  "北",
  "北東",
  "東",
  "南東",
  "南",
  "南西",
  "西",
  "北西",
] as const;

/**
 * 洛書による「後天定位盤」(五黄中央のときの定位置)
 *
 *   南東4  南9   南西2
 *   東3   中央5  西7
 *   北東8  北1   北西6
 *
 * 各星の定位置 → 方位
 */
export const HOME_DIRECTION_OF: Record<KyuseiNumber, Direction> = {
  1: "北",
  2: "南西",
  3: "東",
  4: "南東",
  5: "中央",
  6: "北西",
  7: "西",
  8: "北東",
  9: "南",
};

/**
 * 八方位の対面方位（暗剣殺・本命的殺などの算出に用いる）
 */
export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  北: "南",
  北東: "南西",
  東: "西",
  南東: "北西",
  南: "北",
  南西: "北東",
  西: "東",
  北西: "南東",
  中央: "中央",
};

/**
 * 月支 → 節月の番号（寅月=1, 卯月=2, ..., 丑月=12）
 *
 * 月命星の表は寅月から始まり、丑月で1巡する。
 */
export const ZHI_TO_JIEYUE: Record<string, number> = {
  寅: 1,
  卯: 2,
  辰: 3,
  巳: 4,
  午: 5,
  未: 6,
  申: 7,
  酉: 8,
  戌: 9,
  亥: 10,
  子: 11,
  丑: 12,
};
