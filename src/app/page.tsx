import Link from "next/link";
import { Button } from "@/components/button";
import { ConcordanceBadge } from "@/components/concordance-badge";
import { Divider } from "@/components/divider";
import { FortuneAIMark } from "@/components/fortune-ai-mark";
import { ResultCard } from "@/components/result-card";

export default function Home() {
  return (
    <div className="bg-yozora-washi text-(--color-text-primary)">
      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 pt-(--spacing-ma-2xl) pb-(--spacing-ma-xl)">
          <div className="flex flex-col items-start gap-(--spacing-ma-lg)">
            <FortuneAIMark size="md" glyph="易" />

            <h1 className="font-mincho text-(length:--text-display) tracking-(--tracking-jp-normal) leading-(--text-display--line-height)">
              戦国武将も用いた
              <br />
              東洋の智慧を、
              <br />
              現代のAIで多角的に。
            </h1>

            <p className="font-gothic text-(length:--text-body-lg) tracking-(--tracking-jp-normal) text-(--color-text-secondary) max-w-prose leading-[1.85]">
              四柱推命・九星気学・紫微斗数。
              三千年の経験知を、AIが統合して読み解きます。
              <br />
              統計的な確実性ではなく、三術の合致度を示します。
              最終的な判断は、あなたの手の中に。
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/birth">
                <Button variant="primary" size="lg">
                  無料で始める
                </Button>
              </Link>
              <Button variant="secondary" size="lg">
                占術の解説を読む
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* なぜ */}
      <section className="relative border-t border-(--color-border-subtle)">
        <div className="mx-auto max-w-3xl px-6 py-(--spacing-ma-2xl)">
          <h2 className="font-mincho text-(length:--text-h1) tracking-(--tracking-jp-normal) mb-(--spacing-ma-md)">
            なぜ、いま東洋占術 × AI なのか
          </h2>
          <div className="font-gothic text-(length:--text-body-lg) leading-[1.85] tracking-(--tracking-jp-normal) text-(--color-text-secondary) space-y-(--spacing-ma-md)">
            <p>
              占いには長く誤解がついてまわります。
              「当たる・当たらない」「絶対・確実」といった、本来の占術が目指してこなかった軸での評価です。
            </p>
            <p>
              東洋の三大占術 — 四柱推命・九星気学・紫微斗数 — は、本来「未来を当てる装置」ではなく、
              人生の流れを読み、選択の質を高めるための意思決定の補助具として用いられてきました。
              戦国武将が軍師に占術を学ばせたのも、未来を予知するためではなく、判断の角度を増やすためでした。
            </p>
            <p>
              Fortune AI は、三つの占術を一度に走らせ、その結果の重なり方を可視化します。
              三術が同じ示唆を示すとき、それは強い手がかりかもしれない。
              三術が割れるとき、それは慎重さを要する局面かもしれない。
            </p>
            <p>
              AIは未来を当てません。AIは、三術の解釈をあなたのために統合する役割を担います。
              最後にどう動くかは、あなたが決める。それで十分なのです。
            </p>
          </div>
        </div>
      </section>

      {/* 合致度 */}
      <section className="relative border-t border-(--color-border-subtle) bg-(--color-bg-surface)/40">
        <div className="mx-auto max-w-4xl px-6 py-(--spacing-ma-2xl)">
          <h2 className="font-mincho text-(length:--text-h1) tracking-(--tracking-jp-normal) mb-(--spacing-ma-lg)">
            信頼性ではなく、合致度を示します
          </h2>

          <div className="grid gap-(--spacing-ma-md) md:grid-cols-3">
            {(
              [
                {
                  level: "three" as const,
                  description:
                    "四柱推命・九星気学・紫微斗数の三つすべてが同じ示唆を示しています。強い手がかりとして参考にできるサインです。",
                },
                {
                  level: "two" as const,
                  description:
                    "二つの占術が同じ方向を指しています。注目に値する傾向ですが、もう一つの視点も併せて検討してください。",
                },
                {
                  level: "one" as const,
                  description: "一つの占術のみが言及している内容です。参考程度に留めてください。",
                },
              ]
            ).map((item) => (
              <div
                key={item.level}
                className="rounded-sm border border-(--color-border-subtle) bg-(--color-bg-surface) p-6"
              >
                <ConcordanceBadge level={item.level} />
                <p className="mt-4 font-gothic text-(length:--text-body) leading-[1.8] tracking-(--tracking-jp-normal) text-(--color-text-secondary)">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-(--spacing-ma-md) font-gothic text-(length:--text-caption) text-(--color-text-muted)">
            ※ 合致度は「未来の確実性」ではなく、「三術の解釈の重なり度合い」を示すものです。
          </p>
        </div>
      </section>

      {/* サンプル結果プレビュー */}
      <section className="relative border-t border-(--color-border-subtle)">
        <div className="mx-auto max-w-3xl px-6 py-(--spacing-ma-2xl)">
          <h2 className="font-mincho text-(length:--text-h1) tracking-(--tracking-jp-normal) mb-(--spacing-ma-lg)">
            レポート例
          </h2>
          <ResultCard
            period="今週の運勢"
            concordance="three"
            title="慎重さが活きる時期"
            body={
              <p>
                四柱推命の十二運、九星気学の月盤、紫微斗数の流月。
                三つすべてが「急がず、確認を重ねる」方向を示しています。
                焦らず、いつもより一段階深く確かめる週として読めます。
              </p>
            }
            advice={
              <ul className="space-y-1 list-disc pl-5">
                <li>重要な契約や決定は、可能であれば来週以降に</li>
                <li>急かされる選択には、いったん時間を置く</li>
                <li>周囲との確認・相談を多めに取ると、流れに沿いやすい時期です</li>
              </ul>
            }
          />
        </div>
      </section>

      {/* 私たちの約束 */}
      <section className="relative border-t border-(--color-border-subtle) bg-(--color-bg-surface)/60">
        <div className="mx-auto max-w-4xl px-6 py-(--spacing-ma-2xl)">
          <h2 className="font-mincho text-(length:--text-h1) tracking-(--tracking-jp-normal) mb-(--spacing-ma-lg)">
            私たちの約束
          </h2>
          <p className="font-gothic text-(length:--text-body-lg) text-(--color-text-secondary) mb-(--spacing-ma-lg) leading-[1.85]">
            Fortune AI は、占い業界で繰り返されてきた問題と距離を置きます。
          </p>

          <div className="grid gap-(--spacing-ma-md) md:grid-cols-2">
            <div>
              <h3 className="font-mincho text-(length:--text-h3) text-(--color-accent-warning) mb-3">
                私たちがしないこと
              </h3>
              <ul className="space-y-2 font-gothic text-(length:--text-body) text-(--color-text-secondary)">
                <li>✗ 「絶対当たる」「100%的中」と謳うこと</li>
                <li>✗ 不安を煽って課金を促すこと</li>
                <li>✗ 「祟り」「呪い」を理由に追加課金を求めること</li>
                <li>✗ 解約を妨げる設計をすること</li>
                <li>✗ 重要な医療・金融・法的判断に占いだけで決めるよう促すこと</li>
              </ul>
            </div>
            <div>
              <h3 className="font-mincho text-(length:--text-h3) text-(--color-accent-emphasis) mb-3">
                私たちがすること
              </h3>
              <ul className="space-y-2 font-gothic text-(length:--text-body) text-(--color-text-secondary)">
                <li>✓ 三術の合致度を、誠実に可視化すること</li>
                <li>✓ 「凶」の示唆には、建設的な対処の提案を添えること</li>
                <li>✓ 解約をいつでも1画面で完了できるようにすること</li>
                <li>✓ 重大な判断には専門家への相談を促すこと</li>
                <li>✓ あなたの最終判断を尊重すること</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-(--color-border-subtle)">
        <div className="mx-auto max-w-3xl px-6 py-(--spacing-ma-2xl) text-center">
          <Divider className="mx-auto max-w-xs" />
          <h2 className="mt-(--spacing-ma-lg) font-mincho text-(length:--text-h1) tracking-(--tracking-jp-normal)">
            自分を、もう一度見つめなおす
          </h2>
          <p className="mt-(--spacing-ma-md) font-gothic text-(length:--text-body) text-(--color-text-secondary)">
            登録は1分で完了します。いつでも1画面で解約できます。
          </p>
          <div className="mt-(--spacing-ma-lg) flex justify-center gap-3">
            <Link href="/birth">
              <Button variant="primary" size="lg">
                無料で始める
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-(--color-border-subtle) py-(--spacing-ma-lg)">
        <div className="mx-auto max-w-5xl px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FortuneAIMark size="sm" />
            <span className="font-mincho text-(length:--text-body) tracking-(--tracking-jp-wide)">
              Fortune AI
            </span>
          </div>
          <nav className="flex flex-wrap gap-(--spacing-ma-md) font-gothic text-(length:--text-caption) text-(--color-text-secondary)">
            <Link href="/legal/terms">利用規約</Link>
            <Link href="/legal/disclaimer">免責事項</Link>
            <Link href="/legal/privacy">プライバシー</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
