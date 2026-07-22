import Link from 'next/link';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrivacyNoticeProps {
  className?: string;
  /** Muestra el enlace a la página de privacidad. */
  withLink?: boolean;
}

/** Aviso breve sobre el tratamiento de los datos. */
export function PrivacyNotice({ className, withLink = true }: PrivacyNoticeProps) {
  return (
    <aside
      className={cn(
        'flex flex-col gap-3 rounded-card border border-line bg-shell p-6 sm:flex-row sm:items-start sm:gap-4',
        className,
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface">
        <Lock aria-hidden="true" className="h-4 w-4 text-brand" />
      </span>
      <div className="text-[0.95rem] text-muted">
        <p className="font-semibold text-ink">Tus medidas no salen de tu dispositivo</p>
        <p className="mt-1">
          El cálculo se ejecuta dentro de tu navegador. Si usas el análisis con
          foto, la imagen se queda en la memoria de tu teléfono: no se sube ni se
          guarda. No se crea una cuenta ni se envía información a servidores
          externos, y el último resultado puedes eliminarlo cuando quieras.
        </p>
        {withLink ? (
          <Link
            href="/privacidad"
            className="mt-2 inline-flex min-h-11 items-center font-medium text-brand-dark underline underline-offset-4"
          >
            Ver detalles de privacidad
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
