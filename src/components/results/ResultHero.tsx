import { SilhouetteIllustration } from '@/components/ui/SilhouetteIllustration';
import { getBodyShapeProfile } from '@/data/body-shapes';
import { formatCm } from '@/lib/body-shape/calculations';
import { formatLongDate } from '@/lib/utils';
import type { BodyShapeResult, MeasurementSource } from '@/types/body-shape';

interface ResultHeroProps {
  result: BodyShapeResult;
  createdAt: string;
  /** Cómo se obtuvieron las medidas. */
  source?: MeasurementSource;
}

/** Primera pantalla del resultado: silueta, nombre y resumen breve. */
export function ResultHero({ result, createdAt, source = 'manual' }: ResultHeroProps) {
  const profile = getBodyShapeProfile(result.type);
  const { bust, waist, hips } = result.measurements;

  const chips = [
    { label: 'Busto', value: bust },
    { label: 'Cintura', value: waist },
    { label: 'Cadera', value: hips },
  ];

  return (
    <section
      aria-labelledby="titulo-resultado"
      className="bg-blush-radial rounded-card border border-line px-5 py-7 text-center sm:px-8 sm:py-9"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
        Tu silueta predominante es
      </p>

      <h1 id="titulo-resultado" className="mt-2 text-[2.4rem] leading-none sm:text-5xl">
        {profile.name}
      </h1>

      <div className="mx-auto mt-5 w-28 sm:w-32">
        <SilhouetteIllustration
          proportions={profile.illustration}
          title={`Ilustración de la silueta ${profile.name}`}
        />
      </div>

      <p className="mx-auto mt-5 max-w-sm text-[1.05rem] text-muted">
        {profile.tagline}
      </p>

      <dl className="mt-5 flex flex-wrap justify-center gap-2">
        {chips.map((chip) => (
          <div
            key={chip.label}
            className="flex items-baseline gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2"
          >
            <dt className="text-xs text-faint">{chip.label}</dt>
            <dd className="text-sm font-semibold tabular-nums text-ink">
              {formatCm(chip.value)} cm
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-xs text-faint">
        Análisis del {formatLongDate(createdAt)}
      </p>

      {source === 'photo' ? (
        <p className="mx-auto mt-3 max-w-sm rounded-2xl bg-surface/80 px-4 py-3 text-sm text-muted">
          Medidas <strong className="text-ink">estimadas desde una foto</strong>.
          Confírmalas con una cinta métrica para afinar tu guía.
        </p>
      ) : null}

      {result.warnings.length > 0 ? (
        <div className="mt-5 rounded-2xl border border-sand bg-surface/80 p-4 text-left text-sm text-brand-dark">
          <p className="font-semibold">Ten en cuenta</p>
          <ul className="mt-2 flex flex-col gap-2">
            {result.warnings.map((warning) => (
              <li key={warning.code}>{warning.message}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
