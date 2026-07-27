import type { ColorInfo, ColorSwatch } from '@/lib/garment/color';
import { isNeutralFamily } from '@/lib/garment/color';
import {
  ACCENT_SWATCHES,
  COLOR_NOTE,
  GENERIC_SUGGESTIONS,
  NEUTRAL_SWATCHES,
  PAIR_TARGETS,
  TARGET_LABELS,
  type GarmentKind,
} from '@/data/garment-content';
import { RECOMMENDATIONS } from '@/data/recommendations';
import { getBodyShapeProfile } from '@/data/body-shapes';
import { SHAPE_STYLE } from '@/data/combined-guide-content';
import type { BodyShapeType } from '@/types/body-shape';
import {
  assessColorForSeason,
  type ColorVerdict,
  type Season,
} from '@/lib/color-analysis/season';
import { getSeasonProfile } from '@/data/color-seasons';

/**
 * Sugiere con qué combinar una prenda a partir de su tipo y su color, y —si
 * existen— de la silueta y el perfil de estilo de la persona.
 *
 * Todas las reglas son fijas: mismo tipo, color y silueta producen siempre la
 * misma sugerencia.
 */

export const COMBINE_VERSION = '1.0.0';

export interface PairSuggestion {
  target: GarmentKind;
  label: string;
  suggestion: string;
}

export interface OutfitIdea {
  title: string;
  description: string;
}

/** Cómo le sienta el color de la prenda a la estación de la persona. */
export interface SeasonMatch {
  verdict: ColorVerdict;
  season: Season;
  seasonName: string;
  title: string;
  detail: string;
}

export interface GarmentCombination {
  color: ColorInfo;
  palette: {
    alwaysWith: ColorSwatch[];
    accentWith: ColorSwatch[];
    note: string;
  };
  pairWith: PairSuggestion[];
  outfitIdeas: OutfitIdea[];
  shapeNote?: string;
  /** Veredicto según la colorimetría, si la persona la calculó. */
  seasonMatch?: SeasonMatch;
  version: string;
}

export interface CombineInput {
  kind: GarmentKind;
  color: ColorInfo;
  /** Silueta de la persona, si ya la calculó. */
  shape?: BodyShapeType;
  /** Estación de color de la persona, si ya la calculó. */
  season?: Season;
}

/** Campos de recomendaciones de silueta que son listas de texto. */
type ShapeListField = 'tops' | 'pants' | 'dresses' | 'jackets' | 'accessories';

/** Campo de recomendaciones de silueta que corresponde a cada categoría. */
const SHAPE_FIELD: Partial<Record<GarmentKind, ShapeListField>> = {
  top: 'tops',
  bottom: 'pants',
  dress: 'dresses',
  outerwear: 'jackets',
  accessory: 'accessories',
};

/** Devuelve una sugerencia concreta para una categoría objetivo. */
function suggestionFor(target: GarmentKind, shape?: BodyShapeType): string {
  if (shape) {
    const field = SHAPE_FIELD[target];
    if (field) {
      const list = RECOMMENDATIONS[shape][field];
      if (Array.isArray(list) && list.length > 0) return list[0];
    }
  }
  return GENERIC_SUGGESTIONS[target];
}

/** Nota de estilo según la silueta y el tipo de prenda. */
function buildShapeNote(kind: GarmentKind, shape: BodyShapeType): string {
  const profile = getBodyShapeProfile(shape);
  const style = SHAPE_STYLE[shape];

  if (kind === 'top' || kind === 'dress') {
    return `Para tu silueta ${profile.name.toLowerCase()}, el escote que más te acompaña es ${style.neckline.toLowerCase()}. ${style.focusReason}`;
  }

  return `Para tu silueta ${profile.name.toLowerCase()}, tu punto focal es ${style.focus.toLowerCase()}. ${style.focusReason}`;
}

/** Construye las ideas de outfit, con y sin acento. */
function buildOutfitIdeas(
  kind: GarmentKind,
  color: ColorInfo,
  accent: ColorSwatch | undefined,
): OutfitIdea[] {
  const piece = kind === 'dress' ? 'vestido' : 'prenda';
  const name = color.displayName.toLowerCase();

  const ideas: OutfitIdea[] = [
    {
      title: 'Look seguro con neutros',
      description:
        kind === 'shoes'
          ? `Deja que tu ${name} sea el punto de color y viste el resto en neutros: blanco o beige arriba y un tono medio abajo.`
          : kind === 'accessory'
            ? `Un conjunto en neutros (blanco, gris o beige) deja que tu ${name} sea el detalle que remata el look.`
            : `Combina tu ${piece} ${name} con neutros: los otros elementos en blanco, gris, beige o azul índigo para un conjunto pulido y sin riesgo.`,
    },
  ];

  if (!color.isNeutral && accent) {
    ideas.push({
      title: `Con un toque de ${accent.name.toLowerCase()}`,
      description: `Suma ${accent.name.toLowerCase()} en un accesorio o en una prenda secundaria: crea un contraste intencional sin recargar el conjunto.`,
    });
  } else if (color.isNeutral && accent) {
    ideas.push({
      title: 'Atrévete con el color',
      description: `Al ser un neutro, tu ${piece} admite acentos vivos: prueba ${accent.name.toLowerCase()} en el resto del look para darle energía.`,
    });
  }

  return ideas;
}

/** Evalúa el color de la prenda respecto a la estación de la persona. */
function buildSeasonMatch(color: ColorInfo, season: Season): SeasonMatch {
  const verdict = assessColorForSeason(color.family, season);
  const seasonName = getSeasonProfile(season).name;
  const name = color.displayName.toLowerCase();

  const copy: Record<ColorVerdict, { title: string; detail: string }> = {
    favorece: {
      title: 'Este color te favorece',
      detail: `El ${name} entra en tu paleta de ${seasonName.toLowerCase()}: llévalo cerca del rostro con confianza.`,
    },
    neutral: {
      title: 'Un color que puedes llevar',
      detail: `El ${name} no es de tus más favorecedores ni de los que apagan; funciona sobre todo si el tono va con tu paleta de ${seasonName.toLowerCase()}.`,
    },
    cuidado: {
      title: 'Llévalo con cuidado',
      detail: `El ${name} tiende a apagar a tu estación (${seasonName.toLowerCase()}). Si te encanta, úsalo lejos del rostro —en la parte inferior o en accesorios— o busca un tono más acorde a tu paleta.`,
    },
  };

  return {
    verdict,
    season,
    seasonName,
    title: copy[verdict].title,
    detail: copy[verdict].detail,
  };
}

/** Construye la guía de combinación de una prenda. */
export function buildCombination(input: CombineInput): GarmentCombination {
  const { kind, color, shape, season } = input;

  const accentWith = ACCENT_SWATCHES[color.family];

  const pairWith: PairSuggestion[] = PAIR_TARGETS[kind].map((target) => ({
    target,
    label: TARGET_LABELS[target],
    suggestion: suggestionFor(target, shape),
  }));

  return {
    color,
    palette: {
      alwaysWith: NEUTRAL_SWATCHES,
      accentWith,
      note: color.isNeutral ? COLOR_NOTE.neutral : COLOR_NOTE.color,
    },
    pairWith,
    outfitIdeas: buildOutfitIdeas(kind, color, accentWith[0]),
    shapeNote: shape ? buildShapeNote(kind, shape) : undefined,
    seasonMatch: season ? buildSeasonMatch(color, season) : undefined,
    version: COMBINE_VERSION,
  };
}

export { isNeutralFamily };
