/**
 * 紫微斗数オーケストレーター
 *
 * iztro の Astrolabe をラップし、本プロダクトの ShiWeiResult 型に詰め替える。
 *
 * 注意:
 *  - 出生時刻が不明な場合、時辰に依存する命宮・各宮の位置が不正確になるため、
 *    呼び出し側は「簡易版」と明示するか、デフォルト時辰（午時 = 11:00-12:59）を
 *    使ったうえで結果を「概算」として扱うべき。
 *  - 中国語特有の宮名・星名は normalize.ts で日本式に統一する。
 */

import { astro } from "iztro";
import type { BirthInput, ShiWeiResult, Palace, PalaceName } from "../types";
import { normalizePalaceName, timeToIndex } from "./normalize";

/**
 * 紫微斗数の鑑定を行う
 *
 * @param input       出生情報
 * @param targetDate  運限を評価する日付（デフォルト: 現在）
 */
export function calculateShiWei(
  input: BirthInput,
  targetDate: Date = new Date(),
): ShiWeiResult {
  // 出生時刻不明の場合は午時 (timeIndex=6) をデフォルトとする
  const hour = input.birthTime ? Number(input.birthTime.slice(0, 2)) : 12;
  const timeIndex = timeToIndex(hour);

  // iztro はYYYY-MM-DD 形式
  const astrolabe = astro.bySolar(
    input.birthDate,
    timeIndex,
    input.gender === "male" ? "男" : "女",
    true,
    "ja-JP",
  );

  // 12宮を本プロダクトの Palace[] に詰め替える
  const palaces: Palace[] = astrolabe.palaces.map((p): Palace => ({
    name: normalizePalaceName(p.name),
    tianGan: p.heavenlyStem,
    diZhi: p.earthlyBranch,
    majorStars: p.majorStars.map((s) => s.name),
    minorStars: [...p.minorStars, ...p.adjectiveStars].map((s) => s.name),
    brightness:
      p.majorStars
        .map((s) => s.brightness)
        .filter(Boolean)
        .join(",") || "—",
  }));

  // 命宮の主星
  const soulPalace = palaces.find((p) => p.name === "命宮");
  const mainStar = soulPalace?.majorStars[0] ?? "—";

  // 身宮の地支 → どの宮にあるか
  const bodyBranch = astrolabe.earthlyBranchOfBodyPalace;
  const bodyPalaceData = astrolabe.palaces.find(
    (p) => p.earthlyBranch === bodyBranch,
  );
  const bodyPalace: PalaceName = bodyPalaceData
    ? normalizePalaceName(bodyPalaceData.name)
    : "命宮";

  // 運限（大限・流年・流月・流日）
  const horoscope = astrolabe.horoscope(targetDate);

  return {
    palaces,
    mainStar,
    bodyPalace,
    soul: astrolabe.soul,
    body: astrolabe.body,
    fiveElementsClass: astrolabe.fiveElementsClass,
    currentDecade: extractDecade(horoscope, astrolabe.palaces),
    currentYear: extractYear(horoscope, astrolabe.palaces),
    currentMonth: extractMonth(horoscope, astrolabe.palaces),
    currentDay: extractDay(horoscope, astrolabe.palaces),
  };
}

// ============================================================
// 運限の抽出
// ============================================================

type IztroPalace = ReturnType<typeof astro.bySolar>["palaces"][number];

function findPalaceByBranch(
  palaces: readonly IztroPalace[],
  branch: string,
): IztroPalace | undefined {
  return palaces.find((p) => p.earthlyBranch === branch);
}

function extractDecade(
  horoscope: ReturnType<ReturnType<typeof astro.bySolar>["horoscope"]>,
  palaces: readonly IztroPalace[],
): ShiWeiResult["currentDecade"] {
  if (!horoscope.decadal) return null;
  const p = findPalaceByBranch(palaces, horoscope.decadal.earthlyBranch);
  if (!p) return null;
  // 大限の年齢範囲は宮の Decadal プロパティに格納されている
  const range = p.decadal?.range ?? [0, 0];
  return {
    palace: normalizePalaceName(p.name),
    startAge: range[0],
    endAge: range[1],
    majorStars: p.majorStars.map((s) => s.name),
  };
}

function extractYear(
  horoscope: ReturnType<ReturnType<typeof astro.bySolar>["horoscope"]>,
  palaces: readonly IztroPalace[],
): ShiWeiResult["currentYear"] {
  if (!horoscope.yearly) return null;
  const p = findPalaceByBranch(palaces, horoscope.yearly.earthlyBranch);
  if (!p) return null;
  return {
    palace: normalizePalaceName(p.name),
    majorStars: p.majorStars.map((s) => s.name),
  };
}

function extractMonth(
  horoscope: ReturnType<ReturnType<typeof astro.bySolar>["horoscope"]>,
  palaces: readonly IztroPalace[],
): ShiWeiResult["currentMonth"] {
  if (!horoscope.monthly) return null;
  const p = findPalaceByBranch(palaces, horoscope.monthly.earthlyBranch);
  if (!p) return null;
  return {
    palace: normalizePalaceName(p.name),
    majorStars: p.majorStars.map((s) => s.name),
  };
}

function extractDay(
  horoscope: ReturnType<ReturnType<typeof astro.bySolar>["horoscope"]>,
  palaces: readonly IztroPalace[],
): ShiWeiResult["currentDay"] {
  if (!horoscope.daily) return null;
  const p = findPalaceByBranch(palaces, horoscope.daily.earthlyBranch);
  if (!p) return null;
  return {
    palace: normalizePalaceName(p.name),
    majorStars: p.majorStars.map((s) => s.name),
  };
}
