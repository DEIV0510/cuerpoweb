'use client';

import { useSyncExternalStore } from 'react';
import { ProportionsFlow } from '@/components/proportions/ProportionsFlow';
import { parseProportionsDraft, readRawProportionsDraft } from '@/lib/storage';

/** Marcador usado en servidor y durante la hidratación. */
const PENDING = '__pendiente__';

function subscribe(): () => void {
  return () => {};
}

function getServerSnapshot(): string {
  return PENDING;
}

/** Lee el progreso guardado antes de montar el flujo de proporciones. */
export function ProportionsScreen() {
  const raw = useSyncExternalStore(subscribe, readRawProportionsDraft, getServerSnapshot);

  if (raw === PENDING) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center px-gutter">
        <p aria-live="polite" className="text-muted">
          Preparando tu análisis…
        </p>
      </div>
    );
  }

  return <ProportionsFlow initialDraft={parseProportionsDraft(raw)} />;
}
