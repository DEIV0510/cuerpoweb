'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Ruler, Sparkles } from 'lucide-react';
import { Accordion } from '@/components/ui/Accordion';
import { Button, buttonClasses } from '@/components/ui/Button';
import { FlowHeader } from '@/components/measurements/FlowHeader';
import { MeasurementField } from '@/components/measurements/MeasurementField';
import { SilhouetteIllustration } from '@/components/ui/SilhouetteIllustration';
import { SEGMENT_FIELDS } from '@/data/proportion-recommendations';
import { VALIDATION_MESSAGES, parseMeasurement } from '@/lib/body-shape/validation';
import {
  SEGMENT_RANGES,
  analyzeEightHeads,
  type EightHeadsInput,
} from '@/lib/proportions/eight-heads';
import {
  saveProportions,
  saveProportionsDraft,
  type ProportionsDraft,
} from '@/lib/storage';

/** Introducción y las cuatro medidas verticales. */
const TOTAL_STEPS = 5;

const NUMERIC_PATTERN = /^\d{1,3}([.,]\d)?$/;

type FieldId = keyof EightHeadsInput;

const EMPTY_VALUES: Record<FieldId, string> = {
  head: '',
  torso: '',
  rise: '',
  legs: '',
};

interface ProportionsFlowProps {
  initialDraft: ProportionsDraft | null;
}

/**
 * Técnica de las 8 cabezas, paso a paso.
 * Una medida por pantalla, con la acción principal en la barra inferior.
 */
