import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { MeasurementGuide } from '@/components/measurements/MeasurementGuide';
import { Accordion } from '@/components/ui/Accordion';
import { buttonClasses } from '@/components/ui/Button';
import { PrivacyNotice } from '@/components/ui/PrivacyNotice';

export const metadata: Metadata = {
  title: 'Cómo medirse',
  description:
    'Guía paso a paso para tomar el contorno de busto, cintura y cadera con una cinta métrica flexible.',
};

const COMMON_MISTAKES = [
  {
    title: 'Cinta inclinada',
    text: 'Si la cinta sube por la espalda, la medida crece varios centímetros. Revísala frente a un espejo.',
  },
  {
    title: 'Abdomen contraído',
    text: 'Medir conteniendo el aire reduce la cintura y cambia la clasificación. Respira con normalidad.',
  },
  {
    title: 'Ropa gruesa',
    text: 'Un suéter puede sumar dos o tres centímetros en cada contorno.',
  },
  {
    title: 'Cinta muy apretada',
    text: 'Debe apoyarse sobre el cuerpo sin marcar la piel ni deslizarse.',
  },
];

export default function ComoMedirsePage() {
  return (
    <>
      <PageHeader
        eyebrow="Guía de medición"
        title="Cómo tomar tus medidas"
        description="Una buena medición es la base de un buen resultado. Ten a mano una cinta métrica flexible y sigue estos pasos."
      >
        <Link href="/analisis" className={buttonClasses('primary', 'lg', 'w-full sm:w-auto')}>
          Ya tengo mis medidas
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </PageHeader>

      <div className="app-shell app-shell-wide flex flex-col gap-4 px-gutter py-6 sm:py-10">
        <MeasurementGuide />

        <Accordion title="Detalles que cambian el resultado">
          <ul className="flex flex-col gap-3">
            {COMMON_MISTAKES.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl bg-shell p-4 text-[0.95rem] text-muted"
              >
                <span className="font-semibold text-ink">{item.title}. </span>
                {item.text}
              </li>
            ))}
          </ul>
        </Accordion>

        <PrivacyNotice />

        <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
          <Link
            href="/analisis"
            className={buttonClasses('primary', 'lg', 'w-full sm:w-auto')}
          >
            Ingresar mis medidas
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link
            href="/metodologia"
            className={buttonClasses('ghost', 'lg', 'w-full sm:w-auto')}
          >
            Ver cómo se calcula
          </Link>
        </div>
      </div>
    </>
  );
}
