/**
 * 手動スモークテスト。
 *
 *   npx tsx --conditions=react-server src/lib/fortune/shichusuimei/__smoketest__.ts
 *
 * 命式の数値の妥当性は将来的に外部の四柱推命サービスとの比較で検証する。
 * ここでは「実行が完走し、型と前提を満たす」ことだけを確認する。
 */

import { calculateMeishiki } from "./index";

const cases = [
  {
    label: "1990-01-15 06:30 / 東京 / 男",
    input: {
      birthDate: "1990-01-15",
      birthTime: "06:30",
      birthLongitude: 139.69,
      gender: "male" as const,
    },
  },
  {
    label: "1985-08-20 (時刻不明) / 大阪 / 女",
    input: {
      birthDate: "1985-08-20",
      birthTime: null,
      birthLongitude: 135.52,
      gender: "female" as const,
    },
  },
  {
    label: "1950-06-15 14:00 / 福岡 / 男（サマータイム期間）",
    input: {
      birthDate: "1950-06-15",
      birthTime: "14:00",
      birthLongitude: 130.42,
      gender: "male" as const,
    },
  },
];

for (const c of cases) {
  console.log("\n=====", c.label, "=====");
  const m = calculateMeishiki(c.input);
  const pillar = (name: string, p: typeof m.yearPillar | null) =>
    console.log(
      `  ${name}: ${p ? `${p.tianGan}${p.diZhi} (${p.wuXing}/${p.yinYang}) ${p.shiShen ?? "—"} ${p.twelveStage}` : "—"}`,
    );
  pillar("年柱", m.yearPillar);
  pillar("月柱", m.monthPillar);
  pillar("日柱", m.dayPillar);
  pillar("時柱", m.hourPillar);
  console.log("  日干:", m.dayMaster, " 身強身弱:", m.strength);
  console.log("  五行:", JSON.stringify(m.wuXingBalance));
  console.log("  大運（先頭3本）:");
  for (const dy of m.daYun.slice(0, 3)) {
    console.log(
      `    ${dy.startAge}歳〜  ${dy.tianGan}${dy.diZhi}  ${dy.shiShen}  ${dy.twelveStage}`,
    );
  }
}
