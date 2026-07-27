import type { ColorFamily } from '@/lib/garment/color';

/**
 * Colorimetría personal por las cuatro estaciones.
 *
 * A partir de una autoevaluación guiada (subtono de la piel, cómo te ilumina
 * el oro o la plata, tu cabello y ojos naturales…) se deduce la estación de
 * color y su paleta. No usa inteligencia artificial ni la cámara: son reglas
 * fijas sobre respuestas, así que es una orientación, no un diagnóstico.
 */

export const SEASON_VERSION = '1.0.0';

export type Undertone = 'warm' | 'cool' | 'neutral';
export type Depth = 'light' | 'deep';
export type Chroma = 'bright' | 'soft' | 'neutral';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/** Respuestas del cuestionario de colorimetría. */
export interface ColorimetryAnswers {
  /** Color de las venas de la muñeca. */
  veins: 'cool' | 'warm' | 'unsure';
  /** Metal que más te ilumina. */
  metal: 'gold' | 'silver' | 'both';
  /** Cómo reacciona tu piel al sol. */
  sun: 'tan' | 'burn' | 'both';
  /** Cabello natural. */
  hair: 'light' | 'medium' | 'deep' | 'red';
  /** Color de ojos. */
  eyes: 'light' | 'hazel' | 'deep';
  /** Qué blanco te sienta mejor junto al rostro. */
  white: 'pure' | 'cream' | 'both';
  /** Cómo te sientan los colores muy intensos. */
  intensity: 'bright' | 'soft' | 'depends';
}

export interface SeasonResult {
  season: Season;
  undertone: Undertone;
  depth: Depth;
  chroma: Chroma;
  version: string;
}

export class ColorimetryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ColorimetryError';
  }
}

/** Calcula el subtono comparando señales cálidas y frías. */
export function resolveUndertone(answers: ColorimetryAnswers): Undertone {
  let warm = 0;
  let cool = 0;

  if (answers.veins === 'warm') warm += 1;
  if (answers.veins === 'cool') cool += 1;
  if (answers.metal === 'gold') warm += 1;
  if (answers.metal === 'silver') cool += 1;
  if (answers.sun === 'tan') warm += 1;
  if (answers.sun === 'burn') cool += 1;
  if (answers.white === 'cream') warm += 1;
  if (answers.white === 'pure') cool += 1;
  if (answers.hair === 'red') warm += 1;

  if (warm === cool) return 'neutral';
  return warm > cool ? 'warm' : 'cool';
}

/** Calcula la profundidad (clara o profunda) a partir de cabello y ojos. */
export function resolveDepth(answers: ColorimetryAnswers, chroma: Chroma): Depth {
  let light = 0;
  let deep = 0;

  if (answers.hair === 'light') light += 1;
  if (answers.hair === 'deep') deep += 1;
  if (answers.hair === 'medium' || answers.hair === 'red') {
    light += 0.5;
    deep += 0.5;
  }
  if (answers.eyes === 'light') light += 1;
  if (answers.eyes === 'deep') deep += 1;
  if (answers.eyes === 'hazel') {
    light += 0.5;
    deep += 0.5;
  }

  if (light === deep) {
    // Empate: el color intenso favorece a las estaciones profundas.
    return chroma === 'bright' ? 'deep' : 'light';
  }
  return light > deep ? 'light' : 'deep';
}

/** Calcula el croma (vivo o suave). */
export function resolveChroma(answers: ColorimetryAnswers): Chroma {
  if (answers.intensity === 'bright') return 'bright';
  if (answers.intensity === 'soft') return 'soft';
  return 'neutral';
}

/** Combina subtono, profundidad y croma en una estación. */
function resolveSeason(undertone: Undertone, depth: Depth, chroma: Chroma): Season {
  if (undertone === 'warm') return depth === 'light' ? 'spring' : 'autumn';
  if (undertone === 'cool') return depth === 'light' ? 'summer' : 'winter';

  // Subtono neutro: decide por croma y profundidad.
  if (chroma === 'bright') return depth === 'light' ? 'spring' : 'winter';
  if (chroma === 'soft') return depth === 'light' ? 'summer' : 'autumn';
  return depth === 'light' ? 'summer' : 'autumn';
}

/** Comprueba que todas las respuestas estén presentes. */
function assertComplete(answers: Partial<ColorimetryAnswers>): asserts answers is ColorimetryAnswers {
  const fields: Array<keyof ColorimetryAnswers> = [
    'veins',
    'metal',
    'sun',
    'hair',
    'eyes',
    'white',
    'intensity',
  ];
  for (const field of fields) {
    if (!answers[field]) {
      throw new ColorimetryError('Responde todas las preguntas para conocer tu estación.');
    }
  }
}

/**
 * Analiza la colorimetría a partir del cuestionario.
 * Función pura y determinista.
 *
 * @throws {ColorimetryError} si el cuestionario está incompleto.
 */
export function analyzeSeason(answers: Partial<ColorimetryAnswers>): SeasonResult {
  assertComplete(answers);

  const undertone = resolveUndertone(answers);
  const chroma = resolveChroma(answers);
  const depth = resolveDepth(answers, chroma);
  const season = resolveSeason(undertone, depth, chroma);

  return { season, undertone, depth, chroma, version: SEASON_VERSION };
}

/** Veredicto de un color respecto a una estación. */
export type ColorVerdict = 'favorece' | 'neutral' | 'cuidado';

/**
 * Familias de color que favorecen o piden cuidado en cada estación.
 * Lo no listado se considera neutral.
 */
const SEASON_FAMILIES: Record<
  Season,
  { favor: ColorFamily[]; careful: ColorFamily[] }
> = {
  spring: {
    favor: ['coral', 'yellow', 'green', 'teal', 'beige', 'pink'],
    careful: ['black', 'gray'],
  },
  autumn: {
    favor: ['coral', 'yellow', 'green', 'beige', 'red', 'teal'],
    careful: ['pink', 'black', 'gray'],
  },
  summer: {
    favor: ['pink', 'blue', 'purple', 'gray', 'green'],
    careful: ['coral', 'yellow', 'black'],
  },
  winter: {
    favor: ['pink', 'blue', 'red', 'purple', 'black', 'white', 'teal'],
    careful: ['beige', 'coral', 'yellow'],
  },
};

/** Evalúa si una familia de color favorece a una estación. */
export function assessColorForSeason(
  family: ColorFamily,
  season: Season,
): ColorVerdict {
  const map = SEASON_FAMILIES[season];
  if (map.favor.includes(family)) return 'favorece';
  if (map.careful.includes(family)) return 'cuidado';
  return 'neutral';
}
