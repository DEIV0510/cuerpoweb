import {
  CAPSULES,
  CATEGORY_ORDER,
  WARDROBE_BASICS,
  type Capsule,
  type GarmentCategory,
  type WardrobeBasic,
} from '@/data/wardrobe-content';
import type { Occasion, StyleProfile } from '@/lib/wardrobe/style-profile';

/**
 * Arma el plan de armario a partir del perfil de estilo.
 *
 * Filtra los básicos por las ocasiones de la persona, marca los que son
 * esenciales para su arquetipo y selecciona las cápsulas que encajan con su
 * estilo y su tono. Función pura: mismo perfil, mismo plan.
 */

/** Un básico ya evaluado para esta persona. */
export interface PlannedBasic extends WardrobeBasic {
  /** Es imprescindible para su arquetipo de estilo. */
  essential: boolean;
}

/** Grupo de básicos por categoría. */
export interface BasicsGroup {
  category: GarmentCategory;
  items: PlannedBasic[];
}

export interface WardrobePlan {
  groups: BasicsGroup[];
  /** Todos los básicos en una lista plana, esenciales primero. */
  basics: PlannedBasic[];
  capsules: Capsule[];
  /** Cuántos básicos recomienda el plan. */
  totalBasics: number;
}

/** Comprueba si dos listas de ocasiones se solapan. */
function sharesOccasion(occasions: Occasion[], selected: Occasion[]): boolean {
  return occasions.some((occasion) => selected.includes(occasion));
}

/**
 * Selecciona y ordena los básicos:
 * 1. Solo los que sirven para alguna de las ocasiones elegidas.
 * 2. Los esenciales del arquetipo van primero.
 */
export function selectBasics(profile: StyleProfile): PlannedBasic[] {
  return WARDROBE_BASICS.filter((basic) =>
    sharesOccasion(basic.occasions, profile.occasions),
  )
    .map((basic) => ({
      ...basic,
      essential: basic.essentialFor.includes(profile.archetype),
    }))
    .sort((a, b) => {
      if (a.essential !== b.essential) return a.essential ? -1 : 1;
      // Dentro del mismo nivel, se respeta el orden de categorías.
      return CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
    });
}

/** Agrupa los básicos por categoría, respetando el orden canónico. */
export function groupBasics(basics: PlannedBasic[]): BasicsGroup[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: basics.filter((basic) => basic.category === category),
  })).filter((group) => group.items.length > 0);
}

/**
 * Puntúa una cápsula según cuánto encaja con el perfil.
 * Mayor puntaje = más relevante.
 */
function scoreCapsule(capsule: Capsule, profile: StyleProfile): number {
  let score = 0;

  if (capsule.styles.includes(profile.archetype)) score += 3;
  if (profile.occasions.includes(capsule.occasion)) score += 3;
  if (capsule.tone === 'both' || capsule.tone === profile.tone) score += 1;

  return score;
}

/**
 * Selecciona las cápsulas relevantes: deben coincidir en estilo y en ocasión,
 * y se ordenan por afinidad con el perfil.
 */
export function selectCapsules(profile: StyleProfile): Capsule[] {
  return CAPSULES.filter(
    (capsule) =>
      capsule.styles.includes(profile.archetype) &&
      profile.occasions.includes(capsule.occasion),
  )
    .map((capsule) => ({ capsule, score: scoreCapsule(capsule, profile) }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Desempate estable por id, para que el resultado no cambie al repetir.
      return a.capsule.id.localeCompare(b.capsule.id);
    })
    .map((entry) => entry.capsule);
}

/** Construye el plan completo de armario. */
export function buildWardrobePlan(profile: StyleProfile): WardrobePlan {
  const basics = selectBasics(profile);

  return {
    groups: groupBasics(basics),
    basics,
    capsules: selectCapsules(profile),
    totalBasics: basics.length,
  };
}

/** Progreso del checklist: cuántos básicos tiene ya la persona. */
export interface WardrobeProgress {
  owned: number;
  total: number;
  /** Porcentaje redondeado, de 0 a 100. */
  percent: number;
  /** Esenciales que aún faltan, para sugerir por dónde empezar. */
  missingEssentials: PlannedBasic[];
}

/** Calcula el progreso a partir del conjunto de ids que la persona ya tiene. */
export function computeProgress(
  basics: PlannedBasic[],
  ownedIds: ReadonlySet<string>,
): WardrobeProgress {
  const total = basics.length;
  const owned = basics.filter((basic) => ownedIds.has(basic.id)).length;
  const percent = total === 0 ? 0 : Math.round((owned / total) * 100);
  const missingEssentials = basics.filter(
    (basic) => basic.essential && !ownedIds.has(basic.id),
  );

  return { owned, total, percent, missingEssentials };
}
