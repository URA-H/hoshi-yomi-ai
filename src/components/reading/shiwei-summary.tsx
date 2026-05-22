import type { ShiWeiResult } from "@/lib/fortune/types";
import { Divider } from "@/components/divider";

export function ShiWeiSummary({ s }: { s: ShiWeiResult }) {
  const approximate = s.approximation === "time-unknown";

  return (
    <section
      aria-labelledby="shiwei-title"
      className="rounded-sm border border-(--color-border-subtle) bg-(--color-bg-surface) p-6 md:p-8 space-y-(--spacing-ma-md)"
    >
      <header>
        <p className="font-mincho text-(length:--text-caption) tracking-(--tracking-jp-decorative) text-(--color-text-muted) uppercase">
          紫微斗数
        </p>
        <h2
          id="shiwei-title"
          className="font-mincho text-(length:--text-h2) tracking-(--tracking-jp-normal) mt-1"
        >
          命盤
          {approximate && (
            <span className="ml-2 font-gothic text-(length:--text-caption) text-(--color-text-muted)">
              ※ 出生時刻不明のため概算
            </span>
          )}
        </h2>
      </header>

      <Divider />

      <div className="grid grid-cols-2 gap-3">
        <KeyValue label="命宮 主星" value={s.mainStar} />
        <KeyValue label="身宮の位置" value={s.bodyPalace} />
        <KeyValue label="命主" value={s.soul} />
        <KeyValue label="身主" value={s.body} />
        <KeyValue label="五行局" value={s.fiveElementsClass} />
      </div>

      {/* 現在の運限 */}
      {s.currentDecade && (
        <div className="rounded-sm border-l-2 border-(--color-accent-emphasis)/60 bg-(--color-bg-elevated) px-4 py-3 space-y-1">
          <h3 className="font-mincho text-(length:--text-caption) text-(--color-accent-emphasis) tracking-(--tracking-jp-wide)">
            現在の大限
          </h3>
          <p className="font-gothic text-(length:--text-body) text-(--color-text-secondary)">
            {s.currentDecade.startAge}-{s.currentDecade.endAge}歳:{" "}
            <span className="font-mincho text-(--color-text-primary)">
              {s.currentDecade.palace}
            </span>
            {s.currentDecade.majorStars.length > 0 && (
              <span className="text-(--color-text-muted)">
                {" "}
                / 主星 {s.currentDecade.majorStars.join(", ")}
              </span>
            )}
          </p>
        </div>
      )}

      {/* 流年/流月/流日 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-(length:--text-caption)">
        {s.currentYear && (
          <MiniRunGen label="流年" data={s.currentYear} />
        )}
        {s.currentMonth && (
          <MiniRunGen label="流月" data={s.currentMonth} />
        )}
        {s.currentDay && <MiniRunGen label="流日" data={s.currentDay} />}
      </div>
    </section>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-(--color-border-subtle) bg-(--color-bg-elevated) p-3">
      <p className="font-mincho text-(length:--text-micro) tracking-(--tracking-jp-wide) text-(--color-text-muted)">
        {label}
      </p>
      <p className="font-mincho text-(length:--text-body) text-(--color-text-primary) mt-1">
        {value}
      </p>
    </div>
  );
}

function MiniRunGen({
  label,
  data,
}: {
  label: string;
  data: { palace: string; majorStars: string[] };
}) {
  return (
    <div className="rounded-sm border border-(--color-border-subtle) bg-(--color-bg-elevated) p-3">
      <p className="font-mincho text-(length:--text-micro) text-(--color-text-muted) tracking-(--tracking-jp-wide)">
        {label}
      </p>
      <p className="font-mincho text-(length:--text-body) text-(--color-text-primary) mt-0.5">
        {data.palace}
      </p>
      {data.majorStars.length > 0 && (
        <p className="font-gothic text-(length:--text-micro) text-(--color-text-muted)">
          {data.majorStars.join(", ")}
        </p>
      )}
    </div>
  );
}
