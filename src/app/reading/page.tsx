import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FortuneAIMark } from "@/components/fortune-ai-mark";
import { Button } from "@/components/button";
import { Divider } from "@/components/divider";
import { MeishikiSummary } from "@/components/reading/meishiki-summary";
import { KyuseiSummary } from "@/components/reading/kyusei-summary";
import { ShiWeiSummary } from "@/components/reading/shiwei-summary";
import { CrossSummary } from "@/components/reading/cross-summary";
import { AICommentary } from "@/components/reading/ai-commentary";
import { AICommentaryLoading } from "@/components/reading/ai-commentary-loading";
import { calculateFortune } from "@/lib/fortune";
import { loadBirthSession } from "@/lib/forms/birth-session";
import { toBirthInput } from "@/lib/forms/birth-schema";

export const metadata: Metadata = {
  title: "鑑定結果",
  description: "三術の合致から読み解く、あなた個別の鑑定結果",
};

// セッションごとに動的に算出するため、Next の prerender に乗らない
export const dynamic = "force-dynamic";

export default async function ReadingPage() {
  const session = await loadBirthSession();
  if (!session) {
    redirect("/birth");
  }

  const input = toBirthInput(session);
  const fortune = calculateFortune(input, "monthly", new Date());
  const birthSummary = formatBirthSummary(session);

  return (
    <div className="bg-yozora-washi min-h-screen text-(--color-text-primary)">
      <header className="border-b border-(--color-border-subtle)">
        <div className="mx-auto max-w-5xl px-6 py-(--spacing-ma-md) flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3">
            <FortuneAIMark size="sm" />
            <span className="font-mincho text-(length:--text-body) tracking-(--tracking-jp-wide)">
              Fortune AI
            </span>
          </Link>
          <nav className="font-gothic text-(length:--text-caption)">
            <Link
              href="/birth"
              className="text-(--color-text-secondary) hover:text-(--color-text-primary)"
            >
              出生情報を再入力
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-(--spacing-ma-xl) space-y-(--spacing-ma-lg)">
        {/* タイトル + メタ情報 — 即時表示 */}
        <section>
          <p className="font-mincho text-(length:--text-caption) tracking-(--tracking-jp-decorative) text-(--color-text-muted) uppercase">
            {fortune.targetDate} の鑑定
          </p>
          <h1 className="mt-1 font-mincho text-(length:--text-h1) tracking-(--tracking-jp-normal)">
            あなたの三術の交わり
          </h1>
          <p className="mt-2 font-gothic text-(length:--text-body) text-(--color-text-secondary)">
            {birthSummary}
          </p>
        </section>

        <Divider />

        {/* AI 解釈 — Suspense 境界で分離。生成中はスケルトン、完了で fade-in */}
        <Suspense fallback={<AICommentaryLoading />}>
          <AICommentary fortune={fortune} period="monthly" />
        </Suspense>

        {/* 三術 + クロス分析 — 即時表示 (計算は数ミリ秒) */}
        <CrossSummary cross={fortune.crossAnalysis} />
        <MeishikiSummary m={fortune.meishiki} />
        <KyuseiSummary k={fortune.kyusei} />
        <ShiWeiSummary s={fortune.shiWei} />

        {/* フッターCTA */}
        <section className="text-center py-(--spacing-ma-lg)">
          <Divider className="mx-auto max-w-xs" />
          <p className="mt-(--spacing-ma-md) font-gothic text-(length:--text-caption) text-(--color-text-muted) max-w-prose mx-auto">
            最終的な判断はご自身でなさってください。
            重要な医療・金融・法的判断は、占いではなく専門家にご相談ください。
          </p>
          <div className="mt-(--spacing-ma-md) flex justify-center gap-3">
            <Link href="/birth">
              <Button variant="ghost" size="md">
                出生情報を再入力
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function formatBirthSummary(session: {
  birthDate: string;
  birthTime: string;
  prefecture: string;
  gender: "male" | "female";
}): string {
  const parts = [session.birthDate];
  if (session.birthTime) parts.push(session.birthTime);
  if (session.prefecture) parts.push(session.prefecture);
  parts.push(session.gender === "male" ? "男性" : "女性");
  return parts.join(" / ");
}
