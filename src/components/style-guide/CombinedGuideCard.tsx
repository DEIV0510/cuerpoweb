import {
  Footprints,
  Layers,
  Ruler,
  Shirt,
  Sparkle,
  Target,
  Wand2,
} from 'lucide-react';
import type { CombinedGuide, FormulaItem } from '@/lib/style-guide/combined-guide';

interface CombinedGuideCardProps {
  guide: CombinedGuide;
}

const ICONS: Record<FormulaItem['id'], typeof Ruler> = {
  rise: Ruler,
  tuck: Shirt,
  jacket: Layers,
  shoe: Footprints,
  neckline: Sparkle,
  focus: Target,
};

/**
 * Tarjeta con la fórmula personal: el cruce entre la silueta (contornos) y la
 * proporción vertical (alturas), convertido en seis decisiones concretas.
 */
export function CombinedGuideCard({ guide }: CombinedGuideCardProps) {
  return (
    <section
      aria-labelledby="formula-personal"
      className="rounded-card border border-sand bg-surface p-5 shadow-card sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft">
          <Wand2 aria-hidden="true" className="h-5 w-5 text-brand-dark" />
        </span>
        <div>
          <h2 id="formula-personal" className="text-2xl leading-tight">
            Tu fórmula personal
          </h2>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
            Silueta + proporción vertical
          </p>
        </div>
      </div>

      <p className="mt-4 text-[1.05rem] font-medium text-ink">{guide.headline}</p>
      <p className="mt-2 text-[0.975rem] text-muted">{guide.summary}</p>

      <ul className="mt-5 flex flex-col gap-2.5">
        {guide.formula.map((entry) => {
          const Icon = ICONS[entry.id];

          return (
            <li
              key={entry.id}
              className="flex gap-3 rounded-2xl border border-line bg-shell p-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface">
                <Icon aria-hidden="true" className="h-4 w-4 text-brand" />
              </span>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.12em] text-faint">
                  {entry.label}
                </p>
                <p className="mt-0.5 text-[1.05rem] font-semibold text-ink">
                  {entry.value}
                </p>
                <p className="mt-1 text-[0.9rem] text-muted">{entry.reason}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 rounded-2xl bg-brand-soft/45 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-dark">
          Reglas de tu combinación
        </p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {guide.tips.map((tip) => (
            <li key={tip} className="flex gap-2.5 text-[0.975rem] text-ink">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
              />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
