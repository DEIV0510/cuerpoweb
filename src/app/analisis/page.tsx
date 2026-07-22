import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { MeasurementForm } from '@/components/measurements/MeasurementForm';
import { PrivacyNotice } from '@/components/ui/PrivacyNotice';
import { SITE } from '@/data/navigation';

export const metadata: Metadata = {
  title: 'Analizar mis medidas',
  description:
    'Registra tu contorno de busto, cintura y cadera en centímetros y calcula tu silueta predominante.',
};

export default function AnalisisPage() {
  return (
    <>
      <PageHeader
        eyebrow="Paso 1 de 2"
        title="Ingresa tus medidas"
        description="Necesitamos tres contornos en centímetros. Nada se envía a internet: el cálculo ocurre en tu navegador."
      />

      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <MeasurementForm />

        <PrivacyNotice className="mt-10" />

        <p className="mt-6 text-sm text-muted">
          {SITE.disclaimer}{' '}
          <Link
            href="/metodologia"
            className="font-medium text-brand-dark underline underline-offset-4"
          >
            Conoce cómo se calcula el resultado
          </Link>
          .
        </p>
      </div>
    </>
  );
}
