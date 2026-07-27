import { describe, expect, it } from 'vitest';
import {
  COLOR_FAMILY_OPTIONS,
  COLOR_VERSION,
  classifyColor,
  colorInfoFromFamily,
  isNeutralFamily,
  rgbToHex,
  rgbToHsl,
  sampleColorAt,
  type RGB,
  type SampleSource,
} from './color';
import { COMBINE_VERSION, buildCombination } from './combine';
import { PAIR_TARGETS } from '@/data/garment-content';

describe('conversión de color', () => {
  it('convierte RGB a hexadecimal', () => {
    expect(rgbToHex({ r: 214, g: 32, b: 126 })).toBe('#D6207E');
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#FFFFFF');
  });

  it('redondea y acota los componentes', () => {
    expect(rgbToHex({ r: 213.6, g: -5, b: 300 })).toBe('#D600FF');
  });

  it('convierte RGB a HSL', () => {
    const rojo = rgbToHsl({ r: 255, g: 0, b: 0 });
    expect(Math.round(rojo.h)).toBe(0);
    expect(rojo.s).toBeCloseTo(1, 2);
    expect(rojo.l).toBeCloseTo(0.5, 2);

    const gris = rgbToHsl({ r: 128, g: 128, b: 128 });
    expect(gris.s).toBe(0);
  });
});

describe('sampleColorAt', () => {
  /** Construye una imagen de color uniforme. */
  function solid(r: number, g: number, b: number, size = 10): SampleSource {
    const data = new Uint8ClampedArray(size * size * 4);
    for (let i = 0; i < size * size; i += 1) {
      data[i * 4] = r;
      data[i * 4 + 1] = g;
      data[i * 4 + 2] = b;
      data[i * 4 + 3] = 255;
    }
    return { data, width: size, height: size };
  }

  it('promedia una región de color uniforme', () => {
    const rgb = sampleColorAt(solid(200, 100, 50), 0.5, 0.5, 3);
    expect(Math.round(rgb.r)).toBe(200);
    expect(Math.round(rgb.g)).toBe(100);
    expect(Math.round(rgb.b)).toBe(50);
  });

  it('ignora los píxeles transparentes', () => {
    const size = 10;
    const data = new Uint8ClampedArray(size * size * 4);
    // Solo el centro tiene color; el resto es transparente.
    const center = (5 * size + 5) * 4;
    data[center] = 120;
    data[center + 1] = 40;
    data[center + 2] = 200;
    data[center + 3] = 255;
    const rgb = sampleColorAt({ data, width: size, height: size }, 0.5, 0.5, 0);
    expect(rgb).toEqual({ r: 120, g: 40, b: 200 });
  });

  it('acota las coordenadas fuera de rango', () => {
    const rgb = sampleColorAt(solid(10, 20, 30), 5, -2, 1);
    expect(Math.round(rgb.r)).toBe(10);
  });
});

describe('classifyColor · neutros', () => {
  it('reconoce el negro', () => {
    const c = classifyColor({ r: 20, g: 20, b: 22 });
    expect(c.family).toBe('black');
    expect(c.isNeutral).toBe(true);
  });

  it('reconoce el blanco', () => {
    const c = classifyColor({ r: 244, g: 242, b: 238 });
    expect(c.family).toBe('white');
    expect(c.isNeutral).toBe(true);
  });

  it('reconoce el gris', () => {
    const c = classifyColor({ r: 150, g: 152, b: 150 });
    expect(c.family).toBe('gray');
    expect(c.isNeutral).toBe(true);
  });

  it('reconoce el beige y el camel', () => {
    const beige = classifyColor({ r: 217, g: 195, b: 169 });
    expect(beige.family).toBe('beige');
    expect(beige.isNeutral).toBe(true);

    const camel = classifyColor({ r: 176, g: 141, b: 96 });
    expect(camel.family).toBe('beige');
  });
});

describe('classifyColor · colores', () => {
  it('reconoce el rosa fucsia de la marca', () => {
    const c = classifyColor({ r: 214, g: 32, b: 126 });
    expect(c.family).toBe('pink');
    expect(c.isNeutral).toBe(false);
  });

  it('reconoce el azul y lo nombra marino cuando es oscuro', () => {
    const marino = classifyColor({ r: 42, g: 58, b: 91 });
    expect(marino.family).toBe('blue');
    expect(marino.displayName).toBe('Azul marino');
  });

  it('reconoce el verde', () => {
    expect(classifyColor({ r: 91, g: 122, b: 79 }).family).toBe('green');
  });

  it('reconoce el rojo y lo nombra vino cuando es oscuro', () => {
    const vino = classifyColor({ r: 110, g: 30, b: 46 });
    expect(vino.family).toBe('red');
    expect(vino.displayName).toBe('Vino');
  });

  it('asigna el tono según la luminosidad', () => {
    const claro = classifyColor({ r: 231, g: 196, b: 204 });
    expect(claro.tone).toBe('claro');
  });

  it('es determinista', () => {
    const rgb: RGB = { r: 120, g: 60, b: 180 };
    expect(classifyColor(rgb)).toEqual(classifyColor(rgb));
  });

  it('marca la versión', () => {
    expect(COLOR_VERSION).toBe('1.0.0');
  });
});

