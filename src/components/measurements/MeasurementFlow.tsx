'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Camera, Check, Pencil, Sparkles } from 'lucide-react';
import { Accordion } from '@/components/ui/Accordion';
import { Button, buttonClasses } from '@/components/ui/Button';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { FlowHeader } from '@/components/measurements/FlowHeader';
import { MeasurementField } from '@/components/measurements/MeasurementField';
import {
  MeasurementIllustration,
  type MeasurementZone,
} from '@/components/measurements/MeasurementIllustration';
import { SilhouetteIllustration } from '@/components/ui/SilhouetteIllustration';
import { ESSENTIAL_TIPS, GENERAL_TIPS, ZONE_GUIDES } from '@/data/measurement-guide';
import { classifyBodyShape } from '@/lib/body-shape/classify-body-shape';
import { formatCm } from '@/lib/body-shape/calculations';
import { buildWarnings } from '@/lib/body-shape/validation';
import { clearDraft, saveAnalysis, saveDraft, type MeasurementDraft } from '@/lib/storage';
import {
  EMPTY_MEASUREMENTS_FORM,
  measurementsSchema,
  type MeasurementsFormInput,
  type MeasurementsFormValues,
} from '@/schemas/measurements-schema';

/** Pasos del flujo: preparación, tres medidas y confirmación. */
const TOTAL_STEPS = 5;

const MEASURE_STEPS: Array<{ zone: MeasurementZone; field: 'bust' | 'waist' | 'hips' }> = [
  { zone: 'bust', field: 'bust' },
  { zone: 'waist', field: 'waist' },
  { zone: 'hips', field: 'hips' },
];

function clampStep(step: number): number {
  return Math.min(Math.max(step, 0), TOTAL_STEPS - 1);
}

/** Convierte un borrador guardado en medidas validadas, si es que lo está. */
function draftSummary(draft: MeasurementDraft | null): MeasurementsFormValues | null {
  if (!draft) return null;
  const parsed = measurementsSchema.safeParse(draft.values);
  return parsed.success ? parsed.data : null;
}

interface MeasurementFlowProps {
  initialDraft: MeasurementDraft | null;
}

/**
 * Análisis en cinco pasos, una pantalla por medida.
 * La acción principal vive en una barra inferior fija y el progreso se guarda
 * en el dispositivo para no perder lo escrito.
 */
