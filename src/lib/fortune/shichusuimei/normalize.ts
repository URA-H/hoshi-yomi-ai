/**
 * lunar-typescript の出力（中国本土用語）を、本プロダクトの日本式用語に正規化する。
 *
 * lunar-typescript は中国の四柱推命用語をそのまま返すため、日本で一般的な用語と
 * 一部異なる。主な差分は十神の「正印」→「印綬」のみだが、将来の差分追加に備えて
 * 単一の正規化レイヤーを設けておく。
 */

import type {
  TianGan,
  DiZhi,
  WuXing,
  ShiShen,
  TwelveStage,
  YinYang,
} from "../types";

const TIAN_GAN_SET: ReadonlySet<TianGan> = new Set([
  "甲", "乙", "丙", "丁", "戊",
  "己", "庚", "辛", "壬", "癸",
]);

const DI_ZHI_SET: ReadonlySet<DiZhi> = new Set([
  "子", "丑", "寅", "卯", "辰", "巳",
  "午", "未", "申", "酉", "戌", "亥",
]);

const WU_XING_SET: ReadonlySet<WuXing> = new Set(["木", "火", "土", "金", "水"]);

const TWELVE_STAGE_SET: ReadonlySet<TwelveStage> = new Set([
  "長生", "沐浴", "冠帯", "臨官", "帝旺", "衰",
  "病", "死", "墓", "絶", "胎", "養",
]);

/**
 * 簡体字 → 日本式 (traditional) 十二運の正規化テーブル。
 * lunar-typescript は文脈により簡体/繁體が混在するため、両対応する。
 */
const TWELVE_STAGE_ALIAS: Record<string, TwelveStage> = {
  长生: "長生",
  長生: "長生",
  长: "長生",
  沐浴: "沐浴",
  冠带: "冠帯",
  冠帶: "冠帯",
  临官: "臨官",
  臨官: "臨官",
  帝旺: "帝旺",
  衰: "衰",
  病: "病",
  死: "死",
  墓: "墓",
  绝: "絶",
  絕: "絶",
  絶: "絶",
  胎: "胎",
  养: "養",
  養: "養",
};

/**
 * 簡体字 → 日本式 十神。
 * lunar-typescript は中国語表記を返すため、用語差分を吸収する。
 */
const SHI_SHEN_ALIAS: Record<string, ShiShen> = {
  // 簡体字
  比肩: "比肩",
  劫财: "劫財",
  食神: "食神",
  伤官: "傷官",
  偏财: "偏財",
  正财: "正財",
  偏官: "偏官",
  正官: "正官",
  偏印: "偏印",
  正印: "印綬", // 中国「正印」 = 日本「印綬」
  // 異体
  七殺: "偏官",
  七杀: "偏官",
};

const SHI_SHEN_SET: ReadonlySet<ShiShen> = new Set([
  "比肩", "劫財", "食神", "傷官",
  "偏財", "正財", "偏官", "正官",
  "偏印", "印綬",
]);

const YANG_GAN: ReadonlySet<TianGan> = new Set(["甲", "丙", "戊", "庚", "壬"]);

// ============================================================
// Normalizers
// ============================================================

export function normalizeTianGan(raw: string): TianGan {
  if (TIAN_GAN_SET.has(raw as TianGan)) return raw as TianGan;
  throw new Error(`Unknown 天干: ${raw}`);
}

export function normalizeDiZhi(raw: string): DiZhi {
  if (DI_ZHI_SET.has(raw as DiZhi)) return raw as DiZhi;
  throw new Error(`Unknown 地支: ${raw}`);
}

export function normalizeWuXing(raw: string): WuXing {
  // lunar-typescript の getYearWuXing() は "木火" のような複合文字列を返すことがあり、
  // 先頭1文字を取って正規化する。
  const candidate = raw.charAt(0);
  if (WU_XING_SET.has(candidate as WuXing)) return candidate as WuXing;
  throw new Error(`Unknown 五行: ${raw}`);
}

export function normalizeTwelveStage(raw: string): TwelveStage {
  if (TWELVE_STAGE_SET.has(raw as TwelveStage)) return raw as TwelveStage;
  const aliased = TWELVE_STAGE_ALIAS[raw];
  if (aliased) return aliased;
  throw new Error(`Unknown 十二運: ${raw}`);
}

export function normalizeShiShen(raw: string): ShiShen {
  if (SHI_SHEN_SET.has(raw as ShiShen)) return raw as ShiShen;
  const aliased = SHI_SHEN_ALIAS[raw];
  if (aliased) return aliased;
  throw new Error(`Unknown 十神: ${raw}`);
}

/** 天干の陰陽（甲丙戊庚壬は陽、乙丁己辛癸は陰） */
export function yinYangOf(gan: TianGan): YinYang {
  return YANG_GAN.has(gan) ? "陽" : "陰";
}
