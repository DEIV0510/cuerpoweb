import {
  Compass,
  HeartHandshake,
  Layers,
  Printer,
  Shirt,
  Timer,
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/Card';

const BENEFITS = [
  {
    icon: Compass,
    title: 'Criterio para elegir',
    description:
      'Entiendes por qué una prenda funciona en tu figura y dejas de comprar por ensayo y error.',
  },
  {
    icon: Shirt,
    title: 'Guía por categoría',
    description:
      'Prendas superiores, pantalones, faldas, vestidos, chaquetas, telas, estampados y accesorios.',
  },
  {
    icon: Layers,
    title: 'Outfits completos',
    description:
      'Tres combinaciones listas para usar: casual, profesional y para un evento especial.',
  },
  {
    icon: Timer,
    title: 'Resultado inmediato',
    description:
      'El cálculo ocurre en tu navegador, sin esperas ni procesos externos.',
  },
  {
    icon: Printer,
    title: 'Para llevar contigo',
    description:
      'Imprime o guarda tu ficha en PDF y consúltala cuando vayas de compras.',
  },
  {
    icon: HeartHandshake,
    title: 'Lenguaje respetuoso',
    description:
      'Nada de corregir ni disimular: el objetivo es acompañar tus proporciones naturales.',
  },
];

/** Beneficios del análisis. */
export function Benefits() {
  return (
    <section className="app-shell app-shell-wide px-gutter py-12 sm:py-16">
      <SectionHeading
        eyebrow="Para qué sirve"
        title="Lo que te llevas del análisis"
      />

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map(({ icon: Icon, title, description }) => (
          <li key={title} className="rounded-card border border-line bg-surface p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft/60">
              <Icon aria-hidden="true" className="h-5 w-5 text-brand-dark" />
            </span>
            <h3 className="mt-4 text-lg">{title}</h3>
            <p className="mt-2 text-[0.95rem] text-muted">{description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
