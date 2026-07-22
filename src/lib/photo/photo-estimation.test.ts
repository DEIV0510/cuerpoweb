import { describe, expect, it } from 'vitest';
import {
  DEFAULT_MARKS,
  DEPTH_RATIOS,
  PHOTO_ESTIMATION_VERSION,
  PhotoEstimationError,
  ellipsePerimeter,
  estimateFromPhoto,
  measureWidthCm,
  reviewEstimation,
  widthToCircumference,
  type PhotoMarks,
} from './photo-estimation';
import { classifyBodyShape } from '@/lib/body-shape/classify-body-shape';

/** Marcas de una foto vertical típica (relación 3:4). */
const ASPECT = 0.75;

function marksWith(overrides: Partial<PhotoMarks> = {}): PhotoMarks {
  return {
    height: { top: 0.05, bottom: 0.95 },
    bust: { y: 0.3, left: 0.38, right: 0.62 },
    waist: { y: 0.42, left: 0.4, right: 0.6 },
    hips: { y: 0.54, left: 0.37, right: 0.63 },
    ...overrides,
  };
}

describe('ellipsePerimeter', () => {
  it('devuelve la circunferencia cuando los dos ejes son iguales', () => {
    // Con a = b la elipse es un círculo: perímetro = 2 · π · r.
    expect(ellipsePerimeter(10, 10)).toBeCloseTo(2 * Math.PI * 10, 4);
  });

  it('es cero cuando ambos ejes son cero', () => {
    expect(ellipsePerimeter(0, 0)).toBe(0);
  });

  it('crece con el tamaño de los ejes', () => {
    expect(ellipsePerimeter(20, 15)).toBeGreaterThan(ellipsePerimeter(10, 7.5));
  });

  it('ignora el signo de los ejes', () => {
    expect(ellipsePerimeter(-12, -9)).toBeCloseTo(ellipsePerimeter(12, 9), 6);
  });

  it('queda entre el perímetro de los círculos inscrito y circunscrito', () => {
    const a = 18;
    const b = 12;
    const perimeter = ellipsePerimeter(a, b);
    expect(perimeter).toBeGreaterThan(2 * Math.PI * b);
    expect(perimeter).toBeLessThan(2 * Math.PI * a);
  });
});

describe('widthToCircumference', () => {
  it('aplica la proporción de profundidad de cada zona', () => {
    const width = 34;
    const expected = ellipsePerimeter(width / 2, (width * DEPTH_RATIOS.bust) / 2);
    expect(widthToCircumference(width, 'bust')).toBeCloseTo(expected, 1);
  });

  it('da valores plausibles para un torso real', () => {
    // Un ancho de busto de 34 cm corresponde a un contorno cercano a 96 cm.
    expect(widthToCircumference(34, 'bust')).toBeGreaterThan(88);
    expect(widthToCircumference(34, 'bust')).toBeLessThan(104);
  });

  it('a mayor ancho, mayor contorno', () => {
    expect(widthToCircumference(40, 'hips')).toBeGreaterThan(
      widthToCircumference(30, 'hips'),
    );
  });

  it('la cadera es más plana que el busto para el mismo ancho', () => {
    expect(widthToCircumference(34, 'hips')).toBeLessThan(
      widthToCircumference(34, 'bust'),
    );
  });
});

describe('measureWidthCm', () => {
  it('convierte la escala de la foto a centímetros', () => {
    // Persona de 170 cm ocupando el 90 % del alto en una imagen 3:4.
    // Ancho normalizado 0,24 → 0,24 · 0,75 / 0,90 · 170 = 34 cm.
    const width = measureWidthCm(
      { y: 0.3, left: 0.38, right: 0.62 },
      { aspectRatio: ASPECT, realHeightCm: 170, heightSpan: 0.9 },
    );
    expect(width).toBeCloseTo(34, 1);
  });

  it('no depende del orden de los bordes', () => {
    const base = { aspectRatio: ASPECT, realHeightCm: 170, heightSpan: 0.9 };
    const normal = measureWidthCm({ y: 0.3, left: 0.38, right: 0.62 }, base);
    const inverted = measureWidthCm({ y: 0.3, left: 0.62, right: 0.38 }, base);
    expect(inverted).toBeCloseTo(normal, 6);
  });

  it('escala de forma proporcional a la estatura declarada', () => {
    const base = { aspectRatio: ASPECT, heightSpan: 0.9 };
    const at150 = measureWidthCm(
      { y: 0.3, left: 0.4, right: 0.6 },
      { ...base, realHeightCm: 150 },
    );
    const at180 = measureWidthCm(
      { y: 0.3, left: 0.4, right: 0.6 },
      { ...base, realHeightCm: 180 },
    );
    expect(at180 / at150).toBeCloseTo(180 / 150, 6);
  });
});

