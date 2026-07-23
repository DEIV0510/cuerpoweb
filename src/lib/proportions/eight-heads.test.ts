import { describe, expect, it } from 'vitest';
import {
  EIGHT_HEADS_VERSION,
  EightHeadsError,
  HEAD_TOLERANCE,
  analyzeEightHeads,
  formatHeads,
  resolveStrategy,
} from './eight-heads';

/** Caso de referencia: 1,62 m con cabeza de 20 cm, todo en proporción. */
const REFERENCE_BODY = { head: 20, torso: 40, rise: 20, legs: 80 };

describe('analyzeEightHeads · cuerpo de referencia', () => {
  it('el cuerpo ideal mide 8 cabezas', () => {
    const result = analyzeEightHeads(REFERENCE_BODY);
    expect(result.totalHeads).toBe(8);
    expect(result.totalCm).toBe(160);
  });

  it('los tres tramos quedan en proporción', () => {
    const result = analyzeEightHeads(REFERENCE_BODY);
    expect(result.segments.torso.balance).toBe('balanced');
    expect(result.segments.rise.balance).toBe('balanced');
    expect(result.segments.legs.balance).toBe('balanced');
    expect(result.strategy).toBe('balanced');
  });

  it('convierte cada tramo a cabezas', () => {
    const result = analyzeEightHeads(REFERENCE_BODY);
    expect(result.segments.torso.heads).toBe(2);
    expect(result.segments.rise.heads).toBe(1);
    expect(result.segments.legs.heads).toBe(4);
    expect(result.segments.torso.difference).toBe(0);
  });

  it('usa la versión 1.0.0 del método', () => {
    expect(analyzeEightHeads(REFERENCE_BODY).version).toBe(EIGHT_HEADS_VERSION);
    expect(EIGHT_HEADS_VERSION).toBe('1.0.0');
  });

  it('no genera avisos en un cuerpo de referencia', () => {
    expect(analyzeEightHeads(REFERENCE_BODY).warnings).toEqual([]);
  });
});

describe('clasificación de cada tramo', () => {
  it('detecta un torso largo', () => {
    const result = analyzeEightHeads({ ...REFERENCE_BODY, torso: 47 });
    expect(result.segments.torso.balance).toBe('long');
    expect(result.segments.torso.heads).toBe(2.35);
    expect(result.segments.torso.differenceCm).toBe(7);
  });

  it('detecta un torso corto', () => {
    const result = analyzeEightHeads({ ...REFERENCE_BODY, torso: 33 });
    expect(result.segments.torso.balance).toBe('short');
    expect(result.segments.torso.difference).toBeLessThan(0);
  });

  it('detecta un tiro largo', () => {
    const result = analyzeEightHeads({ ...REFERENCE_BODY, rise: 26 });
    expect(result.segments.rise.balance).toBe('long');
  });

  it('detecta un tiro corto', () => {
    const result = analyzeEightHeads({ ...REFERENCE_BODY, rise: 14 });
    expect(result.segments.rise.balance).toBe('short');
  });

  it('detecta piernas largas', () => {
    const result = analyzeEightHeads({ ...REFERENCE_BODY, legs: 90 });
    expect(result.segments.legs.balance).toBe('long');
  });

  it('detecta piernas cortas', () => {
    const result = analyzeEightHeads({ ...REFERENCE_BODY, legs: 70 });
    expect(result.segments.legs.balance).toBe('short');
  });
});

describe('manejo del margen de tolerancia', () => {
  it('una diferencia justo en el margen sigue siendo proporción', () => {
    // 0,25 cabezas exactas = 5 cm con una cabeza de 20 cm.
    const result = analyzeEightHeads({ ...REFERENCE_BODY, torso: 45 });
    expect(result.segments.torso.difference).toBe(HEAD_TOLERANCE);
    expect(result.segments.torso.balance).toBe('balanced');
  });

  it('pasado el margen ya se considera largo', () => {
    const result = analyzeEightHeads({ ...REFERENCE_BODY, torso: 45.5 });
    expect(result.segments.torso.balance).toBe('long');
  });

  it('el margen también aplica hacia abajo', () => {
    const justo = analyzeEightHeads({ ...REFERENCE_BODY, legs: 75 });
    const pasado = analyzeEightHeads({ ...REFERENCE_BODY, legs: 74.5 });
    expect(justo.segments.legs.balance).toBe('balanced');
    expect(pasado.segments.legs.balance).toBe('short');
  });
});

