import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionProps {
  title: string;
  children: ReactNode;
  /** Texto pequeño bajo el título. */
  subtitle?: string;
  /** Abre la sección al cargar. */
  defaultOpen?: boolean;
  /** Elemento decorativo a la izquierda del título. */
  leading?: ReactNode;
  className?: string;
}

/**
 * Acordeón basado en `<details>`: funciona sin JavaScript, es accesible con
 * teclado y lector de pantalla, y en impresión se despliega solo.
 */
export function Accordion({
  title,
  children,
  subtitle,
  defaultOpen = false,
  leading,
  className,
}: AccordionProps) {
  return (
    <details
      className={cn(
        'accordion group rounded-card border border-line bg-surface transition-shadow open:shadow-card',
        className,
      )}
      open={defaultOpen}
    >
      <summary className="flex min-h-14 items-center gap-3 px-5 py-4">
        {leading ? <span className="shrink-0">{leading}</span> : null}
        <span className="flex-1">
          <span className="block font-medium leading-snug text-ink">{title}</span>
          {subtitle ? (
            <span className="mt-0.5 block text-sm text-faint">{subtitle}</span>
          ) : null}
        </span>
        <ChevronDown
          aria-hidden="true"
          className="accordion-chevron h-5 w-5 shrink-0 text-brand"
        />
      </summary>
      <div className="px-5 pb-5">{children}</div>
    </details>
  );
}
