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
    <section className="bg-blush-radial relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-16 h-[26rem] w-[26rem] rounded-full bg-sand/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-56 h-[24rem] w-[24rem] rounded-full bg-brand-soft/60 blur-3xl"
      />

      <div className="app-shell app-shell-wide relative grid gap-10 px-gutter py-10 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-12">
        <div className="alma-fade-up flex flex-col gap-5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-sand bg-surface/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-dark backdrop-blur">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
            {SITE.brand} · {SITE.product}
          </span>

          <h1 className="text-[2rem] leading-[1.1] sm:text-[2.8rem] lg:text-[3.4rem]">
            Descubre las prendas que{' '}
            <span className="gradient-text italic">mejor acompañan</span> tu silueta
          </h1>

          <p className="max-w-xl leading-relaxed text-muted sm:text-lg">
            Ingresa tres medidas y recibe una guía personalizada de cortes, escotes,
            prendas y detalles que ayudan a crear equilibrio visual y potenciar tu
            estilo.
          </p>

          <div className="flex flex-col gap-2.5 sm:flex-row">
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

        <div className="relative mx-auto w-full max-w-md">
          <div className="relative overflow-hidden rounded-card border border-sand bg-gradient-to-br from-blush via-brand-soft to-sand p-5 shadow-card sm:p-7">
            <div
              aria-hidden="true"
              className="absolute inset-0 [background:radial-gradient(120%_90%_at_100%_0%,rgba(255,255,255,.65),transparent_45%)]"
            />

            <div className="relative">
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-mocha">
                Las cinco siluetas
              </span>
              <p className="font-script text-[2.8rem] leading-none text-brand-deep">
                Alma e Imagen
              </p>

              <div className="mt-7 grid grid-cols-5 items-end gap-2 sm:gap-3">
                {Object.values(BODY_SHAPE_PROFILES).map((profile) => (
                  <figure key={profile.id} className="flex flex-col items-center gap-2">
                    <SilhouetteIllustration
                      proportions={profile.illustration}
                      title={`Silueta ${profile.name}`}
                      className="max-h-32"
                    />
                    <figcaption className="text-center text-[0.62rem] leading-tight text-mocha">
                      {profile.shortName}
                    </figcaption>
                  </figure>
                ))}
              </div>

              <p className="mt-6 border-t border-white/60 pt-4 text-sm text-muted">
                Ninguna silueta es mejor que otra: cada una tiene sus propias
                proporciones y su forma de brillar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
