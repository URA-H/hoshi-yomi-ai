"use client";

import { useActionState, useId, useState } from "react";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import { PREFECTURES } from "@/lib/forms/birth-schema";
import { submitBirthAction } from "./actions";
import { initialBirthFormState, type BirthFormState } from "./form-state";

type Props = {
  initialValues?: {
    birthDate?: string;
    birthTime?: string;
    prefecture?: string;
    gender?: "male" | "female";
  };
};

export function BirthForm({ initialValues }: Props) {
  const [state, formAction, isPending] = useActionState<BirthFormState, FormData>(
    submitBirthAction,
    initialBirthFormState,
  );

  const [timeUnknown, setTimeUnknown] = useState(
    initialValues?.birthTime === "" || !initialValues?.birthTime,
  );
  const [placeUnknown, setPlaceUnknown] = useState(
    initialValues?.prefecture === "" || !initialValues?.prefecture,
  );

  return (
    <form
      action={formAction}
      className="space-y-(--spacing-ma-lg) font-gothic text-(--color-text-primary)"
      noValidate
    >
      {/* 生年月日 */}
      <Field
        label="生年月日"
        name="birthDate"
        error={state.fieldErrors.birthDate}
        required
      >
        <input
          type="date"
          name="birthDate"
          defaultValue={initialValues?.birthDate ?? ""}
          required
          min="1900-01-01"
          max={new Date().toISOString().slice(0, 10)}
          className={inputClass}
        />
      </Field>

      {/* 出生時刻 */}
      <Field
        label="生まれた時刻"
        name="birthTime"
        error={state.fieldErrors.birthTime}
        hint="不明な場合はチェックを入れると、簡易版レポートとして算出します。"
      >
        <div className="space-y-2">
          <input
            type="time"
            name="birthTime"
            defaultValue={
              timeUnknown ? "" : initialValues?.birthTime ?? ""
            }
            disabled={timeUnknown}
            className={cn(inputClass, timeUnknown && "opacity-40")}
          />
          <label className="flex items-center gap-2 text-(length:--text-caption) text-(--color-text-secondary)">
            <input
              type="checkbox"
              checked={timeUnknown}
              onChange={(e) => setTimeUnknown(e.target.checked)}
              className="size-4 rounded-sm border border-(--color-border-subtle) bg-(--color-bg-elevated)"
            />
            時刻は不明
          </label>
        </div>
      </Field>

      {/* 出生地（都道府県） */}
      <Field
        label="生まれた都道府県"
        name="prefecture"
        error={state.fieldErrors.prefecture}
        hint="真太陽時の補正に使います。"
      >
        <div className="space-y-2">
          <select
            name="prefecture"
            defaultValue={
              placeUnknown ? "" : initialValues?.prefecture ?? "東京都"
            }
            disabled={placeUnknown}
            className={cn(inputClass, placeUnknown && "opacity-40")}
          >
            <option value="">選択してください</option>
            {PREFECTURES.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-(length:--text-caption) text-(--color-text-secondary)">
            <input
              type="checkbox"
              checked={placeUnknown}
              onChange={(e) => setPlaceUnknown(e.target.checked)}
              className="size-4 rounded-sm border border-(--color-border-subtle) bg-(--color-bg-elevated)"
            />
            出生地は指定しない
          </label>
        </div>
      </Field>

      {/* 性別 */}
      <Field label="性別" name="gender" error={state.fieldErrors.gender} required>
        <div className="flex gap-4">
          {(
            [
              { value: "male", label: "男性" },
              { value: "female", label: "女性" },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className="inline-flex items-center gap-2 rounded-sm border border-(--color-border-subtle) bg-(--color-bg-elevated) px-4 py-2 cursor-pointer hover:border-(--color-accent-emphasis)/50"
            >
              <input
                type="radio"
                name="gender"
                value={opt.value}
                defaultChecked={initialValues?.gender === opt.value}
                required
                className="size-4"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </Field>

      {/* 同意 */}
      <div className="rounded-sm border border-(--color-border-subtle) bg-(--color-bg-elevated) p-4">
        <p className="text-(length:--text-caption) text-(--color-text-secondary) leading-relaxed">
          ✓ 星読みAI は占術 × AI の解釈サービスで、未来の予測・保証ではありません。<br />
          ✓ 医療・金融・法的判断は専門家にご相談ください。<br />
          ✓ いつでも結果を破棄できます。
        </p>
      </div>

      {state.formError && (
        <p
          role="alert"
          className="text-(length:--text-caption) text-(--color-accent-warning)"
        >
          {state.formError}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "鑑定を準備中..." : "鑑定を始める"}
        </Button>
      </div>
    </form>
  );
}

// ============================================================
// Field wrapper
// ============================================================

const inputClass = cn(
  "w-full rounded-sm border border-(--color-border-subtle) bg-(--color-bg-elevated)",
  "px-4 py-3 min-h-[44px] font-gothic",
  "text-(--color-text-primary)",
  "focus:outline-none focus:ring-2 focus:ring-(--color-ring) focus:border-(--color-accent-emphasis)/50",
  "disabled:cursor-not-allowed",
);

function Field({
  label,
  name,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label
        htmlFor={`${id}-${name}`}
        className="block font-mincho text-(length:--text-body) tracking-(--tracking-jp-normal)"
      >
        {label}
        {required && (
          <span
            aria-hidden
            className="ml-1 text-(--color-accent-warning)"
            title="必須"
          >
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p className="text-(length:--text-micro) text-(--color-text-muted)">
          {hint}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="text-(length:--text-caption) text-(--color-accent-warning)"
        >
          {error}
        </p>
      )}
    </div>
  );
}
