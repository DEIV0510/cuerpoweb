import { Footprints, Gem, Layers, Shirt, ShoppingBag } from 'lucide-react';
import type { OutfitExample } from '@/types/body-shape';

interface OutfitCardProps {
  outfit: OutfitExample;
  /** Ajuste que aporta la proporción vertical, si ya se calculó. */
  verticalAdjustment?: string;
}

const PIECES = [
  { key: 'top', label: 'Arriba', icon: Shirt },
  { key: 'bottom', label: 'Abajo', icon: ShoppingBag },
  { key: 'layer', label: 'Capa', icon: Layers },
  { key: 'shoes', label: 'Calzado', icon: Footprints },
  { key: 'accessories', label: 'Accesorios', icon: Gem },
] as const;

/** Ejemplo de outfit completo presentado como ficha editorial. */
export function OutfitCard({ outfit, verticalAdjustment }: OutfitCardProps) {
  return (
    <article className="flex flex-col rounded-card border border-line bg-surface p-6">
      <span className="w-fit rounded-full bg-brand-soft/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-dark">
        {outfit.occasion}
      </span>
      <h3 className="mt-3 text-xl">{outfit.name}</h3>

      <dl className="mt-4 flex flex-col gap-3">
        {PIECES.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex gap-3">
            <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-muted">
                {label}
              </dt>
              <dd className="text-[0.95rem] text-ink">{outfit[key]}</dd>
            </div>
          </div>
        ))}
      </dl>

      <p className="mt-5 rounded-xl bg-shell p-4 text-sm text-muted">
        <span className="font-semibold text-ink">Por qué funciona: </span>
        {outfit.why}
      </p>

      {verticalAdjustment ? (
        <p className="mt-2.5 rounded-xl bg-brand-soft/45 p-4 text-sm text-brand-dark">
          <span className="font-semibold">Ajuste vertical: </span>
          {verticalAdjustment}
        </p>
      ) : null}
    </article>
  );
}
