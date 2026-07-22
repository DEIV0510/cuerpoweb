import Link from 'next/link';
import { Check, Minus } from 'lucide-react';
import type { BodyShapeResult } from '@/types/body-shape';
import { cn } from '@/lib/utils';

interface RuleExplanationProps {
  result: BodyShapeResult;
}

/**
 * Explicación del resultado: primero la frase personalizada y después el
 * detalle de las cinco reglas evaluadas.
 */
export function RuleExplanation({ result }: RuleExplanationProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[1.05rem] leading-relaxed text-ink">{result.explanation}</p>

      <p className="text-sm text-faint">
        El algoritmo evalúa cinco reglas en un orden fijo y se queda con la primera
        que se cumple. B es el busto, C la cintura y H la cadera.
      </p>

      <ol className="flex flex-col gap-2.5">
        {result.matchedRules.map((rule) => (
          <li
            key={rule.id}
            className={cn(
              'rounded-2xl border p-4',
              rule.decisive ? 'border-brand bg-brand-soft/30' : 'border-line bg-shell',
            )}
          >
            <div className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className={cn(
                  'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                  rule.matched ? 'bg-brand text-white' : 'bg-line text-faint',
                )}
              >
                {rule.matched ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Minus className="h-3.5 w-3.5" />
                )}
              </span>

              <div className="flex-1">
                <p className="font-medium text-ink">
                  Regla {rule.order}: {rule.name}
                  {rule.decisive ? (
                    <span className="ml-2 rounded-full bg-brand px-2.5 py-0.5 align-middle text-[0.7rem] font-semibold text-white">
                      Resultado
                    </span>
                  ) : (
                    <span className="sr-only">
                      {rule.matched ? ' · condición cumplida' : ' · condición no cumplida'}
                    </span>
                  )}
                </p>
                <code className="mt-1 inline-block break-words rounded-full bg-surface px-3 py-0.5 text-xs text-muted">
                  {rule.condition}
                </code>
                <p className="mt-2 text-[0.9rem] text-muted">{rule.detail}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <p className="text-sm text-faint">
        Algoritmo versión {result.algorithmVersion}.{' '}
        <Link
          href="/metodologia"
          className="inline-flex min-h-11 items-center font-medium text-brand-dark underline underline-offset-4"
        >
          Ver la metodología
        </Link>
        .
      </p>
    </div>
  );
}
