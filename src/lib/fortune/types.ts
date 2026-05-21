/**
 * Fortune AI - 共通型定義
 * 東洋三術（四柱推命・九星気学・紫微斗数）+ クロス分析
 */

// ============================================================
// 共通
// ============================================================

/** 占い期間の種別 */
export type PeriodType = "daily" | "monthly" | "yearly" | "decadal";

/** 性別（大運の順行/逆行に影響） */
export type Gender = "male" | "female";

/** ユーザーの入力情報 */
export interface BirthInput {
  /** 生年月日（YYYY-MM-DD） */
  birthDate: string;
  /** 出生時刻（HH:mm）。不明の場合は null */
  birthTime: string | null;
  /** 出生地の経度（真太陽時補正用） */
  birthLongitude: number | null;
  /** 性別 */
  gender: Gender;
}

// ============================================================
// 真太陽時
// ============================================================

/** 真太陽時の補正結果 */
export interface TrueSolarTimeResult {
  /** 元の標準時（Date） */
  standardTime: Date;
  /** 補正後の真太陽時（Date） */
  trueSolarTime: Date;
  /** 経度差による補正（分） */
  longitudeCorrection: number;
  /** 均時差による補正（分） */
  equationOfTime: number;
  /** 合計補正（分） */
  totalCorrection: number;
}

// ============================================================
// 四柱推命
// ============================================================

/** 天干 */
export type TianGan =
  | "甲" | "乙" | "丙" | "丁" | "戊"
  | "己" | "庚" | "辛" | "壬" | "癸";

/** 地支 */
export type DiZhi =
  | "子" | "丑" | "寅" | "卯" | "辰" | "巳"
  | "午" | "未" | "申" | "酉" | "戌" | "亥";

/** 五行 */
export type WuXing = "木" | "火" | "土" | "金" | "水";

/** 陰陽 */
export type YinYang = "陽" | "陰";

/** 十神（通変星） */
export type ShiShen =
  | "比肩" | "劫財"
  | "食神" | "傷官"
  | "偏財" | "正財"
  | "偏官" | "正官"
  | "偏印" | "印綬";

/** 十二運 */
export type TwelveStage =
  | "長生" | "沐浴" | "冠帯" | "臨官" | "帝旺" | "衰"
  | "病" | "死" | "墓" | "絶" | "胎" | "養";

/** 一柱（年柱・月柱・日柱・時柱） */
export interface Pillar {
  /** 天干 */
  tianGan: TianGan;
  /** 地支 */
  diZhi: DiZhi;
  /** 天干の五行 */
  wuXing: WuXing;
  /** 天干の陰陽 */
  yinYang: YinYang;
  /** 十神（日干から見た関係）。日柱自身は null */
  shiShen: ShiShen | null;
  /** 十二運（日干から見た地支の状態） */
  twelveStage: TwelveStage;
}

/** 大運の一期間 */
export interface DaYun {
  /** 開始年齢 */
  startAge: number;
  /** 天干 */
  tianGan: TianGan;
  /** 地支 */
  diZhi: DiZhi;
  /** 十神 */
  shiShen: ShiShen;
  /** 十二運 */
  twelveStage: TwelveStage;
}

/** 五行バランス */
export interface WuXingBalance {
  木: number;
  火: number;
  土: number;
  金: number;
  水: number;
}

/** 四柱推命の命式（完全データ） */
export interface MeishikiResult {
  /** 年柱 */
  yearPillar: Pillar;
  /** 月柱 */
  monthPillar: Pillar;
  /** 日柱 */
  dayPillar: Pillar;
  /** 時柱（出生時刻不明の場合は null） */
  hourPillar: Pillar | null;
  /** 日干（日柱の天干。命式の中心） */
  dayMaster: TianGan;
  /** 五行バランス */
  wuXingBalance: WuXingBalance;
  /** 大運リスト（10年ごと、8期分程度） */
  daYun: DaYun[];
  /** 身強/身弱の判定 */
  strength: "身強" | "身弱" | "中和";
}

// ============================================================
// 九星気学
// ============================================================

/** 九星 */
export type KyuseiStar =
  | "一白水星" | "二黒土星" | "三碧木星"
  | "四緑木星" | "五黄土星" | "六白金星"
  | "七赤金星" | "八白土星" | "九紫火星";

/** 九星の番号（1〜9） */
export type KyuseiNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/** 八方位 + 中央 */
export type Direction =
  | "北" | "北東" | "東" | "南東"
  | "南" | "南西" | "西" | "北西" | "中央";

/** 方位の吉凶 */
export type DirectionFortune = "大吉" | "吉" | "小吉" | "中立" | "小凶" | "凶" | "大凶";

/** 方位の吉凶判定結果 */
export interface DirectionResult {
  direction: Direction;
  fortune: DirectionFortune;
  /** 凶の種類（五黄殺、暗剣殺など） */
  reason: string | null;
}

