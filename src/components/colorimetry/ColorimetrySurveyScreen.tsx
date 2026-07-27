'use client';

import { useSyncExternalStore } from 'react';
import { ColorimetrySurvey } from '@/components/colorimetry/ColorimetrySurvey';
import { parseColorimetryDraft, readRawColorimetryDraft } from '@/lib/storage';

const PENDING = '__pendiente__';

function subscribe(): () => void {
  return () => {};
}

function getServerSnapshot(): string {
  return PENDING;
}

/** Lee el progreso guardado antes de montar el cuestionario. */
export function ColorimetrySurveyScreen() {
  const raw = useSyncExternalStore(subscribe, readRawColorimetryDraft, getServerSnapshot);

  if (raw === PENDING) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center px-gutter">
        <p aria-live="polite" className="text-muted">
          Preparando tu análisis…
        </p>
      </div>
    );
  }

  return <ColorimetrySurvey initialDraft={parseColorimetryDraft(raw)} />;
}
