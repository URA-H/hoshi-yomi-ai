import { describe, it, expect } from "vitest";
import {
  birthFormSchema,
  toBirthInput,
  PREFECTURES,
} from "./birth-schema";

describe("birthFormSchema", () => {
  const valid = {
    birthDate: "1990-01-15",
    birthTime: "06:30",
    prefecture: "東京都",
    gender: "male" as const,
  };

  it("通常ケースを通す", () => {
    expect(birthFormSchema.parse(valid)).toEqual(valid);
  });

  it("birthTime と prefecture は空文字列を許容 (=不明)", () => {
    const result = birthFormSchema.parse({
      ...valid,
      birthTime: "",
      prefecture: "",
    });
    expect(result.birthTime).toBe("");
    expect(result.prefecture).toBe("");
  });

  it("未来の日付を拒否", () => {
    const r = birthFormSchema.safeParse({
      ...valid,
      birthDate: "2999-01-01",
    });
    expect(r.success).toBe(false);
  });

  it("1900年より前を拒否", () => {
    const r = birthFormSchema.safeParse({
      ...valid,
      birthDate: "1899-12-31",
    });
    expect(r.success).toBe(false);
  });

  it("YYYY-MM-DD 以外を拒否", () => {
    const r = birthFormSchema.safeParse({
      ...valid,
      birthDate: "1990/01/15",
    });
    expect(r.success).toBe(false);
  });

  it("不正な時刻フォーマットを拒否", () => {
    const r = birthFormSchema.safeParse({
      ...valid,
      birthTime: "25:99",
    });
    expect(r.success).toBe(false);
  });

  it("リストにない都道府県を拒否", () => {
    const r = birthFormSchema.safeParse({
      ...valid,
      prefecture: "存在しない県",
    });
    expect(r.success).toBe(false);
  });

  it("性別必須", () => {
    const r = birthFormSchema.safeParse({
      ...valid,
      gender: "" as never,
    });
    expect(r.success).toBe(false);
  });
});

describe("toBirthInput", () => {
  it("通常ケース", () => {
    expect(
      toBirthInput({
        birthDate: "1990-01-15",
        birthTime: "06:30",
        prefecture: "東京都",
        gender: "male",
      }),
    ).toEqual({
      birthDate: "1990-01-15",
      birthTime: "06:30",
      birthLongitude: 139.69,
      gender: "male",
    });
  });

  it("時刻不明 → null", () => {
    const r = toBirthInput({
      birthDate: "1990-01-15",
      birthTime: "",
      prefecture: "東京都",
      gender: "male",
    });
    expect(r.birthTime).toBeNull();
  });

  it("都道府県不明 → birthLongitude=null", () => {
    const r = toBirthInput({
      birthDate: "1990-01-15",
      birthTime: "06:30",
      prefecture: "",
      gender: "male",
    });
    expect(r.birthLongitude).toBeNull();
  });
});

describe("PREFECTURES", () => {
  it("47都道府県すべて含む", () => {
    expect(PREFECTURES).toHaveLength(47);
  });
  it("東京都・大阪府・沖縄県を含む", () => {
    expect(PREFECTURES).toContain("東京都");
    expect(PREFECTURES).toContain("大阪府");
    expect(PREFECTURES).toContain("沖縄県");
  });
});
