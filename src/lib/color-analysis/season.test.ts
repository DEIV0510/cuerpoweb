import { describe, expect, it } from 'vitest';
import {
  ColorimetryError,
  SEASON_VERSION,
  analyzeSeason,
  assessColorForSeason,
  resolveChroma,
  resolveDepth,
  resolveUndertone,
  type ColorimetryAnswers,
} from './season';
import { COLORIMETRY_SURVEY } from '@/data/colorimetry-survey';
import { SEASON_PROFILES } from '@/data/color-seasons';

/** Respuestas base neutras. */
function answers(overrides: Partial<ColorimetryAnswers> = {}): ColorimetryAnswers {
  return {
    veins: 'unsure',
    metal: 'both',
    sun: 'both',
    hair: 'medium',
    eyes: 'hazel',
    white: 'both',
    intensity: 'depends',
    ...overrides,
  };
}

describe('resolveUndertone', () => {
  it('suma señales cálidas', () => {
    expect(
      resolveUndertone(answers({ veins: 'warm', metal: 'gold', sun: 'tan', white: 'cream' })),
    ).toBe('warm');
  });

  it('suma señales frías', () => {
    expect(
      resolveUndertone(answers({ veins: 'cool', metal: 'silver', sun: 'burn', white: 'pure' })),
    ).toBe('cool');
  });

  it('es neutro cuando se empatan', () => {
    expect(resolveUndertone(answers({ veins: 'warm', metal: 'silver' }))).toBe('neutral');
  });

  it('el cabello pelirrojo suma calidez', () => {
    expect(resolveUndertone(answers({ hair: 'red', metal: 'gold' }))).toBe('warm');
  });
});

describe('resolveDepth y resolveChroma', () => {
  it('cabello y ojos claros dan colorido claro', () => {
    expect(resolveDepth(answers({ hair: 'light', eyes: 'light' }), 'neutral')).toBe('light');
  });

  it('cabello y ojos oscuros dan colorido profundo', () => {
    expect(resolveDepth(answers({ hair: 'deep', eyes: 'deep' }), 'neutral')).toBe('deep');
  });

  it('en empate, el color vivo inclina a profundo', () => {
    expect(resolveDepth(answers({ hair: 'medium', eyes: 'hazel' }), 'bright')).toBe('deep');
    expect(resolveDepth(answers({ hair: 'medium', eyes: 'hazel' }), 'soft')).toBe('light');
  });

  it('lee el croma', () => {
    expect(resolveChroma(answers({ intensity: 'bright' }))).toBe('bright');
    expect(resolveChroma(answers({ intensity: 'soft' }))).toBe('soft');
    expect(resolveChroma(answers({ intensity: 'depends' }))).toBe('neutral');
  });
});

