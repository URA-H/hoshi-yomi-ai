import { calculateShiWei } from "./index";

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
    label: "1985-08-20 14:00 / 大阪 / 女",
    input: {
      birthDate: "1985-08-20",
      birthTime: "14:00",
      birthLongitude: 135.52,
      gender: "female" as const,
    },
  },
];

for (const c of cases) {
  console.log("\n=====", c.label, "=====");
  const r = calculateShiWei(c.input, new Date("2026-05-21"));
  console.log(`  命主: ${r.soul} / 身主: ${r.body}`);
  console.log(`  五行局: ${r.fiveElementsClass}`);
  console.log(`  命宮の主星: ${r.mainStar}`);
  console.log(`  身宮の位置: ${r.bodyPalace}`);
  console.log("  十二宮:");
  for (const p of r.palaces) {
    const major = p.majorStars.join(",") || "—";
    console.log(`    ${p.name.padEnd(4)} ${p.tianGan}${p.diZhi}  主星:${major}`);
  }
  console.log("  運限:");
  if (r.currentDecade)
    console.log(
      `    大限 (${r.currentDecade.startAge}-${r.currentDecade.endAge}歳): ${r.currentDecade.palace} 主星=${r.currentDecade.majorStars.join(",") || "—"}`,
    );
  if (r.currentYear)
    console.log(
      `    流年: ${r.currentYear.palace} 主星=${r.currentYear.majorStars.join(",") || "—"}`,
    );
  if (r.currentMonth)
    console.log(
      `    流月: ${r.currentMonth.palace} 主星=${r.currentMonth.majorStars.join(",") || "—"}`,
    );
  if (r.currentDay)
    console.log(
      `    流日: ${r.currentDay.palace} 主星=${r.currentDay.majorStars.join(",") || "—"}`,
    );
}
