'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  Check,
  ImageUp,
  Info,
  Sparkles,
} from 'lucide-react';
import { Accordion } from '@/components/ui/Accordion';
import { Button, buttonClasses } from '@/components/ui/Button';
import { FlowHeader } from '@/components/measurements/FlowHeader';
import { MeasurementField } from '@/components/measurements/MeasurementField';
import { PhotoCanvas, type CanvasPoint } from '@/components/photo/PhotoCanvas';
import { SilhouetteIllustration } from '@/components/ui/SilhouetteIllustration';
import { PHOTO_TIPS, PHOTO_ZONE_STEPS } from '@/data/photo-guide';
import { classifyBodyShape } from '@/lib/body-shape/classify-body-shape';
import { formatCm } from '@/lib/body-shape/calculations';
import {
  MAX_HEIGHT_CM,
  MIN_HEIGHT_CM,
  VALIDATION_MESSAGES,
  parseMeasurement,
} from '@/lib/body-shape/validation';
import {
  DEFAULT_MARKS,
  estimateFromPhoto,
  reviewEstimation,
  type PhotoEstimation,
  type PhotoMarks,
  type PhotoZone,
} from '@/lib/photo/photo-estimation';
import { measurementsSchema } from '@/schemas/measurements-schema';
import { saveAnalysis } from '@/lib/storage';

/** Subir foto, marcar estatura, tres anchos y revisar. */
const TOTAL_STEPS = 6;

const NUMERIC_PATTERN = /^\d{1,3}([.,]\d)?$/;

interface EditableMeasurements {
  bust: string;
  waist: string;
  hips: string;
}

/**
 * Estimación de medidas a partir de una fotografía.
 *
 * La foto se abre como URL temporal en memoria: no se sube a ningún servidor
 * ni se guarda en el dispositivo. Al salir de la pantalla se libera.
 */
