import Link from 'next/link';
import { FOOTER_NAV, SITE } from '@/data/navigation';
import { ALGORITHM_VERSION } from '@/lib/body-shape/classify-body-shape';

/** Pie de página con enlaces reales y aviso de alcance. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="no-print border-t border-line bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-3">
          <span className="font-script text-4xl leading-none text-brand-deep">
            {SITE.brand}
          </span>
          <p className="max-w-md text-sm text-muted">{SITE.description}</p>
          <p className="max-w-md text-sm text-muted">{SITE.disclaimer}</p>
        </div>

        <nav aria-label="Enlaces del pie de página">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
            Secciones
          </h2>
          <ul className="mt-4 flex flex-col gap-2">
            {FOOTER_NAV.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-brand-dark"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {year} {SITE.brand}. Todos los derechos reservados.
          </p>
          <p>Algoritmo de clasificación versión {ALGORITHM_VERSION}</p>
        </div>
      </div>
    </footer>
  );
}
