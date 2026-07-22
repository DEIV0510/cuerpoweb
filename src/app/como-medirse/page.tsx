import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { MeasurementGuide } from '@/components/measurements/MeasurementGuide';
import { MeasurementIllustration } from '@/components/measurements/MeasurementIllustration';
import { buttonClasses } from '@/components/ui/Button';
import { PrivacyNotice } from '@/components/ui/PrivacyNotice';

export const metadata: Metadata = {
  title: 'Cómo medirse',
  description:
    'Guía paso a paso para tomar el contorno de busto, cintura y cadera con una cinta métrica flexible.',
};

export default function ComoMedirsePage() {
  return (
    <>
      <PageHeader
        eyebrow="Guía de medición"
        title="Cómo tomar tus medidas"
        description="Una buena medición es la base de un buen resultado. Sigue estas indicaciones y ten a mano una cinta métrica flexible."
      >
        <Link href="/analisis" className={buttonClasses('primary', 'lg')}>
          Ya tengo mis medidas
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </PageHeader>

      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.6fr] lg:items-start">
          <figure className="rounded-card border border-line bg-surface p-6">
            <MeasurementIllustration highlight="all" className="mx-auto max-w-[280px]" />
            <figcaption className="mt-4 text-sm text-muted">
              Las tres líneas señalan el contorno de busto, cintura y cadera. La
              ilustración es esquemática: lo importante es que la cinta quede
              paralela al piso en cada zona.
            </figcaption>
          </figure>

          <MeasurementGuide />
        </div>

        <section
          aria-labelledby="errores-comunes"
          className="mt-12 rounded-card border border-line bg-surface p-6 sm:p-8"
        >
          <h2 id="errores-comunes" className="text-2xl">
            Detalles que cambian el resultado
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            <li className="rounded-xl bg-shell p-5 text-[0.95rem] text-muted">
              <span className="font-semibold text-ink">Cinta inclinada.</span> Si la
              cinta sube por la espalda, la medida crece varios centímetros. Revísala
              frente a un espejo.
            </li>
            <li className="rounded-xl bg-shell p-5 text-[0.95rem] text-muted">
              <span className="font-semibold text-ink">Abdomen contraído.</span> Medir
              conteniendo el aire reduce la cintura y cambia la clasificación. Respira
              con normalidad.
            </li>
            <li className="rounded-xl bg-shell p-5 text-[0.95rem] text-muted">
              <span className="font-semibold text-ink">Ropa gruesa.</span> Un suéter
              puede sumar dos o tres centímetros en cada contorno.
            </li>
            <li className="rounded-xl bg-shell p-5 text-[0.95rem] text-muted">
              <span className="font-semibold text-ink">Cinta muy apretada.</span> Debe
              apoyarse sobre el cuerpo sin marcar la piel ni deslizarse.
            </li>
          </ul>
        </section>

        <PrivacyNotice className="mt-8" />

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/analisis" className={buttonClasses('primary', 'lg')}>
            Ingresar mis medidas
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link href="/metodologia" className={buttonClasses('secondary', 'lg')}>
            Ver cómo se calcula
          </Link>
        </div>
      </div>
    </>
  );
}
