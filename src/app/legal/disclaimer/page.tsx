import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "免責事項",
  description: "星読みAI の免責事項",
};

export default function DisclaimerPage() {
  return (
    <article>
      <h1 className="font-mincho text-(length:--text-h1) tracking-(--tracking-jp-normal) mb-(--spacing-ma-md)">
        免責事項
      </h1>
      <p className="font-gothic text-(length:--text-caption) text-(--color-text-muted) mb-(--spacing-ma-md)">
        最終更新: 2026-05-21 / 草案
      </p>

      <div className="font-gothic text-(length:--text-body) leading-[1.8] tracking-(--tracking-jp-normal) text-(--color-text-secondary) space-y-(--spacing-ma-md)">
        <section>
          <h2 className="font-mincho text-(length:--text-h2) text-(--color-text-primary) mt-(--spacing-ma-lg) mb-(--spacing-ma-sm)">
            占術結果の性質について
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>本サービスが提供する占術結果・AI解釈は、伝統的占術の体系に基づく解釈の一例です。</li>
            <li>同じ生年月日であっても、流派・解釈者により異なる結論が出ることがあります。</li>
            <li>
              「合致度」スコアは、三術の解釈の重なり度合いを示すものであり、結果の確実性・科学的根拠を意味しません。
            </li>
            <li>AIは伝統的占術の解釈を統合する役割を担うものであり、未来を予知する能力を持つわけではありません。</li>
          </ul>
        </section>

        <section>
          <h2 className="font-mincho text-(length:--text-h2) text-(--color-text-primary) mt-(--spacing-ma-lg) mb-(--spacing-ma-sm)">
            重要な判断についての警告
          </h2>
          <p>以下の判断は、本サービスの結果のみに基づいて行わないでください。</p>
          <table className="my-(--spacing-ma-sm) w-full text-(length:--text-body) border border-(--color-border-subtle)">
            <thead className="bg-(--color-bg-surface)">
              <tr>
                <th className="text-left p-3 font-mincho text-(--color-text-primary)">分野</th>
                <th className="text-left p-3 font-mincho text-(--color-text-primary)">推奨される相談先</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["健康・医療", "医師、薬剤師、看護師"],
                ["投資・資産運用", "ファイナンシャルプランナー、税理士、証券会社"],
                ["法的問題", "弁護士、司法書士"],
                ["結婚・離婚・養育", "弁護士、カウンセラー"],
                ["メンタルヘルス", "心療内科、臨床心理士、各種相談窓口"],
              ].map(([area, who]) => (
                <tr key={area} className="border-t border-(--color-border-subtle)">
                  <td className="p-3">{area}</td>
                  <td className="p-3">{who}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="font-mincho text-(length:--text-h2) text-(--color-text-primary) mt-(--spacing-ma-lg) mb-(--spacing-ma-sm)">
            占いとメンタルヘルスについて
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>本サービスの結果が「凶」「悪い」と感じられた場合でも、それは固定された運命を示すものではありません。</li>
            <li>占いの結果に過度に依存することは、ご自身の判断力や精神的健康に影響を及ぼす可能性があります。</li>
            <li>占いの結果により不安を強く感じる方は、ご利用を控えてください。</li>
            <li>深刻な不安や抑うつ症状がある場合は、専門の医療機関にご相談ください。</li>
          </ul>
          <div className="mt-(--spacing-ma-sm) rounded-sm border border-(--color-border-subtle) bg-(--color-bg-surface) p-4">
            <p className="font-mincho text-(--color-text-primary)">相談窓口</p>
            <ul className="mt-2 space-y-1 text-(length:--text-caption)">
              <li>よりそいホットライン（24時間無料）: 0120-279-338</li>
              <li>いのちの電話: 0570-783-556</li>
            </ul>
          </div>
        </section>
      </div>
    </article>
  );
}
