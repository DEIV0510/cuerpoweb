'use client';

import { useId, useState } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { HelpCircle } from 'lucide-react';
import { MeasurementIllustration } from '@/components/measurements/MeasurementIllustration';
import type { MeasurementZone } from '@/components/measurements/MeasurementIllustration';
import { getZoneGuide } from '@/data/measurement-guide';
import { cn } from '@/lib/utils';

interface MeasurementFieldProps {
  label: string;
  /** Zona ilustrada en la ayuda del campo. */
  zone?: MeasurementZone;
  hint: string;
  error?: string;
  registration: UseFormRegisterReturn;
  optional?: boolean;
  unit?: string;
}

/** Campo numérico con unidad, ayuda contextual y error asociado. */
export function MeasurementField({
  label,
  zone,
  hint,
  error,
  registration,
  optional = false,
  unit = 'cm',
}: MeasurementFieldProps) {
  const fieldId = useId();
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const helpId = `${fieldId}-help`;
  const [helpOpen, setHelpOpen] = useState(false);

  const guide = zone ? getZoneGuide(zone) : null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={fieldId} className="text-[1.05rem] font-medium text-ink">
          {label}
          {optional ? (
            <span className="ml-2 text-sm font-normal text-muted">(opcional)</span>
          ) : null}
        </label>

        {guide ? (
          <button
            type="button"
            onClick={() => setHelpOpen((open) => !open)}
            aria-expanded={helpOpen}
            aria-controls={helpId}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm text-brand-dark"
          >
            <HelpCircle aria-hidden="true" className="h-4 w-4" />
            {helpOpen ? 'Ocultar ayuda' : 'Cómo medir'}
          </button>
        ) : null}
      </div>

      <div
        className={cn(
          'flex items-center gap-2 rounded-2xl border bg-surface px-4 transition-colors',
          error ? 'border-brand' : 'border-line focus-within:border-brand',
        )}
      >
        <input
          {...registration}
          id={fieldId}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          enterKeyHint="next"
          placeholder="0"
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(hintId, error ? errorId : undefined)}
          className="min-h-13 w-full bg-transparent py-3 text-lg text-ink outline-none placeholder:text-line"
        />
        <span aria-hidden="true" className="text-base font-medium text-muted">
          {unit}
        </span>
      </div>

      <p id={hintId} className="text-sm text-muted">
        {hint}
      </p>

      {error ? (
        <p id={errorId} className="text-sm font-medium text-brand-dark">
          {error}
        </p>
      ) : null}

      {guide && helpOpen ? (
        <div
          id={helpId}
          className="mt-1 flex gap-4 rounded-2xl border border-line bg-shell p-4"
        >
          <div className="w-16 shrink-0">
            <MeasurementIllustration highlight={guide.id} showLabels={false} />
          </div>
          <div className="text-sm text-muted">
            <p>{guide.instructions}</p>
            <p className="mt-2">
              <span className="font-semibold text-ink">Consejo: </span>
              {guide.tip}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
