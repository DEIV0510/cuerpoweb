'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button, buttonClasses } from '@/components/ui/Button';
import { FlowHeader } from '@/components/measurements/FlowHeader';
import { SilhouetteIllustration } from '@/components/ui/SilhouetteIllustration';
import { STYLE_SURVEY } from '@/data/style-survey';
import {
  deriveStyleProfile,
  type StyleAnswers,
} from '@/lib/wardrobe/style-profile';
import { saveWardrobe, saveWardrobeDraft, type WardrobeDraft } from '@/lib/storage';
import { cn } from '@/lib/utils';

/** Intro + una pregunta por paso. */
const TOTAL_STEPS = STYLE_SURVEY.length + 1;

type AnswerValue = string | string[] | undefined;

interface WardrobeSurveyProps {
  initialDraft: WardrobeDraft | null;
}

/**
 * Encuesta de estilo, una pregunta por pantalla.
 * Guarda el progreso para poder retomarlo y, al terminar, deriva el perfil.
 */
export function WardrobeSurvey({ initialDraft }: WardrobeSurveyProps) {
  const router = useRouter();
  const [step, setStep] = useState(() =>
    Math.min(Math.max(initialDraft?.step ?? 0, 0), TOTAL_STEPS - 1),
  );
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>(
    () => (initialDraft?.answers as Record<string, AnswerValue>) ?? {},
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const question = step >= 1 ? STYLE_SURVEY[step - 1] : null;

  function persist(nextStep: number, nextAnswers = answers) {
    saveWardrobeDraft({ step: nextStep, answers: nextAnswers });
  }

  function selectSingle(field: string, value: string) {
    const updated = { ...answers, [field]: value };
    setAnswers(updated);
    setError(null);
    persist(step, updated);
  }

  function toggleMultiple(field: string, value: string) {
    const current = Array.isArray(answers[field]) ? (answers[field] as string[]) : [];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    const updated = { ...answers, [field]: next };
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
      const value = answers[question.field];
      const answered = question.multiple
        ? Array.isArray(value) && value.length > 0
        : typeof value === 'string' && value.length > 0;

      if (!answered) {
        setError(
          question.multiple
            ? 'Elige al menos una opción para continuar.'
            : 'Elige una opción para continuar.',
        );
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
      const profile = deriveStyleProfile(answers as unknown as StyleAnswers);
      saveWardrobe(profile);
      saveWardrobeDraft({ step: 0, answers: {} });
      window.setTimeout(() => router.push('/armario/resultado'), 450);
    } catch (caught) {
      setSaving(false);
      setError(
        caught instanceof Error
          ? caught.message
          : 'No pudimos crear tu perfil con esas respuestas.',
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
    step === 0 ? 'Comenzar' : step === TOTAL_STEPS - 1 ? 'Ver mi perfil' : 'Continuar';

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
            <section aria-labelledby="armario-intro" className="alma-fade-up flex flex-col gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
                  Mi armario
                </p>
                <h1 id="armario-intro" className="mt-2 text-[2rem] sm:text-4xl">
                  Un armario pensado para ti
                </h1>
                <p className="mt-3 text-muted">
                  Responde unas preguntas sobre tu estilo y tus ocasiones. Con eso
                  armamos tu perfil, un checklist de básicos y cápsulas de outfits
                  listas para usar.
                </p>
              </div>

              <ul className="flex flex-col gap-2.5">
                {[
                  'Tu perfil de estilo en una frase.',
                  'Los básicos que te faltan, según tu estilo.',
                  'Cápsulas de outfits ya combinadas.',
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
                Son seis preguntas rápidas. Todo se guarda solo en tu dispositivo.
              </p>
            </section>
          ) : null}

          {question ? (
            <section
              key={question.field}
              aria-labelledby={`pregunta-${question.field}`}
              className="alma-fade-up flex flex-col gap-5"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
                  Pregunta {step} de {STYLE_SURVEY.length}
                </p>
                <h1 id={`pregunta-${question.field}`} className="mt-2 text-[1.8rem] sm:text-3xl">
                  {question.title}
                </h1>
                {question.multiple ? (
                  <p className="mt-2 text-sm text-muted">Puedes elegir varias.</p>
                ) : null}
              </div>

              <ul className="flex flex-col gap-2.5">
                {question.options.map((option) => {
                  const value = answers[question.field];
                  const selected = question.multiple
                    ? Array.isArray(value) && value.includes(option.value)
                    : value === option.value;

                  return (
                    <li key={option.value}>
                      <button
                        type="button"
                        onClick={() =>
                          question.multiple
                            ? toggleMultiple(question.field, option.value)
                            : selectSingle(question.field, option.value)
                        }
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
                          {option.hint ? (
                            <span className="mt-0.5 block text-sm text-muted">
                              {option.hint}
                            </span>
                          ) : null}
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
            {saving ? 'Creando tu perfil…' : primaryLabel}
            {saving ? null : <ArrowRight aria-hidden="true" className="h-4 w-4" />}
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
              Volver a la pregunta anterior
            </button>
          )}
        </div>
      </div>

      {saving ? (
        <div className="alma-fade-in fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-shell/95 px-gutter text-center backdrop-blur">
          <div className="w-24 animate-pulse">
            <SilhouetteIllustration
              proportions={{ bust: 21, waist: 17, hips: 22 }}
              title="Creando tu perfil de estilo"
            />
          </div>
          <p aria-live="polite" className="flex items-center gap-2 text-lg text-brand-dark">
            <Sparkles aria-hidden="true" className="h-5 w-5" />
            Creando tu perfil de estilo…
          </p>
        </div>
      ) : null}
    </div>
  );
}
