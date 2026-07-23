'use client';

import { useMemo, useSyncExternalStore } from 'react';
import {
  parseProportions,
  parseStoredAnalysis,
  readRawAnalysis,
  readRawProportions,
  subscribeToAnalysis,
} from '@/lib/storage';
import { buildCombinedGuide, type CombinedGuide } from '@/lib/style-guide/combined-guide';
import type { StoredAnalysis } from '@/types/body-shape';
import type { StoredProportions } from '@/lib/storage';

/** Valor devuelto en servidor y durante la hidratación. */
const PENDING = '__pendiente__';

function getServerSnapshot(): string {
  return PENDING;
}

export interface CombinedGuideState {
  /** Todavía no se ha leído el almacenamiento del dispositivo. */
  pending: boolean;
  analysis: StoredAnalysis | null;
  proportions: StoredProportions | null;
  /** Solo existe cuando los dos análisis están hechos. */
  guide: CombinedGuide | null;
}

/**
 * Lee los dos análisis guardados y, si ambos existen, construye la guía
 * combinada. Usa `useSyncExternalStore` para no romper la hidratación.
 */
export function useCombinedGuide(): CombinedGuideState {
  const rawAnalysis = useSyncExternalStore(
    subscribeToAnalysis,
    readRawAnalysis,
    getServerSnapshot,
  );

  const rawProportions = useSyncExternalStore(
    subscribeToAnalysis,
    readRawProportions,
    getServerSnapshot,
  );

  const analysis = useMemo(
    () => (rawAnalysis === PENDING ? null : parseStoredAnalysis(rawAnalysis)),
    [rawAnalysis],
  );

  const proportions = useMemo(
    () => (rawProportions === PENDING ? null : parseProportions(rawProportions)),
    [rawProportions],
  );

  const guide = useMemo(
    () =>
      analysis && proportions
        ? buildCombinedGuide(analysis.result, proportions.result)
        : null,
    [analysis, proportions],
  );

  return {
    pending: rawAnalysis === PENDING || rawProportions === PENDING,
    analysis,
    proportions,
    guide,
  };
}
