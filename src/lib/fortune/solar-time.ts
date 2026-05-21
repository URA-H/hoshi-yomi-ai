/**
 * 真太陽時補正ユーティリティ
 *
 * 四柱推命の時柱は真太陽時（その場所の実際の太陽位置に基づく時刻）で算出する。
 * 真太陽時 = 標準時 + 地方時差（経度補正） + 均時差（Equation of Time）
 *
 * 日本標準時は東経135度（明石）基準。
 * 経度が異なる場所では、1度あたり4分の差が生じる。
 * 均時差は地球の軌道離心率と地軸の傾きにより、日によって最大±16分変動する。
 */

import type { TrueSolarTimeResult } from "./types";

/** 日本標準時の基準経度 */
const JST_BASE_LONGITUDE = 135;

/**
 * 日本の主要都市の経度テーブル
 * ユーザーが都道府県を選択した際に経度を自動取得するために使用
 */
export const PREFECTURE_LONGITUDES: Record<string, number> = {
  北海道: 141.35,
  青森県: 140.74,
  岩手県: 141.15,
  宮城県: 140.87,
  秋田県: 140.10,
  山形県: 140.33,
  福島県: 140.47,
  茨城県: 140.45,
  栃木県: 139.88,
  群馬県: 139.06,
  埼玉県: 139.65,
  千葉県: 140.12,
  東京都: 139.69,
  神奈川県: 139.64,
  新潟県: 139.02,
  富山県: 137.21,
  石川県: 136.63,
  福井県: 136.22,
  山梨県: 138.57,
  長野県: 138.18,
  岐阜県: 136.72,
  静岡県: 138.38,
  愛知県: 136.91,
  三重県: 136.51,
  滋賀県: 135.87,
  京都府: 135.77,
  大阪府: 135.52,
  兵庫県: 135.18,
  奈良県: 135.83,
  和歌山県: 135.17,
  鳥取県: 134.24,
  島根県: 133.05,
  岡山県: 133.93,
  広島県: 132.46,
  山口県: 131.47,
  徳島県: 134.56,
  香川県: 134.04,
  愛媛県: 132.77,
  高知県: 133.53,
  福岡県: 130.42,
  佐賀県: 130.30,
  長崎県: 129.87,
  熊本県: 130.74,
  大分県: 131.61,
  宮崎県: 131.42,
  鹿児島県: 130.56,
  沖縄県: 127.68,
};

/**
 * 均時差（Equation of Time）を計算する
 *
 * Spencer (1971) の近似式を使用。精度は約30秒。
 * 四柱推命の時柱判定（2時間刻み）には十分な精度。
 *
 * @param date - 対象日
 * @returns 均時差（分）。正の値は「太陽が時計より進んでいる」ことを示す
 */
export function calculateEquationOfTime(date: Date): number {
  const dayOfYear = getDayOfYear(date);

  // 角度 B を計算（ラジアン）
  // B = (360/364) * (dayOfYear - 81) をラジアンに変換
  const B = ((2 * Math.PI) / 364) * (dayOfYear - 81);

  // Spencer の近似式（分単位で出力）
  const eot =
    9.87 * Math.sin(2 * B) -
    7.53 * Math.cos(B) -
    1.5 * Math.sin(B);

  return eot;
}

/**
 * 経度差による地方時差を計算する
 *
 * @param longitude - 出生地の経度
 * @returns 地方時差（分）。東側が正（太陽が早く南中する）
 */
export function calculateLongitudeCorrection(longitude: number): number {
  // 経度1度あたり4分の差
  return (longitude - JST_BASE_LONGITUDE) * 4;
}

/**
 * 真太陽時を計算する
 *
 * @param standardTime - 日本標準時での時刻
 * @param longitude - 出生地の経度（null の場合は補正なし）
 * @returns 真太陽時の補正結果
 */
export function calculateTrueSolarTime(
  standardTime: Date,
  longitude: number | null,
): TrueSolarTimeResult {
  if (longitude === null) {
    return {
      standardTime,
      trueSolarTime: standardTime,
      longitudeCorrection: 0,
      equationOfTime: 0,
      totalCorrection: 0,
    };
  }

  const longitudeCorrection = calculateLongitudeCorrection(longitude);
  const equationOfTime = calculateEquationOfTime(standardTime);
  const totalCorrection = longitudeCorrection + equationOfTime;

  const trueSolarTime = new Date(
    standardTime.getTime() + totalCorrection * 60 * 1000,
  );

  return {
    standardTime,
    trueSolarTime,
    longitudeCorrection: Math.round(longitudeCorrection * 100) / 100,
    equationOfTime: Math.round(equationOfTime * 100) / 100,
    totalCorrection: Math.round(totalCorrection * 100) / 100,
  };
}

/**
 * 日本のサマータイム（1948〜1951年）を補正する
 *
 * 1948年5月〜1951年9月に施行。この期間は標準時+1時間。
 * 出生届の時刻がサマータイム込みで記載されている場合、
 * 1時間引いて本来の標準時に戻す必要がある。
 *
 * @param date - 出生日時
 * @returns サマータイム補正後の日時
 */
export function correctSummerTime(date: Date): Date {
  const year = date.getFullYear();

  // サマータイム施行期間の大まかな判定
  // 各年の正確な開始・終了日は異なるが、月単位で十分
  const summerTimePeriods: Array<{ start: Date; end: Date }> = [
    {
      start: new Date(1948, 4, 2), // 1948年5月2日
      end: new Date(1948, 8, 11), // 1948年9月11日
    },
    {
      start: new Date(1949, 3, 3), // 1949年4月3日
      end: new Date(1949, 8, 10), // 1949年9月10日
    },
    {
      start: new Date(1950, 4, 7), // 1950年5月7日
      end: new Date(1950, 8, 9), // 1950年9月9日
    },
    {
      start: new Date(1951, 4, 6), // 1951年5月6日
      end: new Date(1951, 8, 8), // 1951年9月8日
    },
  ];

  if (year < 1948 || year > 1951) {
    return date;
  }

  for (const period of summerTimePeriods) {
    if (date >= period.start && date <= period.end) {
      // サマータイム中の時刻から1時間引く
      return new Date(date.getTime() - 60 * 60 * 1000);
    }
  }

  return date;
}

/**
 * 年間通算日（Day of Year）を取得する
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * 出生日時の文字列から Date オブジェクトを生成する
 *
 * @param birthDate - 生年月日（YYYY-MM-DD）
 * @param birthTime - 出生時刻（HH:mm）。null の場合は 12:00 をデフォルトとする
 * @returns Date オブジェクト
 */
export function parseBirthDateTime(
  birthDate: string,
  birthTime: string | null,
): Date {
  const [year, month, day] = birthDate.split("-").map(Number);
  if (birthTime) {
    const [hour, minute] = birthTime.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute);
  }
  // 時刻不明の場合は正午をデフォルトとする（時柱は算出しない）
  return new Date(year, month - 1, day, 12, 0);
}