describe('estimateFromPhoto', () => {
  it('devuelve tres contornos plausibles', () => {
    const estimation = estimateFromPhoto({
      marks: marksWith(),
      aspectRatio: ASPECT,
      realHeightCm: 170,
    });

    for (const value of [estimation.bust, estimation.waist, estimation.hips]) {
      expect(value).toBeGreaterThan(45);
      expect(value).toBeLessThan(220);
    }
  });

  it('es determinista', () => {
    const input = {
      marks: marksWith(),
      aspectRatio: ASPECT,
      realHeightCm: 170,
    };
    expect(estimateFromPhoto(input)).toEqual(estimateFromPhoto(input));
  });

  it('incluye ancho y profundidad de cada zona', () => {
    const estimation = estimateFromPhoto({
      marks: marksWith(),
      aspectRatio: ASPECT,
      realHeightCm: 170,
    });

    expect(estimation.zones.bust.widthCm).toBeGreaterThan(0);
    expect(estimation.zones.bust.depthCm).toBeCloseTo(
      estimation.zones.bust.widthCm * DEPTH_RATIOS.bust,
      1,
    );
    expect(estimation.zones.waist.circumferenceCm).toBe(estimation.waist);
  });

  it('marca la versión del método', () => {
    const estimation = estimateFromPhoto({
      marks: marksWith(),
      aspectRatio: ASPECT,
      realHeightCm: 170,
    });
    expect(estimation.version).toBe(PHOTO_ESTIMATION_VERSION);
    expect(PHOTO_ESTIMATION_VERSION).toBe('1.0.0');
  });

  it('una cintura más estrecha produce un contorno menor', () => {
    const ancha = estimateFromPhoto({
      marks: marksWith({ waist: { y: 0.42, left: 0.36, right: 0.64 } }),
      aspectRatio: ASPECT,
      realHeightCm: 170,
    });
    const estrecha = estimateFromPhoto({
      marks: marksWith({ waist: { y: 0.42, left: 0.42, right: 0.58 } }),
      aspectRatio: ASPECT,
      realHeightCm: 170,
    });
    expect(estrecha.waist).toBeLessThan(ancha.waist);
  });

  it('alimenta al clasificador sin conversiones extra', () => {
    const estimation = estimateFromPhoto({
      marks: marksWith(),
      aspectRatio: ASPECT,
      realHeightCm: 170,
    });

    const result = classifyBodyShape({
      bust: estimation.bust,
      waist: estimation.waist,
      hips: estimation.hips,
    });

    expect(result.type).toBeTruthy();
    expect(result.measurements.bust).toBe(estimation.bust);
  });

  it('las marcas por defecto dan una estimación válida', () => {
    const estimation = estimateFromPhoto({
      marks: DEFAULT_MARKS,
      aspectRatio: ASPECT,
      realHeightCm: 165,
    });
    expect(estimation.bust).toBeGreaterThan(45);
    expect(reviewEstimation(estimation)).toEqual([]);
  });

  it('rechaza una relación de aspecto inválida', () => {
    expect(() =>
      estimateFromPhoto({ marks: marksWith(), aspectRatio: 0, realHeightCm: 170 }),
    ).toThrow(PhotoEstimationError);
    expect(() =>
      estimateFromPhoto({
        marks: marksWith(),
        aspectRatio: Number.NaN,
        realHeightCm: 170,
      }),
    ).toThrow(PhotoEstimationError);
  });

  it('rechaza una estatura no utilizable', () => {
    expect(() =>
      estimateFromPhoto({ marks: marksWith(), aspectRatio: ASPECT, realHeightCm: 0 }),
    ).toThrow(PhotoEstimationError);
  });

  it('rechaza marcas de estatura demasiado juntas', () => {
    expect(() =>
      estimateFromPhoto({
        marks: marksWith({ height: { top: 0.5, bottom: 0.52 } }),
        aspectRatio: ASPECT,
        realHeightCm: 170,
      }),
    ).toThrow(PhotoEstimationError);
  });

  it('rechaza un ancho sin separación', () => {
    expect(() =>
      estimateFromPhoto({
        marks: marksWith({ waist: { y: 0.42, left: 0.5, right: 0.5 } }),
        aspectRatio: ASPECT,
        realHeightCm: 170,
      }),
    ).toThrow(PhotoEstimationError);
  });
});

describe('reviewEstimation', () => {
  it('avisa cuando la escala parece equivocada', () => {
    // Marcas de estatura muy cortas: todo sale desproporcionado.
    const estimation = estimateFromPhoto({
      marks: marksWith({ height: { top: 0.4, bottom: 0.6 } }),
      aspectRatio: ASPECT,
      realHeightCm: 170,
    });
    expect(reviewEstimation(estimation).length).toBeGreaterThan(0);
  });

  it('no avisa en un caso normal', () => {
    const estimation = estimateFromPhoto({
      marks: marksWith(),
      aspectRatio: ASPECT,
      realHeightCm: 170,
    });
    expect(reviewEstimation(estimation)).toEqual([]);
  });
});
