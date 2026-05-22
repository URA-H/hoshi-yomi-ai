"use server";

import { redirect } from "next/navigation";
import { birthFormSchema } from "@/lib/forms/birth-schema";
import { saveBirthSession } from "@/lib/forms/birth-session";
import type { BirthFormState } from "./form-state";

/**
 * 出生情報を検証して cookie に保存し、結果ページへ遷移する。
 * useActionState から呼ばれる shape (prev, formData)。
 */
export async function submitBirthAction(
  _prev: BirthFormState,
  formData: FormData,
): Promise<BirthFormState> {
  const candidate = {
    birthDate: String(formData.get("birthDate") ?? ""),
    birthTime: String(formData.get("birthTime") ?? ""),
    prefecture: String(formData.get("prefecture") ?? ""),
    gender: String(formData.get("gender") ?? ""),
  };

  const parsed = birthFormSchema.safeParse(candidate);
  if (!parsed.success) {
    const fieldErrors: BirthFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key as keyof typeof fieldErrors]) {
        fieldErrors[key as keyof typeof fieldErrors] = issue.message;
      }
    }
    return { fieldErrors, formError: null };
  }

  await saveBirthSession(parsed.data);
  redirect("/reading");
}
