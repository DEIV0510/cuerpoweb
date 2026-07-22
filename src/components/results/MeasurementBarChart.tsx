import { formatCm } from '@/lib/body-shape/calculations';
import type { Measurements } from '@/types/body-shape';

interface MeasurementBarChartProps {
  measurements: Measurements;
}

const BARS: Array<{ key: 'bust' | 'waist' | 'hips'; label: string }> = [
  { key: 'bust', label: 'Busto' },
  { key: 'waist', label: 'Cintura' },
  { key: 'hips', label: 'Cadera' },
];

/**
 * Comparación visual de los tres contornos con barras proporcionales.
 * Los valores siempre se muestran en texto: el gráfico es un apoyo, no la
 * única fuente de información.
 */
export function MeasurementBarChart({ measurements }: MeasurementBarChartProps) {
  const max = Math.max(measurements.bust, measurements.waist, measurements.hips);

  return (
    <div className="flex flex-col gap-4">
      {BARS.map((bar) => {
        const value = measurements[bar.key];
        const width = max > 0 ? Math.round((value / max) * 100) : 0;

        return (
          <div key={bar.key} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[0.95rem] font-medium text-ink">{bar.label}</span>
              <span className="text-[0.95rem] text-muted">
                <strong className="font-semibold text-ink">{formatCm(value)}</strong> cm
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-shell">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
