import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HeroSection } from '@/components/home/HeroSection';
import { ProcessSteps } from '@/components/home/ProcessSteps';
import { StartOptions } from '@/components/home/StartOptions';
import { BodyShapePreview } from '@/components/home/BodyShapePreview';
import { Benefits } from '@/components/home/Benefits';
import { EightHeadsSection } from '@/components/home/EightHeadsSection';
import { WardrobeSection } from '@/components/home/WardrobeSection';
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
      <StartOptions />
      <BodyShapePreview />
      <EightHeadsSection />
      <WardrobeSection />
      <Benefits />

      <section className="app-shell app-shell-wide px-gutter pb-4">
        <PrivacyNotice />
      </section>

      <Faq items={FAQS} />

      <section className="bg-brand-gradient text-white">
        <div className="app-shell flex flex-col items-center gap-5 px-gutter py-12 text-center sm:py-16">
          <p className="font-script text-5xl leading-none text-brand-soft">
            Es momento
          </p>
          <h2 className="text-3xl text-white sm:text-4xl">
            ¿Comenzamos con tus medidas?
          </h2>
          <p className="max-w-xl text-white/85">
            Ten a mano una cinta métrica flexible. En pocos minutos tendrás tu guía
            de estilo lista para consultar cada vez que abras el clóset.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/analisis"
              className={buttonClasses(
                'primary',
                'lg',
                'bg-white text-brand-dark shadow-none hover:bg-brand-soft hover:text-brand-deep',
              )}
            >
              Descubrir mi silueta
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/como-medirse"
              className={buttonClasses(
                'secondary',
                'lg',
                'border-white/50 bg-white/10 text-white hover:border-white hover:text-white',
              )}
            >
              Aprender a medirme
            </Link>
          </div>
          <p className="max-w-xl text-sm text-white/75">{SITE.disclaimer}</p>
        </div>
      </section>
    </>
  );
}
