'use client';

import { useSyncExternalStore } from 'react';
import { WardrobeSurvey } from '@/components/wardrobe/WardrobeSurvey';
import { parseWardrobeDraft, readRawWardrobeDraft } from '@/lib/storage';

const PENDING = '__pendiente__';

function subscribe(): () => void {
  return () => {};
}

function getServerSnapshot(): string {
  return PENDING;
}

/** Lee el progreso guardado antes de montar la encuesta. */
export function WardrobeSurveyScreen() {
  const raw = useSyncExternalStore(subscribe, readRawWardrobeDraft, getServerSnapshot);

  if (raw === PENDING) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center px-gutter">
        <p aria-live="polite" className="text-muted">
          Preparando tu encuesta…
        </p>
      </div>
    );
  }

  return <WardrobeSurvey initialDraft={parseWardrobeDraft(raw)} />;
}
