'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FOOTER_NAV, SITE } from '@/data/navigation';
import { ALGORITHM_VERSION } from '@/lib/body-shape/classify-body-shape';

/** Los flujos de análisis ocupan toda la pantalla y no llevan pie de página. */
function isFlowRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/analisis') ||
    pathname === '/proporciones' ||
    pathname === '/armario'
  );
}

/** Pie de página compacto en móvil y en dos columnas desde tablet. */
export function Footer() {
  const pathname = usePathname() ?? '/';
  const year = new Date().getFullYear();

  if (isFlowRoute(pathname)) return null;

  return (
    <footer className="no-print border-t border-line bg-surface">
      <div className="app-shell app-shell-wide grid gap-8 px-gutter py-10 md:grid-cols-[1.3fr_1fr] md:py-12">
        <div className="flex flex-col gap-3">
          <span className="font-script text-3xl leading-none text-brand-deep">
            {SITE.brand}
          </span>
          <p className="max-w-md text-sm text-muted">{SITE.description}</p>
          <p className="max-w-md text-sm text-muted">{SITE.disclaimer}</p>
        </div>

        <nav aria-label="Enlaces del pie de página">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
            Secciones
          </h2>
          <ul className="mt-3 flex flex-col">
            {FOOTER_NAV.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-12 items-center text-[0.95rem] text-muted transition-colors hover:text-brand-dark"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="app-shell app-shell-wide flex flex-col gap-1.5 px-gutter py-5 pb-safe text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.brand}. Todos los derechos reservados.
          </p>
          <p>Algoritmo versión {ALGORITHM_VERSION}</p>
        </div>
      </div>
    </footer>
  );
}
