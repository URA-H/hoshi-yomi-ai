import type { Metadata } from "next";
import Link from "next/link";
import { FortuneAIMark } from "@/components/fortune-ai-mark";
import { Divider } from "@/components/divider";
import { BirthForm } from "./birth-form";
import { loadBirthSession } from "@/lib/forms/birth-session";

export const metadata: Metadata = {
  title: "出生情報を登録",
  description:
    "生年月日と出生地から、東洋三術 × AI による多角的な鑑定を開始します。",
};

export default async function BirthPage() {
  const existing = await loadBirthSession();

  return (
    <div className="bg-yozora-washi min-h-screen text-(--color-text-primary)">
      <header className="border-b border-(--color-border-subtle)">
        <div className="mx-auto max-w-3xl px-6 py-(--spacing-ma-md) flex items-center gap-3">
          <Link href="/" aria-label="星読みAI ホーム">
            <FortuneAIMark size="sm" />
          </Link>
          <span className="font-mincho text-(length:--text-body) tracking-(--tracking-jp-wide)">
            <Link href="/">星読みAI</Link>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-(--spacing-ma-xl)">
        <h1 className="font-mincho text-(length:--text-h1) tracking-(--tracking-jp-normal)">
          鑑定を始める
        </h1>
        <p className="mt-(--spacing-ma-sm) font-gothic text-(length:--text-body) leading-relaxed text-(--color-text-secondary)">
          生年月日と出生地から、四柱推命・九星気学・紫微斗数の三術が連動して動きます。
          結果は意思決定の参考としてご利用ください。
        </p>

        <Divider className="my-(--spacing-ma-lg)" />

        <BirthForm initialValues={existing ?? undefined} />

        <p className="mt-(--spacing-ma-lg) text-(length:--text-micro) text-(--color-text-muted) leading-relaxed">
          入力内容は端末の Cookie に保存し、再訪時に再入力不要にしています。
          いつでも結果ページから「再入力」を選択して上書きできます。
        </p>
      </main>
    </div>
  );
}
