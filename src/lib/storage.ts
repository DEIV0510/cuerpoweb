import type {
  BodyShapeResult,
  MeasurementSource,
  StoredAnalysis,
} from '@/types/body-shape';
import type { EightHeadsResult } from '@/lib/proportions/eight-heads';
import type { StyleProfile } from '@/lib/wardrobe/style-profile';

/** Clave única de esta aplicación en localStorage. */
export const STORAGE_KEY = 'alma-silueta-corporal:last-analysis';

/** Clave del progreso temporal del formulario. */
export const DRAFT_KEY = 'alma-silueta-corporal:draft';

/** Clave del análisis de proporción vertical (técnica de las 8 cabezas). */
export const PROPORTIONS_KEY = 'alma-silueta-corporal:proportions';

/** Clave del progreso temporal del análisis de proporciones. */
export const PROPORTIONS_DRAFT_KEY = 'alma-silueta-corporal:proportions-draft';

/** Clave del perfil de estilo (módulo Mi Armario). */
export const WARDROBE_KEY = 'alma-silueta-corporal:wardrobe';

/** Clave del progreso temporal de la encuesta de estilo. */
export const WARDROBE_DRAFT_KEY = 'alma-silueta-corporal:wardrobe-draft';

/** Clave de los básicos que la persona marcó como que ya tiene. */
export const WARDROBE_OWNED_KEY = 'alma-silueta-corporal:wardrobe-owned';

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
  source: MeasurementSource = 'manual',
): StoredAnalysis | null {
  if (!isBrowser()) return null;

  const payload: StoredAnalysis = {
    storageVersion: STORAGE_VERSION,
    createdAt,
    source,
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

/** Progreso temporal del formulario, para no perder lo escrito. */
export interface MeasurementDraft {
  /** Índice del paso en el que quedó la persona. */
  step: number;
  values: {
    bust: string;
    waist: string;
    hips: string;
    height: string;
  };
}

function isDraft(value: unknown): value is MeasurementDraft {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Partial<MeasurementDraft>;
  if (typeof candidate.step !== 'number') return false;
  if (!candidate.values || typeof candidate.values !== 'object') return false;

  const { bust, waist, hips, height } = candidate.values;
  return [bust, waist, hips, height].every((item) => typeof item === 'string');
}

/** Lee el borrador tal cual está guardado (snapshot estable para React). */
export function readRawDraft(): string | null {
  if (!isBrowser()) return null;

  try {
    return window.localStorage.getItem(DRAFT_KEY);
  } catch {
    return null;
  }
}

/** Convierte el texto guardado en un borrador válido, o en null. */
export function parseDraft(raw: string | null): MeasurementDraft | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isDraft(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Guarda el progreso del formulario. Nunca lanza errores. */
export function saveDraft(draft: MeasurementDraft): void {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Sin almacenamiento disponible: el formulario sigue funcionando.
  }
}

/** Elimina el progreso temporal del formulario. */
export function clearDraft(): void {
  if (!isBrowser()) return;

  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Nada que hacer.
  }
}

/* ------------------------------------------------------------------
   Proporción vertical · técnica de las 8 cabezas
   ------------------------------------------------------------------ */

/** Análisis de proporción vertical guardado en el dispositivo. */
export interface StoredProportions {
  storageVersion: number;
  createdAt: string;
  result: EightHeadsResult;
}

/** Progreso temporal del formulario de proporciones. */
export interface ProportionsDraft {
  step: number;
  values: {
    head: string;
    torso: string;
    rise: string;
    legs: string;
  };
}

function isStoredProportions(value: unknown): value is StoredProportions {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Partial<StoredProportions>;
  if (candidate.storageVersion !== STORAGE_VERSION) return false;
  if (typeof candidate.createdAt !== 'string') return false;

  const result = candidate.result as Partial<EightHeadsResult> | undefined;
  if (!result || typeof result !== 'object') return false;
  if (typeof result.headCm !== 'number') return false;
  if (typeof result.totalHeads !== 'number') return false;
  if (!result.segments || typeof result.segments.torso?.heads !== 'number') return false;

  return true;
}

function isProportionsDraft(value: unknown): value is ProportionsDraft {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Partial<ProportionsDraft>;
  if (typeof candidate.step !== 'number') return false;
  if (!candidate.values || typeof candidate.values !== 'object') return false;

  const { head, torso, rise, legs } = candidate.values;
  return [head, torso, rise, legs].every((item) => typeof item === 'string');
}

/** Guarda el análisis de proporción vertical. */
export function saveProportions(
  result: EightHeadsResult,
  createdAt: string = new Date().toISOString(),
): StoredProportions | null {
  if (!isBrowser()) return null;

  const payload: StoredProportions = {
    storageVersion: STORAGE_VERSION,
    createdAt,
    result,
  };

  try {
    window.localStorage.setItem(PROPORTIONS_KEY, JSON.stringify(payload));
    notifyChange();
    return payload;
  } catch {
    return null;
  }
}

/** Lee el texto crudo del análisis de proporciones. */
export function readRawProportions(): string | null {
  if (!isBrowser()) return null;

  try {
    return window.localStorage.getItem(PROPORTIONS_KEY);
  } catch {
    return null;
  }
}

/** Convierte el texto guardado en un análisis de proporciones válido. */
export function parseProportions(raw: string | null): StoredProportions | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isStoredProportions(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Guarda el progreso del formulario de proporciones. */
export function saveProportionsDraft(draft: ProportionsDraft): void {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(PROPORTIONS_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Sin almacenamiento disponible: el formulario sigue funcionando.
  }
}

/** Lee el texto crudo del borrador de proporciones. */
export function readRawProportionsDraft(): string | null {
  if (!isBrowser()) return null;

  try {
    return window.localStorage.getItem(PROPORTIONS_DRAFT_KEY);
  } catch {
    return null;
  }
}

/** Convierte el texto guardado en un borrador de proporciones válido. */
export function parseProportionsDraft(raw: string | null): ProportionsDraft | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isProportionsDraft(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Elimina el análisis de proporciones y su borrador. */
export function clearProportions(): boolean {
  if (!isBrowser()) return false;

  try {
    const existed =
      window.localStorage.getItem(PROPORTIONS_KEY) !== null ||
      window.localStorage.getItem(PROPORTIONS_DRAFT_KEY) !== null;
    window.localStorage.removeItem(PROPORTIONS_KEY);
    window.localStorage.removeItem(PROPORTIONS_DRAFT_KEY);
    notifyChange();
    return existed;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------
   Mi Armario · perfil de estilo, encuesta y básicos
   ------------------------------------------------------------------ */

/** Perfil de estilo guardado en el dispositivo. */
export interface StoredWardrobe {
  storageVersion: number;
  createdAt: string;
  profile: StyleProfile;
}

/** Progreso temporal de la encuesta de estilo. */
export interface WardrobeDraft {
  step: number;
  answers: Record<string, unknown>;
}

function isStoredWardrobe(value: unknown): value is StoredWardrobe {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Partial<StoredWardrobe>;
  if (candidate.storageVersion !== STORAGE_VERSION) return false;
  if (typeof candidate.createdAt !== 'string') return false;

  const profile = candidate.profile as Partial<StyleProfile> | undefined;
  if (!profile || typeof profile !== 'object') return false;
  if (typeof profile.archetype !== 'string') return false;
  if (!Array.isArray(profile.occasions)) return false;

  return true;
}

function isWardrobeDraft(value: unknown): value is WardrobeDraft {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<WardrobeDraft>;
  return typeof candidate.step === 'number' && typeof candidate.answers === 'object';
}

/** Guarda el perfil de estilo. */
export function saveWardrobe(
  profile: StyleProfile,
  createdAt: string = new Date().toISOString(),
): StoredWardrobe | null {
  if (!isBrowser()) return null;

  const payload: StoredWardrobe = {
    storageVersion: STORAGE_VERSION,
    createdAt,
    profile,
  };

  try {
    window.localStorage.setItem(WARDROBE_KEY, JSON.stringify(payload));
    notifyChange();
    return payload;
  } catch {
    return null;
  }
}

/** Lee el texto crudo del perfil de estilo. */
export function readRawWardrobe(): string | null {
  if (!isBrowser()) return null;

  try {
    return window.localStorage.getItem(WARDROBE_KEY);
  } catch {
    return null;
  }
}

/** Convierte el texto guardado en un perfil de estilo válido. */
export function parseWardrobe(raw: string | null): StoredWardrobe | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isStoredWardrobe(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Guarda el progreso de la encuesta de estilo. */
export function saveWardrobeDraft(draft: WardrobeDraft): void {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(WARDROBE_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Sin almacenamiento disponible: la encuesta sigue funcionando.
  }
}

/** Lee el texto crudo del borrador de la encuesta. */
export function readRawWardrobeDraft(): string | null {
  if (!isBrowser()) return null;

  try {
    return window.localStorage.getItem(WARDROBE_DRAFT_KEY);
  } catch {
    return null;
  }
}

/** Convierte el texto guardado en un borrador de encuesta válido. */
export function parseWardrobeDraft(raw: string | null): WardrobeDraft | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isWardrobeDraft(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Lee el conjunto de básicos que la persona marcó como que ya tiene. */
export function readOwnedBasics(): string[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(WARDROBE_OWNED_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

/** Guarda el conjunto de básicos que la persona ya tiene. */
export function saveOwnedBasics(ids: string[]): void {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(WARDROBE_OWNED_KEY, JSON.stringify(ids));
    notifyChange();
  } catch {
    // Nada que hacer.
  }
}

/** Elimina el perfil de estilo, su borrador y los básicos marcados. */
export function clearWardrobe(): boolean {
  if (!isBrowser()) return false;

  try {
    const existed =
      window.localStorage.getItem(WARDROBE_KEY) !== null ||
      window.localStorage.getItem(WARDROBE_DRAFT_KEY) !== null ||
      window.localStorage.getItem(WARDROBE_OWNED_KEY) !== null;
    window.localStorage.removeItem(WARDROBE_KEY);
    window.localStorage.removeItem(WARDROBE_DRAFT_KEY);
    window.localStorage.removeItem(WARDROBE_OWNED_KEY);
    notifyChange();
    return existed;
  } catch {
    return false;
  }
}

/** Elimina todo lo que la aplicación guarda en el dispositivo. */
export function clearAllData(): boolean {
  const hadAnalysis = clearAnalysis();
  const hadProportions = clearProportions();
  const hadWardrobe = clearWardrobe();
  return hadAnalysis || hadProportions || hadWardrobe;
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
    const existed =
      window.localStorage.getItem(STORAGE_KEY) !== null ||
      window.localStorage.getItem(DRAFT_KEY) !== null;
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(DRAFT_KEY);
    notifyChange();
    return existed;
  } catch {
    return false;
  }
}
