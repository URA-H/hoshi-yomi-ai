import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateFortune } from "@/lib/fortune";
import { loadBirthSession } from "@/lib/forms/birth-session";
import { toBirthInput } from "@/lib/forms/birth-schema";
import { generateFortuneReading } from "@/lib/ai/generate-fortune-reading";

const querySchema = z.object({
  period: z.enum(["daily", "monthly", "yearly", "decadal"]).default("monthly"),
});

export const dynamic = "force-dynamic";

/**
 * GET /api/fortune/generate?period=monthly
 *
 * Cookie に保存された出生情報を読み、占術計算 → AI 解釈生成までを一気通貫で実行。
 * Server Component から直接 `generateFortuneReading()` を呼ぶことも可能で、
 * Route Handler は Client Component / 外部呼出からの利用を想定する。
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = querySchema.safeParse({
    period: searchParams.get("period") ?? "monthly",
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_period", detail: parsed.error.issues },
      { status: 400 },
    );
  }

  const session = await loadBirthSession();
  if (!session) {
    return NextResponse.json(
      { error: "no_birth_session", redirectTo: "/birth" },
      { status: 401 },
    );
  }

  const fortune = calculateFortune(
    toBirthInput(session),
    parsed.data.period,
    new Date(),
  );

  const reading = await generateFortuneReading(fortune, parsed.data.period);

  return NextResponse.json({
    targetDate: fortune.targetDate,
    period: parsed.data.period,
    source: reading.source,
    text: reading.text,
  });
}
