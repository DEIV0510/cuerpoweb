'use client';

import { useId } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface MeasurementFieldProps {
  label: string;
  hint?: string;
  error?: string;
  registration: UseFormRegisterReturn;
  unit?: string;
  /** Enfoca el campo al montarse (cada paso del flujo). */
  autoFocus?: boolean;
  /** Acción del botón principal del teclado virtual. */
  enterKeyHint?: 'next' | 'done' | 'go';
  /** Se ejecuta al pulsar «Siguiente» en el teclado virtual. */
  onEnterKey?: () => void;
}

/**
 * Campo numérico táctil: 60 px de alto, teclado decimal, unidad visible y
 * error justo debajo (con altura reservada para que el diseño no salte).
 */
export function MeasurementField({
  label,
  hint,
  error,
  registration,
  unit = 'cm',
  autoFocus = false,
  enterKeyHint = 'next',
  onEnterKey,
}: MeasurementFieldProps) {
  const fieldId = useId();
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="text-[1.05rem] font-medium text-ink">
        {label}
      </label>

      <div
        className={cn(
          'flex items-center gap-2 rounded-2xl border-2 bg-surface px-4 transition-colors',
          error
            ? 'border-brand'
            : 'border-line focus-within:border-brand-light',
        )}
      >
        <input
          {...registration}
          id={fieldId}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint={enterKeyHint}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onEnterKey?.();
          }}
          autoFocus={autoFocus}
          placeholder="0"
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(hint ? hintId : undefined, error ? errorId : undefined)}
          className="min-h-[60px] w-full bg-transparent py-3 text-center text-3xl font-semibold tabular-nums text-ink outline-none placeholder:font-normal placeholder:text-line"
        />
        <span aria-hidden="true" className="text-lg font-medium text-muted">
          {unit}
        </span>
      </div>

      {hint ? (
        <p id={hintId} className="text-sm text-faint">
          {hint}
        </p>
      ) : null}

      {/* Altura reservada: el mensaje aparece sin desplazar el resto. */}
      <p
        id={errorId}
        role={error ? 'alert' : undefined}
        className={cn(
          'min-h-5 text-sm font-medium transition-opacity',
          error ? 'text-brand-dark opacity-100' : 'opacity-0',
        )}
      >
        {error ?? ''}
      </p>
    </div>
  );
}
