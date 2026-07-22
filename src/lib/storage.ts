import type { BodyShapeResult, StoredAnalysis } from '@/types/body-shape';

/** Clave única de esta aplicación en localStorage. */
export const STORAGE_KEY = 'alma-silueta-corporal:last-analysis';

/** Versión del formato guardado. Permite descartar datos antiguos. */
export const STORAGE_VERSION = 1;

/** Evento que se emite cuando el análisis guardado cambia. */
export const STORAGE_EVENT = 'alma-silueta:storage-change';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function notifyChange(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

/** Comprueba de forma defensiva que lo leído tenga la forma esperada. */
function isStoredAnalysis(value: unknown): value is StoredAnalysis {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Partial<StoredAnalysis>;
  if (candidate.storageVersion !== STORAGE_VERSION) return false;
  if (typeof candidate.createdAt !== 'string') return false;

  const result = candidate.result as Partial<BodyShapeResult> | undefined;
  if (!result || typeof result !== 'object') return false;
  if (typeof result.type !== 'string') return false;
  if (typeof result.explanation !== 'string') return false;
  if (!result.measurements || typeof result.measurements.bust !== 'number') return false;
  if (!Array.isArray(result.matchedRules)) return false;
  if (!result.recommendations || typeof result.recommendations.id !== 'string') return false;

  return true;
}

/** Guarda el análisis en el dispositivo. Devuelve el registro guardado. */
export function saveAnalysis(
  result: BodyShapeResult,
  createdAt: string = new Date().toISOString(),
): StoredAnalysis | null {
  if (!isBrowser()) return null;

  const payload: StoredAnalysis = {
    storageVersion: STORAGE_VERSION,
    createdAt,
    result,
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    notifyChange();
    return payload;
  } catch {
    // Modo privado o almacenamiento lleno: la aplicación sigue funcionando.
    return null;
  }
}

/** Convierte el texto guardado en un análisis válido, o en null. */
export function parseStoredAnalysis(raw: string | null): StoredAnalysis | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isStoredAnalysis(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Lee el texto crudo guardado. Útil como snapshot estable para React. */
export function readRawAnalysis(): string | null {
  if (!isBrowser()) return null;

  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Lee el último análisis guardado. Devuelve null si no hay datos válidos. */
export function loadAnalysis(): StoredAnalysis | null {
  return parseStoredAnalysis(readRawAnalysis());
}

/**
 * Se suscribe a los cambios del análisis guardado, tanto en esta pestaña como
 * en otras pestañas del mismo navegador.
 */
export function subscribeToAnalysis(onChange: () => void): () => void {
  if (!isBrowser()) return () => {};

  window.addEventListener(STORAGE_EVENT, onChange);
  window.addEventListener('storage', onChange);

  return () => {
    window.removeEventListener(STORAGE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** Indica si hay un análisis guardado en el dispositivo. */
export function hasAnalysis(): boolean {
  return loadAnalysis() !== null;
}

/**
 * Elimina el análisis guardado.
 * Devuelve true si había algo que borrar. Nunca lanza errores.
 */
export function clearAnalysis(): boolean {
  if (!isBrowser()) return false;

  try {
    const existed = window.localStorage.getItem(STORAGE_KEY) !== null;
    window.localStorage.removeItem(STORAGE_KEY);
    notifyChange();
    return existed;
  } catch {
    return false;
  }
}
