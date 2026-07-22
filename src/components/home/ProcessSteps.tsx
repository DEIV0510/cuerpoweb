import { SectionHeading } from '@/components/ui/Card';

const STEPS = [
  {
    number: '01',
    title: 'Toma tus medidas',
    description:
      'Con una cinta métrica flexible, registra el contorno de busto, cintura y cadera. La guía te acompaña paso a paso.',
  },
  {
    number: '02',
    title: 'Ingresa los tres valores',
    description:
      'Escribe las medidas en centímetros, revisa el resumen y confirma que todo esté correcto antes de calcular.',
  },
  {
    number: '03',
    title: 'Recibe tu guía de estilo',
    description:
      'Conoce tu silueta predominante, por qué se calculó así y qué prendas, cortes y detalles acompañan mejor tus proporciones.',
  },
];

/** Explicación del proceso en tres pasos. */
export function ProcessSteps() {
  return (
    <section className="app-shell app-shell-wide px-gutter py-12 sm:py-16">
      <SectionHeading
        eyebrow="Cómo funciona"
        title="Tres pasos, cinco minutos"
        description="No necesitas fotografías, cuenta de usuario ni conocimientos previos de moda."
      />

      <ol className="mt-10 grid gap-5 md:grid-cols-3">
        {STEPS.map((step) => (
          <li
            key={step.number}
            className="rounded-card border border-line bg-surface p-6 sm:p-7"
          >
            <span
              aria-hidden="true"
              className="font-serif text-4xl italic text-sand-strong"
            >
              {step.number}
            </span>
            <h3 className="mt-3 text-xl">{step.title}</h3>
            <p className="mt-2 text-[0.975rem] text-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
