'use client';

import { useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowRight, RotateCcw, Shirt, Sparkles, Wand2 } from 'lucide-react';
import { Accordion } from '@/components/ui/Accordion';
import { buttonClasses } from '@/components/ui/Button';
import { BasicsChecklist } from '@/components/wardrobe/BasicsChecklist';
import { CapsuleCard } from '@/components/wardrobe/CapsuleCard';
import { OCCASION_LABELS } from '@/data/wardrobe-labels';
import { buildWardrobePlan } from '@/lib/wardrobe/wardrobe-plan';
import {
  parseStoredAnalysis,
  parseWardrobe,
  readRawAnalysis,
  readRawWardrobe,
  subscribeToAnalysis,
} from '@/lib/storage';
import { formatLongDate } from '@/lib/utils';
import { SITE } from '@/data/navigation';

const PENDING = '__pendiente__';

function getServerSnapshot(): string {
  return PENDING;
}

/** Resultado del módulo Mi Armario: perfil, checklist y cápsulas. */
export function WardrobeResultView() {
  const raw = useSyncExternalStore(
    subscribeToAnalysis,
    readRawWardrobe,
    getServerSnapshot,
  );

  const rawShape = useSyncExternalStore(
    subscribeToAnalysis,
    readRawAnalysis,
    getServerSnapshot,
  );

  const stored = useMemo(
    () => (raw === PENDING ? null : parseWardrobe(raw)),
    [raw],
  );

  const shape = useMemo(
    () => (rawShape === PENDING ? null : parseStoredAnalysis(rawShape)),
    [rawShape],
  );

  const plan = useMemo(
    () => (stored ? buildWardrobePlan(stored.profile) : null),
    [stored],
  );

  if (raw === PENDING) {
    return (
      <div className="app-shell px-gutter py-20">
        <p aria-live="polite" className="text-center text-muted">
          Cargando tu armario…
        </p>
      </div>
    );
  }

  if (!stored || !plan) {
    return (
      <div className="app-shell px-gutter py-12 sm:py-20">
        <div className="flex flex-col items-center gap-5 rounded-card border border-line bg-surface px-6 py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
            <Shirt aria-hidden="true" className="h-6 w-6 text-brand-dark" />
          </span>
          <h1 className="text-3xl">Todavía no tienes tu armario</h1>
          <p className="max-w-sm text-muted">
            Responde una encuesta corta sobre tu estilo y tus ocasiones, y arma tu
            perfil, tu checklist de básicos y tus cápsulas de outfits.
          </p>
          <Link href="/armario" className={buttonClasses('primary', 'lg', 'w-full')}>
            Hacer la encuesta de estilo
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const { profile, createdAt } = stored;

  return (
    <div className="app-shell flex flex-col gap-4 px-gutter py-5 sm:gap-5 sm:py-8">
      <header className="print-only">
        <p className="font-script text-3xl">{SITE.brand}</p>
        <p className="text-sm">Mi armario · Ficha del {formatLongDate(createdAt)}</p>
        <hr className="mt-3" />
      </header>

      {/* Perfil de estilo */}
      <section
        aria-labelledby="titulo-perfil"
        className="bg-blush-radial alma-fade-up rounded-card border border-line px-5 py-7 text-center sm:px-8"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
          Tu perfil de estilo
        </p>
        <h1 id="titulo-perfil" className="mt-2 text-[2rem] leading-tight sm:text-4xl">
          {profile.name}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[1.05rem] text-muted">
          {profile.description}
        </p>

        <ul className="mt-5 flex flex-wrap justify-center gap-2">
          {profile.occasions.map((occasion) => (
            <li
              key={occasion}
              className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-ink"
            >
              {OCCASION_LABELS[occasion]}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs text-faint">
          Encuesta del {formatLongDate(createdAt)}
        </p>
      </section>

      {/* Prioridades */}
      <section
        aria-labelledby="prioridades"
        className="rounded-card border border-sand bg-brand-soft/45 p-5 sm:p-6"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface">
            <Sparkles aria-hidden="true" className="h-5 w-5 text-brand-dark" />
          </span>
          <h2 id="prioridades" className="text-xl">
            Por dónde empezar
          </h2>
        </div>
        <ul className="mt-4 flex flex-col gap-2.5">
          {profile.priorities.map((priority) => (
            <li key={priority} className="flex gap-2.5 text-[0.975rem] text-ink">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
              />
              <span>{priority}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Checklist de básicos */}
      <BasicsChecklist groups={plan.groups} basics={plan.basics} />

      {/* Cápsulas de outfits */}
      <section aria-labelledby="titulo-capsulas" className="pt-2">
        <h2 id="titulo-capsulas" className="text-2xl">
          Tus cápsulas de outfits
        </h2>
        <p className="mt-1.5 text-[0.95rem] text-muted">
          Combinaciones ya resueltas para tu estilo y tus ocasiones.
        </p>
        {plan.capsules.length > 0 ? (
          <div className="mt-4 flex flex-col gap-3">
            {plan.capsules.map((capsule) => (
              <CapsuleCard key={capsule.id} capsule={capsule} />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-card border border-line bg-surface p-5 text-[0.95rem] text-muted">
            Para tu combinación de estilo y ocasiones aún no tenemos una cápsula
            armada. El checklist de básicos te da la base para crear las tuyas.
          </p>
        )}
      </section>

      {/* Cruce con la silueta */}
      <section
        aria-labelledby="con-silueta"
        className="rounded-card border border-line bg-surface p-5 sm:p-6"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft">
            <Wand2 aria-hidden="true" className="h-5 w-5 text-brand-dark" />
          </span>
          <h2 id="con-silueta" className="text-xl leading-tight">
            Afínalo con tu silueta
          </h2>
        </div>
        {shape ? (
          <>
            <p className="mt-4 text-[0.95rem] text-muted">
              Tu silueta es <strong className="text-ink">{shape.result.name}</strong>.
              Cruza tu estilo con los cortes que mejor te acompañan en tu fórmula
              personal.
            </p>
            <Link
              href="/resultado"
              className={buttonClasses('secondary', 'lg', 'no-print mt-4 w-full')}
            >
              Ver mi fórmula personal
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </>
        ) : (
          <>
            <p className="mt-4 text-[0.95rem] text-muted">
              Si además analizas tu silueta, sabrás qué cortes acompañan mejor cada
              una de estas prendas.
            </p>
            <Link
              href="/analisis"
              className={buttonClasses('secondary', 'lg', 'no-print mt-4 w-full')}
            >
              Analizar mi silueta
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </>
        )}
      </section>

      <Accordion title="Cómo usar tu armario">
        <ul className="flex flex-col gap-3 text-[0.95rem] text-muted">
          <li>
            El checklist se guarda solo: ve marcando lo que ya tienes cuando revises
            tu clóset.
          </li>
          <li>
            Empieza por los esenciales que te faltan (los de la estrella): son los
            que más rinden.
          </li>
          <li>
            Usa las cápsulas tal cual o cambia una prenda cada vez para crear
            variaciones.
          </li>
        </ul>
      </Accordion>

      <div className="no-print flex flex-col gap-2.5 pt-2">
        <Link href="/armario" className={buttonClasses('ghost', 'lg', 'w-full')}>
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Repetir la encuesta
        </Link>
        <p className="text-sm text-faint">
          Es una guía de imagen y vestuario, orientativa. Perfil de estilo versión{' '}
          {profile.version}.
        </p>
      </div>
    </div>
  );
}