describe('estrategia general', () => {
  it('torso largo con piernas cortas sugiere elevar la cintura', () => {
    const result = analyzeEightHeads({ head: 20, torso: 48, rise: 20, legs: 72 });
    expect(result.strategy).toBe('raise-waist');
  });

  it('torso corto con piernas largas sugiere alargar el torso', () => {
    const result = analyzeEightHeads({ head: 20, torso: 33, rise: 20, legs: 88 });
    expect(result.strategy).toBe('lengthen-torso');
  });

  it('una desviación pequeña mantiene el equilibrio', () => {
    const result = analyzeEightHeads({ head: 20, torso: 41, rise: 20, legs: 81 });
    expect(result.strategy).toBe('balanced');
  });

  it('resolveStrategy compara proporciones, no centímetros', () => {
    const grande = analyzeEightHeads({ head: 25, torso: 60, rise: 25, legs: 90 });
    const pequeno = analyzeEightHeads({ head: 20, torso: 48, rise: 20, legs: 72 });
    // Las dos personas tienen la misma relación torso/piernas.
    expect(resolveStrategy(grande.segments.torso, grande.segments.legs)).toBe(
      resolveStrategy(pequeno.segments.torso, pequeno.segments.legs),
    );
  });
});

describe('independencia de la estatura', () => {
  it('dos personas de distinta altura con la misma proporción dan el mismo resultado', () => {
    const baja = analyzeEightHeads({ head: 19, torso: 38, rise: 19, legs: 76 });
    const alta = analyzeEightHeads({ head: 23, torso: 46, rise: 23, legs: 92 });

    expect(baja.totalHeads).toBe(alta.totalHeads);
    expect(baja.segments.torso.heads).toBe(alta.segments.torso.heads);
    expect(baja.strategy).toBe(alta.strategy);
    expect(baja.totalCm).not.toBe(alta.totalCm);
  });
});

describe('avisos', () => {
  it('avisa cuando el total se aleja mucho de 8 cabezas', () => {
    const result = analyzeEightHeads({ head: 30, torso: 40, rise: 20, legs: 80 });
    expect(result.totalHeads).toBeLessThan(6.5);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('avisa cuando un tramo se aleja más de una cabeza', () => {
    const result = analyzeEightHeads({ head: 20, torso: 65, rise: 20, legs: 80 });
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});

describe('entradas no válidas', () => {
  it('rechaza medidas en cero', () => {
    expect(() => analyzeEightHeads({ ...REFERENCE_BODY, head: 0 })).toThrow(
      EightHeadsError,
    );
  });

  it('rechaza medidas negativas', () => {
    expect(() => analyzeEightHeads({ ...REFERENCE_BODY, legs: -80 })).toThrow(
      EightHeadsError,
    );
  });

  it('rechaza NaN', () => {
    expect(() => analyzeEightHeads({ ...REFERENCE_BODY, torso: Number.NaN })).toThrow(
      EightHeadsError,
    );
  });

  it('rechaza Infinity', () => {
    expect(() =>
      analyzeEightHeads({ ...REFERENCE_BODY, rise: Number.POSITIVE_INFINITY }),
    ).toThrow(EightHeadsError);
  });
});

describe('estabilidad y formato', () => {
  it('devuelve el mismo resultado al repetir', () => {
    expect(analyzeEightHeads(REFERENCE_BODY)).toEqual(analyzeEightHeads(REFERENCE_BODY));
  });

  it('no muta la entrada', () => {
    const input = { ...REFERENCE_BODY };
    analyzeEightHeads(input);
    expect(input).toEqual(REFERENCE_BODY);
  });

  it('formatea las cabezas con coma decimal', () => {
    expect(formatHeads(2)).toBe('2');
    expect(formatHeads(1.75)).toBe('1,75');
    expect(formatHeads(1.7)).toBe('1,7');
    expect(formatHeads(4.05)).toBe('4,05');
  });
});
