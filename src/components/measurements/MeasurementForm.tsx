'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, BookOpen, Pencil } from 'lucide-react';
import { Button, buttonClasses } from '@/components/ui/Button';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { MeasurementField } from '@/components/measurements/MeasurementField';
import { MeasurementGuide } from '@/components/measurements/MeasurementGuide';
import { MeasurementSummary } from '@/components/measurements/MeasurementSummary';
import {
  EMPTY_MEASUREMENTS_FORM,
  measurementsSchema,
} from '@/schemas/measurements-schema';
import type {
  MeasurementsFormInput,
  MeasurementsFormValues,
} from '@/schemas/measurements-schema';
import { classifyBodyShape } from '@/lib/body-shape/classify-body-shape';
import { buildWarnings } from '@/lib/body-shape/validation';
import { saveAnalysis } from '@/lib/storage';
import Link from 'next/link';

type Step = 'form' | 'summary';

/** Formulario de medidas con confirmación previa al cálculo. */
export function MeasurementForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [confirmed, setConfirmed] = useState<MeasurementsFormValues | null>(null);
  const [pendingValues, setPendingValues] = useState<MeasurementsFormValues | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MeasurementsFormInput, unknown, MeasurementsFormValues>({
    resolver: zodResolver(measurementsSchema),
    defaultValues: EMPTY_MEASUREMENTS_FORM,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const errorCount = Object.keys(errors).length;
  const warnings = confirmed ? buildWarnings(confirmed) : [];

  function goToSummary(values: MeasurementsFormValues) {
    setConfirmed(values);
    setStep('summary');
    setAnalysisError(null);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function onSubmit(values: MeasurementsFormValues) {
    if (buildWarnings(values).length > 0) {
      setPendingValues(values);
      return;
    }
    goToSummary(values);
  }

  function runAnalysis() {
    if (!confirmed) return;

    try {
      const result = classifyBodyShape(confirmed);
      saveAnalysis(result);
      router.push('/resultado');
    } catch {
      setAnalysisError(
        'No pudimos calcular tu silueta con esos valores. Revisa las medidas e inténtalo de nuevo.',
      );
    }
  }

  if (step === 'summary' && confirmed) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl">Confirma tus medidas</h2>
          <p className="mt-2 text-muted">
            Revisa que los tres valores correspondan a la zona correcta. Si algo no
            coincide, puedes volver a editarlos.
          </p>
        </div>

        <MeasurementSummary measurements={confirmed} />

        {warnings.length > 0 ? (
          <div
            role="status"
            className="rounded-card border border-brand-soft bg-brand-soft/30 p-5 text-[0.95rem] text-brand-dark"
          >
            <p className="font-semibold">Antes de continuar</p>
            <ul className="mt-2 flex flex-col gap-2">
              {warnings.map((warning) => (
                <li key={warning.code}>{warning.message}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {analysisError ? (
          <p role="alert" className="rounded-card border border-brand bg-surface p-4 text-brand-dark">
            {analysisError}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row-reverse sm:justify-end">
          <Button size="lg" onClick={runAnalysis} className="w-full sm:w-auto">
            Confirmar y analizar
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setStep('form')}
            className="w-full sm:w-auto"
          >
            <Pencil aria-hidden="true" className="h-4 w-4" />
            Editar medidas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl">Tus tres medidas</h2>
          <p className="mt-1 text-muted">
            Escribe los valores en centímetros. Puedes usar decimales, por ejemplo
            92,5.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setGuideOpen((open) => !open)}
          aria-expanded={guideOpen}
          aria-controls="panel-guia"
          className={buttonClasses('secondary', 'md', 'shrink-0')}
        >
          <BookOpen aria-hidden="true" className="h-4 w-4" />
          {guideOpen ? 'Ocultar la guía' : 'Ver guía de medición'}
        </button>
      </div>

      {guideOpen ? (
        <div id="panel-guia" className="rounded-card border border-line bg-shell p-4 sm:p-6">
          <MeasurementGuide compact />
          <Link
            href="/como-medirse"
            className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-brand-dark underline underline-offset-4"
          >
            Abrir la guía completa
          </Link>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        <div
          aria-live="polite"
          className={errorCount > 0 ? 'rounded-card border border-brand bg-surface p-4' : 'sr-only'}
        >
          {errorCount > 0
            ? `Revisa ${errorCount} ${errorCount === 1 ? 'campo' : 'campos'} del formulario para continuar.`
            : ''}
        </div>

        <MeasurementField
          label="Contorno de busto"
          zone="bust"
          hint="Alrededor de la zona de mayor volumen del busto o pecho."
          error={errors.bust?.message}
          registration={register('bust')}
        />

        <MeasurementField
          label="Contorno de cintura"
          zone="waist"
          hint="Alrededor de la parte más estrecha del torso, con el abdomen relajado."
          error={errors.waist?.message}
          registration={register('waist')}
        />

        <MeasurementField
          label="Contorno de cadera"
          zone="hips"
          hint="Alrededor de la zona de mayor volumen de caderas y glúteos."
          error={errors.hips?.message}
          registration={register('hips')}
        />

        <MeasurementField
          label="Altura"
          hint="Dato de referencia. No modifica la clasificación en esta versión."
          error={errors.height?.message}
          registration={register('height')}
          optional
        />

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-fit">
          Revisar mis medidas
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Button>
      </form>

      <ConfirmationDialog
        open={pendingValues !== null}
        title="Confirmemos un detalle"
        description="Tus medidas presentan una diferencia poco habitual. Antes de continuar, confirma que la cinta estaba paralela al piso y que registraste busto, cintura y cadera en los campos correctos."
        details={pendingValues ? buildWarnings(pendingValues).map((w) => w.message) : []}
        confirmLabel="Las medidas son correctas"
        cancelLabel="Volver a revisarlas"
        onConfirm={() => {
          if (pendingValues) goToSummary(pendingValues);
          setPendingValues(null);
        }}
        onCancel={() => setPendingValues(null)}
      />
    </div>
  );
}