describe('familias de color', () => {
  it('cada opción de la lista se reclasifica en su propia familia', () => {
    for (const option of COLOR_FAMILY_OPTIONS) {
      const info = colorInfoFromFamily(option.family);
      expect(info.family).toBe(option.family);
    }
  });

  it('isNeutralFamily distingue neutros de colores', () => {
    expect(isNeutralFamily('beige')).toBe(true);
    expect(isNeutralFamily('gray')).toBe(true);
    expect(isNeutralFamily('pink')).toBe(false);
    expect(isNeutralFamily('blue')).toBe(false);
  });
});

describe('buildCombination', () => {
  const pink = classifyColor({ r: 214, g: 32, b: 126 });
  const beige = classifyColor({ r: 217, g: 195, b: 169 });

  it('devuelve neutros y acentos', () => {
    const combo = buildCombination({ kind: 'top', color: pink });
    expect(combo.palette.alwaysWith.length).toBeGreaterThan(0);
    expect(combo.palette.accentWith.length).toBeGreaterThan(0);
  });

  it('sugiere las categorías correctas para combinar', () => {
    const combo = buildCombination({ kind: 'top', color: pink });
    expect(combo.pairWith.map((p) => p.target)).toEqual(PAIR_TARGETS.top);
  });

  it('sin silueta usa sugerencias genéricas y no añade nota', () => {
    const combo = buildCombination({ kind: 'bottom', color: pink });
    expect(combo.shapeNote).toBeUndefined();
    for (const pair of combo.pairWith) {
      expect(pair.suggestion.length).toBeGreaterThan(5);
    }
  });

  it('con silueta añade una nota y usa sus recomendaciones', () => {
    const combo = buildCombination({ kind: 'top', color: pink, shape: 'triangle' });
    expect(combo.shapeNote).toBeTruthy();
    expect(combo.shapeNote).toContain('triángulo');
    // La sugerencia para prenda inferior debe venir de la silueta triángulo.
    const bottom = combo.pairWith.find((p) => p.target === 'bottom');
    expect(bottom?.suggestion).toBe(
      // Primer pantalón recomendado para triángulo.
      'Corte recto.',
    );
  });

  it('la nota de un top menciona el escote de la silueta', () => {
    const combo = buildCombination({ kind: 'top', color: pink, shape: 'hourglass' });
    expect(combo.shapeNote?.toLowerCase()).toContain('escote');
  });

  it('un neutro invita a atreverse con el color', () => {
    const combo = buildCombination({ kind: 'top', color: beige });
    const titles = combo.outfitIdeas.map((o) => o.title);
    expect(titles.some((t) => t.toLowerCase().includes('color'))).toBe(true);
  });

  it('un color propone un toque de acento', () => {
    const combo = buildCombination({ kind: 'top', color: pink });
    expect(combo.outfitIdeas.length).toBeGreaterThanOrEqual(2);
    expect(combo.outfitIdeas[1].title.toLowerCase()).toContain('toque');
  });

  it('es determinista', () => {
    const input = { kind: 'dress' as const, color: pink, shape: 'oval' as const };
    expect(buildCombination(input)).toEqual(buildCombination(input));
  });

  it('sin estación no incluye el veredicto de colorimetría', () => {
    expect(buildCombination({ kind: 'top', color: pink }).seasonMatch).toBeUndefined();
  });

  it('con estación evalúa el color: el fucsia favorece a Invierno', () => {
    const combo = buildCombination({ kind: 'top', color: pink, season: 'winter' });
    expect(combo.seasonMatch?.verdict).toBe('favorece');
    expect(combo.seasonMatch?.seasonName).toBe('Invierno');
  });

  it('el fucsia pide cuidado en Otoño', () => {
    const combo = buildCombination({ kind: 'top', color: pink, season: 'autumn' });
    expect(combo.seasonMatch?.verdict).toBe('cuidado');
    expect(combo.seasonMatch?.detail.toLowerCase()).toContain('lejos del rostro');
  });

  it('el beige es neutro para Primavera', () => {
    const combo = buildCombination({ kind: 'top', color: beige, season: 'spring' });
    // El beige favorece a primavera en el mapa de familias.
    expect(['favorece', 'neutral']).toContain(combo.seasonMatch?.verdict);
  });

  it('produce combinación válida para las seis categorías', () => {
    for (const kind of ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessory'] as const) {
      const combo = buildCombination({ kind, color: pink, shape: 'rectangle' });
      expect(combo.pairWith.length).toBeGreaterThan(0);
      expect(combo.outfitIdeas.length).toBeGreaterThan(0);
      expect(combo.version).toBe(COMBINE_VERSION);
    }
  });
});
