import { BODY_SHAPE_PROFILES } from '@/data/body-shapes';
import { RECOMMENDATIONS } from '@/data/recommendations';
import type {
  BodyShapeResult,
  BodyShapeType,
  CalculatedDifferences,
  Measurements,
  RuleEvaluation,
} from '@/types/body-shape';
import { calculateDifferences, formatCm, roundTo } from './calculations';
import { buildWarnings, isUsableNumber } from './validation';

/** Versión de la fórmula de clasificación. */
export const ALGORITHM_VERSION = '1.0.0';

/** Diferencia máxima (en cm) para considerar busto y cadera "similares". */
export const SIMILAR_THRESHOLD_CM = 5;
/** Diferencia mínima (en cm) entre cintura y busto/cadera para el reloj de arena. */
export const DEFINED_WAIST_THRESHOLD_CM = 20;
/** Distancia (en cm) por debajo de la cual la cintura se considera cercana. */
export const CLOSE_WAIST_THRESHOLD_CM = 10;

/** Error lanzado cuando las medidas recibidas no son utilizables. */
export class InvalidMeasurementsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidMeasurementsError';
  }
}

/** Entrada de la función principal. */
export interface ClassifyInput {
  bust: number;
  waist: number;
  hips: number;
  height?: number;
}

/** Comprueba que las tres medidas sean números utilizables. */
function assertValidMeasurements(input: ClassifyInput): void {
  const fields: Array<[keyof ClassifyInput, string]> = [
    ['bust', 'busto'],
    ['waist', 'cintura'],
    ['hips', 'cadera'],
  ];

  for (const [key, label] of fields) {
    const value = input[key];
    if (!isUsableNumber(value)) {
      throw new InvalidMeasurementsError(
        `La medida de ${label} debe ser un número mayor que cero.`,
      );
    }
  }

  if (input.height !== undefined && !isUsableNumber(input.height)) {
    throw new InvalidMeasurementsError(
      'La altura debe ser un número mayor que cero o quedar vacía.',
    );
  }
}

/** Construye la lista completa de reglas evaluadas, en orden de prioridad. */
function evaluateRules(
  measurements: Pick<Measurements, 'bust' | 'waist' | 'hips'>,
  differences: CalculatedDifferences,
): { rules: RuleEvaluation[]; type: BodyShapeType } {
  const { bust: B, waist: C, hips: H } = measurements;
  const {
    differenceBustHips,
    hipsMinusBust,
    bustMinusHips,
    bustWaistDifference,
    hipsWaistDifference,
  } = differences;

  // Regla 1 — Óvalo
  const waistIsLargest =
    roundTo(C - B) >= 0 && roundTo(C - H) >= 0;
  const waistIsClose =
    Math.abs(bustWaistDifference) < CLOSE_WAIST_THRESHOLD_CM &&
    Math.abs(hipsWaistDifference) < CLOSE_WAIST_THRESHOLD_CM;
  const isOval = waistIsLargest || waistIsClose;

  // Regla 2 — Triángulo
  const isTriangle = !isOval && hipsMinusBust > SIMILAR_THRESHOLD_CM;

  // Regla 3 — Triángulo invertido
  const isInverted =
    !isOval && !isTriangle && bustMinusHips > SIMILAR_THRESHOLD_CM;

  // Regla 4 — Reloj de arena
  const similarBustHips = differenceBustHips <= SIMILAR_THRESHOLD_CM;
  const definedWaist =
    bustWaistDifference >= DEFINED_WAIST_THRESHOLD_CM &&
    hipsWaistDifference >= DEFINED_WAIST_THRESHOLD_CM;
  const isHourglass =
    !isOval && !isTriangle && !isInverted && similarBustHips && definedWaist;

  // Regla 5 — Rectángulo: caso restante. Si ninguna de las reglas anteriores
  // se cumple, |B − H| ≤ 5 siempre es cierto, así que el algoritmo es total.
  const type: BodyShapeType = isOval
    ? 'oval'
    : isTriangle
      ? 'triangle'
      : isInverted
        ? 'inverted-triangle'
        : isHourglass
          ? 'hourglass'
          : 'rectangle';

  const rules: RuleEvaluation[] = [
    {
      id: 'rule-1-oval',
      order: 1,
      name: 'Óvalo',
      condition: '(C ≥ B y C ≥ H) o (|B − C| < 10 y |H − C| < 10)',
      matched: isOval,
      decisive: type === 'oval',
      detail: waistIsLargest
        ? `La cintura (${formatCm(C)} cm) iguala o supera al busto (${formatCm(
            B,
          )} cm) y a la cadera (${formatCm(H)} cm).`
        : waistIsClose
          ? `La cintura está a ${formatCm(
              Math.abs(bustWaistDifference),
            )} cm del busto y a ${formatCm(
              Math.abs(hipsWaistDifference),
            )} cm de la cadera: menos de 10 cm en ambos casos.`
          : `La cintura no supera a busto ni cadera y su distancia con al menos una de esas medidas es de 10 cm o más (${formatCm(
              Math.abs(bustWaistDifference),
            )} cm con el busto y ${formatCm(
              Math.abs(hipsWaistDifference),
            )} cm con la cadera).`,
    },
    {
      id: 'rule-2-triangle',
      order: 2,
      name: 'Triángulo',
      condition: 'H − B > 5',
      matched: hipsMinusBust > SIMILAR_THRESHOLD_CM,
      decisive: type === 'triangle',
      detail: `La cadera menos el busto da ${formatCm(
        hipsMinusBust,
      )} cm, ${hipsMinusBust > SIMILAR_THRESHOLD_CM ? 'más' : 'no más'} de 5 cm.`,
    },
    {
      id: 'rule-3-inverted-triangle',
      order: 3,
      name: 'Triángulo invertido',
      condition: 'B − H > 5',
      matched: bustMinusHips > SIMILAR_THRESHOLD_CM,
      decisive: type === 'inverted-triangle',
      detail: `El busto menos la cadera da ${formatCm(
        bustMinusHips,
      )} cm, ${bustMinusHips > SIMILAR_THRESHOLD_CM ? 'más' : 'no más'} de 5 cm.`,
    },
    {
      id: 'rule-4-hourglass',
      order: 4,
      name: 'Reloj de arena',
      condition: '|B − H| ≤ 5 y B − C ≥ 20 y H − C ≥ 20',
      matched: similarBustHips && definedWaist,
      decisive: type === 'hourglass',
      detail: `Busto y cadera se diferencian en ${formatCm(
        differenceBustHips,
      )} cm; la cintura es ${formatCm(
        bustWaistDifference,
      )} cm menor que el busto y ${formatCm(
        hipsWaistDifference,
      )} cm menor que la cadera.`,
    },
    {
      id: 'rule-5-rectangle',
      order: 5,
      name: 'Rectángulo',
      condition: '|B − H| ≤ 5 sin cintura 20 cm menor que ambas',
      matched: similarBustHips && !definedWaist,
      decisive: type === 'rectangle',
      detail: `Busto y cadera se diferencian en ${formatCm(
        differenceBustHips,
      )} cm y la diferencia con la cintura es de ${formatCm(
        bustWaistDifference,
      )} cm y ${formatCm(hipsWaistDifference)} cm.`,
    },
  ];

  return { rules, type };
}

