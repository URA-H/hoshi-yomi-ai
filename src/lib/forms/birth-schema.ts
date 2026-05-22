/**
 * 出生情報フォームの Zod スキーマ
 *
 * UI 入力 → BirthInput への正規化を担当する。
 * (BirthInput は src/lib/fortune/types.ts のサーバー内部型)
 */

import { z } from "zod";
import { PREFECTURE_LONGITUDES } from "@/lib/fortune/solar-time";

export const PREFECTURES: readonly string[] = Object.keys(PREFECTURE_LONGITUDES);
const PREFECTURE_SET: ReadonlySet<string> = new Set(PREFECTURES);

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
const YMD = /^\d{4}-\d{2}-\d{2}$/;
const MIN_DATE = "1900-01-01";

/**
 * UI からそのまま FormData の形で送られてくる値を検証する。
 * - birthTime と prefecture は「不明」を空文字列で表現する
 */
export const birthFormSchema = z.object({
  birthDate: z
    .string()
    .regex(YMD, { message: "YYYY-MM-DD 形式で入力してください" })
    .refine((s) => s >= MIN_DATE, { message: "1900年以降の日付を指定してください" })
    .refine((s) => new Date(s) <= new Date(), {
      message: "未来の日付は指定できません",
    }),
  birthTime: z
    .string()
    .refine((s) => s === "" || HHMM.test(s), {
      message: "HH:MM 形式で入力するか、空欄にしてください",
    }),
  prefecture: z
    .string()
    .refine((s) => s === "" || PREFECTURE_SET.has(s), {
      message: "都道府県を選択してください",
    }),
  gender: z.enum(["male", "female"]),
});

export type BirthFormValues = z.infer<typeof birthFormSchema>;

/**
 * UI 値を fortune ライブラリの BirthInput に変換する。
 *  - birthTime: "" → null
 *  - prefecture: "" → birthLongitude: null
 */
export function toBirthInput(values: BirthFormValues): {
  birthDate: string;
  birthTime: string | null;
  birthLongitude: number | null;
  gender: "male" | "female";
} {
  return {
    birthDate: values.birthDate,
    birthTime: values.birthTime === "" ? null : values.birthTime,
    birthLongitude:
      values.prefecture === ""
        ? null
        : PREFECTURE_LONGITUDES[values.prefecture] ?? null,
    gender: values.gender,
  };
}
