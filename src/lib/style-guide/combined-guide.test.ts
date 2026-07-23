import { describe, expect, it } from 'vitest';
import {
  COMBINED_GUIDE_VERSION,
  JACKET,
  RISE,
  SHOE,
  TUCK,
  buildCombinedGuide,
  type FormulaItem,
} from './combined-guide';
import { classifyBodyShape } from '@/lib/body-shape/classify-body-shape';
import { analyzeEightHeads } from '@/lib/proportions/eight-heads';
import { COMBO_INSIGHTS, SHAPE_STYLE } from '@/data/combined-guide-content';
import { BODY_SHAPE_ORDER } from '@/data/body-shapes';

/** Cuerpos verticales de referencia para las pruebas. */
const VERTICAL = {
  balanced: { head: 20, torso: 40, rise: 20, legs: 80 },
  longTorso: { head: 20, torso: 48, rise: 20, legs: 72 },
  shortTorso: { head: 20, torso: 33, rise: 20, legs: 88 },
  // 14 cm sobre una cabeza de 20 son 0,7 cabezas: fuera del margen de 0,25.
  shortRise: { head: 20, torso: 48, rise: 14, legs: 72 },
};

/** Medidas de cada silueta. */
const SHAPES = {
  hourglass: { bust: 98, waist: 74, hips: 99 },
  rectangle: { bust: 96, waist: 82, hips: 95 },
  triangle: { bust: 92, waist: 73, hips: 101 },
  invertedTriangle: { bust: 104, waist: 80, hips: 95 },
  oval: { bust: 100, waist: 96, hips: 98 },
};

function guide(
  shapeInput: { bust: number; waist: number; hips: number },
  verticalInput: { head: number; torso: number; rise: number; legs: number },
) {
  return buildCombinedGuide(
    classifyBodyShape(shapeInput),
    analyzeEightHeads(verticalInput),
  );
}

function item(formula: FormulaItem[], id: FormulaItem['id']): FormulaItem {
  const found = formula.find((entry) => entry.id === id);
  if (!found) throw new Error(`Falta la decisión ${id} en la fórmula`);
  return found;
}

describe('buildCombinedGuide · forma del resultado', () => {
  it('devuelve las seis decisiones de la fórmula', () => {
    const result = guide(SHAPES.hourglass, VERTICAL.balanced);
    expect(result.formula.map((entry) => entry.id)).toEqual([
      'rise',
      'tuck',
      'jacket',
      'shoe',
      'neckline',
      'focus',
    ]);
  });

  it('cada decisión trae valor y motivo', () => {
    const result = guide(SHAPES.triangle, VERTICAL.longTorso);
    for (const entry of result.formula) {
      expect(entry.label.length).toBeGreaterThan(3);
      expect(entry.value.length).toBeGreaterThan(3);
      expect(entry.reason.length).toBeGreaterThan(20);
    }
  });

  it('el título une silueta y estrategia vertical', () => {
    const result = guide(SHAPES.hourglass, VERTICAL.longTorso);
    expect(result.headline).toBe('Reloj de arena · Sube la línea de tu cintura');
  });

  it('conserva los tres outfits de la silueta con su ajuste vertical', () => {
    const result = guide(SHAPES.oval, VERTICAL.shortTorso);
    expect(result.outfits).toHaveLength(3);
    for (const outfit of result.outfits) {
      expect(outfit.verticalAdjustment.length).toBeGreaterThan(20);
      expect(outfit.top.length).toBeGreaterThan(3);
    }
  });

  it('marca la versión de la guía', () => {
    expect(guide(SHAPES.rectangle, VERTICAL.balanced).version).toBe(
      COMBINED_GUIDE_VERSION,
    );
    expect(COMBINED_GUIDE_VERSION).toBe('1.0.0');
  });

  it('es determinista', () => {
    expect(guide(SHAPES.hourglass, VERTICAL.longTorso)).toEqual(
      guide(SHAPES.hourglass, VERTICAL.longTorso),
    );
  });
});

describe('decisión del tiro', () => {
  it('torso largo con piernas cortas pide tiro alto', () => {
    const result = guide(SHAPES.rectangle, VERTICAL.longTorso);
    expect(item(result.formula, 'rise').value).toBe(RISE.high);
  });

  it('torso corto pide tiro medio', () => {
    const result = guide(SHAPES.rectangle, VERTICAL.shortTorso);
    expect(item(result.formula, 'rise').value).toBe(RISE.mid);
  });

  it('un tiro corto manda sobre la estrategia y baja a tiro medio', () => {
    const result = guide(SHAPES.rectangle, VERTICAL.shortRise);
    expect(result.formula[0].value).toBe(RISE.mid);
    expect(item(result.formula, 'rise').reason).toContain('menos de una cabeza');
  });

  it('la silueta óvalo con vertical equilibrada pide tiro cómodo', () => {
    const result = guide(SHAPES.oval, VERTICAL.balanced);
    expect(item(result.formula, 'rise').value).toBe(RISE.comfortable);
  });

  it('vertical equilibrada deja el tiro libre en el resto de siluetas', () => {
    const result = guide(SHAPES.hourglass, VERTICAL.balanced);
    expect(item(result.formula, 'rise').value).toBe(RISE.free);
  });
});

