import type { TianGan, WuXing } from "../types";

/** 天干 → 五行 */
export const GAN_TO_WU_XING: Record<TianGan, WuXing> = {
  甲: "木", 乙: "木",
  丙: "火", 丁: "火",
  戊: "土", 己: "土",
  庚: "金", 辛: "金",
  壬: "水", 癸: "水",
};
