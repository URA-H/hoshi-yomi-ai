import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
  description: "Fortune AI の利用規約",
};

/**
 * Draft only — not legal advice. See docs/terms-draft.md for the full
 * source and the questions to take to a lawyer.
 */
export default function TermsPage() {
  return (
    <article className="prose-jp">
      <h1 className="font-mincho text-(length:--text-h1) tracking-(--tracking-jp-normal) mb-(--spacing-ma-md)">
        利用規約
      </h1>
      <p className="font-gothic text-(length:--text-caption) text-(--color-text-muted) mb-(--spacing-ma-md)">
        最終更新: 2026-05-21 / 本ページは草案です。本番運用前に弁護士レビューを経たものに差し替えます。
      </p>

      <div className="font-gothic text-(length:--text-body) leading-[1.8] tracking-(--tracking-jp-normal) text-(--color-text-secondary) space-y-(--spacing-ma-md)">
        <section>
          <h2 className="font-mincho text-(length:--text-h2) text-(--color-text-primary) mt-(--spacing-ma-lg) mb-(--spacing-ma-sm)">
            第1条（適用）
          </h2>
          <p>
            本規約は、当社が提供する Fortune AI（以下「本サービス」）の利用条件を定めるものです。
            ユーザーは本規約に同意のうえ本サービスを利用するものとし、利用開始をもって同意したものとみなします。
          </p>
        </section>

        <section>
          <h2 className="font-mincho text-(length:--text-h2) text-(--color-text-primary) mt-(--spacing-ma-lg) mb-(--spacing-ma-sm)">
            第2条（サービスの位置付け）
          </h2>
          <p>
            本サービスは、東洋の伝統的占術（四柱推命・九星気学・紫微斗数）の体系に基づき、
            AIが多角的に解釈・統合した内容を提供する、エンターテインメント・自己理解補助サービスです。
            本サービスは未来を予測・保証するものではなく、また科学的に証明された予測手法でもありません。
          </p>
          <p>以下の重大な判断は、本サービスの結果のみに基づいて行わないでください:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>医療上の判断（治療開始・中止、診察を受けるかどうか）</li>
            <li>金融上の判断（投資、借入、契約）</li>
            <li>法的判断（訴訟、契約締結、離婚等）</li>
            <li>重要な人間関係・キャリア上の不可逆な決断</li>
          </ul>
        </section>

        <section>
          <h2 className="font-mincho text-(length:--text-h2) text-(--color-text-primary) mt-(--spacing-ma-lg) mb-(--spacing-ma-sm)">
            第3条（サブスクリプションの解約）
          </h2>
          <p>
            ユーザーはいつでも解約手続きを行うことができます。
            解約手続きは当社所定の画面（マイページ「契約管理」）から1画面で完結します。
            電話・メールでの連絡は不要です。
          </p>
          <p>当社は解約を妨げる設計（ダークパターン）を一切行いません。</p>
        </section>

        <section>
          <h2 className="font-mincho text-(length:--text-h2) text-(--color-text-primary) mt-(--spacing-ma-lg) mb-(--spacing-ma-sm)">
            第4条（禁止事項）
          </h2>
          <p>ユーザーは以下の行為をしてはなりません:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>法令違反、公序良俗違反</li>
            <li>他人の生年月日等の情報を本人の同意なく入力する行為</li>
            <li>本サービスの結果を「未来予測」と第三者に誤認させる形で再配布する行為</li>
            <li>リバースエンジニアリング、スクレイピング、自動アクセス</li>
            <li>本サービスを霊感商法・占い詐欺等の補助ツールとして利用すること</li>
          </ul>
        </section>

        <p className="font-gothic text-(length:--text-caption) text-(--color-text-muted) pt-(--spacing-ma-lg) border-t border-(--color-border-subtle)">
          ※ 本ページは草案であり、第5条以降を含む完全版は弁護士レビュー後に公開します。
          全文の準備版は社内ドキュメント `docs/terms-draft.md` を参照してください。
        </p>
      </div>
    </article>
  );
}