/** 九星盤（年盤・月盤・日盤） */
export interface KyuseiBan {
  /** 中央に位置する星 */
  center: KyuseiNumber;
  /** 各方位に配置された星 [北, 北東, 東, 南東, 南, 南西, 西, 北西] */
  positions: Record<Direction, KyuseiNumber>;
}

/** 九星気学の鑑定結果 */
export interface KyuseiResult {
  /** 本命星 */
  honmeisei: KyuseiStar;
  /** 本命星の番号 */
  honmeiseiNumber: KyuseiNumber;
  /** 月命星 */
  getsumeisei: KyuseiStar;
  /** 月命星の番号 */
  getsumeiseiNumber: KyuseiNumber;
  /** 日命星 */
  nichimeisei: KyuseiStar;
  /** 日命星の番号 */
  nichimeiseiNumber: KyuseiNumber;
  /** 年盤 */
  yearBan: KyuseiBan;
  /** 月盤 */
  monthBan: KyuseiBan;
  /** 日盤 */
  dayBan: KyuseiBan;
  /** 方位吉凶（本命星ベース） */
  directions: DirectionResult[];
}

// ============================================================
// 紫微斗数
// ============================================================

/** 十二宮の名称 */
export type PalaceName =
  | "命宮" | "兄弟宮" | "夫妻宮" | "子女宮"
  | "財帛宮" | "疾厄宮" | "遷移宮" | "交友宮"
  | "官禄宮" | "田宅宮" | "福徳宮" | "父母宮";

/** 宮の情報 */
export interface Palace {
  /** 宮の名称 */
  name: PalaceName;
  /** 天干 */
  tianGan: string;
  /** 地支 */
  diZhi: string;
  /** 主星リスト */
  majorStars: string[];
  /** 副星リスト */
  minorStars: string[];
  /** 宮の評価（吉凶の目安） */
  brightness: string;
}

/** 紫微斗数の鑑定結果 */
export interface ShiWeiResult {
  /** 十二宮の配置 */
  palaces: Palace[];
  /** 命宮の主星 */
  mainStar: string;
  /** 身宮の位置 */
  bodyPalace: PalaceName;
  /** 命主 */
  soul: string;
  /** 身主 */
  body: string;
  /** 五行局 */
  fiveElementsClass: string;
  /**
   * 概算フラグ。出生時刻が不明な場合、時辰依存の命宮等が確定できないため
   * "time-unknown" がセットされる。AIプロンプトはこの場合「概算」と明示する。
   */
  approximation?: "time-unknown";
  /** 大限（現在の10年運） */
  currentDecade: {
    palace: PalaceName;
    startAge: number;
    endAge: number;
    majorStars: string[];
  } | null;
  /** 流年（指定年の運勢） */
  currentYear: {
    palace: PalaceName;
    majorStars: string[];
  } | null;
  /** 流月（指定月の運勢） */
  currentMonth: {
    palace: PalaceName;
    majorStars: string[];
  } | null;
  /** 流日（指定日の運勢） */
  currentDay: {
    palace: PalaceName;
    majorStars: string[];
  } | null;
}

// ============================================================
// クロス分析
// ============================================================

/** 分析領域 */
export type AnalysisDomain =
  | "personality" // 性格・本質
  | "career"      // 仕事運
  | "wealth"      // 財運
  | "relationship" // 恋愛・対人
  | "health"      // 健康
  | "timing"      // 時期判断
  | "direction";  // 方位・行動

/** 各占術からの領域別評価 */
export interface DomainAssessment {
  /** 評価（1〜5。5が最良） */
  score: number;
  /** 根拠の要約 */
  reasoning: string;
}

/** クロス分析の領域別結果 */
export interface CrossAnalysisDomain {
  domain: AnalysisDomain;
  /** 各占術からの評価 */
  shichusuimei: DomainAssessment | null;
  kyusei: DomainAssessment | null;
  shiWei: DomainAssessment | null;
  /** 信頼度スコア（0〜100） */
  confidence: number;
  /** 三術の一致度（一致数 / 対応術数） */
  concordance: number;
  /** 統合サマリー */
  summary: string;
}

/** クロス分析の全体結果 */
export interface CrossAnalysisResult {
  /** 領域別の分析結果 */
  domains: CrossAnalysisDomain[];
  /** 総合スコア（0〜100） */
  overallScore: number;
  /** 総合信頼度（0〜100） */
  overallConfidence: number;
  /** 三術で最も一致した領域 */
  strongestDomain: AnalysisDomain;
  /** 三術で最も分かれた領域 */
  weakestDomain: AnalysisDomain;
}

/** 統合鑑定データ（AIプロンプト生成用） */
export interface CombinedFortuneData {
  birthInput: BirthInput;
  trueSolarTime: TrueSolarTimeResult | null;
  meishiki: MeishikiResult;
  kyusei: KyuseiResult;
  shiWei: ShiWeiResult;
  crossAnalysis: CrossAnalysisResult;
  periodType: PeriodType;
  targetDate: string;
}
