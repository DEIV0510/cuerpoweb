import Link from 'next/link';
import {
  ArrowRight,
  LayoutGrid,
  Palette,
  Ruler,
  ShieldCheck,
  Shirt,
  Sparkles,
} from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import { SilhouetteIllustration } from '@/components/ui/SilhouetteIllustration';
import { BODY_SHAPE_PROFILES } from '@/data/body-shapes';

const HIGHLIGHTS = [
  { icon: LayoutGrid, text: 'Cuatro herramientas en una' },
  { icon: Sparkles, text: 'Resultado inmediato' },
  { icon: ShieldCheck, text: 'Sin registro ni servidores' },
];

/** Los cuatro emblemas de la suite en la tarjeta del hero. */
const TILES = [
  { kind: 'silhouette' as const, label: 'Silueta' },
  { kind: 'ruler' as const, label: '8 cabezas' },
  { kind: 'palette' as const, label: 'Colores' },
  { kind: 'shirt' as const, label: 'Armario' },
];

/** Primera pantalla de la página de inicio: presenta la suite completa. */
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
            Alma e Imagen · Estudio de imagen personal
          </span>

          <h1 className="text-[2rem] leading-[1.1] sm:text-[2.8rem] lg:text-[3.4rem]">
            Aprende qué te favorece:{' '}
            <span className="gradient-text italic">
              tu silueta, tus proporciones, tus colores y tu armario
            </span>
          </h1>

          <p className="max-w-xl leading-relaxed text-muted sm:text-lg">
            Cuatro herramientas que trabajan juntas para darte decisiones concretas
            de vestuario: qué cortes, a qué altura, en qué colores. Todo se calcula
            en tu dispositivo, sin cuentas ni servidores.
          </p>

          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Link href="/analisis" className={buttonClasses('primary', 'lg', 'w-full sm:w-auto')}>
              Empezar por mi silueta
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="#herramientas"
              className={buttonClasses('secondary', 'lg', 'w-full sm:w-auto')}
            >
              Ver las tres herramientas
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
                La suite
              </span>
              <p className="font-script text-[2.8rem] leading-none text-brand-deep">
                Alma e Imagen
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                {TILES.map((tile) => (
                  <figure
                    key={tile.label}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-white/60 px-2 py-4"
                  >
                    <span className="flex h-14 items-center justify-center">
                      {tile.kind === 'silhouette' ? (
                        <SilhouetteIllustration
                          proportions={BODY_SHAPE_PROFILES.hourglass.illustration}
                          title="Silueta"
                          className="max-h-14"
                        />
                      ) : tile.kind === 'ruler' ? (
                        <Ruler aria-hidden="true" className="h-8 w-8 text-brand" />
                      ) : tile.kind === 'palette' ? (
                        <Palette aria-hidden="true" className="h-8 w-8 text-brand" />
                      ) : (
                        <Shirt aria-hidden="true" className="h-8 w-8 text-brand" />
                      )}
                    </span>
                    <figcaption className="text-center text-[0.62rem] font-medium leading-tight text-mocha">
                      {tile.label}
                    </figcaption>
                  </figure>
                ))}
              </div>

              <p className="mt-4 text-center text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-brand-dark">
                Tres herramientas, una fórmula
              </p>

              <p className="mt-4 border-t border-white/60 pt-4 text-sm text-muted">
                Ninguna silueta es mejor que otra: aquí no se corrige nada, se
                acompaña.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
