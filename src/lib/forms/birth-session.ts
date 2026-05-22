import "server-only";

/**
 * 出生情報の cookie 永続化
 *
 * 現状は DB を持たないため、ユーザーがフォーム送信した出生情報を httpOnly
 * cookie に格納し、結果ページから読み出す。将来 Supabase 統合時はここを
 * `getServerSession()` 相当に置き換える。
 *
 * セキュリティ:
 *  - httpOnly: JavaScript から読み取れない
 *  - sameSite: lax (フォーム POST→ 結果ページ遷移を許容)
 *  - secure: 本番では true
 *  - 暗号化はしていない（生年月日は機微情報には該当しないが、本番では
 *    iron-session 等での暗号化を検討）
 */

import { cookies } from "next/headers";
import { birthFormSchema, type BirthFormValues } from "./birth-schema";

const COOKIE_NAME = "fortune-birth";
const MAX_AGE_DAYS = 30;

export async function saveBirthSession(values: BirthFormValues): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, JSON.stringify(values), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * MAX_AGE_DAYS,
    path: "/",
  });
}

export async function loadBirthSession(): Promise<BirthFormValues | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const result = birthFormSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export async function clearBirthSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
