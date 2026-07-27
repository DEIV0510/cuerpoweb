'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { Check, Star } from 'lucide-react';
import { GarmentIcon } from '@/components/wardrobe/GarmentIcon';
import { CATEGORY_LABELS } from '@/data/wardrobe-content';
import {
  computeProgress,
  type BasicsGroup,
  type PlannedBasic,
} from '@/lib/wardrobe/wardrobe-plan';
import {
  readOwnedBasics,
  saveOwnedBasics,
  subscribeToAnalysis,
} from '@/lib/storage';
import { cn } from '@/lib/utils';

interface BasicsChecklistProps {
  groups: BasicsGroup[];
  basics: PlannedBasic[];
}

function getServerSnapshot(): string {
  return '[]';
}

/**
 * Checklist de básicos: la persona marca lo que ya tiene y ve su progreso y
 * los esenciales que le faltan. El estado se guarda en el dispositivo.
 */
export function BasicsChecklist({ groups, basics }: BasicsChecklistProps) {
  const rawOwned = useSyncExternalStore(
    subscribeToAnalysis,
    () => JSON.stringify(readOwnedBasics()),
    getServerSnapshot,
  );

  const owned = useMemo<Set<string>>(() => {
    try {
      const parsed: unknown = JSON.parse(rawOwned);
      return new Set(Array.isArray(parsed) ? (parsed as string[]) : []);
    } catch {
      return new Set();
    }
  }, [rawOwned]);

  // Solo para animar el aria-live sin recomputar el store.
  const [, force] = useState(0);

  function toggle(id: string) {
    const next = new Set(owned);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    saveOwnedBasics([...next]);
    force((value) => value + 1);
  }

  const progress = computeProgress(basics, owned);

  return (
    <section aria-labelledby="checklist-basicos" className="flex flex-col gap-4">
      <div>
        <h2 id="checklist-basicos" className="text-2xl">
          Tu checklist de básicos
        </h2>
        <p className="mt-1.5 text-[0.95rem] text-muted">
          Marca lo que ya tienes. La estrella señala los esenciales para tu estilo.
        </p>
      </div>

      <div className="rounded-card border border-line bg-surface p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[0.95rem] font-medium text-ink">Tu armario base</p>
          <p aria-live="polite" className="text-sm text-muted">
            <strong className="text-ink">{progress.owned}</strong> de {progress.total}
          </p>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-shell">
          <div
            className="bg-rose-gradient h-full rounded-r-full transition-[width] duration-500"
            style={{ width: `${progress.percent}%` }}
          />
        </div>

        {progress.missingEssentials.length > 0 ? (
          <p className="mt-3 text-sm text-muted">
            Te faltan {progress.missingEssentials.length} esenciales. Empieza por
            ahí: {progress.missingEssentials.slice(0, 3).map((b) => b.name.toLowerCase()).join(', ')}
            {progress.missingEssentials.length > 3 ? '…' : '.'}
          </p>
        ) : progress.owned > 0 ? (
          <p className="mt-3 text-sm text-success">
            ¡Tienes todos los esenciales de tu estilo!
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <div key={group.category}>
            <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-brand-dark">
              {CATEGORY_LABELS[group.category]}
            </h3>
            <ul className="mt-2.5 flex flex-col gap-2">
              {group.items.map((basic) => {
                const isOwned = owned.has(basic.id);
                return (
                  <li key={basic.id}>
                    <button
                      type="button"
                      onClick={() => toggle(basic.id)}
                      aria-pressed={isOwned}
                      className={cn(
                        'flex min-h-14 w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-colors',
                        isOwned
                          ? 'border-brand-soft bg-brand-soft/25'
                          : 'border-line bg-surface hover:border-sand',
                      )}
                    >
                      <span className="h-10 w-10 shrink-0">
                        <GarmentIcon garment={basic.garment} />
                      </span>
                      <span className="flex-1">
                        <span className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              'text-[1rem] font-medium',
                              isOwned ? 'text-brand-dark line-through' : 'text-ink',
                            )}
                          >
                            {basic.name}
                          </span>
                          {basic.essential ? (
                            <Star
                              aria-label="Esencial para tu estilo"
                              className="h-3.5 w-3.5 shrink-0 fill-brand text-brand"
                            />
                          ) : null}
                        </span>
                        <span className="mt-0.5 block text-[0.85rem] text-muted">
                          {basic.note}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                          isOwned ? 'border-brand bg-brand text-white' : 'border-line',
                        )}
                      >
                        {isOwned ? <Check className="h-3.5 w-3.5" /> : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
