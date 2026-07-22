import Link from 'next/link';
import { buttonClasses } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 px-4 py-20 text-center sm:px-6 sm:py-28">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        Error 404
      </p>
      <h1 className="text-4xl sm:text-5xl">No encontramos esta página</h1>
      <p className="max-w-md text-muted">
        Es posible que el enlace haya cambiado. Puedes volver al inicio o comenzar
        directamente con tu análisis de silueta.
      </p>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link href="/" className={buttonClasses('primary', 'lg')}>
          Volver al inicio
        </Link>
        <Link href="/analisis" className={buttonClasses('secondary', 'lg')}>
          Descubrir mi silueta
        </Link>
      </div>
    </div>
  );
}
