import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Card';
import { SEASON_LIST } from '@/data/color-seasons';

/** Presentación de la colorimetría en la página de inicio. */
export function ColorimetrySection() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="app-shell app-shell-wide px-gutter py-12 sm:py-16">
        <div className="max-w-2xl">
          <Eyebrow>Colorimetría</Eyebrow>
          <h2 className="mt-2.5 text-[1.8rem] leading-tight sm:text-4xl">
            Los colores que te iluminan
          </h2>
          <p className="mt-3 text-muted">
            Con unas preguntas sobre tu piel, tu cabello y tus ojos descubres tu
            estación de color y la paleta que más te favorece. Y cuando subes una
            prenda, te decimos si su color entra en tu paleta.
          </p>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {SEASON_LIST.map((season) => (
            <li
              key={season.id}
              className="overflow-hidden rounded-card border border-line bg-shell"
            >
              <div className="flex h-16">
                {season.palette.slice(0, 4).map((swatch) => (
                  <span
                    key={swatch.hex}
                    aria-hidden="true"
                    className="flex-1"
                    style={{ backgroundColor: swatch.hex }}
                  />
                ))}
              </div>
              <div className="p-4">
                <h3 className="text-lg leading-tight">{season.name}</h3>
                <p className="mt-1 text-[0.85rem] text-muted">{season.tagline}</p>
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/colorimetria"
          className={buttonClasses('primary', 'lg', 'mt-8 w-full sm:w-auto')}
        >
          Descubrir mis colores
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
