'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Acciones fijas al pie del panel. */
  footer?: ReactNode;
  /** `alertdialog` para confirmaciones que requieren una decisión. */
  role?: 'dialog' | 'alertdialog';
  /** Oculta el título visualmente (sigue anunciándose). */
  hideTitle?: boolean;
  className?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Panel inferior deslizante: el patrón habitual de confirmación en móvil.
 * En pantallas grandes se centra como un diálogo clásico.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
  role = 'dialog',
  hideTitle = false,
  className,
}: BottomSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="alma-fade-in absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'alma-slide-up relative flex max-h-[88dvh] w-full flex-col rounded-t-sheet border border-line bg-surface shadow-card sm:max-w-lg sm:rounded-sheet',
          className,
        )}
      >
        <div className="flex items-start gap-3 border-b border-line px-5 pb-3 pt-4">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-line sm:hidden"
          />
          <h2
            id={titleId}
            className={cn('flex-1 pt-1 text-xl', hideTitle && 'sr-only')}
          >
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="-mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-shell hover:text-ink"
          >
            <X aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only">Cerrar</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          {children}
        </div>

        {footer ? (
          <div className="border-t border-line px-5 pb-safe pt-4">
            <div className="pb-4">{footer}</div>
          </div>
        ) : (
          <div className="pb-safe" />
        )}
      </div>
    </div>
  );
}
