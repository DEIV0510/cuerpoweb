import Link from 'next/link';
import { Check, Minus } from 'lucide-react';
import type { BodyShapeResult } from '@/types/body-shape';
import { cn } from '@/lib/utils';

interface RuleExplanationProps {
  result: BodyShapeResult;
}

/** Detalle de las reglas evaluadas y de la que determinó el resultado. */
export function RuleExplanation({ result }: RuleExplanationProps) {
  return (
    <section
      aria-labelledby="explicacion-regla"
      className="rounded-card border border-line bg-surface p-6 sm:p-7"
    >
      <h2 id="explicacion-regla" className="text-2xl">
        Por qué obtuviste este resultado
      </h2>
      <p className="mt-2 text-[0.95rem] text-muted">
        El algoritmo evalúa cinco reglas en un orden fijo y se queda con la primera
        que se cumple. B es el busto, C la cintura y H la cadera.
      </p>

      <ol className="mt-6 flex flex-col gap-3">
        {result.matchedRules.map((rule) => (
          <li
            key={rule.id}
            className={cn(
              'rounded-2xl border p-4',
              rule.decisive
                ? 'border-brand bg-brand-soft/25'
                : 'border-line bg-shell',
            )}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                  rule.matched ? 'bg-brand text-white' : 'bg-line text-muted',
                )}
                aria-hidden="true"
              >
                {rule.matched ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Minus className="h-3.5 w-3.5" />
                )}
              </span>
              <span className="font-medium text-ink">
                Regla {rule.order}: {rule.name}
              </span>
              <code className="rounded-full bg-surface px-3 py-0.5 text-xs text-muted">
                {rule.condition}
              </code>
              {rule.decisive ? (
                <span className="rounded-full bg-brand px-3 py-0.5 text-xs font-semibold text-white">
                  Resultado
                </span>
              ) : (
                <span className="sr-only">
                  {rule.matched ? 'Condición cumplida' : 'Condición no cumplida'}
                </span>
              )}
            </div>
            <p className="mt-2 text-[0.95rem] text-muted">{rule.detail}</p>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-sm text-muted">
        Algoritmo versión {result.algorithmVersion}.{' '}
        <Link
          href="/metodologia"
          className="font-medium text-brand-dark underline underline-offset-4"
        >
          Ver la metodología completa
        </Link>
        .
      </p>
    </section>
  );
}
