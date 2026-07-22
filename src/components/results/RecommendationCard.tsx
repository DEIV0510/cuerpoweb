import { Sparkle } from 'lucide-react';

interface RecommendationCardProps {
  title: string;
  items: string[];
  description?: string;
}

/** Lista de recomendaciones de una categoría. */
export function RecommendationCard({
  title,
  items,
  description,
}: RecommendationCardProps) {
  return (
    <article className="rounded-card border border-line bg-surface p-6">
      <h3 className="text-xl">{title}</h3>
      {description ? (
        <p className="mt-1 text-[0.95rem] text-muted">{description}</p>
      ) : null}
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[0.975rem] text-ink">
            <Sparkle
              aria-hidden="true"
              className="mt-1 h-4 w-4 shrink-0 text-brand"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
