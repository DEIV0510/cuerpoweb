import { describe, expect, it } from 'vitest';
import {
  STYLE_PROFILE_VERSION,
  StyleProfileError,
  deriveStyleProfile,
  type StyleAnswers,
} from './style-profile';
import {
  buildWardrobePlan,
  computeProgress,
  selectBasics,
  selectCapsules,
} from './wardrobe-plan';
import { CAPSULES, WARDROBE_BASICS } from '@/data/wardrobe-content';

/** Respuestas base para las pruebas. */
function answers(overrides: Partial<StyleAnswers> = {}): StyleAnswers {
  return {
    satisfaction: 'could-be-better',
    occasions: ['office', 'daily'],
    archetype: 'classic',
    tone: 'discreet',
    combining: 'easy',
    nothingToWear: 'weekly',
    ...overrides,
  };
}

describe('deriveStyleProfile', () => {
  it('nombra el perfil según arquetipo y tono', () => {
    const profile = deriveStyleProfile(answers({ archetype: 'classic', tone: 'discreet' }));
    expect(profile.name).toBe('Clásico sereno');
  });

  it('el tono con carácter cambia el nombre', () => {
    const profile = deriveStyleProfile(answers({ archetype: 'minimal', tone: 'statement' }));
    expect(profile.name).toBe('Minimalista con carácter');
  });

  it('traduce la confianza al combinar', () => {
    expect(deriveStyleProfile(answers({ combining: 'very-easy' })).confidence).toBe('high');
    expect(deriveStyleProfile(answers({ combining: 'easy' })).confidence).toBe('medium');
    expect(deriveStyleProfile(answers({ combining: 'tricky' })).confidence).toBe('low');
    expect(deriveStyleProfile(answers({ combining: 'hard' })).confidence).toBe('low');
  });

  it('cruza satisfacción y frecuencia para el foco', () => {
    expect(
      deriveStyleProfile(answers({ satisfaction: 'need-change', nothingToWear: 'daily' })).focus,
    ).toBe('rebuild');
    expect(
      deriveStyleProfile(answers({ satisfaction: 'satisfied', nothingToWear: 'never' })).focus,
    ).toBe('refine');
    expect(
      deriveStyleProfile(answers({ satisfaction: 'could-be-better', nothingToWear: 'never' }))
        .focus,
    ).toBe('improve');
  });

  it('conserva el orden canónico de las ocasiones', () => {
    const profile = deriveStyleProfile(answers({ occasions: ['events', 'daily', 'office'] }));
    expect(profile.occasions).toEqual(['office', 'daily', 'events']);
  });

  it('siempre entrega al menos tres prioridades', () => {
    const profile = deriveStyleProfile(answers());
    expect(profile.priorities.length).toBeGreaterThanOrEqual(3);
  });

  it('marca la versión', () => {
    expect(deriveStyleProfile(answers()).version).toBe(STYLE_PROFILE_VERSION);
    expect(STYLE_PROFILE_VERSION).toBe('1.0.0');
  });

  it('es determinista', () => {
    expect(deriveStyleProfile(answers())).toEqual(deriveStyleProfile(answers()));
  });

  it('rechaza una encuesta sin ocasiones', () => {
    expect(() => deriveStyleProfile(answers({ occasions: [] }))).toThrow(StyleProfileError);
  });
});

describe('selectBasics', () => {
  it('solo incluye básicos de las ocasiones elegidas', () => {
    const profile = deriveStyleProfile(answers({ occasions: ['home'] }));
    const basics = selectBasics(profile);
    expect(basics.length).toBeGreaterThan(0);
    for (const basic of basics) {
      expect(basic.occasions).toContain('home');
    }
  });

  it('marca como esenciales los del arquetipo', () => {
    const profile = deriveStyleProfile(answers({ archetype: 'casual', occasions: ['daily'] }));
    const basics = selectBasics(profile);
    const denim = basics.find((b) => b.id === 'denim-jacket');
    expect(denim?.essential).toBe(true);
  });

  it('pone los esenciales primero', () => {
    const profile = deriveStyleProfile(answers({ archetype: 'classic' }));
    const basics = selectBasics(profile);
    const firstNonEssential = basics.findIndex((b) => !b.essential);
    const lastEssential = basics.map((b) => b.essential).lastIndexOf(true);
    if (firstNonEssential !== -1) {
      expect(lastEssential).toBeLessThan(firstNonEssential);
    }
  });

  it('cada arquetipo tiene al menos un esencial disponible', () => {
    for (const archetype of ['classic', 'minimal', 'casual', 'eclectic'] as const) {
      const profile = deriveStyleProfile(
        answers({ archetype, occasions: ['office', 'daily', 'home', 'date', 'events'] }),
      );
      const basics = selectBasics(profile);
      expect(basics.some((b) => b.essential)).toBe(true);
    }
  });
});

