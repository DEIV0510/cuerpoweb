'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Sparkles, Sun } from 'lucide-react';
import { Button, buttonClasses } from '@/components/ui/Button';
import { FlowHeader } from '@/components/measurements/FlowHeader';
import { COLORIMETRY_SURVEY } from '@/data/colorimetry-survey';
import { analyzeSeason, type ColorimetryAnswers } from '@/lib/color-analysis/season';
import {
  saveColorimetry,
  saveColorimetryDraft,
  type ColorimetryDraft,
} from '@/lib/storage';
import { cn } from '@/lib/utils';

/** Intro + una pregunta por paso. */
const TOTAL_STEPS = COLORIMETRY_SURVEY.length + 1;

interface ColorimetrySurveyProps {
  initialDraft: ColorimetryDraft | null;
}

/** Cuestionario de colorimetría, una pregunta por pantalla. */
export function ColorimetrySurvey({ initialDraft }: ColorimetrySurveyProps) {
  const router = useRouter();
  const [step, setStep] = useState(() =>
    Math.min(Math.max(initialDraft?.step ?? 0, 0), TOTAL_STEPS - 1),
  );
  const [answers, setAnswers] = useState<Record<string, string>>(
    () => (initialDraft?.answers as Record<string, string>) ?? {},
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const question = step >= 1 ? COLORIMETRY_SURVEY[step - 1] : null;

  function persist(nextStep: number, nextAnswers = answers) {
    saveColorimetryDraft({ step: nextStep, answers: nextAnswers });
  }

  function select(field: string, value: string) {
    const updated = { ...answers, [field]: value };
    setAnswers(updated);
    setError(null);
    persist(step, updated);
  }

  function goTo(nextStep: number) {
    setStep(nextStep);
    setError(null);
    persist(nextStep);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function goForward() {
    if (step === 0) {
      goTo(1);
      return;
    }
    if (question) {
      if (!answers[question.field]) {
        setError('Elige una opción para continuar.');
        return;
      }
      if (step < TOTAL_STEPS - 1) {
        goTo(step + 1);
        return;
      }
      finish();
    }
  }

  function finish() {
    setSaving(true);
    try {
      const result = analyzeSeason(answers as unknown as Partial<ColorimetryAnswers>);
      saveColorimetry(result);
      saveColorimetryDraft({ step: 0, answers: {} });
      window.setTimeout(() => router.push('/colorimetria/resultado'), 450);
    } catch (caught) {
      setSaving(false);
      setError(
        caught instanceof Error ? caught.message : 'No pudimos calcular tu estación.',
      );
    }
  }

  function handleBack() {
    if (step === 0) {
      router.push('/');
      return;
    }
    goTo(step - 1);
  }

  const primaryLabel =
    step === 0 ? 'Comenzar' : step === TOTAL_STEPS - 1 ? 'Ver mi estación' : 'Continuar';

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
        backLabel={step === 0 ? 'Volver al inicio' : 'Volver a la pregunta anterior'}
      />

      <div className="flex-1 px-gutter pb-action-bar pt-6">
        <div className="app-shell">
          {step === 0 ? (
            <section aria-labelledby="color-intro" className="alma-fade-up flex flex-col gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
                  Colorimetría
                </p>
                <h1 id="color-intro" className="mt-2 text-[2rem] sm:text-4xl">
                  Descubre los colores que te iluminan
                </h1>
                <p className="mt-3 text-muted">
                  Con unas preguntas sobre tu piel, tu cabello y tus ojos, deducimos
                  tu estación de color y la paleta que más te favorece.
                </p>
              </div>

              <div className="rounded-card border border-line bg-surface p-4">
                <div className="flex items-start gap-3">
                  <Sun aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <p className="text-[0.9rem] text-muted">
                    Respóndelo con <strong className="text-ink">luz natural</strong>,
                    junto a una ventana y sin maquillaje, para apreciar mejor tus
                    tonos.
                  </p>
                </div>
              </div>

              <ul className="flex flex-col gap-2.5">
                {[
                  'Tu estación: primavera, verano, otoño o invierno.',
                  'Tu paleta de colores que te favorecen.',
                  'El metal y los neutros que mejor te sientan.',
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5"
                  >
                    <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-[0.95rem]">{line}</span>
                  </li>
                ))}
              </ul>

              <p className="rounded-2xl bg-surface p-4 text-[0.95rem] text-muted">
                Son siete preguntas. Es una orientación de color; la luz y tu propia
                percepción también cuentan.
              </p>
            </section>
          ) : null}

          {question ? (
            <section
              key={question.field}
              aria-labelledby={`color-${question.field}`}
              className="alma-fade-up flex flex-col gap-5"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
                  Pregunta {step} de {COLORIMETRY_SURVEY.length}
                </p>
                <h1 id={`color-${question.field}`} className="mt-2 text-[1.8rem] sm:text-3xl">
                  {question.title}
                </h1>
                {question.help ? (
                  <p className="mt-2 text-sm text-muted">{question.help}</p>
                ) : null}
              </div>

              <ul className="flex flex-col gap-2.5">
                {question.options.map((option) => {
                  const selected = answers[question.field] === option.value;
                  return (
                    <li key={option.value}>
                      <button
                        type="button"
                        onClick={() => select(question.field, option.value)}
                        aria-pressed={selected}
                        className={cn(
                          'flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors',
                          selected
                            ? 'border-brand bg-brand-soft/50'
                            : 'border-line bg-surface hover:border-sand',
                        )}
                      >
                        <span className="text-[1.02rem] font-medium text-ink">
                          {option.label}
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

              {error ? (
                <p role="alert" className="text-sm font-medium text-brand-dark">
                  {error}
                </p>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>

      <div className="no-print sticky bottom-0 z-30 border-t border-line bg-surface/95 px-gutter pb-safe shadow-bar backdrop-blur-md">
        <div className="app-shell flex flex-col gap-1 py-3">
          <Button size="lg" onClick={goForward} disabled={saving} className="w-full">
            {saving ? 'Analizando tus colores…' : primaryLabel}
            {saving ? null : <ArrowRight aria-hidden="true" className="h-4 w-4" />}
          </Button>

          {step === 0 ? (
            <Link href="/armario" className={buttonClasses('ghost', 'md', 'w-full')}>
              Ir a Mi armario
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleBack}
              className="min-h-11 rounded-full text-sm font-medium text-muted transition-colors hover:text-brand-dark"
            >
              Volver a la pregunta anterior
            </button>
          )}
        </div>
      </div>

      {saving ? (
        <div className="alma-fade-in fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-shell/95 px-gutter text-center backdrop-blur">
          <Sparkles aria-hidden="true" className="h-10 w-10 animate-pulse text-brand" />
          <p aria-live="polite" className="text-lg text-brand-dark">
            Analizando tus colores…
          </p>
        </div>
      ) : null}
    </div>
  );
}
