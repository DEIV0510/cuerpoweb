'use client';

import { ChevronLeft, X } from 'lucide-react';

interface FlowHeaderProps {
  /** Paso actual, empezando en 1. */
  current: number;
  total: number;
  onBack: () => void;
  onExit: () => void;
  backLabel: string;
}

/**
 * Encabezado del flujo de análisis: retroceso, paso actual, salida y barra de
 * progreso. Reemplaza al encabezado del sitio para no distraer del proceso.
 */
export function FlowHeader({
  current,
  total,
  onBack,
  onExit,
  backLabel,
}: FlowHeaderProps) {
  const percent = Math.round((current / total) * 100);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-shell/95 pt-safe backdrop-blur-md">
      <div className="app-shell flex h-14 items-center gap-2 px-gutter">
        <button
          type="button"
          onClick={onBack}
          className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-brand-soft/60"
        >
          <ChevronLeft aria-hidden="true" className="h-6 w-6" />
          <span className="sr-only">{backLabel}</span>
        </button>

        <div className="flex-1 text-center leading-tight">
          <p className="font-script text-[1.45rem] leading-none text-brand-deep">
            Alma e Imagen
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-faint">
            Paso {current} de {total}
          </p>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-brand-soft/60 hover:text-ink"
        >
          <X aria-hidden="true" className="h-5 w-5" />
          <span className="sr-only">Salir del análisis</span>
        </button>
      </div>

      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={`Progreso del análisis: paso ${current} de ${total}`}
        className="h-1 w-full bg-line"
      >
        <div
          className="bg-rose-gradient h-full rounded-r-full transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </header>
  );
}
