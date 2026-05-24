import Link from "next/link";
import { ConcordanceBadge } from "@/components/concordance-badge";
import { ResultCard } from "@/components/result-card";
import { OrnamentFlourish } from "@/components/ornament-flourish";

export default function Home() {
  return (
    <div className="bg-washi-paper text-(--color-sumi)">
      {/* ────────────────────────────────────────
          Hero — 大観テイストの絹本風 backdrop
          ──────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[100vh]">
        {/* 富士 — 上方中央に薄く佇む */}
        <div
          aria-hidden
          className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[80%] max-w-[900px] pointer-events-none opacity-95"
          style={{
            backgroundImage: "url('/textures/nihonga-fuji.svg')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center top",
            aspectRatio: "800/500",
          }}
        />

        {/* 中景の連山 — 画面下方に重ねる */}
        <div
          aria-hidden
          className="absolute bottom-[80px] left-0 right-0 h-[280px] pointer-events-none"
          style={{
            backgroundImage: "url('/textures/nihonga-far-mountains.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* 松林 — 最前景 */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-[140px] pointer-events-none"
          style={{
            backgroundImage: "url('/textures/nihonga-pines.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* 霞 — 富士の裾と山々の間に流れる */}
        <div aria-hidden className="nihonga-mist" />

        {/* コンテンツ */}
        <div className="relative mx-auto max-w-5xl px-6 pt-32 pb-[420px]">
          <div className="flex flex-col items-center text-center gap-(--spacing-ma-md)">
            {/* 詩的なリード — 装飾フォントで小さく */}
            <p className="font-decorative text-(length:--text-body-lg) tracking-(--tracking-jp-decorative) text-(--color-kincha) italic mt-[260px]">
              三つの星々が交わるとき、道筋が見えてくる。
            </p>

            <h1 className="font-mincho text-(length:--text-display) tracking-(--tracking-jp-normal) leading-(--text-display--line-height) text-(--color-sumi) max-w-3xl">
              東洋の智慧を、
              <br />
              現代のAIで多角的に。
            </h1>

            <div className="ornament-flourish max-w-xs">
              <div className="ornament-flourish-diamond" />
            </div>

            <p className="font-gothic text-(length:--text-body-lg) tracking-(--tracking-jp-normal) text-(--color-seiboku) max-w-prose leading-[1.85]">
              四柱推命・九星気学・紫微斗数。
              三千年の経験知を、AIが統合して読み解きます。
              <br />
              統計的な確実性ではなく、三術の合致度を示します。
              最終的な判断は、あなたの手の中に。
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-(--spacing-ma-sm)">
              <Link href="/birth">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-sm min-h-[52px] px-8 font-mincho tracking-(--tracking-jp-wide) text-(length:--text-body-lg) bg-(--color-shuiin) text-(--color-torinoko) hover:bg-(--color-shuiin)/85 active:bg-(--color-shuiin)/95 transition-colors shadow-sm shadow-(--color-shuiin)/30"
                >
                  無料で始める
                </button>
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-sm min-h-[52px] px-8 font-mincho tracking-(--tracking-jp-wide) text-(length:--text-body-lg) bg-transparent text-(--color-sumi) border border-(--color-kincha)/60 hover:bg-(--color-kincha)/10 transition-colors"
              >
                占術の解説を読む
              </button>
            </div>
          </div>
        </div>

        {/* 朱印 — 右下に大観風 */}
        <div
          aria-hidden
          className="absolute bottom-[180px] right-[40px] pointer-events-none rotate-3 hidden md:block"
        >
          <span className="shuiin-seal text-[18px] font-mincho">星</span>
        </div>
      </section>

      {/* ────────────────────────────────────────
          なぜ
          ──────────────────────────────────────── */}
      <section className="relative border-t border-(--color-kincha)/30">
        <div className="mx-auto max-w-3xl px-6 py-(--spacing-ma-2xl)">
          <h2 className="font-mincho text-(length:--text-h1) tracking-(--tracking-jp-normal) text-(--color-sumi) mb-(--spacing-ma-md)">
            なぜ、いま東洋占術 × AI なのか
          </h2>
          <div className="font-gothic text-(length:--text-body-lg) leading-[1.85] tracking-(--tracking-jp-normal) text-(--color-seiboku) space-y-(--spacing-ma-md)">
            <p>
              占いには長く誤解がついてまわります。
              「当たる・当たらない」「絶対・確実」といった、本来の占術が目指してこなかった軸での評価です。
            </p>
            <p>
              東洋の三大占術 — 四柱推命・九星気学・紫微斗数 — は、本来「未来を当てる装置」ではなく、
              人生の流れを読み、選択の質を高めるための意思決定の補助具として用いられてきました。
              古来、人々は星と暦を見上げ、自分の位置を確かめながら、次の一歩を選んできたのです。
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

      <OrnamentFlourish />

      {/* ────────────────────────────────────────
          合致度
          ──────────────────────────────────────── */}
      <section className="relative border-t border-(--color-kincha)/30">
        <div className="mx-auto max-w-4xl px-6 py-(--spacing-ma-2xl)">
          <h2 className="font-mincho text-(length:--text-h1) tracking-(--tracking-jp-normal) text-(--color-sumi) mb-(--spacing-ma-lg)">
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
                className="rounded-sm border border-(--color-kincha)/40 bg-(--color-torinoko)/60 p-6 backdrop-blur-sm"
              >
                <ConcordanceBadge level={item.level} />
                <p className="mt-4 font-gothic text-(length:--text-body) leading-[1.8] tracking-(--tracking-jp-normal) text-(--color-seiboku)">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-(--spacing-ma-md) font-gothic text-(length:--text-caption) text-(--color-kincha)">
            ※ 合致度は「未来の確実性」ではなく、「三術の解釈の重なり度合い」を示すものです。
          </p>
        </div>
      </section>

      <OrnamentFlourish />

      {/* ────────────────────────────────────────
          レポート例
          ──────────────────────────────────────── */}
      <section className="relative border-t border-(--color-kincha)/30">
        <div className="mx-auto max-w-3xl px-6 py-(--spacing-ma-2xl)">
          <h2 className="font-mincho text-(length:--text-h1) tracking-(--tracking-jp-normal) text-(--color-sumi) mb-(--spacing-ma-lg)">
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

      {/* ────────────────────────────────────────
          CTA
          ──────────────────────────────────────── */}
      <section className="relative border-t border-(--color-kincha)/30">
        <div className="mx-auto max-w-3xl px-6 py-(--spacing-ma-2xl) text-center">
          <div className="ornament-flourish max-w-xs mx-auto">
            <div className="ornament-flourish-diamond" />
          </div>
          <h2 className="mt-(--spacing-ma-lg) font-mincho text-(length:--text-h1) tracking-(--tracking-jp-normal) text-(--color-sumi)">
            自分を、もう一度見つめなおす
          </h2>
          <p className="mt-(--spacing-ma-md) font-gothic text-(length:--text-body) text-(--color-seiboku)">
            登録は1分で完了します。いつでも1画面で解約できます。
          </p>
          <div className="mt-(--spacing-ma-lg) flex justify-center gap-3">
            <Link href="/birth">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-sm min-h-[52px] px-8 font-mincho tracking-(--tracking-jp-wide) text-(length:--text-body-lg) bg-(--color-shuiin) text-(--color-torinoko) hover:bg-(--color-shuiin)/85 active:bg-(--color-shuiin)/95 transition-colors shadow-sm shadow-(--color-shuiin)/30"
              >
                無料で始める
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────
          Footer
          ──────────────────────────────────────── */}
      <footer className="border-t border-(--color-kincha)/30 py-(--spacing-ma-lg) bg-(--color-tonoko)/30">
        <div className="mx-auto max-w-5xl px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="shuiin-seal text-[14px] font-mincho">星</span>
            <span className="font-mincho text-(length:--text-body) tracking-(--tracking-jp-wide) text-(--color-sumi)">
              Fortune AI
            </span>
          </div>
          <nav className="flex flex-wrap gap-(--spacing-ma-md) font-gothic text-(length:--text-caption) text-(--color-seiboku)">
            <Link href="/legal/terms" className="hover:text-(--color-sumi)">利用規約</Link>
            <Link href="/legal/disclaimer" className="hover:text-(--color-sumi)">免責事項</Link>
            <Link href="/legal/privacy" className="hover:text-(--color-sumi)">プライバシー</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
