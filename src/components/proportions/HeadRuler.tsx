import {
  formatHeads,
  formatHeadsLabel,
  type EightHeadsResult,
} from '@/lib/proportions/eight-heads';
import { cn } from '@/lib/utils';

interface HeadRulerProps {
  result: EightHeadsResult;
}

const TONES: Record<string, string> = {
  head: 'bg-mocha',
  torso: 'bg-brand',
  rise: 'bg-plum',
  legs: 'bg-brand-light',
};

const LABELS: Record<string, string> = {
  head: 'Cabeza',
  torso: 'Quijada a cintura',
  rise: 'Cintura a entrepierna',
  legs: 'Entrepierna a los pies',
};

/**
 * Comparación visual entre tus tramos y la referencia de ocho cabezas.
 * Las dos columnas comparten escala, así que la diferencia se ve directamente.
 */
export function HeadRuler({ result }: HeadRulerProps) {
  const mine = [
    { id: 'head', heads: 1 },
    { id: 'torso', heads: result.segments.torso.heads },
    { id: 'rise', heads: result.segments.rise.heads },
    { id: 'legs', heads: result.segments.legs.heads },
  ];

  const reference = [
    { id: 'head', heads: 1 },
    { id: 'torso', heads: 2 },
    { id: 'rise', heads: 1 },
    { id: 'legs', heads: 4 },
  ];

  const scale = Math.max(result.totalHeads, 8);

  return (
    <div>
      <div className="flex items-end gap-4">
        <Column title="Tú" blocks={mine} scale={scale} total={result.totalHeads} withLabels />
        <Column title="Referencia" blocks={reference} scale={scale} total={8} muted />
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
        {mine.map((block) => (
          <li key={block.id} className="flex items-center gap-2 text-sm text-muted">
            <span
              aria-hidden="true"
              className={cn('h-3 w-3 rounded-full', TONES[block.id])}
            />
            {LABELS[block.id]}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ColumnProps {
  title: string;
  blocks: Array<{ id: string; heads: number }>;
  scale: number;
  total: number;
  withLabels?: boolean;
  muted?: boolean;
}

function Column({ title, blocks, scale, total, withLabels = false, muted = false }: ColumnProps) {
  return (
    <figure className="flex flex-1 flex-col items-center gap-2">
      <div
        className="flex w-full flex-col justify-end gap-1"
        style={{ height: '19rem' }}
        role="img"
        aria-label={`${title}: ${blocks
          .map((block) => `${LABELS[block.id]}, ${formatHeadsLabel(block.heads)}`)
          .join('; ')}`}
      >
        {blocks.map((block) => (
          <div
            key={block.id}
            style={{ height: `${(block.heads / scale) * 100}%` }}
            className={cn(
              'flex min-h-6 items-center justify-center rounded-lg px-1 text-center',
              muted ? 'bg-line' : TONES[block.id],
            )}
          >
            {withLabels ? (
              <span className="text-[0.7rem] font-semibold leading-tight text-white">
                {formatHeads(block.heads)}
              </span>
            ) : (
              <span className="text-[0.7rem] font-semibold leading-tight text-muted">
                {formatHeads(block.heads)}
              </span>
            )}
          </div>
        ))}
      </div>

      <figcaption className="text-center">
        <span className="block text-sm font-medium text-ink">{title}</span>
        <span className="block text-xs text-faint">{formatHeadsLabel(total)}</span>
      </figcaption>
    </figure>
  );
}
