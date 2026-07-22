import { roundTo } from '@/lib/body-shape/calculations';

/**
 * Estimación de contornos a partir de una fotografía frontal.
 *
 * El método es fotogrametría guiada, no inteligencia artificial:
 *
 * 1. La persona marca su estatura en la foto (coronilla y pies). Como conoce
 *    su estatura real, eso da la escala en píxeles por centímetro.
 * 2. Marca el ancho del cuerpo a la altura de busto, cintura y cadera.
 * 3. Cada zona se modela como una elipse: el ancho visible es el eje mayor y
 *    la profundidad se estima como una proporción de ese ancho.
 * 4. El contorno es el perímetro de esa elipse.
 *
 * Es una estimación: una cinta métrica siempre será más precisa. Todo el
 * cálculo ocurre en el dispositivo y la foto nunca se envía ni se guarda.
 */

/** Versión del método de estimación por foto. */
export const PHOTO_ESTIMATION_VERSION = '1.0.0';

export type PhotoZone = 'bust' | 'waist' | 'hips';

/**
 * Proporción profundidad ÷ ancho de cada zona del torso.
 *
 * Son valores antropométricos aproximados: una fotografía frontal no puede
 * ver la profundidad del cuerpo. Por eso el resultado se presenta siempre
 * como estimación editable.
 */
export const DEPTH_RATIOS: Record<PhotoZone, number> = {
  bust: 0.8,
  waist: 0.74,
  hips: 0.72,
};

/** Marca vertical: dos alturas normalizadas (0 arriba, 1 abajo). */
export interface HeightMark {
  top: number;
  bottom: number;
}

/** Marca de ancho: una altura y dos bordes horizontales, normalizados. */
export interface WidthMark {
  y: number;
  left: number;
  right: number;
}

/** Conjunto completo de marcas sobre la foto. */
export interface PhotoMarks {
  height: HeightMark;
  bust: WidthMark;
  waist: WidthMark;
  hips: WidthMark;
}

export interface EstimationInput {
  marks: PhotoMarks;
  /** Ancho ÷ alto de la imagen mostrada. */
  aspectRatio: number;
  /** Estatura real de la persona, en centímetros. */
  realHeightCm: number;
}

export interface ZoneEstimation {
  /** Ancho medido en la foto, en centímetros. */
  widthCm: number;
  /** Profundidad estimada, en centímetros. */
  depthCm: number;
  /** Contorno estimado, en centímetros. */
  circumferenceCm: number;
}

export interface PhotoEstimation {
  bust: number;
  waist: number;
  hips: number;
  zones: Record<PhotoZone, ZoneEstimation>;
  /** Centímetros que representa cada unidad normalizada de altura. */
  centimetersPerUnit: number;
  version: string;
}

/** Error lanzado cuando las marcas o la estatura no permiten calcular. */
export class PhotoEstimationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PhotoEstimationError';
  }
}

/** Marcas iniciales razonables para una foto de cuerpo completo. */
export const DEFAULT_MARKS: PhotoMarks = {
  height: { top: 0.04, bottom: 0.97 },
  bust: { y: 0.3, left: 0.38, right: 0.62 },
  waist: { y: 0.42, left: 0.4, right: 0.6 },
  hips: { y: 0.54, left: 0.37, right: 0.63 },
};

/**
 * Perímetro de una elipse por la aproximación de Ramanujan.
 * El error es inferior al 0,01 % para las proporciones de un torso humano.
 */
export function ellipsePerimeter(semiMajor: number, semiMinor: number): number {
  const a = Math.abs(semiMajor);
  const b = Math.abs(semiMinor);
  if (a === 0 && b === 0) return 0;

  return (
    Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)))
  );
}

/** Convierte un ancho visible en un contorno estimado para esa zona. */
export function widthToCircumference(widthCm: number, zone: PhotoZone): number {
  const depthCm = widthCm * DEPTH_RATIOS[zone];
  return roundTo(ellipsePerimeter(widthCm / 2, depthCm / 2), 1);
}

/** Comprueba que un número sea utilizable. */
function isFinitePositive(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

/**
 * Calcula el ancho real, en centímetros, de un segmento horizontal marcado
 * sobre la foto.
 */
export function measureWidthCm(
  mark: WidthMark,
  input: Pick<EstimationInput, 'aspectRatio' | 'realHeightCm'> & {
    heightSpan: number;
  },
): number {
  const horizontalSpan = Math.abs(mark.right - mark.left);
  // Los ejes están normalizados a dimensiones distintas: el factor de forma
  // de la imagen los pone en la misma escala.
  return (
    (horizontalSpan * input.aspectRatio) / input.heightSpan * input.realHeightCm
  );
}

/**
 * Estima los tres contornos a partir de las marcas de la foto.
 * Función pura y determinista.
 *
 * @throws {PhotoEstimationError} si falta información para calcular.
 */
export function estimateFromPhoto(input: EstimationInput): PhotoEstimation {
  const { marks, aspectRatio, realHeightCm } = input;

  if (!isFinitePositive(aspectRatio)) {
    throw new PhotoEstimationError('No pudimos leer las dimensiones de la foto.');
  }

  if (!isFinitePositive(realHeightCm)) {
    throw new PhotoEstimationError('Ingresa tu estatura para calcular la escala.');
  }

  const heightSpan = Math.abs(marks.height.bottom - marks.height.top);
  if (heightSpan < 0.05) {
    throw new PhotoEstimationError(
      'Separa un poco más las marcas de la coronilla y de los pies.',
    );
  }

  const zones = {} as Record<PhotoZone, ZoneEstimation>;
  const zoneList: PhotoZone[] = ['bust', 'waist', 'hips'];

  for (const zone of zoneList) {
    const mark = marks[zone];
    const widthCm = measureWidthCm(mark, {
      aspectRatio,
      realHeightCm,
      heightSpan,
    });

    if (!isFinitePositive(widthCm)) {
      throw new PhotoEstimationError(
        'Revisa las marcas de ancho: deben tener separación entre sí.',
      );
    }

    const depthCm = widthCm * DEPTH_RATIOS[zone];

    zones[zone] = {
      widthCm: roundTo(widthCm, 1),
      depthCm: roundTo(depthCm, 1),
      circumferenceCm: widthToCircumference(widthCm, zone),
    };
  }

  return {
    bust: zones.bust.circumferenceCm,
    waist: zones.waist.circumferenceCm,
    hips: zones.hips.circumferenceCm,
    zones,
    centimetersPerUnit: roundTo(realHeightCm / heightSpan, 2),
    version: PHOTO_ESTIMATION_VERSION,
  };
}

/**
 * Revisa si una estimación cae fuera de lo esperable, para avisar antes de
 * clasificar. No bloquea: solo sugiere revisar las marcas.
 */
export function reviewEstimation(estimation: PhotoEstimation): string[] {
  const notes: string[] = [];
  const values = [estimation.bust, estimation.waist, estimation.hips];

  if (values.some((value) => value < 45 || value > 220)) {
    notes.push(
      'Alguna medida quedó fuera del rango habitual. Revisa la marca de tu estatura: es la que define la escala de la foto.',
    );
  }

  const largest = Math.max(...values);
  const smallest = Math.min(...values);
  if (largest - smallest > 45) {
    notes.push(
      'Las tres medidas se diferencian mucho entre sí. Comprueba que cada línea esté a la altura correcta y toque los bordes del cuerpo.',
    );
  }

  return notes;
}
