import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { SilhouetteIllustration } from '@/components/ui/SilhouetteIllustration';
import { buttonClasses } from '@/components/ui/Button';
import { BODY_SHAPE_LIST } from '@/data/body-shapes';
import {
  ALGORITHM_VERSION,
  CLOSE_WAIST_THRESHOLD_CM,
  DEFINED_WAIST_THRESHOLD_CM,
  SIMILAR_THRESHOLD_CM,
} from '@/lib/body-shape/classify-body-shape';
import {
  MAX_MEASUREMENT_CM,
  MIN_MEASUREMENT_CM,
} from '@/lib/body-shape/validation';
import {
  DEPTH_RATIOS,
  PHOTO_ESTIMATION_VERSION,
} from '@/lib/photo/photo-estimation';
import {
  EIGHT_HEADS_VERSION,
  HEAD_TOLERANCE,
} from '@/lib/proportions/eight-heads';

export const metadata: Metadata = {
  title: 'Metodología',
  description:
    'Cómo se calcula la silueta: medidas utilizadas, orden de las reglas, límites del método y versión del algoritmo.',
};

const RULES = [
  {
    order: 1,
    name: 'Óvalo',
    condition: '(C ≥ B y C ≥ H) o (|B − C| < 10 y |H − C| < 10)',
    explanation:
      'Se evalúa primero porque, cuando la cintura iguala o se acerca mucho a las otras dos medidas, es la zona media la que define la proporción visual.',
  },
  {
    order: 2,
    name: 'Triángulo',
    condition: 'H − B > 5',
    explanation:
      'La cadera supera al busto en más de cinco centímetros, así que la parte inferior concentra el volumen.',
  },
  {
    order: 3,
    name: 'Triángulo invertido',
    condition: 'B − H > 5',
    explanation:
      'El busto supera a la cadera en más de cinco centímetros, así que la parte superior concentra el volumen.',
  },
  {
    order: 4,
    name: 'Reloj de arena',
    condition: '|B − H| ≤ 5 y B − C ≥ 20 y H − C ≥ 20',
    explanation:
      'Busto y cadera son similares y la cintura queda al menos veinte centímetros por debajo de ambas, lo que produce una definición marcada en el centro.',
  },
  {
    order: 5,
    name: 'Rectángulo',
    condition: '|B − H| ≤ 5 sin cintura veinte centímetros menor',
    explanation:
      'Busto y cadera son similares, pero la cintura no llega a los veinte centímetros de diferencia. Es el caso restante del algoritmo.',
  },
];

const EXAMPLES = [
  { bust: 98, waist: 74, hips: 99, result: 'Reloj de arena' },
  { bust: 92, waist: 73, hips: 101, result: 'Triángulo' },
  { bust: 104, waist: 80, hips: 95, result: 'Triángulo invertido' },
  { bust: 96, waist: 82, hips: 95, result: 'Rectángulo' },
  { bust: 100, waist: 96, hips: 98, result: 'Óvalo' },
];

const LIMITS = [
  'Las siluetas son categorías orientativas: agrupan proporciones parecidas, no describen a una persona por completo.',
  'Muchas personas presentan características mixtas de dos siluetas, sobre todo cuando las medidas quedan cerca de un límite.',
  'La postura, la ropa que llevas puesta y la tensión de la cinta pueden mover el resultado varios centímetros.',
  'El método no considera altura, estructura ósea, distribución del volumen ni proporción entre torso y piernas.',
  'El análisis no es un diagnóstico médico ni una valoración de salud, peso o composición corporal.',
  'No existe un porcentaje de certeza: el resultado es determinista, pero la interpretación siempre es orientativa.',
];

