import "server-only";

/**
 * 紫微斗数オーケストレーター
 *
 * iztro の Astrolabe をラップし、本プロダクトの ShiWeiResult 型に詰め替える。
 *
 * 注意:
 *  - 真太陽時補正後の Date を `options.trueSolarTime` で受け取り、iztro に
 *    渡す solarDate と hour 両方をそこから組み立てる（経度差で時辰境界を
 *    またぐ場合に命宮自体が変わるため、必須）。
 *  - 出生時刻が不明な場合は `approximation: "time-unknown"` フラグを立てる。
 *  - 中国語特有の宮名・星名は normalize.ts で日本式に統一する。
 */

import { astro } from "iztro";
import type { BirthInput, ShiWeiResult, Palace, PalaceName } from "../types";
import { normalizePalaceName, timeToIndex } from "./normalize";

// iztro 既定値 (`yearDivide: 'normal'` = 旧暦正月境界) は日本式の立春境界と
// 食い違うため、モジュール読み込み時に一度だけ立春基準に切り替える。
// 九星気学側も立春補正をしているので、これにより三術で年の定義が一致する。
astro.config({
  yearDivide: "exact",       // 立春で年を区切る
  horoscopeDivide: "exact",  // 運限境界も立春基準
});

type ShiWeiOptions = {
  /** 真太陽時補正後の出生日時。null の場合は input から組み立てる */
  trueSolarTime?: Date | null;
};

export function calculateShiWei(
  input: BirthInput,
  targetDate: Date = new Date(),
  options: ShiWeiOptions = {},
): ShiWeiResult {
  // 出生時刻不明の判定
  const timeUnknown = input.birthTime === null;

  // iztro に渡す solarDate と timeIndex を真太陽時から組み立てる
  const sourceDate =
    options.trueSolarTime ??
    new Date(
      ...parseBirthLocalParts(input.birthDate, input.birthTime ?? "12:00"),
    );

  const solarDate = formatSolarDate(sourceDate);
  const hour = timeUnknown ? 12 : sourceDate.getHours();
  const timeIndex = timeToIndex(hour);

  const astrolabe = astro.bySolar(
    solarDate,
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
    approximation: timeUnknown ? "time-unknown" : undefined,
    currentDecade: extractDecade(horoscope, astrolabe.palaces),
    currentYear: extractYear(horoscope, astrolabe.palaces),
    currentMonth: extractMonth(horoscope, astrolabe.palaces),
    currentDay: extractDay(horoscope, astrolabe.palaces),
  };
}

// ============================================================
// 日付ヘルパー
// ============================================================

function parseBirthLocalParts(
  birthDate: string,
  birthTime: string,
): [number, number, number, number, number] {
  const [y, m, d] = birthDate.split("-").map(Number);
  const [hh, mm] = birthTime.split(":").map(Number);
  return [y, m - 1, d, hh, mm];
}

/** iztro は YYYY-M-D を許容するが、ゼロ詰め YYYY-MM-DD も問題なし */
function formatSolarDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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