describe('decisión de la blusa', () => {
  it('la estrategia de subir la cintura pide blusa por dentro', () => {
    const result = guide(SHAPES.hourglass, VERTICAL.longTorso);
    expect(item(result.formula, 'tuck').value).toBe(TUCK.in);
  });

  it('la estrategia de alargar el torso pide blusa por fuera', () => {
    const result = guide(SHAPES.hourglass, VERTICAL.shortTorso);
    expect(item(result.formula, 'tuck').value).toBe(TUCK.out);
  });

  it('la silueta óvalo mantiene la blusa por fuera aunque haya que subir la cintura', () => {
    const result = guide(SHAPES.oval, VERTICAL.longTorso);
    expect(item(result.formula, 'tuck').value).toBe(TUCK.outFlowing);
    expect(item(result.formula, 'tuck').reason).toContain('tercera prenda');
  });

  it('vertical equilibrada deja la elección libre', () => {
    const result = guide(SHAPES.rectangle, VERTICAL.balanced);
    expect(item(result.formula, 'tuck').value).toBe(TUCK.free);
  });
});

describe('decisión de la chaqueta', () => {
  it('torso largo pide chaqueta corta', () => {
    const result = guide(SHAPES.rectangle, VERTICAL.longTorso);
    expect(item(result.formula, 'jacket').value).toBe(JACKET.short);
  });

  it('torso corto pide chaqueta larga', () => {
    const result = guide(SHAPES.rectangle, VERTICAL.shortTorso);
    expect(item(result.formula, 'jacket').value).toBe(JACKET.long);
  });

  it('con torso en proporción y piernas cortas no pasa de la cadera', () => {
    const result = guide(SHAPES.rectangle, { head: 20, torso: 40, rise: 20, legs: 72 });
    expect(item(result.formula, 'jacket').value).toBe(JACKET.hip);
  });

  it('el triángulo invertido evita hombreras', () => {
    const result = guide(SHAPES.invertedTriangle, VERTICAL.longTorso);
    expect(item(result.formula, 'jacket').reason).toContain('hombro natural');
  });
});

describe('decisión del zapato', () => {
  it('piernas cortas piden altura y continuidad de tono', () => {
    const result = guide(SHAPES.hourglass, VERTICAL.longTorso);
    expect(item(result.formula, 'shoe').value).toBe(SHOE.height);
  });

  it('piernas largas no necesitan altura', () => {
    const result = guide(SHAPES.hourglass, VERTICAL.shortTorso);
    expect(item(result.formula, 'shoe').value).toBe(SHOE.any);
  });

  it('piernas en proporción dejan la elección libre', () => {
    const result = guide(SHAPES.hourglass, VERTICAL.balanced);
    expect(item(result.formula, 'shoe').value).toBe(SHOE.free);
  });
});

describe('decisión del escote', () => {
  it('usa el escote propio de la silueta cuando el torso está en proporción', () => {
    const result = guide(SHAPES.triangle, VERTICAL.balanced);
    expect(item(result.formula, 'neckline').value).toBe(SHAPE_STYLE.triangle.neckline);
  });

  it('con torso corto cambia al escote vertical de esa silueta', () => {
    const result = guide(SHAPES.triangle, VERTICAL.shortTorso);
    expect(item(result.formula, 'neckline').value).toBe(
      SHAPE_STYLE.triangle.verticalNeckline,
    );
    expect(item(result.formula, 'neckline').reason).toContain('torso corto');
  });

  it('si la silueta ya pide un escote vertical, no cambia', () => {
    const result = guide(SHAPES.invertedTriangle, VERTICAL.shortTorso);
    expect(item(result.formula, 'neckline').value).toBe(
      SHAPE_STYLE['inverted-triangle'].verticalNeckline,
    );
  });
});

describe('ajuste vertical de los outfits', () => {
  it('añade la nota del zapato cuando las piernas son cortas', () => {
    const result = guide(SHAPES.hourglass, VERTICAL.longTorso);
    expect(result.outfits[0].verticalAdjustment).toContain('tono cercano');
  });

  it('no añade la nota del zapato cuando las piernas están en proporción', () => {
    const result = guide(SHAPES.hourglass, VERTICAL.balanced);
    expect(result.outfits[0].verticalAdjustment).not.toContain('tono cercano');
  });

  it('el ajuste cambia con la estrategia', () => {
    const subir = guide(SHAPES.rectangle, VERTICAL.longTorso);
    const alargar = guide(SHAPES.rectangle, VERTICAL.shortTorso);
    expect(subir.outfits[0].verticalAdjustment).not.toBe(
      alargar.outfits[0].verticalAdjustment,
    );
  });
});

describe('cobertura de todas las combinaciones', () => {
  it('las cinco siluetas por las tres estrategias tienen contenido escrito', () => {
    for (const shape of BODY_SHAPE_ORDER) {
      for (const strategy of ['raise-waist', 'lengthen-torso', 'balanced'] as const) {
        const combo = COMBO_INSIGHTS[shape][strategy];
        expect(combo.summary.length).toBeGreaterThan(40);
        expect(combo.tips.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('cada silueta aporta su prenda estrella al primer consejo', () => {
    const result = guide(SHAPES.oval, VERTICAL.balanced);
    expect(result.tips[0]).toContain(SHAPE_STYLE.oval.signature);
    expect(result.tips.length).toBeGreaterThanOrEqual(3);
  });

  it('produce guía válida para las quince combinaciones', () => {
    const verticals = [VERTICAL.balanced, VERTICAL.longTorso, VERTICAL.shortTorso];

    for (const shapeInput of Object.values(SHAPES)) {
      for (const verticalInput of verticals) {
        const result = guide(shapeInput, verticalInput);
        expect(result.formula).toHaveLength(6);
        expect(result.summary.length).toBeGreaterThan(40);
        expect(result.outfits).toHaveLength(3);
      }
    }
  });
});
