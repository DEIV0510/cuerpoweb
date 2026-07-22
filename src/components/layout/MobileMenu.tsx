'use client';

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import type { NavLink } from '@/data/navigation';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { buttonClasses } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  currentPath: string;
}

/** Navegación móvil presentada como panel inferior. */
export function MobileMenu({ open, onClose, links, currentPath }: MobileMenuProps) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Menú"
      footer={
        <Link
          href="/analisis"
          onClick={onClose}
          className={buttonClasses('primary', 'lg', 'w-full')}
        >
          Descubrir mi silueta
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      }
    >
      <nav aria-label="Navegación principal">
        <ul className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive =
              link.href === '/'
                ? currentPath === '/'
                : currentPath.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex min-h-14 items-center justify-between gap-3 rounded-2xl px-4 text-[1.05rem] transition-colors',
                    isActive
                      ? 'bg-brand-soft/70 font-semibold text-brand-dark'
                      : 'text-ink hover:bg-shell',
                  )}
                >
                  {link.label}
                  {isActive ? (
                    <Check aria-hidden="true" className="h-4 w-4 text-brand" />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </BottomSheet>
  );
}
