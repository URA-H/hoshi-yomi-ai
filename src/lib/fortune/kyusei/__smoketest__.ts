/**
 * 九星気学スモークテスト
 *   npx tsx --conditions=react-server src/lib/fortune/kyusei/__smoketest__.ts
 *
 * 本命星は公知の表と照合可能。月命星・日命星はサンプルで実行確認のみ。
 */

import { calculateKyusei } from "./index";
import { digitalRoot, calculateHonmeiseiNumber } from "./honmeisei";

// --- 数値根 ---
console.log("--- digitalRoot ---");
for (const [n, expected] of [
  [1990, 1],
  [1985, 5],
  [2020, 4],
  [2026, 1], // 2+0+2+6=10 → 1
] as const) {
  const got = digitalRoot(n);
  console.log(`  ${n} → ${got} ${got === expected ? "✓" : `✗ (expected ${expected})`}`);
}

// --- 本命星（公知の年表と照合） ---
// 1990 = 一白水星
// 1985 = 六白金星
// 2020 = 七赤金星
// 1972 = 一白水星
// 1955 = 二黒土星
console.log("\n--- 本命星 (mid-year, 立春後) ---");
for (const [date, expectedStar] of [
  ["1990-06-15", 1], // 一白
  ["1985-06-15", 6], // 六白
  ["2020-06-15", 7], // 七赤
  ["1972-06-15", 1], // 一白
  ["1955-06-15", 9], // 九紫 (1955年生は九紫火星)
] as const) {
  const d = new Date(date);
  const n = calculateHonmeiseiNumber(d);
  console.log(`  ${date} → ${n} ${n === expectedStar ? "✓" : `✗ (expected ${expectedStar})`}`);
}

// --- 立春前生まれの繰り上げ ---
console.log("\n--- 立春境界 ---");
for (const date of [
  "1990-01-15", // 立春前 → 1989年扱い → 1989の数値根 27→9 → 11-9=2 → 二黒
  "1990-02-15", // 立春後 → 1990 → 一白
  "1989-12-31", // 1989 → 二黒
] as const) {
  const d = new Date(date);
  const n = calculateHonmeiseiNumber(d);
  console.log(`  ${date} → ${n}`);
}

// --- 完全な鑑定結果 ---
console.log("\n--- 完全結果（1990-01-15, 評価日: 2026-05-21） ---");
const result = calculateKyusei(
  {
    birthDate: "1990-01-15",
    birthTime: "06:30",
    birthLongitude: 139.69,
    gender: "male",
  },
  new Date("2026-05-21"),
);
console.log(`  本命星: ${result.honmeisei} (${result.honmeiseiNumber})`);
console.log(`  月命星: ${result.getsumeisei} (${result.getsumeiseiNumber})`);
console.log(`  日命星: ${result.nichimeisei} (${result.nichimeiseiNumber})`);
console.log(`  年盤中央: ${result.yearBan.center}`);
console.log(`    北: ${result.yearBan.positions.北} / 南: ${result.yearBan.positions.南}`);
console.log(`    東: ${result.yearBan.positions.東} / 西: ${result.yearBan.positions.西}`);
console.log(`  月盤中央: ${result.monthBan.center}`);
console.log(`  日盤中央: ${result.dayBan.center}`);

console.log("\n  方位の吉凶（年盤×本命星）:");
for (const d of result.directions) {
  const tag = d.fortune === "中立" ? "○" : d.fortune;
  console.log(`    ${d.direction}: ${tag}${d.reason ? ` (${d.reason})` : ""}`);
}
