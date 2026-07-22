import Link from 'next/link';
import { Camera, Ruler } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/Card';

const OPTIONS = [
  {
    icon: Ruler,
    title: 'Con cinta métrica',
    badge: 'Más preciso',
    description:
      'Tomas tus tres contornos con una cinta flexible y los escribes paso a paso. Es el método recomendado.',
    href: '/analisis',
    cta: 'Escribir mis medidas',
    variant: 'primary' as const,
  },
  {
    icon: Camera,
    title: 'Con una foto',
    badge: 'Estimación',
    description:
      'Subes una foto de cuerpo completo, marcas tu estatura y el ancho de tres zonas, y la app estima tus contornos. La imagen no sale de tu teléfono.',
    href: '/analisis/foto',
    cta: 'Estimar desde una foto',
    variant: 'secondary' as const,
  },
];

/** Los dos caminos para obtener las medidas. */
export function StartOptions() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="app-shell app-shell-wide px-gutter py-12 sm:py-16">
        <SectionHeading
          eyebrow="Dos formas de empezar"
          title="Con cinta métrica o con una foto"
          description="Elige la que tengas más a mano. En ambos casos el cálculo ocurre dentro de tu dispositivo."
        />

        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {OPTIONS.map(({ icon: Icon, ...option }) => (
            <li
              key={option.href}
              className="flex flex-col rounded-card border border-line bg-shell p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft">
                  <Icon aria-hidden="true" className="h-5 w-5 text-brand-dark" />
                </span>
                <div>
                  <h3 className="text-xl leading-tight">{option.title}</h3>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
                    {option.badge}
                  </span>
                </div>
              </div>

              <p className="mt-3 flex-1 text-[0.95rem] text-muted">
                {option.description}
              </p>

              <Link
                href={option.href}
                className={buttonClasses(option.variant, 'lg', 'mt-5 w-full')}
              >
                {option.cta}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
