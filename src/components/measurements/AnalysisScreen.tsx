'use client';

import { useSyncExternalStore } from 'react';
import { MeasurementFlow } from '@/components/measurements/MeasurementFlow';
import { parseDraft, readRawDraft } from '@/lib/storage';

/** Marcador usado en servidor y durante la hidratación. */
const PENDING = '__pendiente__';

/** El borrador solo se lee una vez, al montar: no hace falta suscripción. */
function subscribe(): () => void {
  return () => {};
}

function getServerSnapshot(): string {
  return PENDING;
}

/**
 * Lee el progreso guardado antes de montar el flujo.
 * Usa `useSyncExternalStore` para que el HTML del servidor y el del cliente
 * coincidan y no se produzcan errores de hidratación.
 */
export function AnalysisScreen() {
  const raw = useSyncExternalStore(subscribe, readRawDraft, getServerSnapshot);

  if (raw === PENDING) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center px-gutter">
        <p aria-live="polite" className="text-muted">
          Preparando tu análisis…
        </p>
      </div>
    );
  }

  return <MeasurementFlow initialDraft={parseDraft(raw)} />;
}
