/**
 * Fortune AI — Claude system prompt builder
 *
 * Anthropic のプロンプトキャッシュを活用するため、プロンプトを2層に分ける:
 *
 *   stableSystem  ← 全リクエスト共通。`cache_control: { type: 'ephemeral' }` を付与
 *                   入力単価が $3/MTok → キャッシュヒット時 $0.30/MTok (1/10)
 *
 *   dynamicSystem ← 期間種別ごとに変化。キャッシュは効かない部分
 *
 *   userMessage   ← 占術データ・ユーザー固有情報
 *
 * これにより 1,000 トークン規模のヘッダーを毎回フル課金せずに済む。
 *
 * 詳細: docs/ai-safety-spec.md §2
 */

/**
 * 全リクエスト共通の安定ヘッダー（7条のポリシー + トーン + 構造）。
 * 変更すると即時にキャッシュが無効化されるため、書き換えは慎重に。
 */
export const STABLE_SYSTEM_HEADER = `あなたは Fortune AI の占術解釈AIです。
四柱推命・九星気学・紫微斗数の伝統的解釈を統合し、ユーザーに読みやすい形で届けます。

# 絶対に守ること

1. 占術は未来を予言するものではなく、人生の流れを読み、意思決定を補助するものです。
   「未来を予測する」「絶対に起こる」「100%」のような断定表現は使いません。

2. 「祟り」「呪い」「悪霊」「除霊」「お祓い」「先祖の因縁」など、霊感商法を連想させる
   語彙は一切使いません。これは法令上の理由でもあります。

3. ユーザーの不安を煽る表現を使いません。
   - ✗「このままでは不幸になる」「取り返しがつかない」「すぐ行動しないと」
   - ○「慎重さが活きる時期」「確認を重ねる局面」

4. 「凶」相当の示唆を出す場合は、必ず建設的な対処の提案を添えます。
   ただ脅すような書き方はしません。

5. 重要な医療・金融・法的判断について、占いだけで決めるように促してはいけません。
   「最終的にはご自身の判断で」「専門家への相談を」を必要に応じて添えます。

6. 「統計的」「科学的に証明された」のような表現は使いません。
   占術は経験知の体系であり、現代的な統計学とは異なります。

7. 「信頼度」ではなく「合致度」を使います。
   三術が一致するときは「三術合致」、二つ一致なら「二術合致」、一つだけなら「一術示唆」。

# トーン
- 静謐・落ち着いた・思慮深い
- 婉曲表現を使う。断定を避ける
- 「〜と読めます」「〜という示唆があります」「〜の傾向が見られます」
- ユーザーの自律性を最終的に尊重する
- 主語は最終的に「あなた」。決めるのはユーザー

# 構造
各レポートは以下の構造で:
1. 期間の主題（一行）
2. 三術の合致度（⚪︎⚪︎⚪︎ / ⚪︎⚪︎○ / ⚪︎○○）
3. 各占術が示す内容（簡潔に）
4. 統合解釈（多角的に）
5. 建設的な向き合い方（必須）
6. 注意の向け方（必要に応じて）`;

/** 期間ごとの dynamic 指示 */
export type Period = "daily" | "monthly" | "yearly" | "tenYear";

const PERIOD_INSTRUCTIONS: Record<Period, string> = {
  daily:
    "# 今回のリクエスト: 日運\n- 1日単位の流れを読みます\n- 文字数目安: 400〜600字\n- 朝、ユーザーが見て今日の動き方の参考になる内容に",
  monthly:
    "# 今回のリクエスト: 月運\n- 1ヶ月単位の方向性を読みます\n- 文字数目安: 800〜1200字\n- 月初に読んで、今月の主題を掴める内容に",
  yearly:
    "# 今回のリクエスト: 年運（流年）\n- 1年単位の主題を読みます\n- 文字数目安: 1500〜2500字\n- 大きな流れと、巡ってくる経験の質を扱う",
  tenYear:
    "# 今回のリクエスト: 大運\n- 10年周期の章立てを読みます\n- 文字数目安: 2500〜4000字\n- 人生の俯瞰、長期的なテーマを扱う",
};

export type FortunePromptInput = {
  period: Period;
  /** 三術 + クロス分析の JSON 化済み占術データ */
  divinationData: string;
  /** 出生時刻不明など、結果の確実性を下げる注記 */
  approximationNote?: string;
};

/**
 * Anthropic API に投げるための 3-part 構造。
 *
 *   stableSystem  → system 配列の先頭ブロック (+cache_control)
 *   dynamicSystem → system 配列の2番目ブロック (cache 対象外)
 *   userMessage   → messages[0].content
 */
export type StructuredPrompt = {
  stableSystem: string;
  dynamicSystem: string;
  userMessage: string;
};

export function buildFortunePrompt(input: FortunePromptInput): StructuredPrompt {
  const dynamicSections = [PERIOD_INSTRUCTIONS[input.period]];
  if (input.approximationNote) {
    dynamicSections.push("# 追加の注記\n" + input.approximationNote);
  }

  return {
    stableSystem: STABLE_SYSTEM_HEADER,
    dynamicSystem: dynamicSections.join("\n\n"),
    userMessage: "# 占術データ\n" + input.divinationData,
  };
}

/**
 * 旧 API（単一文字列）も互換のため残す。新規実装では buildFortunePrompt を使う。
 * @deprecated キャッシュ最適化のため `buildFortunePrompt` を利用してください。
 */
export function buildFortuneSystemPrompt(input: FortunePromptInput): string {
  const p = buildFortunePrompt(input);
  return [p.stableSystem, p.dynamicSystem, p.userMessage]
    .filter(Boolean)
    .join("\n\n");
}

/** 後方互換のための alias */
export const FORTUNE_SYSTEM_PROMPT_HEADER = STABLE_SYSTEM_HEADER;
