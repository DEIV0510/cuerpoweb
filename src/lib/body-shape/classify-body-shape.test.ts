import { describe, expect, it } from 'vitest';
import {
  ALGORITHM_VERSION,
  InvalidMeasurementsError,
  classifyBodyShape,
} from './classify-body-shape';
import { calculateDifferences, formatCm, roundTo } from './calculations';
import {
  MAX_MEASUREMENT_CM,
  MIN_MEASUREMENT_CM,
  buildWarnings,
  needsExtraConfirmation,
} from './validation';
import { measurementsSchema } from '@/schemas/measurements-schema';
import type { BodyShapeType } from '@/types/body-shape';

/** Helper corto para los casos de prueba. */
function classify(bust: number, waist: number, hips: number) {
  return classifyBodyShape({ bust, waist, hips });
}

/** Devuelve la regla que determinó el resultado. */
function decisiveRule(type: BodyShapeType, bust: number, waist: number, hips: number) {
  const result = classify(bust, waist, hips);
  expect(result.type).toBe(type);
  return result.matchedRules.find((rule) => rule.decisive);
}

describe('classifyBodyShape · casos obligatorios del enunciado', () => {
  it('Caso 1: 98 / 74 / 99 es reloj de arena', () => {
    const result = classify(98, 74, 99);
    expect(result.type).toBe('hourglass');
    expect(result.name).toBe('Reloj de arena');
  });

  it('Caso 2: 92 / 73 / 101 es triángulo', () => {
    const result = classify(92, 73, 101);
    expect(result.type).toBe('triangle');
    expect(result.name).toBe('Triángulo');
  });

  it('Caso 3: 104 / 80 / 95 es triángulo invertido', () => {
    const result = classify(104, 80, 95);
    expect(result.type).toBe('inverted-triangle');
    expect(result.name).toBe('Triángulo invertido');
  });

  it('Caso 4: 96 / 82 / 95 es rectángulo', () => {
    const result = classify(96, 82, 95);
    expect(result.type).toBe('rectangle');
    expect(result.name).toBe('Rectángulo');
  });

  it('Caso 5: 100 / 96 / 98 es óvalo', () => {
    const result = classify(100, 96, 98);
    expect(result.type).toBe('oval');
    expect(result.name).toBe('Óvalo');
  });
});

