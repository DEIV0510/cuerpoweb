import type { CalculatedDifferences, Measurements } from '@/types/body-shape';

/**
 * Precisión interna del algoritmo.
 *
 * Las medidas se aceptan con un decimal como máximo, por lo que redondear a
 * dos decimales elimina los artefactos de coma flotante (por ejemplo
 * 100.3 - 80.3 = 19.999999999999996) sin alterar ningún valor real.
 */
const INTERNAL_PRECISION = 2;

/** Redondea a un número fijo de decimales de forma estable. */
export function roundTo(value: number, decimals = INTERNAL_PRECISION): number {
  const factor = 10 ** decimals;
  // El `+ Number.EPSILON` evita que 1.005 se redondee hacia abajo.
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/** Diferencia redondeada entre dos medidas. */
export function difference(a: number, b: number): number {
  return roundTo(a - b);
}

/**
 * Calcula todas las diferencias derivadas de las tres medidas principales.
 * Función pura: mismas medidas, mismo resultado.
 */
export function calculateDifferences(
  measurements: Pick<Measurements, 'bust' | 'waist' | 'hips'>,
): CalculatedDifferences {
  const { bust: B, waist: C, hips: H } = measurements;

  return {
    differenceBustHips: roundTo(Math.abs(B - H)),
    hipsMinusBust: roundTo(H - B),
    bustMinusHips: roundTo(B - H),
    bustWaistDifference: roundTo(B - C),
    hipsWaistDifference: roundTo(H - C),
    averageBustHips: roundTo((B + H) / 2),
    averageWaistDifference: roundTo((B + H) / 2 - C),
  };
}

/**
 * Formatea un número de centímetros para mostrarlo:
 * 92 -> "92", 92.5 -> "92,5" (coma decimal, convención en español).
 */
export function formatCm(value: number): string {
  const rounded = roundTo(value, 1);
  const text = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1);
  return text.replace('.', ',');
}

/** Formatea una diferencia como "9 cm" o "0,5 cm". */
export function formatDifference(value: number): string {
  return `${formatCm(Math.abs(value))} cm`;
}
