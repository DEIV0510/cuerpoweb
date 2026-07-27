/**
 * Color de una prenda a partir de una muestra de la foto.
 *
 * No usa inteligencia artificial: se toma el color de un punto de la imagen
 * (los píxeles alrededor de donde la persona toca su prenda), se clasifica en
 * una familia de color con reglas fijas y se propone una paleta de colores que
 * combinan. Todo ocurre en el dispositivo.
 */

export const COLOR_VERSION = '1.0.0';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  /** Matiz en grados, 0 a 360. */
  h: number;
  /** Saturación, 0 a 1. */
  s: number;
  /** Luminosidad, 0 a 1. */
  l: number;
}

export type ColorFamily =
  | 'black'
  | 'white'
  | 'gray'
  | 'beige'
  | 'red'
  | 'coral'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'blue'
  | 'purple'
  | 'pink';

export type ColorTone = 'claro' | 'medio' | 'oscuro';

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface ColorInfo {
  family: ColorFamily;
  /** Nombre de la familia, p. ej. "Rosa". */
  name: string;
  tone: ColorTone;
  /** Nombre para mostrar, p. ej. "Rosa medio". */
  displayName: string;
  /** Color real muestreado, en hexadecimal. */
  hex: string;
  isNeutral: boolean;
}

function clamp255(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)));
}

/** Convierte un componente 0-255 a dos dígitos hexadecimales. */
function toHex(value: number): string {
  return clamp255(value).toString(16).padStart(2, '0');
}

/** RGB a cadena hexadecimal. */
export function rgbToHex({ r, g, b }: RGB): string {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/** RGB (0-255) a HSL. */
export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case rn:
        h = ((gn - bn) / delta + (gn < bn ? 6 : 0)) * 60;
        break;
      case gn:
        h = ((bn - rn) / delta + 2) * 60;
        break;
      default:
        h = ((rn - gn) / delta + 4) * 60;
        break;
    }
  }

  return { h, s, l };
}

/** Datos mínimos de una imagen, compatibles con ImageData. */
export interface SampleSource {
  data: Uint8ClampedArray | number[];
  width: number;
  height: number;
}

/**
 * Toma el color promedio de una región cuadrada alrededor de un punto.
 * `x` e `y` son normalizados (0 a 1) respecto al tamaño de la imagen.
 */
export function sampleColorAt(
  source: SampleSource,
  x: number,
  y: number,
  radius = 6,
): RGB {
  const { data, width, height } = source;
  const cx = Math.round(Math.min(Math.max(x, 0), 1) * (width - 1));
  const cy = Math.round(Math.min(Math.max(y, 0), 1) * (height - 1));

  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  for (let dy = -radius; dy <= radius; dy += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      const px = cx + dx;
      const py = cy + dy;
      if (px < 0 || py < 0 || px >= width || py >= height) continue;

      const index = (py * width + px) * 4;
      const alpha = data[index + 3];
      if (alpha === 0) continue;

      r += data[index];
      g += data[index + 1];
      b += data[index + 2];
      count += 1;
    }
  }

  if (count === 0) return { r: 0, g: 0, b: 0 };

  return { r: r / count, g: g / count, b: b / count };
}

const FAMILY_NAMES: Record<ColorFamily, string> = {
  black: 'Negro',
  white: 'Blanco',
  gray: 'Gris',
  beige: 'Beige',
  red: 'Rojo',
  coral: 'Coral',
  yellow: 'Amarillo',
  green: 'Verde',
  teal: 'Turquesa',
  blue: 'Azul',
  purple: 'Morado',
  pink: 'Rosa',
};

const NEUTRAL_FAMILIES: ReadonlySet<ColorFamily> = new Set<ColorFamily>([
  'black',
  'white',
  'gray',
  'beige',
]);

/** Clasifica el matiz (con saturación suficiente) en una familia de color. */
function hueFamily(h: number): ColorFamily {
  if (h < 15 || h >= 345) return 'red';
  if (h < 45) return 'coral';
  if (h < 70) return 'yellow';
  if (h < 160) return 'green';
  if (h < 200) return 'teal';
  if (h < 250) return 'blue';
  if (h < 290) return 'purple';
  return 'pink';
}

