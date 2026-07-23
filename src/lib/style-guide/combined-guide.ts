import type { BodyShapeResult, BodyShapeType, OutfitExample } from '@/types/body-shape';
import type {
  EightHeadsResult,
  ProportionStrategy,
  SegmentBalance,
} from '@/lib/proportions/eight-heads';
import { STRATEGY_GUIDES } from '@/data/proportion-recommendations';
import { COMBO_INSIGHTS, SHAPE_STYLE } from '@/data/combined-guide-content';

/**
 * Guía combinada: cruza la silueta (contornos, eje horizontal) con la técnica
 * de las 8 cabezas (alturas, eje vertical).
 *
 * La silueta dice QUÉ cortes acompañan tus proporciones; la técnica vertical
 * dice A QUÉ ALTURA ponerlos. Juntas producen decisiones concretas: tiro,
 * blusa por dentro o por fuera, largo de chaqueta, altura de zapato y escote.
 *
 * Todo se calcula con reglas fijas: mismos análisis, misma fórmula.
 */

/** Versión de la guía combinada. */
export const COMBINED_GUIDE_VERSION = '1.0.0';

/** Valores posibles de cada decisión, como constantes para poder probarlas. */
export const RISE = {
  high: 'Tiro alto',
  mid: 'Tiro medio',
  midHigh: 'Tiro medio o alto',
  comfortable: 'Tiro medio o alto, sin apretar',
  free: 'El tiro que prefieras',
} as const;

export const TUCK = {
  in: 'Blusa por dentro',
  out: 'Blusa por fuera',
  outFlowing: 'Blusa por fuera, con caída',
  free: 'Por dentro o por fuera',
} as const;

export const JACKET = {
  short: 'Chaqueta corta, a la cintura',
  long: 'Chaqueta o blazer largo y abierto',
  hip: 'Chaqueta corta o hasta la cadera',
  free: 'Corta o larga, las dos te funcionan',
} as const;

export const SHOE = {
  height: 'Con algo de altura y en tono continuo',
  any: 'Plano o con tacón, los dos te funcionan',
  free: 'El que prefieras, elige por comodidad',
} as const;

/** Una decisión concreta de la fórmula. */
export interface FormulaItem {
  id: 'rise' | 'tuck' | 'jacket' | 'shoe' | 'neckline' | 'focus';
  label: string;
  value: string;
  reason: string;
}

/** Outfit de la silueta con su ajuste vertical. */
export interface CombinedOutfit extends OutfitExample {
  verticalAdjustment: string;
}

export interface CombinedGuide {
  /** Título corto: silueta más estrategia vertical. */
  headline: string;
  /** Explicación del cruce, en dos frases. */
  summary: string;
  /** Las seis decisiones concretas. */
  formula: FormulaItem[];
  /** Reglas combinadas de esta pareja de análisis. */
  tips: string[];
  outfits: CombinedOutfit[];
  version: string;
}

/** Ajuste vertical que se añade a cada outfit de la silueta. */
const VERTICAL_ADJUSTMENTS: Record<ProportionStrategy, string> = {
  'raise-waist':
    'Llévalo con el pantalón a tiro alto y la blusa por dentro: subes la cintura y alargas la pierna.',
  'lengthen-torso':
    'Llévalo con la blusa por fuera y tiro medio: alargas el torso y mantienes la proporción.',
  balanced:
    'Puedes llevarlo tal cual: tu proporción vertical ya está equilibrada.',
};

/** Nota extra cuando las piernas son cortas respecto al torso. */
const SHORT_LEGS_NOTE =
  ' Elige el zapato en un tono cercano al del pantalón para continuar la línea de la pierna.';

