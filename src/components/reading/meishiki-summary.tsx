import type { MeishikiResult } from "@/lib/fortune/types";
import {
  describeStrength,
  moodOfTwelveStage,
} from "@/lib/fortune/labels";
import { Divider } from "@/components/divider";

const MOOD_STYLE: Record<ReturnType<typeof moodOfTwelveStage>, string> = {
  rising: "text-(--color-accent-primary)",
  peak: "text-(--color-accent-emphasis)",
  settled: "text-(--color-text-secondary)",
  low: "text-(--color-accent-warning)",
  dormant: "text-(--color-text-muted)",
};

export function MeishikiSummary({ m }: { m: MeishikiResult }) {
  const pillars = [
    { label: "年柱", p: m.yearPillar },
    { label: "月柱", p: m.monthPillar },
    { label: "日柱", p: m.dayPillar },
    { label: "時柱", p: m.hourPillar },
  ] as const;

  return (
    <section
      aria-labelledby="meishiki-title"
      className="rounded-sm border border-(--color-border-subtle) bg-(--color-bg-surface) p-6 md:p-8 space-y-(--spacing-ma-md)"
    >
      <header>
        <p className="font-mincho text-(length:--text-caption) tracking-(--tracking-jp-decorative) text-(--color-text-muted) uppercase">
          四柱推命
        </p>
        <h2
          id="meishiki-title"
          className="font-mincho text-(length:--text-h2) tracking-(--tracking-jp-normal) mt-1"
        >
          命式
        </h2>
      </header>

      <Divider />

      <dl className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {pillars.map(({ label, p }) => (
          <div
            key={label}
            className="rounded-sm border border-(--color-border-subtle) bg-(--color-bg-elevated) p-3"
          >
            <dt className="font-mincho text-(length:--text-micro) tracking-(--tracking-jp-wide) text-(--color-text-muted)">
              {label}
            </dt>
            {p ? (
              <dd className="mt-2 space-y-1">
                <p className="font-mincho text-(length:--text-h3) text-(--color-text-primary)">
                  {p.tianGan}
                  {p.diZhi}
                </p>
                <p className="text-(length:--text-micro) text-(--color-text-secondary)">
                  {p.wuXing} / {p.yinYang}
                </p>
                {p.shiShen && (
                  <p className="text-(length:--text-micro) text-(--color-text-secondary)">
                    {p.shiShen}
                  </p>
                )}
                <p
                  className={`text-(length:--text-micro) ${MOOD_STYLE[moodOfTwelveStage(p.twelveStage)]}`}
                >
                  {p.twelveStage}
                </p>
              </dd>
            ) : (
              <dd className="mt-2 text-(length:--text-micro) text-(--color-text-muted)">
                時刻不明のため算出なし
              </dd>
            )}
          </div>
        ))}
      </dl>

      {/* 五行バランス */}
      <div>
        <h3 className="font-mincho text-(length:--text-caption) tracking-(--tracking-jp-wide) text-(--color-text-muted) mb-2">
          五行バランス
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {(["木", "火", "土", "金", "水"] as const).map((w) => {
            const v = m.wuXingBalance[w];
            const max = Math.max(...Object.values(m.wuXingBalance), 1);
            return (
              <div key={w} className="space-y-1">
                <div className="flex items-center justify-between font-gothic text-(length:--text-caption)">
                  <span>{w}</span>
                  <span className="text-(--color-text-muted)">{v}</span>
                </div>
                <div
                  className="h-1 rounded-sm bg-(--color-accent-emphasis)"
                  style={{ width: `${(v / max) * 100}%` }}
                  aria-hidden
                />
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-(length:--text-caption) text-(--color-text-secondary)">
        日干: <span className="font-mincho text-(--color-text-primary)">{m.dayMaster}</span>
        {" — "}
        {describeStrength(m.strength)}
      </p>

      {/* 現在の大運 */}
      {m.daYun[0] && (
        <div className="rounded-sm border-l-2 border-(--color-accent-emphasis)/60 bg-(--color-bg-elevated) px-4 py-3">
          <h3 className="font-mincho text-(length:--text-caption) text-(--color-accent-emphasis) tracking-(--tracking-jp-wide)">
            直近の大運
          </h3>
          <p className="mt-1 font-gothic text-(length:--text-body) text-(--color-text-secondary)">
            {m.daYun[0].startAge}歳〜{" "}
            <span className="font-mincho text-(--color-text-primary)">
              {m.daYun[0].tianGan}
              {m.daYun[0].diZhi}
            </span>{" "}
            ({m.daYun[0].shiShen} / {m.daYun[0].twelveStage})
          </p>
        </div>
      )}
    </section>
  );
}
