import type { GarmentType } from '@/data/wardrobe-content';
import { cn } from '@/lib/utils';

interface GarmentIconProps {
  garment: GarmentType;
  className?: string;
}

/**
 * Ilustración simple de cada prenda, dibujada en SVG.
 *
 * Son formas esquemáticas de línea, no fotografías: coherentes con el resto de
 * la marca y sin depender de imágenes externas.
 */
const PATHS: Record<GarmentType, string> = {
  // Superiores
  top: 'M20 16 L28 12 L36 18 L44 12 L52 16 L48 26 L44 24 L44 52 L28 52 L28 24 L24 26 Z',
  blouse:
    'M20 16 L28 12 L36 20 L44 12 L52 16 L47 27 L44 25 L45 52 L27 52 L28 25 L25 27 Z M36 20 L33 40 L39 40 Z',
  knit: 'M18 18 L28 12 L36 16 L44 12 L54 18 L50 28 L46 25 L46 54 L26 54 L26 25 L22 28 Z M46 25 L52 40 M26 25 L20 40',
  shirt:
    'M20 15 L28 12 L36 18 L44 12 L52 15 L48 25 L45 23 L45 53 L27 53 L27 23 L24 25 Z M36 18 L36 50 M31 26 L31 27 M31 33 L31 34 M31 40 L31 41',
  // Inferiores
  pants:
    'M26 12 L46 12 L47 30 L45 54 L38 54 L36 32 L34 54 L27 54 L25 30 Z',
  jeans:
    'M26 12 L46 12 L47 30 L45 54 L38 54 L36 32 L34 54 L27 54 L25 30 Z M26 18 L46 18',
  wide: 'M24 12 L48 12 L50 54 L40 54 L37 32 L35 54 L22 54 Z',
  skirt: 'M28 14 L44 14 L44 22 L52 52 L20 52 L28 22 Z',
  // Vestidos
  dress:
    'M24 15 L30 12 L36 17 L42 12 L48 15 L44 26 L46 54 L26 54 L28 26 Z',
  // Chaquetas
  blazer:
    'M18 16 L28 12 L36 16 L44 12 L54 16 L50 27 L48 54 L38 54 L36 26 L34 54 L24 54 L22 27 Z M36 16 L30 30 M36 16 L42 30',
  coat: 'M20 16 L28 12 L36 15 L44 12 L52 16 L49 30 L48 56 L24 56 L23 30 Z M36 15 L36 54 M40 32 L40 36',
  cardigan:
    'M20 16 L28 13 L36 16 L44 13 L52 16 L49 30 L48 56 L24 56 L23 30 Z M34 16 L33 56 M38 16 L39 56',
  'denim-jacket':
    'M20 16 L28 12 L36 16 L44 12 L52 16 L48 26 L46 50 L26 50 L24 26 Z M36 16 L31 28 M36 16 L41 28 M30 34 L30 44 M42 34 L42 44',
  // Calzado
  flats: 'M14 40 Q14 32 26 33 L46 36 Q52 37 52 42 L52 44 L14 44 Z',
  heels:
    'M16 34 Q16 30 24 31 L46 36 Q50 37 50 40 L50 42 L22 42 L20 54 L16 54 L18 40 Z',
  sneakers:
    'M14 38 Q14 32 22 33 L38 36 Q50 38 52 43 L52 45 L14 45 Z M22 34 L24 40 M28 35 L30 41',
  // Accesorios
  bag: 'M22 26 L46 26 L48 52 L20 52 Z M28 26 Q28 16 34 16 Q40 16 40 26',
  belt: 'M14 30 L54 30 L54 38 L14 38 Z M30 30 L30 38 L38 38 L38 30 M32 32 L36 32 L36 36 L32 36 Z',
  scarf:
    'M24 14 Q34 22 44 14 L44 20 Q34 28 24 20 Z M32 26 L30 54 M36 26 L38 54',
  jewelry:
    'M34 16 Q22 28 34 44 Q46 28 34 16 Z M24 20 L24 26 M44 20 L44 26',
};

/** Formas que se dibujan solo con trazo (sin relleno). */
const STROKE_ONLY = new Set<GarmentType>([
  'knit',
  'shirt',
  'jeans',
  'blazer',
  'coat',
  'cardigan',
  'denim-jacket',
  'sneakers',
  'belt',
  'scarf',
  'jewelry',
  'bag',
]);

export function GarmentIcon({ garment, className }: GarmentIconProps) {
  const filled = !STROKE_ONLY.has(garment);

  return (
    <svg
      viewBox="0 0 68 68"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={cn('h-full w-full', className)}
    >
      <path
        d={PATHS[garment]}
        className={filled ? 'fill-brand-soft stroke-brand' : 'fill-none stroke-brand'}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
