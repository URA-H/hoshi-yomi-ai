/**
 * 大運の算出
 *
 * 大運は10年ごとの大きな運勢の流れ。
 * 月柱の干支から順行または逆行で並べ、開始年齢は流派により異なる。
 *
 * 本実装は lunar-typescript の DaYun に委譲し、Pillar 型に正規化する。
 * 順行/逆行の判定は lunar-typescript の内部で「年干の陰陽 × 性別」の
 * 慣習に基づき自動的に処理される。
 */

import { Solar } from "lunar-typescript";
import type { DaYun, TianGan } from "../types";
import {
  normalizeTianGan,
  normalizeDiZhi,
  normalizeShiShen,
} from "./normalize";
import { getTwelveStage } from "./twelve-stages";

/**
 * 大運リストを算出する
 *
 * @param trueSolarTime - 真太陽時補正後の Date
 * @param gender - 性別（0: 女、1: 男）lunar-typescript の慣習に従う
 * @param dayMaster - 日干
 * @param count - 取得する大運の本数（デフォルト8 = 約80年分）
 */
export function calculateDaYun(
  trueSolarTime: Date,
  gender: "male" | "female",
  dayMaster: TianGan,
  count = 8,
): DaYun[] {
  const solar = Solar.fromYmdHms(
    trueSolarTime.getFullYear(),
    trueSolarTime.getMonth() + 1,
    trueSolarTime.getDate(),
    trueSolarTime.getHours(),
    trueSolarTime.getMinutes(),
    trueSolarTime.getSeconds(),
  );
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  // lunar-typescript: 1 = 男, 0 = 女
  const list = eightChar.getYun(gender === "male" ? 1 : 0).getDaYun(count);

  const out: DaYun[] = [];
  for (const dy of list) {
    const ganZhi = dy.getGanZhi();
    if (ganZhi.length < 2) continue; // 出生〜立運までの空運期間はスキップ
    const tianGan = normalizeTianGan(ganZhi.charAt(0));
    const diZhi = normalizeDiZhi(ganZhi.charAt(1));
    out.push({
      startAge: dy.getStartAge(),
      tianGan,
      diZhi,
      // 日干に対する十神は lunar-typescript の DaYun には直接出ないため、
      // ganZhi の天干を比較して算出する。ここでは概算として
      // pillars と同じ正規化器を用いる。
      shiShen: deriveShiShenFromGan(dayMaster, tianGan),
      twelveStage: getTwelveStage(dayMaster, diZhi),
    });
  }
  return out;
}

// ============================================================
// 十神の派生（日干と任意の天干の関係から）
// ============================================================

// 五行
const GAN_WU_XING: Record<TianGan, "木" | "火" | "土" | "金" | "水"> = {
  甲: "木", 乙: "木",
  丙: "火", 丁: "火",
  戊: "土", 己: "土",
  庚: "金", 辛: "金",
  壬: "水", 癸: "水",
};

const YANG_GAN: ReadonlySet<TianGan> = new Set(["甲", "丙", "戊", "庚", "壬"]);

const PRODUCED_BY: Record<string, string> = {
  木: "水",
  火: "木",
  土: "火",
  金: "土",
  水: "金",
};

const PRODUCES: Record<string, string> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};

const CONTROLS: Record<string, string> = {
  木: "土",
  火: "金",
  土: "水",
  金: "木",
  水: "火",
};

/**
 * 日干と相手の天干から十神を導く
 *
 * 五行関係 + 陰陽の同異 で10種類が一意に決まる:
 *  - 同五行:  同陰陽=比肩 / 異陰陽=劫財
 *  - 自分が生む(食傷):  同陰陽=食神 / 異陰陽=傷官
 *  - 相手が生む(印):    同陰陽=偏印 / 異陰陽=印綬
 *  - 自分が剋す(財):    同陰陽=偏財 / 異陰陽=正財
 *  - 相手が剋す(官):    同陰陽=偏官 / 異陰陽=正官
 */
function deriveShiShenFromGan(
  dayMaster: TianGan,
  other: TianGan,
): import("../types").ShiShen {
  const me = GAN_WU_XING[dayMaster];
  const them = GAN_WU_XING[other];
  const sameYinYang = YANG_GAN.has(dayMaster) === YANG_GAN.has(other);

  if (me === them) return sameYinYang ? "比肩" : "劫財";
  if (PRODUCES[me] === them) return sameYinYang ? "食神" : "傷官";
  if (PRODUCED_BY[me] === them) return sameYinYang ? "偏印" : "印綬";
  if (CONTROLS[me] === them) return sameYinYang ? "偏財" : "正財";
  if (CONTROLS[them] === me) return sameYinYang ? "偏官" : "正官";
  // 上の5パターンで全て網羅される
  return normalizeShiShen("比肩");
}
