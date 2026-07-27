'use client';

import { useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowRight, Camera, Gem, Palette, RotateCcw, Sparkles } from 'lucide-react';
import { Accordion } from '@/components/ui/Accordion';
import { buttonClasses } from '@/components/ui/Button';
import { getSeasonProfile } from '@/data/color-seasons';
import type { ColorSwatch } from '@/lib/garment/color';
import {
  parseColorimetry,
  readRawColorimetry,
  subscribeToAnalysis,
} from '@/lib/storage';
import { formatLongDate } from '@/lib/utils';
import { SITE } from '@/data/navigation';

const PENDING = '__pendiente__';

function getServerSnapshot(): string {
  return PENDING;
}

function Swatches({ items, large = false }: { items: ColorSwatch[]; large?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((swatch) => (
        <li key={`${swatch.name}-${swatch.hex}`} className="flex flex-col items-center gap-1">
          <span
            aria-hidden="true"
            className={large ? 'h-14 w-14 rounded-2xl border border-line' : 'h-9 w-9 rounded-xl border border-line'}
            style={{ backgroundColor: swatch.hex }}
          />
          <span className="max-w-[4.5rem] text-center text-[0.65rem] leading-tight text-muted">
            {swatch.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Resultado de la colorimetría: estación, paleta y consejos. */
export function ColorimetryResultView() {
  const raw = useSyncExternalStore(subscribeToAnalysis, readRawColorimetry, getServerSnapshot);
  const stored = useMemo(() => (raw === PENDING ? null : parseColorimetry(raw)), [raw]);

  if (raw === PENDING) {
    return (
      <div className="app-shell px-gutter py-20">
        <p aria-live="polite" className="text-center text-muted">
          Cargando tu colorimetría…
        </p>
      </div>
    );
  }

  if (!stored) {
    return (
      <div className="app-shell px-gutter py-12 sm:py-20">
        <div className="flex flex-col items-center gap-5 rounded-card border border-line bg-surface px-6 py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
            <Palette aria-hidden="true" className="h-6 w-6 text-brand-dark" />
          </span>
          <h1 className="text-3xl">Todavía no conoces tu estación</h1>
          <p className="max-w-sm text-muted">
            Responde unas preguntas sobre tu piel, tu cabello y tus ojos y descubre
            los colores que te iluminan.
          </p>
          <Link href="/colorimetria" className={buttonClasses('primary', 'lg', 'w-full')}>
            Hacer mi colorimetría
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const { result, createdAt } = stored;
  const profile = getSeasonProfile(result.season);

  return (
    <div className="app-shell flex flex-col gap-4 px-gutter py-5 sm:gap-5 sm:py-8">
      <header className="print-only">
        <p className="font-script text-3xl">{SITE.brand}</p>
        <p className="text-sm">Colorimetría · Ficha del {formatLongDate(createdAt)}</p>
        <hr className="mt-3" />
      </header>

      {/* Estación */}
      <section
        aria-labelledby="titulo-estacion"
        className="bg-blush-radial alma-fade-up rounded-card border border-line px-5 py-7 text-center sm:px-8"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
          Tu estación de color
        </p>
        <h1 id="titulo-estacion" className="mt-2 text-[2.4rem] leading-none sm:text-5xl">
          {profile.name}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[1.05rem] text-muted">{profile.tagline}</p>
        <p className="mt-2 text-sm text-faint">{profile.summary}</p>
        <p className="mt-4 text-xs text-faint">Análisis del {formatLongDate(createdAt)}</p>
      </section>

      <p className="text-[1.02rem] leading-relaxed text-ink">{profile.description}</p>

      {/* Paleta */}
      <section
        aria-labelledby="paleta-estacion"
        className="rounded-card border border-line bg-surface p-5 sm:p-6"
      >
        <div className="flex items-center gap-2.5">
          <Palette aria-hidden="true" className="h-5 w-5 text-brand" />
          <h2 id="paleta-estacion" className="text-2xl">
            Tu paleta
          </h2>
        </div>
        <p className="mt-1.5 text-[0.95rem] text-muted">
          Los colores que más te iluminan, sobre todo cerca del rostro.
        </p>
        <div className="mt-5">
          <Swatches items={profile.palette} large />
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-ink">Tus mejores neutros</p>
            <div className="mt-2">
              <Swatches items={profile.neutrals} />
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl bg-shell p-4">
            <Gem aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <div>
              <p className="text-sm font-medium text-ink">Tu metal</p>
              <p className="text-[0.95rem] text-muted">{profile.metal}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Con cuidado */}
      <section className="rounded-card border border-sand bg-brand-soft/40 p-5">
        <h2 className="text-lg">Con cuidado</h2>
        <p className="mt-1.5 text-[0.95rem] text-brand-dark">{profile.careful}</p>
      </section>

      {/* Consejos */}
      <Accordion title="Cómo sacarle partido" defaultOpen>
        <ul className="flex flex-col gap-3 text-[0.95rem] text-muted">
          {profile.tips.map((tip) => (
            <li key={tip} className="flex gap-2.5">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </Accordion>

      {/* Cruce con la prenda */}
      <section
        aria-labelledby="con-prenda"
        className="rounded-card border border-line bg-surface p-5 sm:p-6"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft">
            <Camera aria-hidden="true" className="h-5 w-5 text-brand-dark" />
          </span>
          <h2 id="con-prenda" className="text-xl leading-tight">
            ¿Ese color te favorece?
          </h2>
        </div>
        <p className="mt-3 text-[0.95rem] text-muted">
          Sube la foto de una prenda y, además de con qué combinarla, te diré si su
          color entra en tu paleta de {profile.name.toLowerCase()}.
        </p>
        <Link
          href="/armario/prenda"
          className={buttonClasses('secondary', 'lg', 'no-print mt-4 w-full')}
        >
          Analizar una prenda
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </section>

      <div className="no-print flex flex-col gap-2.5 pt-2">
        <Link href="/colorimetria" className={buttonClasses('ghost', 'lg', 'w-full')}>
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Repetir el análisis
        </Link>
        <p className="flex items-start gap-2 text-sm text-faint">
          <Sparkles aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          Es una orientación de color, no una norma. La luz, tu maquillaje y tu
          gusto también deciden. Método versión {result.version}.
        </p>
      </div>
    </div>
  );
}