function resolveTone(l: number): ColorTone {
  if (l < 0.4) return 'oscuro';
  if (l > 0.66) return 'claro';
  return 'medio';
}

/**
 * Clasifica un color en su familia, tono y nombre para mostrar.
 * Función pura y determinista.
 */
export function classifyColor(rgb: RGB): ColorInfo {
  const hsl = rgbToHsl(rgb);
  const hex = rgbToHex(rgb);

  // El croma (max − min sobre 0-255) distingue neutros de colores mejor que la
  // saturación HSL, que se dispara en tonos muy claros u oscuros.
  const chroma = Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b);

  // Neutros: casi sin color.
  if (chroma < 18) {
    let family: ColorFamily = 'gray';
    if (hsl.l < 0.22) family = 'black';
    else if (hsl.l > 0.82) family = 'white';

    return {
      family,
      name: FAMILY_NAMES[family],
      tone: resolveTone(hsl.l),
      displayName: FAMILY_NAMES[family],
      hex,
      isNeutral: true,
    };
  }

  // Beige y camel: cálidos, poco saturados y claros.
  if (hsl.s < 0.42 && hsl.h >= 20 && hsl.h <= 55 && hsl.l >= 0.5 && hsl.l <= 0.85) {
    return {
      family: 'beige',
      name: FAMILY_NAMES.beige,
      tone: resolveTone(hsl.l),
      displayName: hsl.l < 0.62 ? 'Camel' : 'Beige',
      hex,
      isNeutral: true,
    };
  }

  const family = hueFamily(hsl.h);
  const tone = resolveTone(hsl.l);
  const name = FAMILY_NAMES[family];

  // Algunos nombres compuestos habituales.
  let displayName = `${name} ${tone}`;
  if (family === 'blue' && tone === 'oscuro') displayName = 'Azul marino';
  else if (family === 'red' && tone === 'oscuro') displayName = 'Vino';
  else if (family === 'pink' && tone === 'oscuro') displayName = 'Fucsia';
  else if (family === 'green' && tone === 'oscuro') displayName = 'Verde oliva';

  return {
    family,
    name,
    tone,
    displayName,
    hex,
    isNeutral: false,
  };
}

/** Indica si una familia es neutra. */
export function isNeutralFamily(family: ColorFamily): boolean {
  return NEUTRAL_FAMILIES.has(family);
}

/** Familias que la persona puede elegir a mano si la detección falla. */
export const COLOR_FAMILY_OPTIONS: Array<{ family: ColorFamily; label: string; hex: string }> = [
  { family: 'black', label: 'Negro', hex: '#1E1E1E' },
  { family: 'white', label: 'Blanco', hex: '#F4F1EC' },
  { family: 'gray', label: 'Gris', hex: '#9AA0A6' },
  { family: 'beige', label: 'Beige / camel', hex: '#C9A87C' },
  { family: 'red', label: 'Rojo', hex: '#C0392B' },
  { family: 'coral', label: 'Coral / naranja', hex: '#F27649' },
  { family: 'yellow', label: 'Amarillo', hex: '#D4B12A' },
  { family: 'green', label: 'Verde', hex: '#5B7A4F' },
  { family: 'teal', label: 'Turquesa', hex: '#3FA6A0' },
  { family: 'blue', label: 'Azul', hex: '#3A5B9B' },
  { family: 'purple', label: 'Morado / lila', hex: '#7E5AA8' },
  { family: 'pink', label: 'Rosa / fucsia', hex: '#D6207E' },
];

/** Construye un ColorInfo a partir de una familia elegida a mano. */
export function colorInfoFromFamily(family: ColorFamily): ColorInfo {
  const option = COLOR_FAMILY_OPTIONS.find((item) => item.family === family);
  const hex = option?.hex ?? '#000000';
  const rgb: RGB = {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
  return classifyColor(rgb);
}