describe('orden de prioridad de las reglas', () => {
  it('la regla del óvalo se evalúa antes que la del triángulo', () => {
    // Cadera 7 cm mayor que el busto (cumple triángulo), pero la cintura está
    // a menos de 10 cm de ambas medidas, así que gana el óvalo.
    const result = classify(92, 90, 99);
    expect(result.type).toBe('oval');
    const oval = result.matchedRules.find((r) => r.id === 'rule-1-oval');
    const triangle = result.matchedRules.find((r) => r.id === 'rule-2-triangle');
    expect(oval?.decisive).toBe(true);
    expect(triangle?.matched).toBe(true);
    expect(triangle?.decisive).toBe(false);
  });

  it('la regla del óvalo se evalúa antes que la del triángulo invertido', () => {
    const result = classify(101, 94, 92);
    expect(result.type).toBe('oval');
  });

  it('el triángulo tiene prioridad sobre el reloj de arena', () => {
    // |B − H| = 9 > 5, así que nunca puede ser reloj de arena.
    const result = classify(92, 70, 101);
    expect(result.type).toBe('triangle');
  });

  it('marca una única regla como decisiva', () => {
    const result = classify(98, 74, 99);
    const decisive = result.matchedRules.filter((rule) => rule.decisive);
    expect(decisive).toHaveLength(1);
    expect(decisive[0]?.id).toBe('rule-4-hourglass');
  });

  it('devuelve siempre las cinco reglas evaluadas en orden', () => {
    const result = classify(98, 74, 99);
    expect(result.matchedRules.map((rule) => rule.order)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('manejo de límites', () => {
  it('una diferencia exacta de 5 cm entre busto y cadera cuenta como medidas similares', () => {
    // H − B = 5 (no > 5) y cintura 20 cm menor que ambas: reloj de arena.
    const result = classify(90, 70, 95);
    expect(result.type).toBe('hourglass');
  });

  it('una diferencia de 5,1 cm entre cadera y busto ya es triángulo', () => {
    const result = classify(90, 70, 95.1);
    expect(result.type).toBe('triangle');
  });

  it('una diferencia de 5,1 cm entre busto y cadera ya es triángulo invertido', () => {
    const result = classify(95.1, 70, 90);
    expect(result.type).toBe('inverted-triangle');
  });

  it('una diferencia exacta de 20 cm con la cintura sí permite reloj de arena', () => {
    const result = classify(95, 75, 95);
    expect(result.type).toBe('hourglass');
    expect(result.calculatedDifferences.bustWaistDifference).toBe(20);
    expect(result.calculatedDifferences.hipsWaistDifference).toBe(20);
  });

  it('19,9 cm de diferencia con la cintura ya no es reloj de arena', () => {
    const result = classify(95, 75.1, 95);
    expect(result.type).toBe('rectangle');
  });

  it('una diferencia exacta de 10 cm con la cintura no entra por la condición "menor de 10"', () => {
    // |B − C| = 10 exacto, así que la segunda condición del óvalo no se cumple.
    const result = classify(95, 85, 95);
    expect(result.type).toBe('rectangle');
    const oval = result.matchedRules.find((r) => r.id === 'rule-1-oval');
    expect(oval?.matched).toBe(false);
  });

  it('9,9 cm de diferencia con busto y cadera sí es óvalo', () => {
    const result = classify(95, 85.1, 95);
    expect(result.type).toBe('oval');
  });

  it('la cintura igual al busto y a la cadera es óvalo', () => {
    const result = classify(95, 95, 95);
    expect(result.type).toBe('oval');
  });
});

describe('predominancia de la cintura', () => {
  it('cintura mayor que busto y cadera es óvalo', () => {
    const result = classify(90, 100, 92);
    expect(result.type).toBe('oval');
  });

  it('cintura mayor que el busto pero mucho menor que la cadera es triángulo', () => {
    const result = classify(80, 92, 115);
    expect(result.type).toBe('triangle');
  });

  it('cintura mayor que la cadera pero mucho menor que el busto es triángulo invertido', () => {
    const result = classify(115, 92, 80);
    expect(result.type).toBe('inverted-triangle');
  });

  it('cintura exactamente igual al busto y mayor que la cadera es óvalo', () => {
    const result = classify(95, 95, 90);
    expect(result.type).toBe('oval');
  });
});

describe('valores decimales', () => {
  it('clasifica correctamente con un decimal', () => {
    const result = classify(98.5, 74.5, 99.5);
    expect(result.type).toBe('hourglass');
    expect(result.calculatedDifferences.differenceBustHips).toBe(1);
  });

  it('no sufre errores de coma flotante en los umbrales', () => {
    // 100,3 − 80,3 = 20 exacto; en coma flotante daría 19.999999999999996.
    const result = classify(100.3, 80.3, 100.3);
    expect(result.calculatedDifferences.bustWaistDifference).toBe(20);
    expect(result.type).toBe('hourglass');
  });

  it('conserva los decimales de las medidas registradas', () => {
    const result = classify(92.5, 70.5, 93.5);
    expect(result.measurements.bust).toBe(92.5);
    expect(result.measurements.waist).toBe(70.5);
    expect(result.measurements.hips).toBe(93.5);
  });
});

describe('medidas iguales y casos extremos', () => {
  it('tres medidas idénticas dan óvalo', () => {
    const result = classify(100, 100, 100);
    expect(result.type).toBe('oval');
  });

  it('valores muy pequeños no rompen el algoritmo', () => {
    const result = classify(46, 45, 46);
    expect(result.type).toBe('oval');
    expect(result.warnings.some((w) => w.code === 'out-of-common-range')).toBe(false);
  });

  it('valores por debajo del rango habitual avisan pero no fallan', () => {
    const result = classify(20, 18, 20);
    expect(result.type).toBe('oval');
    expect(result.warnings.some((w) => w.code === 'out-of-common-range')).toBe(true);
  });

  it('valores muy grandes siguen clasificando', () => {
    const result = classify(219, 205, 219.5);
    expect(result.type).toBe('rectangle');
    expect(result.warnings).toHaveLength(0);
  });

  it('valores por encima del rango habitual avisan', () => {
    const result = classify(260, 240, 258);
    expect(result.warnings.some((w) => w.code === 'out-of-common-range')).toBe(true);
  });
});

describe('entradas no válidas', () => {
  it('rechaza texto', () => {
    expect(() =>
      classifyBodyShape({
        bust: Number('noventa'),
        waist: 70,
        hips: 95,
      }),
    ).toThrow(InvalidMeasurementsError);
  });

  it('rechaza NaN', () => {
    expect(() => classify(Number.NaN, 70, 95)).toThrow(InvalidMeasurementsError);
  });

  it('rechaza Infinity', () => {
    expect(() => classify(Number.POSITIVE_INFINITY, 70, 95)).toThrow(
      InvalidMeasurementsError,
    );
  });

  it('rechaza valores negativos', () => {
    expect(() => classify(-90, 70, 95)).toThrow(InvalidMeasurementsError);
  });

  it('rechaza el cero', () => {
    expect(() => classify(90, 0, 95)).toThrow(InvalidMeasurementsError);
  });

  it('rechaza campos vacíos', () => {
    expect(() =>
      classifyBodyShape({
        bust: undefined as unknown as number,
        waist: 70,
        hips: 95,
      }),
    ).toThrow(InvalidMeasurementsError);
  });

  it('rechaza una altura no numérica cuando se envía', () => {
    expect(() =>
      classifyBodyShape({ bust: 98, waist: 74, hips: 99, height: Number.NaN }),
    ).toThrow(InvalidMeasurementsError);
  });

  it('acepta que la altura no venga', () => {
    const result = classify(98, 74, 99);
    expect(result.measurements.height).toBeUndefined();
  });

  it('guarda la altura cuando se envía, sin alterar la clasificación', () => {
    const withHeight = classifyBodyShape({ bust: 98, waist: 74, hips: 99, height: 165 });
    const withoutHeight = classify(98, 74, 99);
    expect(withHeight.measurements.height).toBe(165);
    expect(withHeight.type).toBe(withoutHeight.type);
  });
});

describe('estabilidad y forma del resultado', () => {
  it('devuelve el mismo resultado al repetir la función', () => {
    const first = classify(98, 74, 99);
    const second = classify(98, 74, 99);
    expect(second).toEqual(first);
  });

  it('no muta la entrada', () => {
    const input = { bust: 98, waist: 74, hips: 99 };
    const copy = { ...input };
    classifyBodyShape(input);
    expect(input).toEqual(copy);
  });

  it('incluye todos los campos esperados', () => {
    const result = classify(98, 74, 99);
    expect(Object.keys(result).sort()).toEqual(
      [
        'algorithmVersion',
        'calculatedDifferences',
        'explanation',
        'matchedRules',
        'measurements',
        'name',
        'recommendations',
        'shortName',
        'type',
        'visualObjective',
        'warnings',
      ].sort(),
    );
  });

  it('usa la versión 1.0.0 del algoritmo', () => {
    expect(classify(98, 74, 99).algorithmVersion).toBe(ALGORITHM_VERSION);
    expect(ALGORITHM_VERSION).toBe('1.0.0');
  });

  it('cada silueta trae recomendaciones completas', () => {
    const cases: Array<[BodyShapeType, [number, number, number]]> = [
      ['hourglass', [98, 74, 99]],
      ['rectangle', [96, 82, 95]],
      ['triangle', [92, 73, 101]],
      ['inverted-triangle', [104, 80, 95]],
      ['oval', [100, 96, 98]],
    ];

    for (const [type, [bust, waist, hips]] of cases) {
      const result = classify(bust, waist, hips);
      expect(result.type).toBe(type);
      expect(result.recommendations.id).toBe(type);
      expect(result.recommendations.tops.length).toBeGreaterThan(0);
      expect(result.recommendations.necklines.length).toBeGreaterThan(0);
      expect(result.recommendations.pants.length).toBeGreaterThan(0);
      expect(result.recommendations.skirts.length).toBeGreaterThan(0);
      expect(result.recommendations.dresses.length).toBeGreaterThan(0);
      expect(result.recommendations.jackets.length).toBeGreaterThan(0);
      expect(result.recommendations.fabrics.length).toBeGreaterThan(0);
      expect(result.recommendations.prints.length).toBeGreaterThan(0);
      expect(result.recommendations.accessories.length).toBeGreaterThan(0);
      expect(result.recommendations.stylingTips.length).toBeGreaterThan(0);
      expect(result.recommendations.outfitExamples).toHaveLength(3);
      expect(result.visualObjective.length).toBeGreaterThan(10);
      expect(result.explanation.length).toBeGreaterThan(20);
    }
  });

  it('cada silueta ofrece los tres tipos de ocasión', () => {
    const result = classify(98, 74, 99);
    expect(result.recommendations.outfitExamples.map((o) => o.occasion)).toEqual([
      'Casual',
      'Profesional',
      'Evento o salida especial',
    ]);
  });

  it('la explicación menciona las diferencias reales', () => {
    const result = classify(92, 73, 101);
    expect(result.explanation).toContain('9 cm');
    expect(decisiveRule('triangle', 92, 73, 101)?.id).toBe('rule-2-triangle');
  });
});

describe('calculateDifferences', () => {
  it('calcula todas las diferencias', () => {
    const differences = calculateDifferences({ bust: 98, waist: 74, hips: 99 });
    expect(differences).toEqual({
      differenceBustHips: 1,
      hipsMinusBust: 1,
      bustMinusHips: -1,
      bustWaistDifference: 24,
      hipsWaistDifference: 25,
      averageBustHips: 98.5,
      averageWaistDifference: 24.5,
    });
  });

  it('redondea de forma estable', () => {
    expect(roundTo(19.999999999999996)).toBe(20);
    expect(roundTo(0.1 + 0.2)).toBe(0.3);
  });

  it('formatea centímetros con coma decimal', () => {
    expect(formatCm(92)).toBe('92');
    expect(formatCm(92.5)).toBe('92,5');
    expect(formatCm(92.0)).toBe('92');
  });
});

describe('avisos informativos', () => {
  it('avisa cuando la cintura es la medida más amplia', () => {
    const warnings = buildWarnings({ bust: 90, waist: 100, hips: 92 });
    expect(warnings.some((w) => w.code === 'waist-largest')).toBe(true);
  });

  it('avisa cuando la cintura supera solo al busto', () => {
    const warnings = buildWarnings({ bust: 80, waist: 92, hips: 115 });
    expect(warnings.some((w) => w.code === 'waist-over-bust')).toBe(true);
  });

  it('avisa cuando la cintura supera solo a la cadera', () => {
    const warnings = buildWarnings({ bust: 115, waist: 92, hips: 80 });
    expect(warnings.some((w) => w.code === 'waist-over-hips')).toBe(true);
  });

  it('avisa ante diferencias muy poco habituales', () => {
    const warnings = buildWarnings({ bust: 130, waist: 70, hips: 128 });
    expect(warnings.some((w) => w.code === 'extreme-difference')).toBe(true);
  });

  it('no genera avisos en un caso habitual', () => {
    expect(buildWarnings({ bust: 98, waist: 74, hips: 99 })).toHaveLength(0);
    expect(needsExtraConfirmation({ bust: 98, waist: 74, hips: 99 })).toBe(false);
  });

  it('pide confirmación adicional cuando hay avisos', () => {
    expect(needsExtraConfirmation({ bust: 90, waist: 100, hips: 92 })).toBe(true);
  });
});

describe('esquema del formulario', () => {
  const valid = { bust: '98', waist: '74', hips: '99', height: '' };

  it('acepta medidas válidas y las convierte a número', () => {
    const parsed = measurementsSchema.parse(valid);
    expect(parsed).toEqual({ bust: 98, waist: 74, hips: 99, height: undefined });
  });

  it('acepta coma decimal', () => {
    const parsed = measurementsSchema.parse({ ...valid, bust: '98,5' });
    expect(parsed.bust).toBe(98.5);
  });

  it('acepta punto decimal', () => {
    const parsed = measurementsSchema.parse({ ...valid, bust: '101.3' });
    expect(parsed.bust).toBe(101.3);
  });

  it('rechaza campos vacíos con un mensaje específico', () => {
    const result = measurementsSchema.safeParse({ ...valid, bust: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Ingresa la medida de tu busto.');
    }
  });

  it('rechaza texto', () => {
    const result = measurementsSchema.safeParse({ ...valid, waist: 'setenta' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('La medida debe ser un número válido.');
    }
  });

  it('rechaza valores negativos', () => {
    const result = measurementsSchema.safeParse({ ...valid, hips: '-99' });
    expect(result.success).toBe(false);
  });

  it('rechaza valores fuera de rango', () => {
    expect(measurementsSchema.safeParse({ ...valid, bust: '10' }).success).toBe(false);
    expect(measurementsSchema.safeParse({ ...valid, bust: '400' }).success).toBe(false);
  });

  it('acepta exactamente los límites del rango', () => {
    expect(
      measurementsSchema.safeParse({ ...valid, bust: String(MIN_MEASUREMENT_CM) }).success,
    ).toBe(true);
    expect(
      measurementsSchema.safeParse({ ...valid, bust: String(MAX_MEASUREMENT_CM) }).success,
    ).toBe(true);
  });

  it('rechaza más de un decimal', () => {
    const result = measurementsSchema.safeParse({ ...valid, bust: '98.55' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('máximo un decimal');
    }
  });

  it('acepta una altura válida y rechaza una fuera de rango', () => {
    expect(measurementsSchema.parse({ ...valid, height: '165' }).height).toBe(165);
    expect(measurementsSchema.safeParse({ ...valid, height: '40' }).success).toBe(false);
  });

  it('el resultado del esquema alimenta al algoritmo sin conversiones extra', () => {
    const parsed = measurementsSchema.parse({ bust: '92', waist: '73', hips: '101', height: '' });
    expect(classifyBodyShape(parsed).type).toBe('triangle');
  });
});