export function MeasurementFlow({ initialDraft }: MeasurementFlowProps) {
  const router = useRouter();
  const [summary, setSummary] = useState<MeasurementsFormValues | null>(() =>
    draftSummary(initialDraft),
  );
  const [step, setStep] = useState(() => {
    const target = clampStep(initialDraft?.step ?? 0);
    // Si el borrador quedó en la confirmación pero las medidas ya no son
    // válidas, se retrocede al último paso editable.
    return target === 4 && !draftSummary(initialDraft) ? 3 : target;
  });
  const [pendingValues, setPendingValues] = useState<MeasurementsFormValues | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [keepKeyboard, setKeepKeyboard] = useState(false);
  const [flowError, setFlowError] = useState<string | null>(null);

  const {
    register,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<MeasurementsFormInput, unknown, MeasurementsFormValues>({
    resolver: zodResolver(measurementsSchema),
    defaultValues: initialDraft?.values ?? EMPTY_MEASUREMENTS_FORM,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  function persist(nextStep: number) {
    const values = getValues();
    saveDraft({
      step: nextStep,
      values: {
        bust: values.bust ?? '',
        waist: values.waist ?? '',
        hips: values.hips ?? '',
        height: values.height ?? '',
      },
    });
  }

  function goTo(nextStep: number) {
    const target = clampStep(nextStep);
    setStep(target);
    setFlowError(null);
    persist(target);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  async function goForward() {
    if (step === 0) {
      setKeepKeyboard(false);
      goTo(1);
      return;
    }

    const measure = MEASURE_STEPS[step - 1];
    if (measure) {
      const valid = await trigger(measure.field);
      if (!valid) return;

      if (step < 3) {
        goTo(step + 1);
        return;
      }

      // Última medida: se validan las tres antes de mostrar el resumen.
      const allValid = await trigger(['bust', 'waist', 'hips', 'height']);
      if (!allValid) return;

      const parsed = measurementsSchema.safeParse(getValues());
      if (!parsed.success) return;

      setSummary(parsed.data);
      setKeepKeyboard(false);
      goTo(4);
    }
  }

  function runAnalysis(values: MeasurementsFormValues) {
    setAnalyzing(true);

    try {
      const result = classifyBodyShape(values);
      saveAnalysis(result);
      clearDraft();
      // Pausa breve para que el estado de carga no parpadee.
      window.setTimeout(() => router.push('/resultado'), 450);
    } catch {
      setAnalyzing(false);
      setFlowError(
        'No pudimos calcular tu silueta con esos valores. Revisa las medidas e inténtalo de nuevo.',
      );
    }
  }

  const onConfirm = handleSubmit((values) => {
    if (buildWarnings(values).length > 0) {
      setPendingValues(values);
      return;
    }
    runAnalysis(values);
  });

  function handleBack() {
    if (step === 0) {
      router.push('/');
      return;
    }
    setKeepKeyboard(false);
    goTo(step - 1);
  }

  function handleExit() {
    persist(step);
    router.push('/');
  }

  const measure = step >= 1 && step <= 3 ? MEASURE_STEPS[step - 1] : null;
  const guide = measure ? ZONE_GUIDES.find((zone) => zone.id === measure.zone) : null;
  const warnings = summary ? buildWarnings(summary) : [];

  const primaryLabel =
    step === 0
      ? 'Comenzar'
      : step === 4
        ? 'Analizar mi silueta'
        : step === 3
          ? 'Confirmar medida'
          : 'Continuar';

  return (
    <div className="flex min-h-[100dvh] flex-col bg-shell">
      <FlowHeader
        current={step + 1}
        total={TOTAL_STEPS}
        onBack={handleBack}
        onExit={handleExit}
        backLabel={step === 0 ? 'Volver al inicio' : 'Volver al paso anterior'}
      />

      <div className="flex-1 px-gutter pb-action-bar pt-6">
        <form
          id="flujo-medidas"
          className="app-shell"
          noValidate
          onBlur={() => persist(step)}
          onSubmit={(event) => {
            event.preventDefault();
            if (step === 4) {
              void onConfirm();
              return;
            }
            void goForward();
          }}
        >
          {/* ---------------- Paso 1 · Preparación ---------------- */}
          {step === 0 ? (
            <section aria-labelledby="paso-intro" className="alma-fade-up flex flex-col gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
                  Antes de empezar
                </p>
                <h1 id="paso-intro" className="mt-2 text-[2rem] sm:text-4xl">
                  Ten lista tu cinta métrica
                </h1>
                <p className="mt-3 text-muted">
                  Vas a registrar tres contornos: busto, cintura y cadera. Toma unos
                  tres minutos y todo se calcula en tu teléfono.
                </p>
              </div>

              <div className="mx-auto w-40 sm:w-48">
                <MeasurementIllustration highlight="all" />
              </div>

              <ul className="flex flex-col gap-2.5">
                {ESSENTIAL_TIPS.map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5"
                  >
                    <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-[0.95rem]">{tip}</span>
                  </li>
                ))}
              </ul>

              <Accordion title="Ver todos los consejos">
                <ul className="flex flex-col gap-2.5 text-[0.95rem] text-muted">
                  {GENERAL_TIPS.map((tip) => (
                    <li key={tip} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                      />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </Accordion>

              <div className="rounded-card border border-line bg-surface p-5">
                <div className="flex items-start gap-3">
                  <Camera aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <div>
                    <p className="font-medium text-ink">¿No tienes cinta métrica?</p>
                    <p className="mt-1 text-[0.9rem] text-muted">
                      Puedes estimar tus medidas desde una foto de cuerpo completo.
                      Es menos preciso, pero te da un punto de partida.
                    </p>
                    <Link
                      href="/analisis/foto"
                      className={buttonClasses('secondary', 'md', 'mt-3 w-full')}
                    >
                      Estimar desde una foto
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          {/* ---------------- Pasos 2 a 4 · Medidas ---------------- */}
          {measure && guide ? (
            <section
              key={measure.field}
              aria-labelledby={`paso-${measure.field}`}
              className="alma-fade-up flex flex-col gap-5"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
                  Medida {step} de 3
                </p>
                <h1 id={`paso-${measure.field}`} className="mt-2 text-[2rem] sm:text-4xl">
                  {guide.label}
                </h1>
              </div>

              <div className="mx-auto w-36 sm:w-44">
                <MeasurementIllustration highlight={measure.zone} showLabels={false} />
              </div>

              <p className="text-center text-[1.05rem] leading-relaxed text-muted">
                {guide.instructions}
              </p>

              <MeasurementField
                label={`Tu ${guide.short.toLowerCase()} en centímetros`}
                error={errors[measure.field]?.message}
                registration={register(measure.field)}
                autoFocus={keepKeyboard}
                enterKeyHint={step === 3 ? 'done' : 'next'}
                onEnterKey={() => setKeepKeyboard(true)}
                hint="Puedes usar un decimal, por ejemplo 92,5."
              />

              <Accordion title="Ver cómo medir esta zona">
                <ul className="flex flex-col gap-2.5 text-[0.95rem] text-muted">
                  {guide.quickTips.map((tip) => (
                    <li key={tip} className="flex gap-2.5">
                      <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-success" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 rounded-2xl bg-shell p-4 text-sm text-muted">
                  <span className="font-semibold text-ink">Error frecuente: </span>
                  {guide.commonError}
                </p>
              </Accordion>
            </section>
          ) : null}

          {/* ---------------- Paso 5 · Confirmación ---------------- */}
          {step === 4 && summary ? (
            <section aria-labelledby="paso-confirmar" className="alma-fade-up flex flex-col gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
                  Último paso
                </p>
                <h1 id="paso-confirmar" className="mt-2 text-[2rem] sm:text-4xl">
                  Confirma tus medidas
                </h1>
                <p className="mt-3 text-muted">
                  Revisa que cada valor corresponda a su zona. Puedes editar el que
                  necesites.
                </p>
              </div>

              <ul className="flex flex-col gap-2.5">
                {MEASURE_STEPS.map((item, index) => {
                  const zoneGuide = ZONE_GUIDES.find((zone) => zone.id === item.zone);
                  return (
                    <li
                      key={item.field}
                      className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3"
                    >
                      <div className="w-9 shrink-0">
                        <MeasurementIllustration
                          highlight={item.zone}
                          showLabels={false}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-faint">{zoneGuide?.short}</p>
                        <p className="text-xl font-semibold tabular-nums text-ink">
                          {formatCm(summary[item.field])}
                          <span className="ml-1 text-sm font-normal text-muted">cm</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => goTo(index + 1)}
                        className="flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-soft/60"
                      >
                        <Pencil aria-hidden="true" className="h-4 w-4" />
                        Editar
                      </button>
                    </li>
                  );
                })}
              </ul>

              {warnings.length > 0 ? (
                <div
                  role="status"
                  className="rounded-2xl border border-sand bg-brand-soft/40 p-4 text-[0.9rem] text-brand-dark"
                >
                  <p className="font-semibold">Antes de continuar</p>
                  <ul className="mt-2 flex flex-col gap-2">
                    {warnings.map((warning) => (
                      <li key={warning.code}>{warning.message}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {flowError ? (
                <p role="alert" className="rounded-2xl border border-brand bg-surface p-4 text-brand-dark">
                  {flowError}
                </p>
              ) : null}

              <p className="text-sm text-faint">
                Tus medidas no salen de este dispositivo. El cálculo ocurre aquí
                mismo, sin enviar nada a internet.
              </p>
            </section>
          ) : null}
        </form>
      </div>

      {/* ---------------- Barra de acción inferior ---------------- */}
      <div className="no-print sticky bottom-0 z-30 border-t border-line bg-surface/95 px-gutter pb-safe shadow-bar backdrop-blur-md">
        <div className="app-shell flex flex-col gap-1 py-3">
          <Button
            type="submit"
            form="flujo-medidas"
            size="lg"
            disabled={analyzing}
            onClick={() => setKeepKeyboard(false)}
            className="w-full"
          >
            {analyzing ? 'Calculando…' : primaryLabel}
            {analyzing ? null : <ArrowRight aria-hidden="true" className="h-4 w-4" />}
          </Button>

          {step === 0 ? (
            <Link
              href="/como-medirse"
              className={buttonClasses('ghost', 'md', 'w-full')}
            >
              Ver la guía completa
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

      <ConfirmationDialog
        open={pendingValues !== null}
        title="Confirmemos un detalle"
        description="Tus medidas presentan una diferencia poco habitual. Antes de continuar, confirma que la cinta estaba paralela al piso y que registraste busto, cintura y cadera en los campos correctos."
        details={pendingValues ? buildWarnings(pendingValues).map((item) => item.message) : []}
        confirmLabel="Las medidas son correctas"
        cancelLabel="Volver a revisarlas"
        onConfirm={() => {
          const values = pendingValues;
          setPendingValues(null);
          if (values) runAnalysis(values);
        }}
        onCancel={() => setPendingValues(null)}
      />

      {analyzing ? (
        <div className="alma-fade-in fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-shell/95 px-gutter text-center backdrop-blur">
          <div className="w-24 animate-pulse">
            <SilhouetteIllustration
              proportions={{ bust: 23, waist: 15, hips: 23 }}
              title="Calculando tu silueta"
            />
          </div>
          <p aria-live="polite" className="flex items-center gap-2 text-lg text-brand-dark">
            <Sparkles aria-hidden="true" className="h-5 w-5" />
            Calculando tu silueta…
          </p>
        </div>
      ) : null}
    </div>
  );
}
