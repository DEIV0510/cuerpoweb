import Link from 'next/link';
import { ArrowRight, CheckCircle2, Layers, Shirt } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Card';

const HIGHLIGHTS = [
  {
    icon: Shirt,
    title: 'Tu perfil de estilo',
    description: 'Una encuesta corta traduce tus gustos en un perfil con nombre propio.',
  },
  {
    icon: CheckCircle2,
    title: 'Checklist de básicos',
    description: 'Marca lo que tienes y descubre qué te falta según tu estilo y tus ocasiones.',
  },
  {
    icon: Layers,
    title: 'Cápsulas de outfits',
    description: 'Combinaciones ya resueltas para no dudar al vestirte.',
  },
];

/** Presentación del módulo Mi Armario en la página de inicio. */
export function WardrobeSection() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="app-shell app-shell-wide px-gutter py-12 sm:py-16">
        <div className="max-w-2xl">
          <Eyebrow>Mi armario</Eyebrow>
          <h2 className="mt-2.5 text-[1.8rem] leading-tight sm:text-4xl">
            Arma un armario que sí combina
          </h2>
          <p className="mt-3 text-muted">
            Responde una encuesta de estilo y recibe tu perfil, un checklist de los
            básicos que te faltan y cápsulas de outfits listas para usar. Todo se
            apoya en tu silueta y se guarda en tu dispositivo.
          </p>
        </div>

        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
            <li key={title} className="rounded-card border border-line bg-shell p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft">
                <Icon aria-hidden="true" className="h-5 w-5 text-brand-dark" />
              </span>
              <h3 className="mt-4 text-lg">{title}</h3>
              <p className="mt-2 text-[0.95rem] text-muted">{description}</p>
            </li>
          ))}
        </ul>

        <Link
          href="/armario"
          className={buttonClasses('primary', 'lg', 'mt-8 w-full sm:w-auto')}
        >
          Crear mi armario
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
