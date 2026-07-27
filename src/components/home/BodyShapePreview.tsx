import Link from 'next/link';
import { Camera, Ruler } from 'lucide-react';
import { buttonClasses, type ButtonVariant } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/Card';
import { SilhouetteIllustration } from '@/components/ui/SilhouetteIllustration';
import { BODY_SHAPE_LIST } from '@/data/body-shapes';

/** Los dos métodos de medir la silueta. */
const METHODS: Array<{
  icon: typeof Ruler;
  title: string;
  badge: string;
  description: string;
  href: string;
  cta: string;
  variant: ButtonVariant;
}> = [
  {
    icon: Ruler,
    title: 'Con cinta métrica',
    badge: 'Más preciso',
    description:
      'Tomas tus tres contornos con una cinta flexible y los escribes paso a paso. Es el método recomendado.',
    href: '/analisis',
    cta: 'Escribir mis medidas',
    variant: 'primary',
  },
  {
    icon: Camera,
    title: 'Con una foto',
    badge: 'Estimación',
    description:
      'Subes una foto de cuerpo completo, marcas tu estatura y el ancho de tres zonas, y la app estima tus contornos. La imagen no sale de tu teléfono.',
    href: '/analisis/foto',
    cta: 'Estimar desde una foto',
    variant: 'secondary',
  },
];

/** Deep-dive de la silueta: las cinco siluetas y las dos formas de medirlas. */
export function BodyShapePreview() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="app-shell app-shell-wide px-gutter py-12 sm:py-16">
        <SectionHeading
          eyebrow="Herramienta 1 · Tu silueta"
          title="Categorías orientativas, no etiquetas"
          description="Cada silueta describe una relación entre busto, cintura y cadera. Muchas personas presentan características de dos de ellas."
        />

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BODY_SHAPE_LIST.map((profile) => (
            <li
              key={profile.id}
              className="flex gap-5 rounded-card border border-line bg-shell p-6"
            >
              <div className="w-16 shrink-0 sm:w-20">
                <SilhouetteIllustration
                  proportions={profile.illustration}
                  title={`Silueta ${profile.name}`}
                />
              </div>
              <div>
                <h3 className="text-xl">{profile.name}</h3>
                {profile.alternativeName ? (
                  <p className="text-xs uppercase tracking-[0.14em] text-brand">
                    También llamada {profile.alternativeName}
                  </p>
                ) : null}
                <p className="mt-2 text-[0.95rem] text-muted">{profile.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12 border-t border-line pt-10">
          <h3 className="text-2xl">Dos formas de medir tu silueta</h3>
          <p className="mt-1.5 text-muted">
            Elige la que tengas más a mano; el cálculo ocurre en tu dispositivo.
          </p>

          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {METHODS.map(({ icon: Icon, ...method }) => (
              <li
                key={method.href}
                className="flex flex-col rounded-card border border-line bg-shell p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft">
                    <Icon aria-hidden="true" className="h-5 w-5 text-brand-dark" />
                  </span>
                  <div>
                    <h4 className="text-xl leading-tight">{method.title}</h4>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
                      {method.badge}
                    </span>
                  </div>
                </div>

                <p className="mt-3 flex-1 text-[0.95rem] text-muted">
                  {method.description}
                </p>

                <Link
                  href={method.href}
                  className={buttonClasses(method.variant, 'lg', 'mt-5 w-full')}
                >
                  {method.cta}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
