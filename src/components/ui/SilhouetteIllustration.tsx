import { cn } from '@/lib/utils';

/** Semianchos (en unidades del viewBox) de cada zona de la figura. */
export interface SilhouetteProportions {
  bust: number;
  waist: number;
  hips: number;
}

/** Coordenadas verticales de referencia dentro del viewBox de 200 unidades. */
export const SILHOUETTE_Y = {
  shoulders: 32,
  bust: 58,
  waist: 92,
  hips: 126,
  hem: 186,
} as const;

const CENTER = 50;

/**
 * Construye el contorno abstracto de una figura simétrica a partir de tres
 * semianchos. No representa a ninguna persona concreta: es una ilustración
 * geométrica pensada para comunicar proporción, no anatomía.
 */
export function buildSilhouettePath({
  bust,
  waist,
  hips,
}: SilhouetteProportions): string {
  const shoulder = bust * 0.92;
  const hem = hips * 0.62;
  const { shoulders: sy, bust: by, waist: wy, hips: hy, hem: my } = SILHOUETTE_Y;

  return [
    `M ${CENTER - shoulder} ${sy}`,
    `C ${CENTER - bust} ${sy + 8}, ${CENTER - bust} ${by - 12}, ${CENTER - bust} ${by}`,
    `C ${CENTER - bust} ${by + 14}, ${CENTER - waist} ${wy - 14}, ${CENTER - waist} ${wy}`,
    `C ${CENTER - waist} ${wy + 14}, ${CENTER - hips} ${hy - 14}, ${CENTER - hips} ${hy}`,
    `C ${CENTER - hips} ${hy + 20}, ${CENTER - hem} ${my - 26}, ${CENTER - hem} ${my}`,
    `L ${CENTER + hem} ${my}`,
    `C ${CENTER + hem} ${my - 26}, ${CENTER + hips} ${hy + 20}, ${CENTER + hips} ${hy}`,
    `C ${CENTER + hips} ${hy - 14}, ${CENTER + waist} ${wy + 14}, ${CENTER + waist} ${wy}`,
    `C ${CENTER + waist} ${wy - 14}, ${CENTER + bust} ${by + 14}, ${CENTER + bust} ${by}`,
    `C ${CENTER + bust} ${by - 12}, ${CENTER + shoulder} ${sy + 8}, ${CENTER + shoulder} ${sy}`,
    `Q ${CENTER} ${sy - 6}, ${CENTER - shoulder} ${sy}`,
    'Z',
  ].join(' ');
}

interface SilhouetteIllustrationProps {
  proportions: SilhouetteProportions;
  /** Texto alternativo del gráfico. */
  title: string;
  className?: string;
  /** Estilo relleno (tarjetas) o de contorno (fondos claros). */
  variant?: 'filled' | 'outline';
}

/** Ilustración abstracta de una silueta. */
export function SilhouetteIllustration({
  proportions,
  title,
  className,
  variant = 'filled',
}: SilhouetteIllustrationProps) {
  const path = buildSilhouettePath(proportions);

  return (
    <svg
      viewBox="0 0 100 200"
      role="img"
      aria-label={title}
      className={cn('h-auto w-full', className)}
      focusable="false"
    >
      <title>{title}</title>
      <g
        className={
          variant === 'filled'
            ? 'fill-brand-soft stroke-brand'
            : 'fill-transparent stroke-brand'
        }
        strokeWidth={1.6}
        strokeLinejoin="round"
      >
        <circle cx={CENTER} cy={13} r={8.5} />
        <path d={`M ${CENTER - 4} 20 L ${CENTER - 4} 33 L ${CENTER + 4} 33 L ${CENTER + 4} 20 Z`} />
        <path d={path} />
      </g>
    </svg>
  );
}
