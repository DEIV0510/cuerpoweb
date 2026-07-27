'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera, Check, ImageUp, Info, RotateCcw } from 'lucide-react';
import { Accordion } from '@/components/ui/Accordion';
import { Button, buttonClasses } from '@/components/ui/Button';
import { FlowHeader } from '@/components/measurements/FlowHeader';
import { GarmentColorCanvas } from '@/components/garment/GarmentColorCanvas';
import { CombinationResult } from '@/components/garment/CombinationResult';
import {
  COLOR_FAMILY_OPTIONS,
  classifyColor,
  colorInfoFromFamily,
  type ColorInfo,
  type RGB,
} from '@/lib/garment/color';
import { buildCombination } from '@/lib/garment/combine';
import { GARMENT_KINDS, type GarmentKind } from '@/data/garment-content';
import {
  parseColorimetry,
  parseStoredAnalysis,
  readRawAnalysis,
  readRawColorimetry,
  subscribeToAnalysis,
} from '@/lib/storage';
import { getBodyShapeProfile } from '@/data/body-shapes';
import { cn } from '@/lib/utils';

/** Foto, color, tipo y resultado. */
const TOTAL_STEPS = 4;

const PENDING = '__pendiente__';

function getServerSnapshot(): string {
  return PENDING;
}

/**
 * Sube la foto de una prenda, toma su color y sugiere combinaciones.
 * La foto se abre como URL temporal en memoria y se libera al salir; no se
 * guarda nada.
 */