export function ProportionsFlow({ initialDraft }: ProportionsFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(() =>
    Math.min(Math.max(initialDraft?.step ?? 0, 0), TOTAL_STEPS - 1),
  );
  const [values, setValues] = useState<Record<FieldId, string>>(
    () => initialDraft?.values ?? EMPTY_VALUES,
  );
  const [error, setError] = useState<string | null>(null);
  const [keepKeyboard, setKeepKeyboard] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const field = step >= 1 ? SEGMENT_FIELDS[step - 1] : null;

  function persist(nextStep: number, nextValues = values) {
    saveProportionsDraft({ step: nextStep, values: nextValues });
  }

  function setValue(id: FieldId, next: string) {
    const updated = { ...values, [id]: next };
    setValues(updated);
    if (error) setError(null);
  }

  function validateCurrent(): boolean {
    if (!field) return true;

    const id = field.id as FieldId;
    const raw = values[id].trim();
    const range = SEGMENT_RANGES[id];

    if (raw.length === 0) {
      setError(`Ingresa la medida: ${field.label.toLowerCase()}.`);
      return false;
    }

    if (!NUMERIC_PATTERN.test(raw)) {
      setError(VALIDATION_MESSAGES.notANumber);
      return false;
    }

    const parsed = parseMeasurement(raw);
    if (parsed < range.min || parsed > range.max) {
      setError(`Ingresa una medida entre ${range.min} y ${range.max} cm.`);
      return false;
    }

    setError(null);
    return true;
  }

  function goTo(nextStep: number) {
    setStep(nextStep);
    setError(null);
    persist(nextStep);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function goForward() {
    if (step === 0) {
      setKeepKeyboard(false);
      goTo(1);
      return;
    }

    if (!validateCurrent()) return;

    if (step < TOTAL_STEPS - 1) {
      goTo(step + 1);
      return;
    }

    runAnalysis();
  }

  function runAnalysis() {
    setAnalyzing(true);

    try {
      const result = analyzeEightHeads({
        head: parseMeasurement(values.head),
        torso: parseMeasurement(values.torso),
        rise: parseMeasurement(values.rise),
        legs: parseMeasurement(values.legs),
      });

      saveProportions(result);
      saveProportionsDraft({ step: 0, values: EMPTY_VALUES });
      window.setTimeout(() => router.push('/proporciones/resultado'), 450);
    } catch (caught) {
      setAnalyzing(false);
      setError(
        caught instanceof Error
          ? caught.message
          : 'No pudimos calcular tu proporción con esas medidas.',
      );
    }
  }

  function handleBack() {
    setKeepKeyboard(false);
    if (step === 0) {
      router.push('/');
      return;
    }
    goTo(step - 1);
  }

  const primaryLabel =
    step === 0 ? 'Comenzar' : step === TOTAL_STEPS - 1 ? 'Ver mi proporción' : 'Continuar';

  return (
    <div className="flex min-h-[100dvh] flex-col bg-shell">
      <FlowHeader
        current={step + 1}
        total={TOTAL_STEPS}
        onBack={handleBack}
        onExit={() => {
          persist(step);
          router.push('/');
        }}
        backLabel={step === 0 ? 'Volver al inicio' : 'Volver al paso anterior'}
      />

      <div className="flex-1 px-gutter pb-action-bar pt-6">
        <form
          id="flujo-proporciones"
          className="app-shell"
          noValidate
          onBlur={() => persist(step)}
          onSubmit={(event) => {
            event.preventDefault();
            goForward();
          }}
        >
          {step === 0 ? (
            <section aria-labelledby="proporciones-intro" className="alma-fade-up flex flex-col gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
                  Proporción vertical
                </p>
                <h1 id="proporciones-intro" className="mt-2 text-[2rem] sm:text-4xl">
                  La técnica de las 8 cabezas
                </h1>
                <p className="mt-3 text-muted">
                  El cuerpo se divide verticalmente en unidades del tamaño de tu
                  propia cabeza. No importa cuánto midas: lo que decide la
                  estilización es cómo se reparten tus tramos.
                </p>
              </div>

              <ul className="flex flex-col gap-2.5">
                {SEGMENT_FIELDS.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand-dark">
                      {item.reference}
                    </span>
                    <span className="text-[0.95rem]">
                      <span className="font-medium text-ink">{item.short}: </span>
                      {item.reference === 1 ? '1 cabeza' : `${item.reference} cabezas`}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="rounded-2xl bg-surface p-4 text-[0.95rem] text-muted">
                Con eso sabrás si tu torso es corto o largo, qué tiro de pantalón te
                sienta mejor, si te favorecen las chaquetas cortas o los blazers
                largos y cuánta altura necesita tu zapato.
              </p>

              <Accordion title="Qué necesitas para medirte">
                <ul className="flex flex-col gap-2.5 text-[0.95rem] text-muted">
                  <li className="flex gap-2.5">
                    <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-success" />
                    <span>Una cinta métrica y, si puedes, un espejo de cuerpo completo.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-success" />
                    <span>Estar descalza y de pie, con la espalda recta.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-success" />
                    <span>
                      Todas las medidas son verticales, en línea recta, no contornos.
                    </span>
                  </li>
                </ul>
              </Accordion>
            </section>
          ) : null}

          {field ? (
            <section
              key={field.id}
              aria-labelledby={`proporcion-${field.id}`}
              className="alma-fade-up flex flex-col gap-5"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
                  Medida {step} de 4
                </p>
                <h1 id={`proporcion-${field.id}`} className="mt-2 text-[1.9rem] sm:text-4xl">
                  {field.label}
                </h1>
                <p className="mt-3 text-muted">{field.instruction}</p>
              </div>

              <div className="flex items-center justify-center gap-3 rounded-card border border-line bg-surface px-5 py-4">
                <Ruler aria-hidden="true" className="h-5 w-5 text-brand" />
                <p className="text-[0.95rem] text-muted">
                  Referencia:{' '}
                  <strong className="text-ink">
                    {field.reference === 1 ? '1 cabeza' : `${field.reference} cabezas`}
                  </strong>
                </p>
              </div>

              <MeasurementField
                label={`${field.short} en centímetros`}
                value={values[field.id as FieldId]}
                onValueChange={(next) => setValue(field.id as FieldId, next)}
                error={error ?? undefined}
                hint="Medida vertical, en línea recta. Puedes usar un decimal."
                autoFocus={keepKeyboard}
                enterKeyHint={step === TOTAL_STEPS - 1 ? 'done' : 'next'}
                onEnterKey={() => setKeepKeyboard(true)}
              />

              <Accordion title="Cómo tomar esta medida">
                <ul className="flex flex-col gap-2.5 text-[0.95rem] text-muted">
                  {field.tips.map((tip) => (
                    <li key={tip} className="flex gap-2.5">
                      <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-success" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </Accordion>
            </section>
          ) : null}

          {error && !field ? (
            <p role="alert" className="mt-4 rounded-2xl border border-brand bg-surface p-4 text-brand-dark">
              {error}
            </p>
          ) : null}
        </form>
      </div>

      <div className="no-print sticky bottom-0 z-30 border-t border-line bg-surface/95 px-gutter pb-safe shadow-bar backdrop-blur-md">
        <div className="app-shell flex flex-col gap-1 py-3">
          <Button
            type="submit"
            form="flujo-proporciones"
            size="lg"
            disabled={analyzing}
            onClick={() => setKeepKeyboard(false)}
            className="w-full"
          >
            {analyzing ? 'Calculando…' : primaryLabel}
            {analyzing ? null : <ArrowRight aria-hidden="true" className="h-4 w-4" />}
          </Button>

          {step === 0 ? (
            <Link href="/analisis" className={buttonClasses('ghost', 'md', 'w-full')}>
              Analizar mi silueta primero
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

      {analyzing ? (
        <div className="alma-fade-in fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-shell/95 px-gutter text-center backdrop-blur">
          <div className="w-24 animate-pulse">
            <SilhouetteIllustration
              proportions={{ bust: 21, waist: 17, hips: 22 }}
              title="Calculando tu proporción"
            />
          </div>
          <p aria-live="polite" className="flex items-center gap-2 text-lg text-brand-dark">
            <Sparkles aria-hidden="true" className="h-5 w-5" />
            Calculando tu proporción…
          </p>
        </div>
      ) : null}
    </div>
  );
}
