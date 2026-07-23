import { roundTo } from '@/lib/body-shape/calculations';

/**
 * Técnica de las 8 cabezas: proporción vertical del cuerpo.
 *
 * La estética clásica del dibujo de figurín divide el cuerpo en ocho unidades
 * del tamaño de la propia cabeza. No importa cuánto midas: lo que define la
 * estilización es la relación entre tus tramos.
 *
 *   1 cabeza  · coronilla a quijada
 *   2 cabezas · quijada a cintura
 *   1 cabeza  · cintura a entrepierna
 *   4 cabezas · entrepierna a los pies
 *
 * A partir de ahí se deduce si el torso es corto o largo, si el tiro es corto
 * o largo y si las piernas son cortas o largas, que es justo lo que decide el
 * tiro del pantalón, el largo de la chaqueta y la altura del zapato.
 */

/** Versión del método de proporción vertical. */
export const EIGHT_HEADS_VERSION = '1.0.0';

/** Cabezas ideales de cada tramo. */
export const REFERENCE_HEADS = {
  torso: 2,
  rise: 1,
  legs: 4,
} as const;

/**
 * Margen, en cabezas, dentro del cual un tramo se considera en proporción.
 * Un cuarto de cabeza equivale a unos 5 cm en una persona de 1,62 m.
 */
export const HEAD_TOLERANCE = 0.25;

/** Diferencia relativa a partir de la cual el conjunto se inclina a un lado. */
export const TILT_THRESHOLD = 0.08;

export type ProportionSegment = 'torso' | 'rise' | 'legs';
export type SegmentBalance = 'short' | 'balanced' | 'long';
/** Hacia dónde conviene trabajar el equilibrio vertical. */
export type ProportionStrategy = 'raise-waist' | 'lengthen-torso' | 'balanced';

/** Medidas verticales en centímetros. */
export interface EightHeadsInput {
  /** Coronilla a quijada. */
  head: number;
  /** Quijada a cintura. */
  torso: number;
  /** Cintura a entrepierna. */
  rise: number;
  /** Entrepierna al piso. */
  legs: number;
}

export interface SegmentResult {
  id: ProportionSegment;
  /** Medida registrada en centímetros. */
  measuredCm: number;
  /** Cuántas cabezas mide el tramo. */
  heads: number;
  /** Cuántas cabezas debería medir. */
  reference: number;
  /** Diferencia en cabezas respecto a la referencia. */
  difference: number;
  /** Diferencia en centímetros respecto a la referencia. */
  differenceCm: number;
  balance: SegmentBalance;
}

export interface EightHeadsResult {
  headCm: number;
  segments: Record<ProportionSegment, SegmentResult>;
  /** Suma de los cuatro tramos, en centímetros. */
  totalCm: number;
  /** Cuántas cabezas mide el cuerpo completo. */
  totalHeads: number;
  /** Estrategia general de equilibrio vertical. */
  strategy: ProportionStrategy;
  warnings: string[];
  version: string;
}

/** Error lanzado cuando las medidas no permiten calcular la proporción. */
export class EightHeadsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EightHeadsError';
  }
}

/** Rangos aceptados para cada tramo, en centímetros. */
export const SEGMENT_RANGES: Record<keyof EightHeadsInput, { min: number; max: number }> = {
  head: { min: 15, max: 35 },
  torso: { min: 20, max: 70 },
  rise: { min: 10, max: 45 },
  legs: { min: 40, max: 120 },
};

function isUsable(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

/** Clasifica un tramo comparándolo con su referencia. */
function buildSegment(
  id: ProportionSegment,
  measuredCm: number,
  headCm: number,
): SegmentResult {
  const reference = REFERENCE_HEADS[id];
  const heads = roundTo(measuredCm / headCm, 2);
  const difference = roundTo(heads - reference, 2);

  const balance: SegmentBalance =
    Math.abs(difference) <= HEAD_TOLERANCE ? 'balanced' : difference < 0 ? 'short' : 'long';

  return {
    id,
    measuredCm: roundTo(measuredCm, 1),
    heads,
    reference,
    difference,
    differenceCm: roundTo(difference * headCm, 1),
    balance,
  };
}

/**
 * Decide la estrategia general comparando cuánto se aleja el torso de su
 * referencia frente a cuánto se alejan las piernas de la suya.
 */
export function resolveStrategy(
  torso: SegmentResult,
  legs: SegmentResult,
): ProportionStrategy {
  const torsoShare = torso.heads / torso.reference;
  const legShare = legs.heads / legs.reference;
  const tilt = torsoShare - legShare;

  if (tilt > TILT_THRESHOLD) return 'raise-waist';
  if (tilt < -TILT_THRESHOLD) return 'lengthen-torso';
  return 'balanced';
}

/** Avisos informativos: nunca bloquean el resultado. */
function buildWarnings(result: {
  totalHeads: number;
  segments: Record<ProportionSegment, SegmentResult>;
}): string[] {
  const warnings: string[] = [];

  if (result.totalHeads < 6.5 || result.totalHeads > 9.5) {
    warnings.push(
      `Tu cuerpo dio ${result.totalHeads} cabezas en total y lo habitual está entre 7 y 8,5. Revisa sobre todo la medida de la cabeza: es la unidad con la que se divide todo lo demás.`,
    );
  }

  const extreme = Object.values(result.segments).find(
    (segment) => Math.abs(segment.difference) > 1,
  );

  if (extreme) {
    warnings.push(
      'Alguno de los tramos se aleja más de una cabeza de su referencia. Comprueba que mediste desde los puntos correctos y con la cinta recta.',
    );
  }

  return warnings;
}

/**
 * Analiza la proporción vertical del cuerpo.
 * Función pura y determinista.
 *
 * @throws {EightHeadsError} si alguna medida no es utilizable.
 */
export function analyzeEightHeads(input: EightHeadsInput): EightHeadsResult {
  const fields: Array<[keyof EightHeadsInput, string]> = [
    ['head', 'la cabeza'],
    ['torso', 'de la quijada a la cintura'],
    ['rise', 'de la cintura a la entrepierna'],
    ['legs', 'de la entrepierna a los pies'],
  ];

  for (const [key, label] of fields) {
    if (!isUsable(input[key])) {
      throw new EightHeadsError(
        `La medida ${label} debe ser un número mayor que cero.`,
      );
    }
  }

  const headCm = roundTo(input.head, 1);

  const segments: Record<ProportionSegment, SegmentResult> = {
    torso: buildSegment('torso', input.torso, headCm),
    rise: buildSegment('rise', input.rise, headCm),
    legs: buildSegment('legs', input.legs, headCm),
  };

  const totalCm = roundTo(input.head + input.torso + input.rise + input.legs, 1);
  const totalHeads = roundTo(totalCm / headCm, 2);

  return {
    headCm,
    segments,
    totalCm,
    totalHeads,
    strategy: resolveStrategy(segments.torso, segments.legs),
    warnings: buildWarnings({ totalHeads, segments }),
    version: EIGHT_HEADS_VERSION,
  };
}

/** Formatea con la palabra: 1 -> "1 cabeza", 2.35 -> "2,35 cabezas". */
export function formatHeadsLabel(value: number): string {
  const text = formatHeads(value);
  return `${text} ${value === 1 ? 'cabeza' : 'cabezas'}`;
}

/** Formatea un número de cabezas: 2 -> "2", 1.75 -> "1,75". */
export function formatHeads(value: number): string {
  const rounded = roundTo(value, 2);
  return (Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2))
    .replace(/0$/, '')
    .replace(/[.,]$/, '')
    .replace('.', ',');
}
