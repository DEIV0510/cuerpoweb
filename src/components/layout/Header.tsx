'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { MAIN_NAV, SITE } from '@/data/navigation';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { buttonClasses } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/** Encabezado fijo con navegación principal. */
export function Header() {
  const pathname = usePathname() ?? '/';
  // El panel móvil se cierra desde sus propios enlaces y botones, así que no
  // hace falta sincronizar el estado con la ruta mediante efectos.
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-shell/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-script text-[1.85rem] text-brand-deep sm:text-[2.1rem]">
            {SITE.brand}
          </span>
          <span className="mt-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-faint">
            {SITE.product}
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {MAIN_NAV.map((link) => {
              const isActive =
                link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'inline-flex min-h-11 items-center rounded-full px-3.5 text-[0.95rem] transition-colors',
                      isActive
                        ? 'bg-brand-soft/60 font-semibold text-brand-dark'
                        : 'text-muted hover:text-ink',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/analisis" className={buttonClasses('primary', 'md', 'hidden sm:inline-flex')}>
            Descubrir mi silueta
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink md:hidden"
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only">Abrir el menú</span>
          </button>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={MAIN_NAV}
        currentPath={pathname}
      />
    </header>
  );
}
