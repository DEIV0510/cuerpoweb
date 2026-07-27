import { GarmentIcon } from '@/components/wardrobe/GarmentIcon';
import { OCCASION_LABELS } from '@/data/wardrobe-labels';
import type { Capsule } from '@/data/wardrobe-content';

interface CapsuleCardProps {
  capsule: Capsule;
}

/** Tarjeta de una cápsula: las piezas del outfit y por qué funciona. */
export function CapsuleCard({ capsule }: CapsuleCardProps) {
  return (
    <article className="rounded-card border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl">{capsule.name}</h3>
        <span className="shrink-0 rounded-full bg-brand-soft/60 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-brand-dark">
          {OCCASION_LABELS[capsule.occasion]}
        </span>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {capsule.pieces.map((piece) => (
          <li
            key={piece.label}
            className="flex flex-col items-center gap-1.5 rounded-2xl bg-shell p-3 text-center"
          >
            <span className="h-12 w-12">
              <GarmentIcon garment={piece.garment} />
            </span>
            <span className="text-[0.78rem] leading-tight text-muted">{piece.label}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 rounded-xl bg-shell p-3.5 text-sm text-muted">
        <span className="font-semibold text-ink">Por qué funciona: </span>
        {capsule.why}
      </p>
    </article>
  );
}
