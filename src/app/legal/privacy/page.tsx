import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "星読みAI のプライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <article>
      <h1 className="font-mincho text-(length:--text-h1) tracking-(--tracking-jp-normal) mb-(--spacing-ma-md)">
        プライバシーポリシー
      </h1>
      <p className="font-gothic text-(length:--text-caption) text-(--color-text-muted) mb-(--spacing-ma-md)">
        最終更新: 2026-05-21 / 草案
      </p>

      <div className="font-gothic text-(length:--text-body) leading-[1.8] tracking-(--tracking-jp-normal) text-(--color-text-secondary) space-y-(--spacing-ma-md)">
        <section>
          <h2 className="font-mincho text-(length:--text-h2) text-(--color-text-primary) mt-(--spacing-ma-lg) mb-(--spacing-ma-sm)">
            収集する情報
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>必須: 生年月日時、出生地（都道府県）、性別、メールアドレス</li>
            <li>任意: お名前、相談内容</li>
            <li>自動収集: アクセスログ、Cookie、端末情報</li>
          </ul>
        </section>

        <section>
          <h2 className="font-mincho text-(length:--text-h2) text-(--color-text-primary) mt-(--spacing-ma-lg) mb-(--spacing-ma-sm)">
            利用目的
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>占術計算と結果生成</li>
            <li>アカウント管理、サービス改善</li>
            <li>不正利用の防止</li>
            <li>マーケティング（任意設定で停止可能）</li>
          </ul>
        </section>

        <section>
          <h2 className="font-mincho text-(length:--text-h2) text-(--color-text-primary) mt-(--spacing-ma-lg) mb-(--spacing-ma-sm)">
            処理委託先
          </h2>
          <p>本サービスは以下の処理委託先を利用します:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Supabase（DB・認証）</li>
            <li>Vercel（ホスティング）</li>
            <li>Stripe（決済）</li>
            <li>Anthropic（AI処理 — 占術データはユーザー識別情報を含まない形で送信）</li>
          </ul>
        </section>

        <section>
          <h2 className="font-mincho text-(length:--text-h2) text-(--color-text-primary) mt-(--spacing-ma-lg) mb-(--spacing-ma-sm)">
            ユーザーの権利
          </h2>
          <p>ユーザーは、開示請求、訂正、削除、利用停止をいつでも請求できます。</p>
        </section>

        <section>
          <h2 className="font-mincho text-(length:--text-h2) text-(--color-text-primary) mt-(--spacing-ma-lg) mb-(--spacing-ma-sm)">
            データの保持期間
          </h2>
          <p>アカウント削除後30日以内に全削除します。バックアップから完全消去まで最大90日。</p>
        </section>
      </div>
    </article>
  );
}
