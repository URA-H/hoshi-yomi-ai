import "server-only";

/**
 * 九星気学オーケストレーター
 *
 * BirthInput と任意のターゲット日付（評価する年/月/日盤の基準日）から、
 * 本命星・月命星・日命星 と 年盤/月盤/日盤、方位吉凶 を返す。
 *
 *   - 「本命星」関係の盤は出生日基準
 *   - 「方位吉凶」は targetDate 基準の盤に対して、本命星から評価する
 */

import type { BirthInput, KyuseiResult } from "../types";
import { parseBirthDateTime } from "../solar-time";
import { calculateHonmeisei } from "./honmeisei";
import { calculateGetsumeisei } from "./getsumeisei";
import { calculateNichimeisei } from "./nichimeisei";
import {
  buildBan,
  calculateYearBanCenter,
  calculateMonthBanCenter,
  calculateDayBanCenter,
} from "./ban";
import { calculateDirections } from "./directions";

export function calculateKyusei(
  input: BirthInput,
  targetDate: Date = new Date(),
): KyuseiResult {
  const birthDate = parseBirthDateTime(input.birthDate, input.birthTime);

  const honmei = calculateHonmeisei(birthDate);
  const getsumei = calculateGetsumeisei(honmei.number, birthDate);
  const nichimei = calculateNichimeisei(birthDate);

  // 評価対象日付の各盤
  const yearBan = buildBan(calculateYearBanCenter(targetDate));
  const monthBan = buildBan(calculateMonthBanCenter(targetDate));
  const dayBan = buildBan(calculateDayBanCenter(targetDate));

  // 方位吉凶は年盤ベースで評価（月単位の判断は月盤を渡せる）
  const directions = calculateDirections(yearBan, honmei.number);

  return {
    honmeisei: honmei.star,
    honmeiseiNumber: honmei.number,
    getsumeisei: getsumei.star,
    getsumeiseiNumber: getsumei.number,
    nichimeisei: nichimei.star,
    nichimeiseiNumber: nichimei.number,
    yearBan,
    monthBan,
    dayBan,
    directions,
  };
}
