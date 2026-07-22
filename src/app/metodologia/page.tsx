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

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-12 sm:px-6 sm:py-16">
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
          <div className="mt-5 overflow-x-auto rounded-card border border-line bg-surface">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <caption className="sr-only">
                Ejemplos de medidas y la silueta que devuelve el algoritmo
              </caption>
              <thead>
                <tr className="border-b border-line text-sm text-muted">
                  <th scope="col" className="px-5 py-3 font-medium">Busto</th>
                  <th scope="col" className="px-5 py-3 font-medium">Cintura</th>
                  <th scope="col" className="px-5 py-3 font-medium">Cadera</th>
                  <th scope="col" className="px-5 py-3 font-medium">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLES.map((example) => (
                  <tr key={example.result} className="border-b border-line last:border-0">
                    <td className="px-5 py-3">{example.bust} cm</td>
                    <td className="px-5 py-3">{example.waist} cm</td>
                    <td className="px-5 py-3">{example.hips} cm</td>
                    <td className="px-5 py-3 font-medium text-brand-dark">
                      {example.result}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/analisis" className={buttonClasses('primary', 'lg')}>
            Realizar mi análisis
          </Link>
          <Link href="/privacidad" className={buttonClasses('secondary', 'lg')}>
            Ver privacidad y datos
          </Link>
        </div>
      </div>
    </>
  );
}
