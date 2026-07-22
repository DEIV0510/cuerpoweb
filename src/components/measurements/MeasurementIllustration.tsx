import { cn } from '@/lib/utils';
import {
  SILHOUETTE_Y,
  buildSilhouettePath,
} from '@/components/ui/SilhouetteIllustration';

export type MeasurementZone = 'bust' | 'waist' | 'hips';

const NEUTRAL_PROPORTIONS = { bust: 21, waist: 17, hips: 22 };

const ZONES: Array<{
  id: MeasurementZone;
  label: string;
  y: number;
  half: number;
}> = [
  { id: 'bust', label: 'Busto', y: SILHOUETTE_Y.bust, half: NEUTRAL_PROPORTIONS.bust },
  { id: 'waist', label: 'Cintura', y: SILHOUETTE_Y.waist, half: NEUTRAL_PROPORTIONS.waist },
  { id: 'hips', label: 'Cadera', y: SILHOUETTE_Y.hips, half: NEUTRAL_PROPORTIONS.hips },
];

interface MeasurementIllustrationProps {
  /** Zona resaltada. `all` marca las tres. */
  highlight?: MeasurementZone | 'all';
  /** Muestra las etiquetas de texto junto a cada línea. */
  showLabels?: boolean;
  className?: string;
}

/**
 * Figura abstracta con las tres líneas de medición marcadas.
 * Sirve tanto para la guía como para la ayuda de cada campo del formulario.
 */
export function MeasurementIllustration({
  highlight = 'all',
  showLabels = true,
  className,
}: MeasurementIllustrationProps) {
  const path = buildSilhouettePath(NEUTRAL_PROPORTIONS);
  const activeLabel =
    highlight === 'all'
      ? 'busto, cintura y cadera'
      : ZONES.find((zone) => zone.id === highlight)?.label.toLowerCase();

  return (
    <svg
      viewBox="0 0 140 200"
      role="img"
      aria-label={`Figura con la zona de medición de ${activeLabel} señalada`}
      className={cn('h-auto w-full', className)}
      focusable="false"
    >
      <title>{`Zona de medición: ${activeLabel}`}</title>

      <g
        className="fill-shell stroke-sand"
        strokeWidth={1.4}
        strokeLinejoin="round"
        transform="translate(12 0)"
      >
        <circle cx={50} cy={13} r={8.5} />
        <path d="M 46 20 L 46 33 L 54 33 L 54 20 Z" />
        <path d={path} />
      </g>

      {ZONES.map((zone) => {
        const isActive = highlight === 'all' || highlight === zone.id;
        const x1 = 12 + 50 - zone.half - 8;
        const x2 = 12 + 50 + zone.half + 8;

        return (
          <g key={zone.id}>
            <line
              x1={x1}
              y1={zone.y}
              x2={x2}
              y2={zone.y}
              className={isActive ? 'stroke-brand' : 'stroke-line'}
              strokeWidth={isActive ? 2 : 1.2}
              strokeDasharray={isActive ? undefined : '3 3'}
              strokeLinecap="round"
            />
            <circle
              cx={x2}
              cy={zone.y}
              r={isActive ? 2.6 : 1.8}
              className={isActive ? 'fill-brand' : 'fill-line'}
            />
            {showLabels ? (
              <text
                x={x2 + 5}
                y={zone.y + 3.5}
                className={cn(
                  'text-[9px]',
                  isActive ? 'fill-brand-dark' : 'fill-muted',
                )}
                style={{ fontWeight: isActive ? 600 : 400 }}
              >
                {zone.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
