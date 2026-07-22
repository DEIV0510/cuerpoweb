import { SilhouetteIllustration } from '@/components/ui/SilhouetteIllustration';
import { getBodyShapeProfile } from '@/data/body-shapes';
import { formatCm } from '@/lib/body-shape/calculations';
import { formatLongDate } from '@/lib/utils';
import type { BodyShapeResult } from '@/types/body-shape';

interface ResultHeroProps {
  result: BodyShapeResult;
  createdAt: string;
}

/** Encabezado del resultado: silueta, resumen y medidas registradas. */
export function ResultHero({ result, createdAt }: ResultHeroProps) {
  const profile = getBodyShapeProfile(result.type);
  const { bust, waist, hips } = result.measurements;

  return (
    <section
      aria-labelledby="titulo-resultado"
      className="rounded-card border border-line bg-surface p-6 sm:p-8"
    >
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="mx-auto w-32 shrink-0 sm:mx-0 sm:w-36">
          <SilhouetteIllustration
            proportions={profile.illustration}
            title={`Ilustración de la silueta ${profile.name}`}
          />
        </div>

        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
            Tu silueta predominante es
          </p>
          <h1 id="titulo-resultado" className="mt-2 text-4xl sm:text-5xl">
            {profile.name}
          </h1>
          {profile.alternativeName ? (
            <p className="mt-1 text-sm text-muted">
              También conocida como {profile.alternativeName.toLowerCase()}.
            </p>
          ) : null}

          <p className="mt-4 text-lg text-ink">{result.explanation}</p>

          <dl className="mt-6 flex flex-wrap gap-2">
            {[
              { label: 'Busto', value: bust },
              { label: 'Cintura', value: waist },
              { label: 'Cadera', value: hips },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-baseline gap-2 rounded-full border border-line bg-shell px-4 py-2"
              >
                <dt className="text-sm text-muted">{item.label}</dt>
                <dd className="font-semibold text-ink">{formatCm(item.value)} cm</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 text-sm text-muted">
            Análisis realizado el {formatLongDate(createdAt)}.
          </p>
        </div>
      </div>

      {result.warnings.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-brand-soft bg-brand-soft/25 p-4 text-[0.95rem] text-brand-dark">
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
