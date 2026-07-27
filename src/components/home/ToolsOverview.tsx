import Link from 'next/link';
import { Ruler, Shirt } from 'lucide-react';
import { buttonClasses, type ButtonVariant } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/Card';
import { SilhouetteIllustration } from '@/components/ui/SilhouetteIllustration';
import { BODY_SHAPE_PROFILES } from '@/data/body-shapes';

interface Tool {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  variant: ButtonVariant;
  badge?: string;
}

const TOOLS: Tool[] = [
  {
    eyebrow: 'Herramienta 1',
    title: 'Tu silueta',
    description:
      'Con tres medidas —o una foto— descubres tu silueta y qué cortes, escotes y prendas crean equilibrio.',
    href: '/analisis',
    cta: 'Descubrir mi silueta',
    variant: 'primary',
    badge: 'Empieza aquí',
  },
  {
    eyebrow: 'Herramienta 2',
    title: 'Tus proporciones',
    description:
      'La técnica de las 8 cabezas mide tus alturas y te dice qué tiro, largo de chaqueta y altura de zapato te estilizan.',
    href: '/proporciones',
    cta: 'Medir mi proporción',
    variant: 'secondary',
  },
  {
    eyebrow: 'Herramienta 3',
    title: 'Tu armario',
    description:
      'Una encuesta de estilo te da tu perfil, un checklist de básicos y cápsulas de outfits ya resueltas.',
    href: '/armario',
    cta: 'Crear mi armario',
    variant: 'secondary',
  },
];

/** Mini ilustración de la silueta para la primera tarjeta. */
function ToolIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <SilhouetteIllustration
        proportions={BODY_SHAPE_PROFILES.hourglass.illustration}
        title="Silueta"
        className="h-8 w-auto"
      />
    );
  }
  const Icon = index === 1 ? Ruler : Shirt;
  return <Icon aria-hidden="true" className="h-5 w-5 text-brand-dark" />;
}

/**
 * Mapa de la suite: presenta las tres herramientas como un trío de igual peso
 * para que la aplicación se entienda como un conjunto en el segundo vistazo.
 */
export function ToolsOverview() {
  return (
    <section
      id="herramientas"
      className="app-shell app-shell-wide scroll-mt-20 px-gutter py-12 sm:py-16"
    >
      <SectionHeading
        eyebrow="La suite"
        title="Tres herramientas que trabajan juntas"
        description="Cada una resuelve una parte de tu imagen y se cruzan en una sola fórmula personal. Empieza por la que quieras: la silueta es la puerta de entrada recomendada."
      />

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {TOOLS.map((tool, index) => (
          <li
            key={tool.href}
            className="flex flex-col rounded-card border border-line bg-surface p-6"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft">
                <ToolIcon index={index} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
                  {tool.badge ?? tool.eyebrow}
                </p>
                <h3 className="text-xl leading-tight">{tool.title}</h3>
              </div>
            </div>

            <p className="mt-3 flex-1 text-[0.95rem] text-muted">{tool.description}</p>

            <Link
              href={tool.href}
              className={buttonClasses(tool.variant, 'lg', 'mt-5 w-full')}
            >
              {tool.cta}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