export function GarmentFlow() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [step, setStep] = useState(0);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState('');
  const [color, setColor] = useState<ColorInfo | null>(null);
  const [manual, setManual] = useState(false);
  const [kind, setKind] = useState<GarmentKind | null>(null);
  const [error, setError] = useState<string | null>(null);

  // La silueta guardada (si existe) afina las combinaciones.
  const rawShape = useSyncExternalStore(
    subscribeToAnalysis,
    readRawAnalysis,
    getServerSnapshot,
  );
  const shape = useMemo(() => {
    if (rawShape === PENDING) return undefined;
    return parseStoredAnalysis(rawShape)?.result.type;
  }, [rawShape]);

  // La colorimetría (si existe) dice si el color de la prenda le favorece.
  const rawSeason = useSyncExternalStore(
    subscribeToAnalysis,
    readRawColorimetry,
    getServerSnapshot,
  );
  const season = useMemo(() => {
    if (rawSeason === PENDING) return undefined;
    return parseColorimetry(rawSeason)?.result.season;
  }, [rawSeason]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Elige un archivo de imagen (JPG, PNG o HEIC).');
      return;
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setPhotoUrl(url);
    setPhotoName(file.name);
    setColor(null);
    setManual(false);
    setError(null);
  }

  function handleSample(rgb: RGB) {
    if (manual) return;
    setColor(classifyColor(rgb));
  }

  function pickFamily(family: (typeof COLOR_FAMILY_OPTIONS)[number]['family']) {
    setManual(true);
    setColor(colorInfoFromFamily(family));
  }

  function goTo(next: number) {
    setStep(next);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function goForward() {
    if (step === 0) {
      if (!photoUrl) {
        setError('Sube una foto de tu prenda para continuar.');
        return;
      }
      goTo(1);
      return;
    }
    if (step === 1) {
      if (!color) {
        setError('Toca tu prenda para tomar su color, o elígelo a mano.');
        return;
      }
      goTo(2);
      return;
    }
    if (step === 2) {
      if (!kind) {
        setError('Elige qué tipo de prenda es.');
        return;
      }
      goTo(3);
    }
  }

  function reset() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPhotoUrl(null);
    setPhotoName('');
    setColor(null);
    setManual(false);
    setKind(null);
    goTo(0);
  }

  function handleBack() {
    if (step === 0) {
      router.push('/armario');
      return;
    }
    goTo(step - 1);
  }

  const combination =
    step === 3 && color && kind
      ? buildCombination({ kind, color, shape, season })
      : null;

  const primaryLabel =
    step === 0
      ? 'Continuar'
      : step === 1
        ? 'Este es el color'
        : step === 2
          ? 'Ver combinaciones'
          : 'Combinar otra prenda';

  return (
    <div className="flex min-h-[100dvh] flex-col bg-shell">
      <FlowHeader
        current={step + 1}
        total={TOTAL_STEPS}
        onBack={handleBack}
        onExit={() => router.push('/')}
        backLabel={step === 0 ? 'Volver a Mi armario' : 'Volver al paso anterior'}
      />

      <div className="flex-1 px-gutter pb-action-bar pt-6">
        <div className="app-shell flex flex-col gap-5">
          {/* Paso 1 · Subir foto */}
          {step === 0 ? (
            <section aria-labelledby="prenda-inicio" className="alma-fade-up flex flex-col gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
                  Combinar una prenda
                </p>
                <h1 id="prenda-inicio" className="mt-2 text-[2rem] sm:text-4xl">
                  Sube una prenda y te digo con qué va
                </h1>
                <p className="mt-3 text-muted">
                  Toma su color de la foto y, con tu silueta y tu estilo, te sugiere
                  colores y prendas para combinarla. La imagen no sale de tu
                  dispositivo.
                </p>
              </div>

              <div className="rounded-card border border-line bg-surface p-4">
                <div className="flex items-start gap-3">
                  <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <p className="text-[0.9rem] text-muted">
                    Funciona mejor con una foto de la prenda sola, bien iluminada y
                    sobre un fondo liso.
                  </p>
                </div>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => handleFile(event.target.files?.[0])}
              />

              {photoUrl ? (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoUrl}
                      alt="Vista previa de tu prenda"
                      className="max-h-[38dvh] w-auto max-w-full rounded-card border border-line"
                    />
                  </div>
                  <p className="truncate text-center text-sm text-faint">{photoName}</p>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => inputRef.current?.click()}
                    className="w-full"
                  >
                    <ImageUp aria-hidden="true" className="h-4 w-4" />
                    Cambiar la foto
                  </Button>
                </div>
              ) : (
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => inputRef.current?.click()}
                  className="w-full flex-col gap-2 py-8"
                >
                  <Camera aria-hidden="true" className="h-7 w-7 text-brand" />
                  Tomar o elegir una foto
                  <span className="text-sm font-normal text-faint">Cámara o galería</span>
                </Button>
              )}
            </section>
          ) : null}

          {/* Paso 2 · Tomar el color */}
          {step === 1 && photoUrl ? (
            <section aria-labelledby="prenda-color" className="alma-fade-up flex flex-col gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
                  Su color
                </p>
                <h1 id="prenda-color" className="mt-2 text-[1.9rem] sm:text-3xl">
                  Toca tu prenda
                </h1>
                <p className="mt-2 text-muted">
                  Toca la zona de la prenda que mejor represente su color.
                </p>
              </div>

              <GarmentColorCanvas src={photoUrl} onSample={handleSample} />

              {color ? (
                <div className="flex items-center gap-3 rounded-card border border-line bg-surface p-4">
                  <span
                    aria-hidden="true"
                    className="h-12 w-12 shrink-0 rounded-full border border-line"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <p className="text-sm text-faint">Color detectado</p>
                    <p className="text-xl font-semibold text-ink">{color.displayName}</p>
                  </div>
                </div>
              ) : null}

              <Accordion title="¿No acertó? Elige el color a mano">
                <ul className="flex flex-wrap gap-2">
                  {COLOR_FAMILY_OPTIONS.map((option) => (
                    <li key={option.family}>
                      <button
                        type="button"
                        onClick={() => pickFamily(option.family)}
                        className={cn(
                          'flex min-h-11 items-center gap-2 rounded-full border px-3 text-sm transition-colors',
                          manual && color?.family === option.family
                            ? 'border-brand bg-brand-soft/50 text-brand-dark'
                            : 'border-line bg-surface text-ink hover:border-sand',
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="h-4 w-4 rounded-full border border-line"
                          style={{ backgroundColor: option.hex }}
                        />
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </Accordion>
            </section>
          ) : null}

          {/* Paso 3 · Tipo de prenda */}
          {step === 2 ? (
            <section aria-labelledby="prenda-tipo" className="alma-fade-up flex flex-col gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
                  Qué es
                </p>
                <h1 id="prenda-tipo" className="mt-2 text-[1.9rem] sm:text-3xl">
                  ¿Qué prenda es?
                </h1>
              </div>

              <ul className="flex flex-col gap-2.5">
                {GARMENT_KINDS.map((option) => {
                  const selected = kind === option.kind;
                  return (
                    <li key={option.kind}>
                      <button
                        type="button"
                        onClick={() => {
                          setKind(option.kind);
                          setError(null);
                        }}
                        aria-pressed={selected}
                        className={cn(
                          'flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors',
                          selected
                            ? 'border-brand bg-brand-soft/50'
                            : 'border-line bg-surface hover:border-sand',
                        )}
                      >
                        <span>
                          <span className="block text-[1.02rem] font-medium text-ink">
                            {option.label}
                          </span>
                          <span className="mt-0.5 block text-sm text-muted">
                            {option.hint}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                            selected ? 'border-brand bg-brand text-white' : 'border-line',
                          )}
                        >
                          {selected ? <Check className="h-3.5 w-3.5" /> : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {/* Paso 4 · Resultado */}
          {step === 3 && combination ? (
            <CombinationResult
              combination={combination}
              photoUrl={photoUrl}
              shapeName={shape ? getBodyShapeProfile(shape).name : undefined}
            />
          ) : null}

          {error ? (
            <p role="alert" className="rounded-2xl border border-brand bg-surface p-4 text-brand-dark">
              {error}
            </p>
          ) : null}
        </div>
      </div>

      <div className="no-print sticky bottom-0 z-30 border-t border-line bg-surface/95 px-gutter pb-safe shadow-bar backdrop-blur-md">
        <div className="app-shell flex flex-col gap-1 py-3">
          <Button
            size="lg"
            onClick={step === 3 ? reset : goForward}
            className="w-full"
          >
            {step === 3 ? <RotateCcw aria-hidden="true" className="h-4 w-4" /> : null}
            {primaryLabel}
          </Button>

          {step === 0 ? (
            <Link href="/armario" className={buttonClasses('ghost', 'md', 'w-full')}>
              Volver a Mi armario
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleBack}
              className="min-h-11 rounded-full text-sm font-medium text-muted transition-colors hover:text-brand-dark"
            >
              Volver al paso anterior
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