describe('analyzeSeason · las cuatro estaciones', () => {
  it('cálida y clara es Primavera', () => {
    const result = analyzeSeason(
      answers({
        veins: 'warm',
        metal: 'gold',
        sun: 'tan',
        white: 'cream',
        hair: 'light',
        eyes: 'light',
        intensity: 'bright',
      }),
    );
    expect(result.season).toBe('spring');
    expect(result.undertone).toBe('warm');
    expect(result.depth).toBe('light');
  });

  it('cálida y profunda es Otoño', () => {
    const result = analyzeSeason(
      answers({
        veins: 'warm',
        metal: 'gold',
        sun: 'tan',
        white: 'cream',
        hair: 'deep',
        eyes: 'deep',
        intensity: 'soft',
      }),
    );
    expect(result.season).toBe('autumn');
    expect(result.undertone).toBe('warm');
    expect(result.depth).toBe('deep');
  });

  it('fría y clara es Verano', () => {
    const result = analyzeSeason(
      answers({
        veins: 'cool',
        metal: 'silver',
        sun: 'burn',
        white: 'pure',
        hair: 'light',
        eyes: 'light',
        intensity: 'soft',
      }),
    );
    expect(result.season).toBe('summer');
    expect(result.undertone).toBe('cool');
  });

  it('fría y profunda es Invierno', () => {
    const result = analyzeSeason(
      answers({
        veins: 'cool',
        metal: 'silver',
        sun: 'burn',
        white: 'pure',
        hair: 'deep',
        eyes: 'deep',
        intensity: 'bright',
      }),
    );
    expect(result.season).toBe('winter');
    expect(result.undertone).toBe('cool');
    expect(result.depth).toBe('deep');
  });

  it('el subtono neutro se resuelve por croma y profundidad', () => {
    const brillanteProfundo = analyzeSeason(
      answers({ hair: 'deep', eyes: 'deep', intensity: 'bright' }),
    );
    expect(brillanteProfundo.undertone).toBe('neutral');
    expect(brillanteProfundo.season).toBe('winter');

    const suaveClaro = analyzeSeason(
      answers({ hair: 'light', eyes: 'light', intensity: 'soft' }),
    );
    expect(suaveClaro.season).toBe('summer');
  });

  it('es determinista', () => {
    const input = answers({ veins: 'warm', hair: 'light' });
    expect(analyzeSeason(input)).toEqual(analyzeSeason(input));
  });

  it('marca la versión', () => {
    expect(analyzeSeason(answers()).version).toBe(SEASON_VERSION);
    expect(SEASON_VERSION).toBe('1.0.0');
  });

  it('rechaza un cuestionario incompleto', () => {
    expect(() => analyzeSeason({ veins: 'warm' })).toThrow(ColorimetryError);
  });
});

describe('assessColorForSeason', () => {
  it('el fucsia favorece a Invierno y pide cuidado en Otoño', () => {
    expect(assessColorForSeason('pink', 'winter')).toBe('favorece');
    expect(assessColorForSeason('pink', 'autumn')).toBe('cuidado');
  });

  it('el coral favorece a Primavera y Otoño', () => {
    expect(assessColorForSeason('coral', 'spring')).toBe('favorece');
    expect(assessColorForSeason('coral', 'autumn')).toBe('favorece');
  });

  it('el naranja pide cuidado en Verano', () => {
    expect(assessColorForSeason('coral', 'summer')).toBe('cuidado');
  });

  it('el negro favorece a Invierno pero apaga a Primavera', () => {
    expect(assessColorForSeason('black', 'winter')).toBe('favorece');
    expect(assessColorForSeason('black', 'spring')).toBe('cuidado');
  });

  it('lo no listado es neutral', () => {
    expect(assessColorForSeason('white', 'spring')).toBe('neutral');
  });

  it('cada estación tiene favorables y de cuidado', () => {
    for (const season of ['spring', 'summer', 'autumn', 'winter'] as const) {
      const favorece = (['pink', 'coral', 'blue', 'green', 'black'] as const).some(
        (f) => assessColorForSeason(f, season) === 'favorece',
      );
      const cuidado = (['pink', 'coral', 'black', 'yellow', 'beige'] as const).some(
        (f) => assessColorForSeason(f, season) === 'cuidado',
      );
      expect(favorece).toBe(true);
      expect(cuidado).toBe(true);
    }
  });
});

describe('integridad de los datos', () => {
  it('el cuestionario cubre los siete campos', () => {
    const fields = COLORIMETRY_SURVEY.map((q) => q.field);
    expect(new Set(fields).size).toBe(7);
  });

  it('cada estación tiene paleta, neutros y consejos', () => {
    for (const profile of Object.values(SEASON_PROFILES)) {
      expect(profile.palette.length).toBeGreaterThanOrEqual(6);
      expect(profile.neutrals.length).toBeGreaterThan(0);
      expect(profile.tips.length).toBeGreaterThan(0);
      expect(profile.metal.length).toBeGreaterThan(0);
    }
  });
});
