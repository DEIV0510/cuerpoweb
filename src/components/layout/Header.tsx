'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronLeft, Menu } from 'lucide-react';
import { MAIN_NAV, SITE } from '@/data/navigation';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { buttonClasses } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/** Los flujos de análisis dibujan su propio encabezado con el paso actual. */
function hasOwnHeader(pathname: string): boolean {
  return (
    pathname.startsWith('/analisis') ||
    pathname === '/proporciones' ||
    pathname === '/armario'
  );
}

/** Encabezado móvil compacto: 56 px, wordmark y una sola acción a cada lado. */
export function Header() {
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  if (hasOwnHeader(pathname)) return null;

  const isHome = pathname === '/';

  return (
    <>
      <header className="no-print sticky top-0 z-40 border-b border-line bg-shell/90 pt-safe backdrop-blur-md">
        <div className="app-shell app-shell-wide flex h-14 items-center justify-between gap-2 px-gutter">
          <div className="flex min-w-0 items-center gap-1">
            {isHome ? null : (
              <button
                type="button"
                onClick={() => router.back()}
                className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-brand-soft/60"
              >
                <ChevronLeft aria-hidden="true" className="h-6 w-6" />
                <span className="sr-only">Volver</span>
              </button>
            )}

            <Link
              href="/"
              className="flex min-h-11 min-w-0 flex-col justify-center leading-none"
            >
              <span className="truncate font-script text-[1.7rem] text-brand-deep">
                {SITE.brand}
              </span>
              <span className="truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-faint">
                {SITE.product}
              </span>
            </Link>
          </div>

          <nav aria-label="Navegación principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {MAIN_NAV.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'inline-flex min-h-11 items-center rounded-full px-3.5 text-[0.95rem] transition-colors',
                        isActive
                          ? 'bg-brand-soft/70 font-semibold text-brand-dark'
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

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/analisis"
              className={buttonClasses(
                'primary',
                'md',
                'hidden lg:inline-flex',
              )}
            >
              Descubrir mi silueta
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              className="-mr-1 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-brand lg:hidden"
            >
              <Menu aria-hidden="true" className="h-5 w-5" />
              <span className="sr-only">Abrir el menú</span>
            </button>
          </div>
        </div>
      </header>

      {/* Fuera del encabezado: su backdrop-filter crearía un bloque contenedor
          y el panel fijo quedaría atrapado dentro de la barra. */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={MAIN_NAV}
        currentPath={pathname}
      />
    </>
  );
}
