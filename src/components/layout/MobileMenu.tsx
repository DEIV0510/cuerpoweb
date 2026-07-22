'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { NavLink } from '@/data/navigation';
import { buttonClasses } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  currentPath: string;
}

/** Panel de navegación para pantallas pequeñas. */
export function MobileMenu({ open, onClose, links, currentPath }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="Cerrar el menú"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className="absolute inset-x-0 top-0 rounded-b-card border-b border-line bg-surface p-5 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <span className="font-serif text-xl">Alma e Imagen</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink"
          >
            <X aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only">Cerrar el menú</span>
          </button>
        </div>

        <nav aria-label="Navegación principal" className="mt-5">
          <ul className="flex flex-col gap-1">
            {links.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex min-h-12 items-center rounded-xl px-4 text-base',
                      isActive
                        ? 'bg-brand-soft/60 font-semibold text-brand-dark'
                        : 'text-ink hover:bg-shell',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link
          href="/analisis"
          onClick={onClose}
          className={buttonClasses('primary', 'lg', 'mt-5 w-full')}
        >
          Descubrir mi silueta
        </Link>
      </div>
    </div>
  );
}
