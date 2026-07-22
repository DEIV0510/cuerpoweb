import { SectionHeading } from '@/components/ui/Card';
import { SilhouetteIllustration } from '@/components/ui/SilhouetteIllustration';
import { BODY_SHAPE_LIST } from '@/data/body-shapes';

/** Presentación de las cinco siluetas que reconoce la aplicación. */
export function BodyShapePreview() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="app-shell app-shell-wide px-gutter py-12 sm:py-16">
        <SectionHeading
          eyebrow="Las cinco siluetas"
          title="Categorías orientativas, no etiquetas"
          description="Cada silueta describe una relación entre busto, cintura y cadera. Muchas personas presentan características de dos de ellas."
        />

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BODY_SHAPE_LIST.map((profile) => (
            <li
              key={profile.id}
              className="flex gap-5 rounded-card border border-line bg-shell p-6"
            >
              <div className="w-16 shrink-0 sm:w-20">
                <SilhouetteIllustration
                  proportions={profile.illustration}
                  title={`Silueta ${profile.name}`}
                />
              </div>
              <div>
                <h3 className="text-xl">{profile.name}</h3>
                {profile.alternativeName ? (
                  <p className="text-xs uppercase tracking-[0.14em] text-brand">
                    También llamada {profile.alternativeName}
                  </p>
                ) : null}
                <p className="mt-2 text-[0.95rem] text-muted">{profile.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
