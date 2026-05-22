import type { KyuseiResult } from "@/lib/fortune/types";
import { formatDirectionResult } from "@/lib/fortune/labels";
import { Divider } from "@/components/divider";

const INTENSITY_BADGE: Record<
  ReturnType<typeof formatDirectionResult>["intensity"],
  string
> = {
  "strong-favor": "border-(--color-accent-emphasis)/60 text-(--color-accent-emphasis)",
  favor: "border-(--color-accent-primary)/60 text-(--color-accent-primary)",
  "mild-favor": "border-(--color-accent-primary)/30 text-(--color-text-secondary)",
  neutral: "border-(--color-border-subtle) text-(--color-text-muted)",
  "mild-caution": "border-(--color-accent-warning)/30 text-(--color-text-secondary)",
  caution: "border-(--color-accent-warning)/60 text-(--color-accent-warning)",
  "strong-caution":
    "border-(--color-accent-warning)/80 text-(--color-accent-warning) bg-(--color-accent-warning)/5",
};

export function KyuseiSummary({ k }: { k: KyuseiResult }) {
  return (
    <section
      aria-labelledby="kyusei-title"
      className="rounded-sm border border-(--color-border-subtle) bg-(--color-bg-surface) p-6 md:p-8 space-y-(--spacing-ma-md)"
    >
      <header>
        <p className="font-mincho text-(length:--text-caption) tracking-(--tracking-jp-decorative) text-(--color-text-muted) uppercase">
          九星気学
        </p>
        <h2
          id="kyusei-title"
          className="font-mincho text-(length:--text-h2) tracking-(--tracking-jp-normal) mt-1"
        >
          三命星
        </h2>
      </header>

      <Divider />

      <div className="grid grid-cols-3 gap-3">
        <StarCard label="本命星" star={k.honmeisei} />
        <StarCard label="月命星" star={k.getsumeisei} />
        <StarCard label="日命星" star={k.nichimeisei} />
      </div>

      {/* 方位 */}
      <div>
        <h3 className="font-mincho text-(length:--text-caption) tracking-(--tracking-jp-wide) text-(--color-text-muted) mb-2">
          今期の方位
        </h3>
        <ul className="space-y-1.5">
          {k.directions.map((d) => {
            const f = formatDirectionResult(d);
            return (
              <li
                key={d.direction}
                className={`flex items-center gap-3 rounded-sm border px-3 py-2 text-(length:--text-caption) ${INTENSITY_BADGE[f.intensity]}`}
              >
                <span className="font-mincho min-w-12">{d.direction}</span>
                <span className="font-gothic">{f.display}</span>
                {f.detail && (
                  <span className="font-gothic text-(length:--text-micro) text-(--color-text-muted) ml-auto">
                    {f.detail}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function StarCard({ label, star }: { label: string; star: string }) {
  return (
    <div className="rounded-sm border border-(--color-border-subtle) bg-(--color-bg-elevated) p-3">
      <p className="font-mincho text-(length:--text-micro) tracking-(--tracking-jp-wide) text-(--color-text-muted)">
        {label}
      </p>
      <p className="font-mincho text-(length:--text-h3) text-(--color-text-primary) mt-1">
        {star}
      </p>
    </div>
  );
}
