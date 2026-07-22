import Link from 'next/link';
import { ArrowRight, Ruler, ShieldCheck, Sparkles } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import { SilhouetteIllustration } from '@/components/ui/SilhouetteIllustration';
import { BODY_SHAPE_PROFILES } from '@/data/body-shapes';
import { SITE } from '@/data/navigation';

const HIGHLIGHTS = [
  { icon: Ruler, text: 'Solo tres medidas' },
  { icon: Sparkles, text: 'Resultado inmediato' },
  { icon: ShieldCheck, text: 'Sin registro ni servidores' },
];

/** Primera pantalla de la página de inicio. */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-shell px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            {SITE.brand} · {SITE.product}
          </p>

          <h1 className="text-[2.6rem] leading-[1.08] sm:text-6xl">
            Descubre las prendas que mejor acompañan tu silueta
          </h1>

          <p className="max-w-xl text-lg text-muted">
            Ingresa tres medidas y recibe una guía personalizada de cortes, escotes,
            prendas y detalles que ayudan a crear equilibrio visual y potenciar tu
            estilo.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/analisis" className={buttonClasses('primary', 'lg', 'w-full sm:w-auto')}>
              Descubrir mi silueta
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/como-medirse"
              className={buttonClasses('secondary', 'lg', 'w-full sm:w-auto')}
            >
              Ver cómo medirme
            </Link>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 text-sm text-muted">
                <Icon aria-hidden="true" className="h-4 w-4 text-brand" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="rounded-card border border-line bg-shell p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Cinco siluetas
            </p>
            <div className="mt-6 grid grid-cols-5 items-end gap-2 sm:gap-3">
              {Object.values(BODY_SHAPE_PROFILES).map((profile) => (
                <figure key={profile.id} className="flex flex-col items-center gap-2">
                  <SilhouetteIllustration
                    proportions={profile.illustration}
                    title={`Silueta ${profile.name}`}
                    className="max-h-32"
                  />
                  <figcaption className="text-center text-[0.65rem] leading-tight text-muted">
                    {profile.shortName}
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-6 border-t border-line pt-4 text-sm text-muted">
              Ninguna silueta es mejor que otra: cada una tiene sus propias
              proporciones y su forma de brillar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