export function PhotoFlow() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [step, setStep] = useState(0);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState('');
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [height, setHeight] = useState('');
  const [heightError, setHeightError] = useState<string | null>(null);
  const [marks, setMarks] = useState<PhotoMarks>(DEFAULT_MARKS);
  const [estimation, setEstimation] = useState<PhotoEstimation | null>(null);
  const [values, setValues] = useState<EditableMeasurements>({
    bust: '',
    waist: '',
    hips: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Libera la URL temporal al salir de la pantalla.
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  function handleFile(file: File | undefined) {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Elige un archivo de imagen (JPG, PNG o HEIC).');
      return;
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;

    setPhotoUrl(url);
    setPhotoName(file.name);
    setAspectRatio(null);
    setMarks(DEFAULT_MARKS);
    setFormError(null);
  }

  function validateHeight(): boolean {
    const raw = height.trim();

    if (raw.length === 0) {
      setHeightError('Ingresa tu estatura: es la escala de la foto.');
      return false;
    }

    if (!NUMERIC_PATTERN.test(raw)) {
      setHeightError(VALIDATION_MESSAGES.notANumber);
      return false;
    }

    const parsed = parseMeasurement(raw);
    if (parsed < MIN_HEIGHT_CM || parsed > MAX_HEIGHT_CM) {
      setHeightError(VALIDATION_MESSAGES.heightOutOfRange);
      return false;
    }

    setHeightError(null);
    return true;
  }

  function moveMark(id: string, x: number, y: number) {
    setMarks((current) => {
      if (id === 'height-top') {
        return { ...current, height: { ...current.height, top: y } };
      }
      if (id === 'height-bottom') {
        return { ...current, height: { ...current.height, bottom: y } };
      }

      const [zone, side] = id.split('-') as [PhotoZone, 'left' | 'right'];
      const mark = current[zone];
      if (!mark) return current;

      return {
        ...current,
        // Las dos marcas de una zona comparten la misma altura.
        [zone]: { y, left: side === 'left' ? x : mark.left, right: side === 'right' ? x : mark.right },
      };
    });
  }

  function buildEstimation(): PhotoEstimation | null {
    if (!aspectRatio) {
      setFormError('Espera a que la foto termine de cargar.');
      return null;
    }

    try {
      const result = estimateFromPhoto({
        marks,
        aspectRatio,
        realHeightCm: parseMeasurement(height),
      });
      setFormError(null);
      return result;
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'No pudimos calcular las medidas con esas marcas.',
      );
      return null;
    }
  }

  function goForward() {
    setFormError(null);

    if (step === 0) {
      if (!photoUrl) {
        setFormError('Sube una foto de cuerpo completo para continuar.');
        return;
      }
      if (!validateHeight()) return;
      setStep(1);
      return;
    }

    if (step < 4) {
      setStep(step + 1);
      return;
    }

    if (step === 4) {
      const result = buildEstimation();
      if (!result) return;

      setEstimation(result);
      setValues({
        bust: String(result.bust).replace('.', ','),
        waist: String(result.waist).replace('.', ','),
        hips: String(result.hips).replace('.', ','),
      });
      setStep(5);
      return;
    }

    runAnalysis();
  }

  function runAnalysis() {
    const parsed = measurementsSchema.safeParse({ ...values, height });

    if (!parsed.success) {
      setFormError(
        parsed.error.issues[0]?.message ??
          'Revisa las medidas estimadas antes de continuar.',
      );
      return;
    }

    setAnalyzing(true);

    try {
      const result = classifyBodyShape(parsed.data);
      saveAnalysis(result, new Date().toISOString(), 'photo');
      window.setTimeout(() => router.push('/resultado'), 450);
    } catch {
      setAnalyzing(false);
      setFormError('No pudimos calcular tu silueta con esas medidas.');
    }
  }

  function handleBack() {
    setFormError(null);
    if (step === 0) {
      router.push('/analisis');
      return;
    }
    setStep(step - 1);
  }

  const zoneStep = step >= 2 && step <= 4 ? PHOTO_ZONE_STEPS[step - 2] : null;

  const heightPoints: CanvasPoint[] = [
    {
      id: 'height-top',
      x: 0.5,
      y: marks.height.top,
      axis: 'y',
      label: 'Marca de la coronilla. Usa las flechas arriba y abajo para ajustarla.',
    },
    {
      id: 'height-bottom',
      x: 0.5,
      y: marks.height.bottom,
      axis: 'y',
      label: 'Marca de los pies. Usa las flechas arriba y abajo para ajustarla.',
    },
  ];

  const zonePoints: CanvasPoint[] = zoneStep
    ? [
        {
          id: `${zoneStep.zone}-left`,
          x: marks[zoneStep.zone].left,
          y: marks[zoneStep.zone].y,
          axis: 'both',
          label: `Borde izquierdo de ${zoneStep.label.toLowerCase()}. Muévelo con las flechas.`,
        },
        {
          id: `${zoneStep.zone}-right`,
          x: marks[zoneStep.zone].right,
          y: marks[zoneStep.zone].y,
          axis: 'both',
          label: `Borde derecho de ${zoneStep.label.toLowerCase()}. Muévelo con las flechas.`,
        },
      ]
    : [];

  const notes = estimation ? reviewEstimation(estimation) : [];

  const primaryLabel =
    step === 0
      ? 'Continuar'
      : step === 1
        ? 'Estatura marcada'
        : step === 4
          ? 'Calcular mis medidas'
          : step === 5
            ? 'Analizar mi silueta'
            : 'Continuar';

  return (
    <div className="flex min-h-[100dvh] flex-col bg-shell">
      <FlowHeader
        current={step + 1}
        total={TOTAL_STEPS}
        onBack={handleBack}
        onExit={() => router.push('/')}
        backLabel={step === 0 ? 'Volver al análisis' : 'Volver al paso anterior'}
      />

      <div className="flex-1 px-gutter pb-action-bar pt-6">
        <div className="app-shell flex flex-col gap-5">
          {/* ---------------- Paso 1 · Foto y estatura ---------------- */}
          {step === 0 ? (
            <section aria-labelledby="foto-inicio" className="alma-fade-up flex flex-col gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
                  Análisis con foto
                </p>
                <h1 id="foto-inicio" className="mt-2 text-[2rem] sm:text-4xl">
                  Sube tu foto de cuerpo completo
                </h1>
                <p className="mt-3 text-muted">
                  Sobre la foto marcarás tu estatura y el ancho de tres zonas. Con
                  eso estimamos tus contornos. La imagen se queda en tu teléfono.
                </p>
              </div>

              <div className="rounded-card border border-line bg-surface p-4">
                <div className="flex items-start gap-3">
                  <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <p className="text-[0.9rem] text-muted">
                    Es una <strong className="text-ink">estimación</strong>, no una
                    medición exacta. Si tienes cinta métrica, ese método es más
                    preciso. Podrás ajustar los valores antes de analizar.
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
                      alt="Vista previa de la foto seleccionada"
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
                  <span className="text-sm font-normal text-faint">
                    Cámara o galería
                  </span>
                </Button>
              )}

              <MeasurementField
                label="Tu estatura"
                value={height}
                onValueChange={(next) => {
                  setHeight(next);
                  if (heightError) setHeightError(null);
                }}
                error={heightError ?? undefined}
                hint="Necesaria para convertir los píxeles de la foto a centímetros."
                enterKeyHint="done"
              />

              <Accordion title="Cómo tomar la foto" defaultOpen={!photoUrl}>
                <ul className="flex flex-col gap-2.5 text-[0.95rem] text-muted">
                  {PHOTO_TIPS.map((tip) => (
                    <li key={tip} className="flex gap-2.5">
                      <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-success" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </Accordion>
            </section>
          ) : null}

          {/* ---------------- Paso 2 · Estatura en la foto ---------------- */}
          {step === 1 && photoUrl ? (
            <section aria-labelledby="foto-estatura" className="alma-fade-up flex flex-col gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
                  Paso clave
                </p>
                <h1 id="foto-estatura" className="mt-2 text-[1.9rem] sm:text-3xl">
                  Marca tu estatura
                </h1>
                <p className="mt-2 text-muted">
                  Arrastra el punto de arriba hasta tu coronilla y el de abajo hasta
                  la base de tus pies. De esta línea sale la escala de toda la foto.
                </p>
              </div>

              <PhotoCanvas
                src={photoUrl}
                points={heightPoints}
                rulers={['height-top', 'height-bottom']}
                connections={[['height-top', 'height-bottom']]}
                onMove={moveMark}
                onImageLoad={setAspectRatio}
              />

              <p className="rounded-2xl bg-surface p-4 text-sm text-muted">
                Tu estatura declarada: {height || '—'} cm. Si la línea no coincide
                con tu cuerpo, el resto de medidas saldrá desplazado.
              </p>
            </section>
          ) : null}

          {/* ---------------- Pasos 3 a 5 · Anchos ---------------- */}
          {zoneStep && photoUrl ? (
            <section
              key={zoneStep.zone}
              aria-labelledby={`foto-${zoneStep.zone}`}
              className="alma-fade-up flex flex-col gap-4"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
                  Zona {step - 1} de 3
                </p>
                <h1 id={`foto-${zoneStep.zone}`} className="mt-2 text-[1.9rem] sm:text-3xl">
                  {zoneStep.label}
                </h1>
                <p className="mt-2 text-muted">{zoneStep.instruction}</p>
              </div>

              <PhotoCanvas
                src={photoUrl}
                points={zonePoints}
                connections={[[`${zoneStep.zone}-left`, `${zoneStep.zone}-right`]]}
                onMove={moveMark}
                onImageLoad={setAspectRatio}
              />

              <p className="rounded-2xl bg-surface p-4 text-sm text-muted">
                <span className="font-semibold text-ink">Consejo: </span>
                {zoneStep.tip}
              </p>
            </section>
          ) : null}

          {/* ---------------- Paso 6 · Revisión ---------------- */}
          {step === 5 && estimation ? (
            <section aria-labelledby="foto-revision" className="alma-fade-up flex flex-col gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brand-dark">
                  Último paso
                </p>
                <h1 id="foto-revision" className="mt-2 text-[2rem] sm:text-4xl">
                  Revisa las medidas estimadas
                </h1>
                <p className="mt-3 text-muted">
                  Estas son las medidas calculadas desde tu foto. Ajusta cualquiera
                  que no te cuadre y continúa.
                </p>
              </div>

              <div className="flex gap-3 rounded-card border border-sand bg-brand-soft/40 p-4 text-[0.9rem] text-brand-dark">
                <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
                <p>
                  Una foto no puede ver la profundidad del cuerpo, así que estos
                  valores son aproximados. Para una guía más precisa, confírmalos con
                  una cinta métrica.
                </p>
              </div>

              {notes.map((note) => (
                <p
                  key={note}
                  role="status"
                  className="rounded-2xl border border-line bg-surface p-4 text-sm text-muted"
                >
                  {note}
                </p>
              ))}

              <div className="flex flex-col gap-4">
                <MeasurementField
                  label="Contorno de busto"
                  value={values.bust}
                  onValueChange={(next) => setValues({ ...values, bust: next })}
                  hint={`Ancho medido: ${formatCm(estimation.zones.bust.widthCm)} cm.`}
                />
                <MeasurementField
                  label="Contorno de cintura"
                  value={values.waist}
                  onValueChange={(next) => setValues({ ...values, waist: next })}
                  hint={`Ancho medido: ${formatCm(estimation.zones.waist.widthCm)} cm.`}
                />
                <MeasurementField
                  label="Contorno de cadera"
                  value={values.hips}
                  onValueChange={(next) => setValues({ ...values, hips: next })}
                  hint={`Ancho medido: ${formatCm(estimation.zones.hips.widthCm)} cm.`}
                  enterKeyHint="done"
                />
              </div>

              <Accordion title="Cómo se calcularon">
                <p className="text-[0.95rem] text-muted">
                  Tu estatura convierte los píxeles de la foto en centímetros. Con
                  esa escala se mide el ancho de cada zona y se modela su sección
                  como una elipse, estimando la profundidad como una proporción del
                  ancho. El contorno es el perímetro de esa elipse.
                </p>
                <dl className="mt-4 flex flex-col gap-2">
                  {(['bust', 'waist', 'hips'] as const).map((zone) => (
                    <div
                      key={zone}
                      className="flex items-baseline justify-between gap-3 rounded-2xl bg-shell px-4 py-3 text-sm"
                    >
                      <dt className="text-muted">
                        {zone === 'bust' ? 'Busto' : zone === 'waist' ? 'Cintura' : 'Cadera'}
                      </dt>
                      <dd className="text-ink">
                        ancho {formatCm(estimation.zones[zone].widthCm)} cm ·
                        profundidad {formatCm(estimation.zones[zone].depthCm)} cm
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-sm text-faint">
                  Método por foto versión {estimation.version}.{' '}
                  <Link
                    href="/metodologia"
                    className="inline-flex min-h-11 items-center font-medium text-brand-dark underline underline-offset-4"
                  >
                    Ver la metodología
                  </Link>
                </p>
              </Accordion>
            </section>
          ) : null}

          {formError ? (
            <p role="alert" className="rounded-2xl border border-brand bg-surface p-4 text-brand-dark">
              {formError}
            </p>
          ) : null}
        </div>
      </div>

      {/* ---------------- Barra de acción inferior ---------------- */}
      <div className="no-print sticky bottom-0 z-30 border-t border-line bg-surface/95 px-gutter pb-safe shadow-bar backdrop-blur-md">
        <div className="app-shell flex flex-col gap-1 py-3">
          <Button size="lg" onClick={goForward} disabled={analyzing} className="w-full">
            {analyzing ? 'Calculando…' : primaryLabel}
            {analyzing ? null : <ArrowRight aria-hidden="true" className="h-4 w-4" />}
          </Button>

          {step === 0 ? (
            <Link href="/analisis" className={buttonClasses('ghost', 'md', 'w-full')}>
              Prefiero escribir mis medidas
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