/** Decide el tiro del pantalón cruzando los dos análisis. */
function resolveRise(
  strategy: ProportionStrategy,
  riseBalance: SegmentBalance,
  shapeType: BodyShapeType,
): FormulaItem {
  if (riseBalance === 'short') {
    return {
      id: 'rise',
      label: 'Tiro del pantalón',
      value: RISE.mid,
      reason:
        'De tu cintura a la entrepierna hay menos de una cabeza: un tiro muy alto te sobra por arriba y se arruga.',
    };
  }

  if (strategy === 'raise-waist') {
    return {
      id: 'rise',
      label: 'Tiro del pantalón',
      value: RISE.high,
      reason:
        'Tu torso pesa más que tus piernas en la vertical: el tiro alto sube la línea de la cintura y alarga la pierna.',
    };
  }

  if (strategy === 'lengthen-torso') {
    return {
      id: 'rise',
      label: 'Tiro del pantalón',
      value: riseBalance === 'long' ? RISE.midHigh : RISE.mid,
      reason:
        riseBalance === 'long'
          ? 'Tu tiro es largo, así que el alto te queda cómodo; llévalo con la blusa por fuera para no acortar el torso.'
          : 'Tu torso pesa menos que tus piernas en la vertical: el tiro medio le devuelve presencia a la parte alta.',
    };
  }

  if (shapeType === 'oval') {
    return {
      id: 'rise',
      label: 'Tiro del pantalón',
      value: RISE.comfortable,
      reason:
        'Tu vertical está equilibrada; lo importante es que la pretina no comprima la zona media.',
    };
  }

  return {
    id: 'rise',
    label: 'Tiro del pantalón',
    value: RISE.free,
    reason: 'Tu vertical está equilibrada: cualquier tiro respeta tu proporción.',
  };
}

/** Decide si la blusa va por dentro o por fuera. */
function resolveTuck(
  strategy: ProportionStrategy,
  shapeType: BodyShapeType,
): FormulaItem {
  if (shapeType === 'oval') {
    return {
      id: 'tuck',
      label: 'La blusa',
      value: TUCK.outFlowing,
      reason:
        strategy === 'raise-waist'
          ? 'Tu zona media agradece fluidez: en lugar de meterla, usa una tercera prenda abierta con tiro alto para subir la cintura sin ceñir.'
          : 'Tu zona media agradece fluidez: la prenda cae mejor por fuera y crea una vertical continua.',
    };
  }

  if (strategy === 'raise-waist') {
    return {
      id: 'tuck',
      label: 'La blusa',
      value: TUCK.in,
      reason:
        'Meterla, aunque sea solo por delante, marca dónde empieza la pierna y sube la cintura al instante.',
    };
  }

  if (strategy === 'lengthen-torso') {
    return {
      id: 'tuck',
      label: 'La blusa',
      value: TUCK.out,
      reason:
        'Dejarla por fuera, un poco más larga que la cadera, alarga la vertical de tu torso.',
    };
  }

  return {
    id: 'tuck',
    label: 'La blusa',
    value: TUCK.free,
    reason: 'Tu proporción vertical te deja elegir según el look, no por necesidad.',
  };
}

/** Decide el largo de la chaqueta. */
function resolveJacket(
  torsoBalance: SegmentBalance,
  legsBalance: SegmentBalance,
  shapeType: BodyShapeType,
): FormulaItem {
  const shoulderNote =
    shapeType === 'inverted-triangle'
      ? ' Elígela de hombro natural, sin hombreras marcadas.'
      : shapeType === 'triangle'
        ? ' Un hombro ligeramente estructurado suma presencia arriba.'
        : '';

  if (torsoBalance === 'long') {
    return {
      id: 'jacket',
      label: 'Chaqueta o blazer',
      value: JACKET.short,
      reason: `Tu torso supera las dos cabezas: una chaqueta que termine en la cintura la sube visualmente.${shoulderNote}`,
    };
  }

  if (torsoBalance === 'short') {
    return {
      id: 'jacket',
      label: 'Chaqueta o blazer',
      value: JACKET.long,
      reason: `Tu torso es corto: una prenda larga y abierta dibuja dos líneas verticales que lo alargan.${shoulderNote}`,
    };
  }

  if (legsBalance === 'short') {
    return {
      id: 'jacket',
      label: 'Chaqueta o blazer',
      value: JACKET.hip,
      reason: `Tu torso está en proporción; un largo que no pase la cadera evita acortar la pierna.${shoulderNote}`,
    };
  }

  return {
    id: 'jacket',
    label: 'Chaqueta o blazer',
    value: JACKET.free,
    reason: `Tu torso está en proporción: el largo lo decides por el conjunto.${shoulderNote}`,
  };
}

