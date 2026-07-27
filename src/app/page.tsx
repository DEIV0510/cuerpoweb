import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HeroSection } from '@/components/home/HeroSection';
import { ToolsOverview } from '@/components/home/ToolsOverview';
import { PersonalFormula } from '@/components/home/PersonalFormula';
import { BodyShapePreview } from '@/components/home/BodyShapePreview';
import { EightHeadsSection } from '@/components/home/EightHeadsSection';
import { WardrobeSection } from '@/components/home/WardrobeSection';
import { Benefits } from '@/components/home/Benefits';
import { Faq } from '@/components/ui/Faq';
import { PrivacyNotice } from '@/components/ui/PrivacyNotice';
import { buttonClasses } from '@/components/ui/Button';
import { FAQS } from '@/data/faqs';
import { SITE } from '@/data/navigation';

export default function HomePage() {
  return (
    <>
      {/* Qué es: la suite completa */}
      <HeroSection />

      {/* Las tres herramientas como conjunto de igual peso */}
      <ToolsOverview />

      {/* Por qué es una suite: la fórmula que las une */}
      <PersonalFormula />

      {/* Detalle de cada herramienta, en orden de prioridad */}
      <BodyShapePreview />
      <EightHeadsSection />
      <WardrobeSection />

      {/* Apoyo: valor, confianza y dudas */}
      <Benefits />

      <section className="app-shell app-shell-wide px-gutter pb-4">
        <PrivacyNotice />
      </section>

      <Faq items={FAQS} />

      {/* Cierre de suite */}
      <section className="bg-brand-gradient text-white">
        <div className="app-shell flex flex-col items-center gap-5 px-gutter py-12 text-center sm:py-16">
          <p className="font-script text-5xl leading-none text-brand-soft">
            Es momento
          </p>
          <h2 className="text-3xl text-white sm:text-4xl">
            ¿Por dónde quieres empezar?
          </h2>
          <p className="max-w-xl text-white/85">
            Puedes empezar por tu silueta, medir tus proporciones o armar tu
            armario. Cada paso alimenta tu fórmula personal.
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
              href="#herramientas"
              className={buttonClasses(
                'secondary',
                'lg',
                'border-white/50 bg-white/10 text-white hover:border-white hover:text-white',
              )}
            >
              Ver las tres herramientas
            </Link>
          </div>
          <p className="max-w-xl text-sm text-white/75">{SITE.disclaimer}</p>
        </div>
      </section>
    </>
  );
}
