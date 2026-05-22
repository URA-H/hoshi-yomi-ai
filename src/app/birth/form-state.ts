/**
 * useActionState の状態型と初期値
 *
 * actions.ts は "use server" のため、関数以外のエクスポートが禁止される。
 * 型と初期定数は本ファイルに分離し、Client/Server 両方から参照する。
 */

export type BirthFormState = {
  fieldErrors: Partial<{
    birthDate: string;
    birthTime: string;
    prefecture: string;
    gender: string;
  }>;
  formError: string | null;
};

export const initialBirthFormState: BirthFormState = {
  fieldErrors: {},
  formError: null,
};