/** Redacta la explicación personalizada del resultado. */
function buildExplanation(
  type: BodyShapeType,
  measurements: Pick<Measurements, 'bust' | 'waist' | 'hips'>,
  differences: CalculatedDifferences,
): string {
  const { bust: B, waist: C, hips: H } = measurements;
  const {
    differenceBustHips,
    hipsMinusBust,
    bustMinusHips,
    bustWaistDifference,
    hipsWaistDifference,
  } = differences;

  switch (type) {
    case 'hourglass':
      return `Tu busto y tu cadera tienen una diferencia de ${formatCm(
        differenceBustHips,
      )} cm y tu cintura es ${formatCm(
        bustWaistDifference,
      )} cm menor que tu busto y ${formatCm(
        hipsWaistDifference,
      )} cm menor que tu cadera. Esto genera una proporción equilibrada con una cintura notablemente definida.`;

    case 'triangle':
      return `Tu cadera supera a tu busto en ${formatCm(
        hipsMinusBust,
      )} cm. Por esta razón, tu silueta presenta mayor presencia visual en la zona inferior.`;

    case 'inverted-triangle':
      return `Tu busto supera a tu cadera en ${formatCm(
        bustMinusHips,
      )} cm. Tu estructura tiene mayor presencia visual en la parte superior.`;

    case 'rectangle':
      return `Tu busto y tu cadera son similares, con ${formatCm(
        differenceBustHips,
      )} cm de diferencia, y tu cintura no llega a ser 20 cm menor que ambas medidas (${formatCm(
        bustWaistDifference,
      )} cm respecto al busto y ${formatCm(
        hipsWaistDifference,
      )} cm respecto a la cadera). Esto crea una línea corporal más continua.`;

    case 'oval': {
      const waistIsLargest = roundTo(C - B) >= 0 && roundTo(C - H) >= 0;
      if (waistIsLargest) {
        return `Tu cintura (${formatCm(
          C,
        )} cm) iguala o supera a tu busto (${formatCm(
          B,
        )} cm) y a tu cadera (${formatCm(
          H,
        )} cm), por lo que la zona media tiene una presencia visual predominante.`;
      }
      return `Tu cintura está a ${formatCm(
        Math.abs(bustWaistDifference),
      )} cm de tu busto y a ${formatCm(
        Math.abs(hipsWaistDifference),
      )} cm de tu cadera, es decir, muy próxima a ambas medidas. Por eso la zona media tiene una presencia visual predominante.`;
    }
  }
}

/**
 * Clasifica la silueta corporal a partir de tres contornos en centímetros.
 *
 * Función pura y determinista: con las mismas medidas devuelve siempre el
 * mismo resultado. No depende del navegador ni de ningún estado externo.
 *
 * Orden de prioridad de las reglas:
 * 1. Óvalo, 2. Triángulo, 3. Triángulo invertido, 4. Reloj de arena, 5. Rectángulo.
 *
 * @throws {InvalidMeasurementsError} si alguna medida no es un número válido.
 */
export function classifyBodyShape(input: ClassifyInput): BodyShapeResult {
  assertValidMeasurements(input);

  const measurements: Measurements = {
    bust: roundTo(input.bust, 1),
    waist: roundTo(input.waist, 1),
    hips: roundTo(input.hips, 1),
    ...(input.height !== undefined ? { height: roundTo(input.height, 1) } : {}),
  };

  const calculatedDifferences = calculateDifferences(measurements);
  const { rules, type } = evaluateRules(measurements, calculatedDifferences);
  const profile = BODY_SHAPE_PROFILES[type];

  return {
    type,
    name: profile.name,
    shortName: profile.shortName,
    explanation: buildExplanation(type, measurements, calculatedDifferences),
    measurements,
    calculatedDifferences,
    matchedRules: rules,
    visualObjective: profile.visualObjective,
    recommendations: RECOMMENDATIONS[type],
    warnings: buildWarnings(measurements),
    algorithmVersion: ALGORITHM_VERSION,
  };
}
