import Link from 'next/link';
import { Palette, Shirt, Sparkles, Target } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import type { ColorSwatch } from '@/lib/garment/color';
import type { GarmentCombination } from '@/lib/garment/combine';

interface CombinationResultProps {
  combination: GarmentCombination;
  photoUrl: string | null;
  /** Nombre de la silueta, si la persona la calculó. */
  shapeName?: string;
}

function Swatches({ items }: { items: ColorSwatch[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((swatch) => (
        <li
          key={`${swatch.name}-${swatch.hex}`}
          className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5"
        >
          <span
            aria-hidden="true"
            className="h-4 w-4 rounded-full border border-line"
            style={{ backgroundColor: swatch.hex }}
          />
          <span className="text-sm text-ink">{swatch.name}</span>
        </li>
      ))}
    </ul>
  );
}

/** Muestra la guía de combinación de la prenda subida. */
export function CombinationResult({
  combination,
  photoUrl,
  shapeName,
}: CombinationResultProps) {
  const { color, palette, pairWith, outfitIdeas, shapeNote } = combination;

  return (
    <section aria-labelledby="prenda-resultado" className="alma-fade-up flex flex-col gap-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
          Con qué combinarla
        </p>
        <h1 id="prenda-resultado" className="mt-2 text-[2rem] sm:text-4xl">
          Tu prenda {color.displayName.toLowerCase()}
        </h1>
      </div>

      <div className="flex items-center gap-4 rounded-card border border-line bg-surface p-4">
        {photoUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt="Tu prenda"
              className="h-20 w-20 shrink-0 rounded-2xl border border-line object-cover"
            />
          </>
        ) : null}
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-10 w-10 shrink-0 rounded-full border border-line"
            style={{ backgroundColor: color.hex }}
          />
          <div>
            <p className="text-lg font-semibold text-ink">{color.displayName}</p>
            <p className="text-sm text-muted">
              {color.isNeutral ? 'Un neutro versátil' : 'Un color con presencia'}
            </p>
          </div>
        </div>
      </div>

      {/* Colores que combinan */}
      <section
        aria-labelledby="paleta"
        className="rounded-card border border-line bg-surface p-5"
      >
        <div className="flex items-center gap-2.5">
          <Palette aria-hidden="true" className="h-5 w-5 text-brand" />
          <h2 id="paleta" className="text-xl">
            Colores que combinan
          </h2>
        </div>
        <p className="mt-2 text-[0.95rem] text-muted">{palette.note}</p>

        <p className="mt-4 text-sm font-medium text-ink">Siempre funcionan</p>
        <div className="mt-2">
          <Swatches items={palette.alwaysWith} />
        </div>

        <p className="mt-4 text-sm font-medium text-ink">Para darle intención</p>
        <div className="mt-2">
          <Swatches items={palette.accentWith} />
        </div>
      </section>

      {/* Con qué prendas */}
      <section aria-labelledby="con-que" className="rounded-card border border-line bg-surface p-5">
        <div className="flex items-center gap-2.5">
          <Shirt aria-hidden="true" className="h-5 w-5 text-brand" />
          <h2 id="con-que" className="text-xl">
            Con qué prendas
          </h2>
        </div>
        <ul className="mt-4 flex flex-col gap-3">
          {pairWith.map((pair) => (
            <li key={pair.target} className="rounded-2xl bg-shell p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-faint">{pair.label}</p>
              <p className="mt-0.5 text-[0.975rem] text-ink">{pair.suggestion}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Nota de silueta */}
      {shapeNote ? (
        <section className="rounded-card border border-sand bg-brand-soft/45 p-5">
          <div className="flex items-center gap-2.5">
            <Target aria-hidden="true" className="h-5 w-5 text-brand-dark" />
            <h2 className="text-lg">Según tu silueta</h2>
          </div>
          <p className="mt-2 text-[0.95rem] text-brand-dark">{shapeNote}</p>
        </section>
      ) : (
        <section className="rounded-card border border-line bg-surface p-5">
          <p className="text-[0.95rem] text-muted">
            Si analizas tu silueta, estas sugerencias se afinan a los cortes que
            mejor te acompañan.
          </p>
          <Link
            href="/analisis"
            className={buttonClasses('secondary', 'md', 'mt-3 w-full')}
          >
            Analizar mi silueta
          </Link>
        </section>
      )}

      {/* Ideas de outfit */}
      <section aria-labelledby="ideas" className="pt-1">
        <div className="flex items-center gap-2.5">
          <Sparkles aria-hidden="true" className="h-5 w-5 text-brand" />
          <h2 id="ideas" className="text-2xl">
            Ideas de look
          </h2>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {outfitIdeas.map((idea) => (
            <article key={idea.title} className="rounded-card border border-line bg-surface p-5">
              <h3 className="text-lg">{idea.title}</h3>
              <p className="mt-1.5 text-[0.95rem] text-muted">{idea.description}</p>
            </article>
          ))}
        </div>
      </section>

      <p className="text-sm text-faint">
        {shapeName
          ? `Sugerencias afinadas a tu silueta ${shapeName.toLowerCase()}. `
          : ''}
        Es una orientación de estilo; la última palabra es tuya.
      </p>
    </section>
  );
}
