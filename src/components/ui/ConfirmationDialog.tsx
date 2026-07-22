'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description: string;
  /** Puntos adicionales para revisar. */
  details?: string[];
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Diálogo modal accesible para confirmaciones puntuales. */
export function ConfirmationDialog({
  open,
  title,
  description,
  details = [],
  confirmLabel = 'Confirmar y continuar',
  cancelLabel = 'Revisar medidas',
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    confirmRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCancel();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled])',
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 bg-ink/45" onClick={onCancel} aria-hidden="true" />

      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialogo-titulo"
        aria-describedby="dialogo-descripcion"
        className="relative w-full max-w-lg rounded-card border border-line bg-surface p-6 shadow-xl sm:p-7"
      >
        <div className="flex gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft/60">
            <AlertTriangle aria-hidden="true" className="h-5 w-5 text-brand-dark" />
          </span>
          <div>
            <h2 id="dialogo-titulo" className="text-2xl">
              {title}
            </h2>
            <p id="dialogo-descripcion" className="mt-2 text-[0.95rem] text-muted">
              {description}
            </p>
            {details.length > 0 ? (
              <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
                {details.map((detail) => (
                  <li key={detail} className="rounded-xl bg-shell p-3">
                    {detail}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <Button ref={confirmRef} onClick={onConfirm} size="lg" className="w-full sm:w-auto">
            {confirmLabel}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