export default function MetodologiaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Transparencia"
        title="Cómo se calcula tu silueta"
        description="El resultado no viene de una inteligencia artificial ni de una base de datos externa: es una comparación matemática entre tres medidas, con reglas fijas y públicas."
      />

      <div className="app-shell app-shell-wide flex flex-col gap-8 px-gutter py-8 sm:py-12">
        <section
          aria-labelledby="medidas-usadas"
          className="rounded-card border border-line bg-surface p-6 sm:p-8"
        >
          <h2 id="medidas-usadas" className="text-2xl">
            Qué medidas se utilizan
          </h2>
          <p className="mt-3 text-muted">
            Se usan tres contornos en centímetros: busto (B), cintura (C) y cadera
            (H). Se aceptan valores entre {MIN_MEASUREMENT_CM} y{' '}
            {MAX_MEASUREMENT_CM} cm, con un decimal como máximo. La altura es un
            campo opcional que se guarda como referencia y no interviene en el
            cálculo de esta versión.
          </p>
          <p className="mt-3 text-muted">
            Se comparan entre sí porque la silueta no depende de cuánto mide cada
            contorno por separado, sino de la relación entre ellos: qué zona tiene
            más presencia visual y cuánta diferencia hay con la cintura.
          </p>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { term: 'Diferencia busto y cadera', def: '|B − H|' },
              { term: 'Diferencia busto y cintura', def: 'B − C' },
              { term: 'Diferencia cadera y cintura', def: 'H − C' },
              { term: 'Promedio de busto y cadera', def: '(B + H) ÷ 2' },
            ].map((item) => (
              <div
                key={item.term}
                className="flex items-baseline justify-between gap-3 rounded-xl bg-shell px-4 py-3"
              >
                <dt className="text-sm text-muted">{item.term}</dt>
                <dd className="font-mono text-sm font-semibold text-ink">{item.def}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="orden-reglas">
          <h2 id="orden-reglas" className="text-2xl">
            Orden de prioridad de las reglas
          </h2>
          <p className="mt-2 text-muted">
            El algoritmo evalúa las cinco reglas en este orden exacto y se queda con
            la primera que se cumple. Ese orden evita resultados contradictorios
            cuando una misma persona podría encajar en dos categorías.
          </p>

          <ol className="mt-6 flex flex-col gap-4">
            {RULES.map((rule) => (
              <li
                key={rule.order}
                className="rounded-card border border-line bg-surface p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                    {rule.order}
                  </span>
                  <h3 className="text-xl">{rule.name}</h3>
                  <code className="rounded-full bg-shell px-3 py-1 text-xs text-muted">
                    {rule.condition}
                  </code>
                </div>
                <p className="mt-3 text-[0.95rem] text-muted">{rule.explanation}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="limites-numericos"
          className="rounded-card border border-line bg-surface p-6 sm:p-8"
        >
          <h2 id="limites-numericos" className="text-2xl">
            Cómo se tratan los límites
          </h2>
          <ul className="mt-4 flex flex-col gap-3 text-[0.95rem] text-muted">
            <li>
              Una diferencia de exactamente {SIMILAR_THRESHOLD_CM} cm entre busto y
              cadera cuenta como <strong className="text-ink">medidas similares</strong>.
            </li>
            <li>
              Triángulo y triángulo invertido necesitan una diferencia{' '}
              <strong className="text-ink">mayor</strong> de {SIMILAR_THRESHOLD_CM} cm.
            </li>
            <li>
              Una diferencia de exactamente {DEFINED_WAIST_THRESHOLD_CM} cm entre la
              cintura y las otras dos medidas{' '}
              <strong className="text-ink">sí</strong> permite el reloj de arena.
            </li>
            <li>
              Para el óvalo, una distancia de exactamente{' '}
              {CLOSE_WAIST_THRESHOLD_CM} cm no entra por la condición «menor de{' '}
              {CLOSE_WAIST_THRESHOLD_CM}», salvo que la cintura sea la medida
              predominante.
            </li>
          </ul>
        </section>

        <section aria-labelledby="ejemplos">
          <h2 id="ejemplos" className="text-2xl">
            Ejemplos de clasificación
          </h2>
          <p className="mt-2 text-muted">
            Cada combinación entrega siempre el mismo resultado.
          </p>

          {/* Sin tablas anchas: cada ejemplo es una tarjeta legible en móvil. */}
          <ul className="mt-5 flex flex-col gap-3">
            {EXAMPLES.map((example) => (
              <li
                key={example.result}
                className="rounded-card border border-line bg-surface p-4"
              >
                <p className="font-medium text-brand-dark">{example.result}</p>
                <dl className="mt-2 flex flex-wrap gap-2">
                  {[
                    { label: 'Busto', value: example.bust },
                    { label: 'Cintura', value: example.waist },
                    { label: 'Cadera', value: example.hips },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-baseline gap-1.5 rounded-full bg-shell px-3 py-1.5"
                    >
                      <dt className="text-xs text-faint">{item.label}</dt>
                      <dd className="text-sm font-semibold tabular-nums text-ink">
                        {item.value} cm
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="siluetas-resumen">
          <h2 id="siluetas-resumen" className="text-2xl">
            Resumen de las cinco siluetas
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {BODY_SHAPE_LIST.map((profile) => (
              <li
                key={profile.id}
                className="flex gap-4 rounded-card border border-line bg-surface p-5"
              >
                <div className="w-12 shrink-0">
                  <SilhouetteIllustration
                    proportions={profile.illustration}
                    title={`Silueta ${profile.name}`}
                    variant="outline"
                  />
                </div>
                <div>
                  <h3 className="text-lg">{profile.name}</h3>
                  <p className="mt-1 text-sm text-muted">{profile.ruleSummary}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="metodo-cabezas"
          className="rounded-card border border-line bg-surface p-6 sm:p-8"
        >
          <h2 id="metodo-cabezas" className="text-2xl">
            La técnica de las 8 cabezas
          </h2>
          <p className="mt-3 text-muted">
            Es un análisis distinto y complementario: la silueta compara contornos
            (horizontal) y esta técnica compara alturas (vertical). Viene del dibujo
            de figurín, donde la figura ideal mide ocho veces su propia cabeza.
          </p>

          <ul className="mt-4 flex flex-col gap-2.5 text-[0.95rem] text-muted">
            <li className="rounded-2xl bg-shell p-4">
              <span className="font-semibold text-ink">1 cabeza · </span>
              coronilla a quijada. Es la unidad de medida.
            </li>
            <li className="rounded-2xl bg-shell p-4">
              <span className="font-semibold text-ink">2 cabezas · </span>
              quijada a cintura. Menos de eso es torso corto; más, torso largo.
            </li>
            <li className="rounded-2xl bg-shell p-4">
              <span className="font-semibold text-ink">1 cabeza · </span>
              cintura a entrepierna. Define el tiro que te sienta.
            </li>
            <li className="rounded-2xl bg-shell p-4">
              <span className="font-semibold text-ink">4 cabezas · </span>
              entrepierna a los pies. Define el largo de tus piernas.
            </li>
          </ul>

          <p className="mt-4 text-muted">
            Cada tramo se divide entre tu medida de cabeza y se compara con su
            referencia. Un tramo se considera en proporción cuando la diferencia no
            supera <strong className="text-ink">{HEAD_TOLERANCE} cabezas</strong>,
            que son unos 5 cm en una persona de 1,62 m. Comparando cuánto se aleja
            el torso frente a cuánto se alejan las piernas se decide la estrategia:
            subir la cintura, alargar el torso o mantener el equilibrio.
          </p>

          <p className="mt-3 text-sm text-faint">
            Método de proporción vertical versión {EIGHT_HEADS_VERSION}. Las ocho
            cabezas son un canon de dibujo, no una norma de belleza: casi ninguna
            persona real mide exactamente ocho, y eso no tiene nada de malo.
          </p>
        </section>

        <section
          aria-labelledby="metodo-color"
          className="rounded-card border border-line bg-surface p-6 sm:p-8"
        >
          <h2 id="metodo-color" className="text-2xl">
            La colorimetría
          </h2>
          <p className="mt-3 text-muted">
            Es un cuestionario guiado, no un análisis de fotografía. A partir de
            tus respuestas se deducen tres ejes y de ahí la estación de color:
          </p>
          <ul className="mt-4 flex flex-col gap-2.5 text-[0.95rem] text-muted">
            <li className="rounded-2xl bg-shell p-4">
              <span className="font-semibold text-ink">Subtono (cálido o frío): </span>
              del color de tus venas, si te ilumina el oro o la plata, cómo
              reacciona tu piel al sol y qué blanco te sienta.
            </li>
            <li className="rounded-2xl bg-shell p-4">
              <span className="font-semibold text-ink">Profundidad (clara o profunda): </span>
              de tu cabello y tus ojos naturales.
            </li>
            <li className="rounded-2xl bg-shell p-4">
              <span className="font-semibold text-ink">Croma (vivo o suave): </span>
              de cómo te sientan los colores muy intensos.
            </li>
          </ul>
          <p className="mt-4 text-muted">
            Cálida y clara es <strong className="text-ink">primavera</strong>; fría y
            clara, <strong className="text-ink">verano</strong>; cálida y profunda,{' '}
            <strong className="text-ink">otoño</strong>; fría y profunda,{' '}
            <strong className="text-ink">invierno</strong>. Cada estación trae su
            paleta y, al subir una prenda, se compara la familia de color de la
            prenda con esa paleta.
          </p>
          <p className="mt-3 rounded-2xl border border-sand bg-brand-soft/40 p-4 text-[0.95rem] text-brand-dark">
            Es una orientación: la colorimetría no es una ciencia exacta y la luz,
            el maquillaje y tu propia percepción también influyen. No usa la cámara
            ni analiza fotos de tu rostro.
          </p>
        </section>

        <section
          aria-labelledby="metodo-foto"
          className="rounded-card border border-line bg-surface p-6 sm:p-8"
        >
          <h2 id="metodo-foto" className="text-2xl">
            La estimación con foto
          </h2>
          <p className="mt-3 text-muted">
            Es opcional y funciona por fotogrametría guiada, no por inteligencia
            artificial. Tú marcas los puntos y la aplicación hace la aritmética:
          </p>
          <ol className="mt-4 flex flex-col gap-3 text-[0.95rem] text-muted">
            <li className="rounded-2xl bg-shell p-4">
              <span className="font-semibold text-ink">1. Escala. </span>
              Marcas tu coronilla y tus pies en la foto. Como conoces tu estatura
              real, se obtiene cuántos centímetros representa cada píxel.
            </li>
            <li className="rounded-2xl bg-shell p-4">
              <span className="font-semibold text-ink">2. Anchos. </span>
              Marcas los bordes del cuerpo a la altura de busto, cintura y cadera, y
              esos anchos se convierten a centímetros con la escala anterior.
            </li>
            <li className="rounded-2xl bg-shell p-4">
              <span className="font-semibold text-ink">3. Contorno. </span>
              Cada zona se modela como una elipse: el ancho es su eje mayor y la
              profundidad se estima como una proporción del ancho ({DEPTH_RATIOS.bust}{' '}
              en busto, {DEPTH_RATIOS.waist} en cintura y {DEPTH_RATIOS.hips} en
              cadera). El contorno es el perímetro de esa elipse, calculado con la
              aproximación de Ramanujan.
            </li>
          </ol>
          <p className="mt-4 rounded-2xl border border-sand bg-brand-soft/40 p-4 text-[0.95rem] text-brand-dark">
            Por eso el resultado es una estimación: la profundidad no se ve en una
            foto frontal, y la postura, la ropa o la perspectiva de la cámara
            desplazan los valores. Las medidas se muestran siempre editables antes
            de clasificar, y una cinta métrica sigue siendo el método fiable.
          </p>
          <p className="mt-3 text-sm text-faint">
            Método por foto versión {PHOTO_ESTIMATION_VERSION}.
          </p>
        </section>

        <section
          aria-labelledby="limites-metodo"
          className="rounded-card border border-line bg-surface p-6 sm:p-8"
        >
          <h2 id="limites-metodo" className="text-2xl">
            Límites del método
          </h2>
          <ul className="mt-4 flex flex-col gap-3 text-[0.95rem] text-muted">
            {LIMITS.map((limit) => (
              <li key={limit} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span>{limit}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-xl bg-shell p-4 text-sm text-muted">
            La fórmula utilizada corresponde a la versión{' '}
            <strong className="text-ink">{ALGORITHM_VERSION}</strong> del algoritmo.
            Si cambia el cálculo, cambiará también este número.
          </p>
        </section>

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <Link href="/analisis" className={buttonClasses('primary', 'lg', 'w-full sm:w-auto')}>
            Realizar mi análisis
          </Link>
          <Link href="/privacidad" className={buttonClasses('ghost', 'lg', 'w-full sm:w-auto')}>
            Ver privacidad y datos
          </Link>
        </div>
      </div>
    </>
  );
}
