import Link from 'next/link';
import { buttonClasses } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="app-shell flex flex-col items-center gap-5 px-gutter py-16 text-center sm:py-24">
      <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
        Error 404
      </p>
      <h1 className="text-4xl sm:text-5xl">No encontramos esta página</h1>
      <p className="max-w-md text-muted">
        Es posible que el enlace haya cambiado. Puedes volver al inicio o comenzar
        directamente con tu análisis de silueta.
      </p>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link href="/" className={buttonClasses('primary', 'lg', 'w-full sm:w-auto')}>
          Volver al inicio
        </Link>
        <Link href="/analisis" className={buttonClasses('ghost', 'lg', 'w-full sm:w-auto')}>
          Descubrir mi silueta
        </Link>
      </div>
    </div>
  );
}