describe('selectCapsules', () => {
  it('solo devuelve cápsulas del estilo y las ocasiones elegidas', () => {
    const profile = deriveStyleProfile(answers({ archetype: 'classic', occasions: ['office'] }));
    const capsules = selectCapsules(profile);
    expect(capsules.length).toBeGreaterThan(0);
    for (const capsule of capsules) {
      expect(capsule.styles).toContain('classic');
      expect(capsule.occasion).toBe('office');
    }
  });

  it('ordena por afinidad: primero el tono que coincide', () => {
    const profile = deriveStyleProfile(
      answers({ archetype: 'classic', tone: 'statement', occasions: ['office'] }),
    );
    const capsules = selectCapsules(profile);
    // La cápsula de oficina con carácter debe salir antes que la discreta.
    const eclecticIndex = capsules.findIndex((c) => c.id === 'office-eclectic');
    const classicIndex = capsules.findIndex((c) => c.id === 'office-classic');
    if (eclecticIndex !== -1 && classicIndex !== -1) {
      expect(eclecticIndex).toBeLessThan(classicIndex);
    }
  });

  it('es estable al repetir', () => {
    const profile = deriveStyleProfile(answers());
    expect(selectCapsules(profile)).toEqual(selectCapsules(profile));
  });

  it('las cinco ocasiones producen al menos una cápsula para algún estilo', () => {
    for (const occasion of ['office', 'daily', 'home', 'date', 'events'] as const) {
      const found = CAPSULES.some((c) => c.occasion === occasion);
      expect(found).toBe(true);
    }
  });
});

describe('buildWardrobePlan', () => {
  it('agrupa los básicos por categoría', () => {
    const profile = deriveStyleProfile(
      answers({ occasions: ['office', 'daily', 'date', 'events', 'home'] }),
    );
    const plan = buildWardrobePlan(profile);
    expect(plan.groups.length).toBeGreaterThan(0);
    const flat = plan.groups.flatMap((g) => g.items);
    expect(flat).toHaveLength(plan.totalBasics);
  });

  it('no deja grupos vacíos', () => {
    const profile = deriveStyleProfile(answers({ occasions: ['home'] }));
    const plan = buildWardrobePlan(profile);
    for (const group of plan.groups) {
      expect(group.items.length).toBeGreaterThan(0);
    }
  });
});

describe('computeProgress', () => {
  it('cuenta cuántos básicos tiene la persona', () => {
    const profile = deriveStyleProfile(answers());
    const plan = buildWardrobePlan(profile);
    const twoIds = new Set(plan.basics.slice(0, 2).map((b) => b.id));
    const progress = computeProgress(plan.basics, twoIds);
    expect(progress.owned).toBe(2);
    expect(progress.total).toBe(plan.basics.length);
  });

  it('calcula el porcentaje', () => {
    const profile = deriveStyleProfile(answers());
    const plan = buildWardrobePlan(profile);
    const allIds = new Set(plan.basics.map((b) => b.id));
    expect(computeProgress(plan.basics, allIds).percent).toBe(100);
    expect(computeProgress(plan.basics, new Set()).percent).toBe(0);
  });

  it('lista los esenciales que faltan', () => {
    const profile = deriveStyleProfile(answers({ archetype: 'classic' }));
    const plan = buildWardrobePlan(profile);
    const progress = computeProgress(plan.basics, new Set());
    expect(progress.missingEssentials.length).toBeGreaterThan(0);
    for (const missing of progress.missingEssentials) {
      expect(missing.essential).toBe(true);
    }
  });

  it('no lista esenciales que la persona ya tiene', () => {
    const profile = deriveStyleProfile(answers({ archetype: 'classic' }));
    const plan = buildWardrobePlan(profile);
    const allIds = new Set(plan.basics.map((b) => b.id));
    expect(computeProgress(plan.basics, allIds).missingEssentials).toHaveLength(0);
  });
});

describe('integridad de los datos', () => {
  it('todos los básicos tienen id único', () => {
    const ids = WARDROBE_BASICS.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('todos los básicos declaran al menos una ocasión y un arquetipo', () => {
    for (const basic of WARDROBE_BASICS) {
      expect(basic.occasions.length).toBeGreaterThan(0);
      expect(basic.essentialFor.length).toBeGreaterThan(0);
    }
  });

  it('todas las cápsulas tienen id único y al menos tres piezas', () => {
    const ids = CAPSULES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const capsule of CAPSULES) {
      expect(capsule.pieces.length).toBeGreaterThanOrEqual(3);
      expect(capsule.styles.length).toBeGreaterThan(0);
    }
  });
});
