/**
 * 十二運（十二長生）テーブル
 *
 * 日干と地支の組み合わせから十二運を求める。
 * lunar-typescript の CHANG_SHENG データは簡体字のため、
 * 日本語の十二運名へのマッピングも提供する。
 *
 * 十二運は日干の「勢い」を表す:
 *   長生→沐浴→冠帯→臨官→帝旺→衰→病→死→墓→絶→胎→養
 *   (誕生→成長→成熟→極盛→衰退→消滅→再生)
 */

import type { TianGan, DiZhi, TwelveStage } from "../types";

/** 十二運の順序（日本語） */
const TWELVE_STAGES: TwelveStage[] = [
  "長生", "沐浴", "冠帯", "臨官", "帝旺", "衰",
  "病", "死", "墓", "絶", "胎", "養",
];

/** 地支の順序 */
const DI_ZHI_ORDER: DiZhi[] = [
  "子", "丑", "寅", "卯", "辰", "巳",
  "午", "未", "申", "酉", "戌", "亥",
];

/**
 * 日干ごとの十二運の開始地支インデックス
 *
 * 陽干（甲丙戊庚壬）は順行、陰干（乙丁己辛癸）は逆行で十二運を配置する。
 * 開始位置は日干の「長生」の地支。
 *
 * 甲: 亥(11)から順行  乙: 午(6)から逆行
 * 丙: 寅(2)から順行   丁: 酉(9)から逆行
 * 戊: 寅(2)から順行   己: 酉(9)から逆行
 * 庚: 巳(5)から順行   辛: 子(0)から逆行
 * 壬: 申(8)から順行   癸: 卯(3)から逆行
 */
const STAGE_CONFIG: Record<TianGan, { startIndex: number; forward: boolean }> = {
  甲: { startIndex: 11, forward: true },
  乙: { startIndex: 6, forward: false },
  丙: { startIndex: 2, forward: true },
  丁: { startIndex: 9, forward: false },
  戊: { startIndex: 2, forward: true },
  己: { startIndex: 9, forward: false },
  庚: { startIndex: 5, forward: true },
  辛: { startIndex: 0, forward: false },
  壬: { startIndex: 8, forward: true },
  癸: { startIndex: 3, forward: false },
};

/**
 * 日干と地支から十二運を求める
 *
 * @param dayMaster - 日干（日柱の天干）
 * @param diZhi - 判定対象の地支（各柱の地支）
 * @returns 十二運
 */
export function getTwelveStage(dayMaster: TianGan, diZhi: DiZhi): TwelveStage {
  const config = STAGE_CONFIG[dayMaster];
  const diZhiIndex = DI_ZHI_ORDER.indexOf(diZhi);

  let stageIndex: number;
  if (config.forward) {
    // 陽干: 順行（長生の位置から時計回り）
    stageIndex = (diZhiIndex - config.startIndex + 12) % 12;
  } else {
    // 陰干: 逆行（長生の位置から反時計回り）
    stageIndex = (config.startIndex - diZhiIndex + 12) % 12;
  }

  return TWELVE_STAGES[stageIndex];
}

/**
 * 十二運の強さを数値化する（身強/身弱の判定に使用）
 *
 * 帝旺が最も強く(5)、絶が最も弱い(0)
 */
export function getTwelveStageStrength(stage: TwelveStage): number {
  const STRENGTH_MAP: Record<TwelveStage, number> = {
    長生: 4,
    沐浴: 3,
    冠帯: 4,
    臨官: 5,
    帝旺: 5,
    衰: 2,
    病: 1,
    死: 0,
    墓: 1,
    絶: 0,
    胎: 1,
    養: 2,
  };
  return STRENGTH_MAP[stage];
}
