/**
 * 方位吉凶の算出
 *
 * 本実装でカバーする凶方位（流派により扱いの違いはあるが、もっとも一般的な4種）:
 *   - 五黄殺: 五黄(5)が位置する方位
 *   - 暗剣殺: 五黄殺の反対方位
 *   - 本命殺: その人の本命星が位置する方位
 *   - 本命的殺: 本命殺の反対方位
 *
 * 中央(5の定位置)は凶方位対象外。
 *
 * 吉方位は流派や時期により異なる解釈があるため、本実装では明確な「凶」のみ
 * 警告し、他は「中立」として返す（コピーガイドの「煽らない」方針に整合）。
 */

import type {
  Direction,
  DirectionResult,
  KyuseiBan,
  KyuseiNumber,
} from "../types";
import { DIRECTIONS, OPPOSITE_DIRECTION } from "./constants";

type CurseKey = "五黄殺" | "暗剣殺" | "本命殺" | "本命的殺";

/**
 * 九星盤と本命星から、各方位の吉凶を算出する
 */
export function calculateDirections(
  ban: KyuseiBan,
  honmeiNumber: KyuseiNumber,
): DirectionResult[] {
  // 五黄(5)の位置
  const goouPos = findDirection(ban, 5);
  const honmeiPos = findDirection(ban, honmeiNumber);

  const curses: Partial<Record<Direction, CurseKey[]>> = {};
  const add = (dir: Direction | null, curse: CurseKey) => {
    if (!dir || dir === "中央") return;
    if (!curses[dir]) curses[dir] = [];
    curses[dir]!.push(curse);
  };

  add(goouPos, "五黄殺");
  add(goouPos ? OPPOSITE_DIRECTION[goouPos] : null, "暗剣殺");
  add(honmeiPos, "本命殺");
  add(honmeiPos ? OPPOSITE_DIRECTION[honmeiPos] : null, "本命的殺");

  return DIRECTIONS.map<DirectionResult>((dir) => {
    const labels = curses[dir];
    if (!labels || labels.length === 0) {
      return { direction: dir, fortune: "中立", reason: null };
    }
    // 「凶」のうち、五黄殺 > 暗剣殺 > 本命殺 > 本命的殺 の順で重さがあるとされる。
    // 複数該当する場合は重い方を優先するが、別途すべて理由として記録する。
    return {
      direction: dir,
      fortune: labels.includes("五黄殺") || labels.includes("暗剣殺") ? "大凶" : "凶",
      reason: labels.join(" + "),
    };
  });
}

function findDirection(ban: KyuseiBan, star: KyuseiNumber): Direction | null {
  for (const dir of DIRECTIONS) {
    if (ban.positions[dir] === star) return dir;
  }
  if (ban.center === star) return "中央";
  return null;
}
