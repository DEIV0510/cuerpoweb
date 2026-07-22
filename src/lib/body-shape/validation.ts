import type { AnalysisWarning, Measurements } from '@/types/body-shape';
import { formatDifference, roundTo } from './calculations';

/** Medida mínima aceptada, en centímetros. */
export const MIN_MEASUREMENT_CM = 45;
/** Medida máxima aceptada, en centímetros. */
export const MAX_MEASUREMENT_CM = 220;
/** Altura mínima aceptada (campo opcional), en centímetros. */
export const MIN_HEIGHT_CM = 120;
/** Altura máxima aceptada (campo opcional), en centímetros. */
export const MAX_HEIGHT_CM = 230;

/**
 * Acepta números con máximo un decimal, con punto o coma.
 * Ejemplos válidos: "92", "92.5", "101,3".
 */
export const MEASUREMENT_PATTERN = /^\d{1,3}([.,]\d)?$/;

/** Mensajes de error reutilizados por el esquema del formulario. */
export const VALIDATION_MESSAGES = {
  requiredBust: 'Ingresa la medida de tu busto.',
  requiredWaist: 'Ingresa la medida de tu cintura.',
  requiredHips: 'Ingresa la medida de tu cadera.',
  notANumber: 'La medida debe ser un número válido.',
  oneDecimal: 'Revisa la medida ingresada. Usa máximo un decimal, por ejemplo 92,5.',
  outOfRange: `Ingresa una medida entre ${MIN_MEASUREMENT_CM} y ${MAX_MEASUREMENT_CM} cm.`,
  heightOutOfRange: `Ingresa una altura entre ${MIN_HEIGHT_CM} y ${MAX_HEIGHT_CM} cm.`,
} as const;

/** Convierte el texto de un campo a número, aceptando coma decimal. */
export function parseMeasurement(raw: string): number {
  return Number(raw.trim().replace(',', '.'));
}

/** Un número es una medida utilizable si es finito y está dentro del rango. */
export function isMeasurementInRange(value: number): boolean {
  return (
    Number.isFinite(value) &&
    value >= MIN_MEASUREMENT_CM &&
    value <= MAX_MEASUREMENT_CM
  );
}

/** Verifica que un valor sea un número finito y positivo utilizable por el algoritmo. */
export function isUsableNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

/** Diferencia a partir de la cual se sugiere revisar la toma de medidas. */
const EXTREME_DIFFERENCE_CM = 45;

/**
 * Genera avisos informativos. Nunca invalida un cuerpo: solo sugiere revisar
 * la forma de medir cuando la combinación es poco habitual.
 */
export function buildWarnings(
  measurements: Pick<Measurements, 'bust' | 'waist' | 'hips'>,
): AnalysisWarning[] {
  const { bust, waist, hips } = measurements;
  const warnings: AnalysisWarning[] = [];

  const waistOverBust = roundTo(waist - bust) > 0;
  const waistOverHips = roundTo(waist - hips) > 0;

  if (waistOverBust && waistOverHips) {
    warnings.push({
      code: 'waist-largest',
      message:
        'Tu cintura es la medida más amplia de las tres. Es una combinación posible; confirma que tomaste la cintura en la parte más estrecha del torso y con el abdomen relajado.',
    });
  } else if (waistOverBust) {
    warnings.push({
      code: 'waist-over-bust',
      message:
        'Tu cintura es mayor que tu busto. Confirma que registraste cada medida en el campo correspondiente.',
    });
  } else if (waistOverHips) {
    warnings.push({
      code: 'waist-over-hips',
      message:
        'Tu cintura es mayor que tu cadera. Confirma que registraste cada medida en el campo correspondiente.',
    });
  }

  const differences = [
    Math.abs(bust - hips),
    Math.abs(bust - waist),
    Math.abs(hips - waist),
  ];

  const largest = Math.max(...differences);
  if (largest > EXTREME_DIFFERENCE_CM) {
    warnings.push({
      code: 'extreme-difference',
      message: `Tus medidas presentan una diferencia poco habitual (${formatDifference(
        largest,
      )}). Antes de continuar, confirma que la cinta estaba paralela al piso y que registraste busto, cintura y cadera en los campos correctos.`,
    });
  }

  const values = [bust, waist, hips];
  if (values.some((value) => !isMeasurementInRange(value))) {
    warnings.push({
      code: 'out-of-common-range',
      message: `Alguna medida está fuera del rango habitual de la herramienta (${MIN_MEASUREMENT_CM} a ${MAX_MEASUREMENT_CM} cm). El resultado sigue siendo orientativo.`,
    });
  }

  return warnings;
}

/** Indica si unas medidas requieren una confirmación adicional del usuario. */
export function needsExtraConfirmation(
  measurements: Pick<Measurements, 'bust' | 'waist' | 'hips'>,
): boolean {
  return buildWarnings(measurements).length > 0;
}
