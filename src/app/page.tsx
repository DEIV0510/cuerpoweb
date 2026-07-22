import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HeroSection } from '@/components/home/HeroSection';
import { ProcessSteps } from '@/components/home/ProcessSteps';
import { BodyShapePreview } from '@/components/home/BodyShapePreview';
import { Benefits } from '@/components/home/Benefits';
import { Faq } from '@/components/ui/Faq';
import { PrivacyNotice } from '@/components/ui/PrivacyNotice';
import { buttonClasses } from '@/components/ui/Button';
import { FAQS } from '@/data/faqs';
import { SITE } from '@/data/navigation';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProcessSteps />
      <BodyShapePreview />
      <Benefits />

      <section className="mx-auto w-full max-w-6xl px-4 pb-4 sm:px-6">
        <PrivacyNotice />
      </section>

      <Faq items={FAQS} />

      <section className="border-t border-line bg-surface">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 sm:py-20">
          <h2 className="text-3xl sm:text-4xl">¿Comenzamos con tus medidas?</h2>
          <p className="max-w-xl text-muted">
            Ten a mano una cinta métrica flexible. En pocos minutos tendrás tu guía
            de estilo lista para consultar cada vez que abras el clóset.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/analisis" className={buttonClasses('primary', 'lg')}>
              Descubrir mi silueta
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link href="/como-medirse" className={buttonClasses('secondary', 'lg')}>
              Aprender a medirme
            </Link>
          </div>
          <p className="max-w-xl text-sm text-muted">{SITE.disclaimer}</p>
        </div>
      </section>
    </>
  );
}