/** Decide la altura del zapato. */
function resolveShoe(legsBalance: SegmentBalance): FormulaItem {
  if (legsBalance === 'short') {
    return {
      id: 'shoe',
      label: 'El zapato',
      value: SHOE.height,
      reason:
        'Tus piernas miden menos de cuatro cabezas: unos centímetros de altura y un zapato del tono del pantalón continúan la línea de la pierna.',
    };
  }

  if (legsBalance === 'long') {
    return {
      id: 'shoe',
      label: 'El zapato',
      value: SHOE.any,
      reason:
        'Tus piernas superan las cuatro cabezas: no necesitas altura extra, así que elige por comodidad o por estilo.',
    };
  }

  return {
    id: 'shoe',
    label: 'El zapato',
    value: SHOE.free,
    reason: 'Tus piernas están en proporción: plano o con tacón, la línea se mantiene.',
  };
}

/** Decide el escote cruzando la silueta con el largo del torso. */
function resolveNeckline(
  shapeType: BodyShapeType,
  torsoBalance: SegmentBalance,
): FormulaItem {
  const style = SHAPE_STYLE[shapeType];

  if (torsoBalance === 'short' && style.neckline !== style.verticalNeckline) {
    return {
      id: 'neckline',
      label: 'El escote',
      value: style.verticalNeckline,
      reason: `Tu silueta pediría ${style.neckline.toLowerCase()}, pero con el torso corto conviene un escote más vertical que le dé longitud.`,
    };
  }

  return {
    id: 'neckline',
    label: 'El escote',
    value: style.neckline,
    reason: style.necklineReason,
  };
}

/** Zona donde conviene poner el punto focal. */
function resolveFocus(shapeType: BodyShapeType): FormulaItem {
  const style = SHAPE_STYLE[shapeType];

  return {
    id: 'focus',
    label: 'Tu punto focal',
    value: style.focus,
    reason: style.focusReason,
  };
}

/**
 * Construye la guía combinada.
 * Función pura: los mismos dos análisis producen siempre la misma guía.
 */
export function buildCombinedGuide(
  shape: BodyShapeResult,
  proportions: EightHeadsResult,
): CombinedGuide {
  const { strategy, segments } = proportions;
  const combo = COMBO_INSIGHTS[shape.type][strategy];
  const style = SHAPE_STYLE[shape.type];

  const formula: FormulaItem[] = [
    resolveRise(strategy, segments.rise.balance, shape.type),
    resolveTuck(strategy, shape.type),
    resolveJacket(segments.torso.balance, segments.legs.balance, shape.type),
    resolveShoe(segments.legs.balance),
    resolveNeckline(shape.type, segments.torso.balance),
    resolveFocus(shape.type),
  ];

  const outfits: CombinedOutfit[] = shape.recommendations.outfitExamples.map(
    (outfit) => ({
      ...outfit,
      verticalAdjustment:
        VERTICAL_ADJUSTMENTS[strategy] +
        (segments.legs.balance === 'short' ? SHORT_LEGS_NOTE : ''),
    }),
  );

  return {
    headline: `${shape.name} · ${STRATEGY_GUIDES[strategy].title}`,
    summary: combo.summary,
    formula,
    tips: [`${style.signature} es tu prenda estrella.`, ...combo.tips],
    outfits,
    version: COMBINED_GUIDE_VERSION,
  };
}
