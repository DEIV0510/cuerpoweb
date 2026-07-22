import { Plus } from 'lucide-react';
import type { Faq as FaqItem } from '@/data/faqs';
import { SectionHeading } from '@/components/ui/Card';

interface FaqProps {
  items: FaqItem[];
  eyebrow?: string;
  title?: string;
}

/**
 * Acordeón de preguntas frecuentes.
 * Usa <details>, así que funciona con teclado y sin JavaScript.
 */
export function Faq({
  items,
  eyebrow = 'Preguntas frecuentes',
  title = 'Antes de empezar',
}: FaqProps) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading eyebrow={eyebrow} title={title} />

      <div className="mt-8 flex flex-col gap-3">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-card border border-line bg-surface px-5 py-4 open:border-brand-soft"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-ink marker:hidden">
              <span>{item.question}</span>
              <Plus
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-brand transition-transform duration-200 group-open:rotate-45"
              />
            </summary>
            <p className="mt-3 text-[0.95rem] text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
