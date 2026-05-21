/**
 * 統合スモークテスト
 *   npx tsx src/lib/fortune/__smoketest__.ts
 */

import { calculateFortune } from "./index";

const cases = [
  {
    label: "1990-01-15 06:30 東京 男",
    input: {
      birthDate: "1990-01-15",
      birthTime: "06:30",
      birthLongitude: 139.69,
      gender: "male" as const,
    },
  },
  {
    label: "1985-08-20 時刻不明 大阪 女",
    input: {
      birthDate: "1985-08-20",
      birthTime: null,
      birthLongitude: 135.52,
      gender: "female" as const,
    },
  },
];

const targetDate = new Date("2026-05-21");

for (const c of cases) {
  console.log("\n=====", c.label, "=====");
  const f = calculateFortune(c.input, "monthly", targetDate);

  console.log("\n[ 四柱推命 ]");
  console.log(
    `  ${f.meishiki.yearPillar.tianGan}${f.meishiki.yearPillar.diZhi} ` +
      `${f.meishiki.monthPillar.tianGan}${f.meishiki.monthPillar.diZhi} ` +
      `${f.meishiki.dayPillar.tianGan}${f.meishiki.dayPillar.diZhi} ` +
      `${f.meishiki.hourPillar ? f.meishiki.hourPillar.tianGan + f.meishiki.hourPillar.diZhi : "—"}` +
      ` / 日干: ${f.meishiki.dayMaster} / ${f.meishiki.strength}`,
  );

  console.log("\n[ 九星気学 ]");
  console.log(
    `  本命:${f.kyusei.honmeisei} 月命:${f.kyusei.getsumeisei} 日命:${f.kyusei.nichimeisei}`,
  );

  console.log("\n[ 紫微斗数 ]");
  console.log(
    `  命宮主星:${f.shiWei.mainStar} 五行局:${f.shiWei.fiveElementsClass} 大限:${f.shiWei.currentDecade?.palace ?? "—"}`,
  );

  console.log("\n[ クロス分析 ]");
  console.log(
    `  総合スコア: ${f.crossAnalysis.overallScore} / 総合合致度: ${f.crossAnalysis.overallConfidence}`,
  );
  console.log(`  最強領域: ${f.crossAnalysis.strongestDomain}`);
  console.log(`  最弱領域: ${f.crossAnalysis.weakestDomain}`);
  console.log("  ┄ 領域別 ┄");
  for (const d of f.crossAnalysis.domains) {
    const m = d.shichusuimei?.score ?? "—";
    const k = d.kyusei?.score ?? "—";
    const s = d.shiWei?.score ?? "—";
    console.log(
      `   ${d.domain.padEnd(13)} 推命:${m} 九星:${k} 紫微:${s}` +
        `  合致度:${(d.concordance * 100).toFixed(0)}%  ${d.summary}`,
    );
  }
}
