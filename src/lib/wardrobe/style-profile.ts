/**
 * Perfil de estilo a partir de una encuesta corta.
 *
 * No es una evaluación ni un plan cerrado: es una encuesta que traduce las
 * preferencias de la persona en un perfil orientativo, con el que después se
 * arma el checklist de básicos y las cápsulas de outfits.
 *
 * Todo es determinista: las mismas respuestas producen el mismo perfil.
 */

/** Versión del cálculo del perfil de estilo. */
export const STYLE_PROFILE_VERSION = '1.0.0';

/** Arquetipos de estilo (respuesta a "qué estilo te llama"). */
export type StyleArchetype = 'classic' | 'minimal' | 'casual' | 'eclectic';

/** Tono: cómo quiere proyectarse la persona. */
export type StyleTone = 'statement' | 'discreet';

/** Ocasiones para las que necesita outfits. */
export type Occasion = 'office' | 'daily' | 'home' | 'date' | 'events';

/** Confianza al combinar prendas. */
export type StylingConfidence = 'high' | 'medium' | 'low';

/** Qué tan prioritario es renovar el armario. */
export type WardrobeFocus = 'refine' | 'improve' | 'rebuild';

export const OCCASIONS: Occasion[] = ['office', 'daily', 'home', 'date', 'events'];

/** Respuestas de la encuesta, tal como llegan del formulario. */
export interface StyleAnswers {
  /** ¿Qué tan satisfecha estás con tu armario? */
  satisfaction: 'satisfied' | 'could-be-better' | 'need-change';
  /** ¿Para qué ocasiones necesitas outfits? (al menos una) */
  occasions: Occasion[];
  /** ¿Qué estilo te llama más la atención? */
  archetype: StyleArchetype;
  /** Cuando te vistes, quieres que tu estilo… */
  tone: StyleTone;
  /** ¿Te resulta fácil combinar prendas? */
  combining: 'very-easy' | 'easy' | 'tricky' | 'hard';
  /** ¿Cuántas veces sientes que "no tienes nada que ponerte"? */
  nothingToWear: 'daily' | 'weekly' | 'events-only' | 'never';
}

export interface StyleProfile {
  archetype: StyleArchetype;
  tone: StyleTone;
  occasions: Occasion[];
  confidence: StylingConfidence;
  focus: WardrobeFocus;
  /** Nombre corto del perfil, p. ej. "Clásico sereno". */
  name: string;
  /** Descripción del perfil en una o dos frases. */
  description: string;
  /** En qué conviene concentrarse primero. */
  priorities: string[];
  version: string;
}

/** Error lanzado cuando la encuesta está incompleta. */
export class StyleProfileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StyleProfileError';
  }
}

const ARCHETYPE_NAMES: Record<StyleArchetype, string> = {
  classic: 'Clásico',
  minimal: 'Minimalista',
  casual: 'Relajado',
  eclectic: 'Ecléctico',
};

const TONE_SUFFIX: Record<StyleTone, string> = {
  statement: 'con carácter',
  discreet: 'sereno',
};

const ARCHETYPE_DESCRIPTIONS: Record<StyleArchetype, string> = {
  classic:
    'Te atraen las prendas atemporales, las líneas limpias y los conjuntos que nunca pasan de moda.',
  minimal:
    'Prefieres pocas prendas bien elegidas, colores neutros y siluetas depuradas.',
  casual:
    'Buscas comodidad y naturalidad, con prendas fáciles de llevar todos los días.',
  eclectic:
    'Te gusta mezclar registros y jugar con distintas piezas según el día y el ánimo.',
};

const TONE_NOTE: Record<StyleTone, string> = {
  statement:
    'Te gusta que tu ropa se note, con un detalle, un color o una pieza que hable por ti.',
  discreet:
    'Prefieres una elegancia discreta, donde el conjunto se vea cuidado sin gritar.',
};

/** Traduce la respuesta de combinar en un nivel de confianza. */
function resolveConfidence(combining: StyleAnswers['combining']): StylingConfidence {
  switch (combining) {
    case 'very-easy':
      return 'high';
    case 'easy':
      return 'medium';
    default:
      return 'low';
  }
}

/**
 * Cruza satisfacción y frecuencia de "no tengo nada que ponerme" para saber
 * cuánto conviene renovar.
 */
function resolveFocus(
  satisfaction: StyleAnswers['satisfaction'],
  nothingToWear: StyleAnswers['nothingToWear'],
): WardrobeFocus {
  const strain =
    (satisfaction === 'need-change' ? 2 : satisfaction === 'could-be-better' ? 1 : 0) +
    (nothingToWear === 'daily' ? 2 : nothingToWear === 'weekly' ? 1 : 0);

  if (strain >= 3) return 'rebuild';
  if (strain >= 1) return 'improve';
  return 'refine';
}

/** Prioridades según confianza y foco. */
function buildPriorities(
  confidence: StylingConfidence,
  focus: WardrobeFocus,
): string[] {
  const priorities: string[] = [];

  if (focus === 'rebuild') {
    priorities.push('Empieza por completar los básicos que te faltan: son la base de todo lo demás.');
  } else if (focus === 'improve') {
    priorities.push('Refuerza los básicos que te falten y renueva las piezas más gastadas.');
  } else {
    priorities.push('Tu base está sólida: suma alguna pieza con personalidad para refrescarla.');
  }

  if (confidence === 'low') {
    priorities.push('Apóyate en las cápsulas: son combinaciones ya resueltas para no dudar al vestirte.');
  } else if (confidence === 'medium') {
    priorities.push('Usa las cápsulas como punto de partida y ve variando una prenda cada vez.');
  } else {
    priorities.push('Ya combinas con soltura: usa las cápsulas solo como inspiración.');
  }

  priorities.push('Prioriza las prendas que sirvan para varias de tus ocasiones: rinden más.');

  return priorities;
}

/**
 * Deriva el perfil de estilo a partir de las respuestas.
 *
 * @throws {StyleProfileError} si no se eligió ninguna ocasión.
 */
export function deriveStyleProfile(answers: StyleAnswers): StyleProfile {
  if (!Array.isArray(answers.occasions) || answers.occasions.length === 0) {
    throw new StyleProfileError('Elige al menos una ocasión para la que necesitas outfits.');
  }

  // Se conserva el orden canónico de las ocasiones y se descartan duplicados.
  const occasions = OCCASIONS.filter((occasion) => answers.occasions.includes(occasion));

  const confidence = resolveConfidence(answers.combining);
  const focus = resolveFocus(answers.satisfaction, answers.nothingToWear);

  return {
    archetype: answers.archetype,
    tone: answers.tone,
    occasions,
    confidence,
    focus,
    name: `${ARCHETYPE_NAMES[answers.archetype]} ${TONE_SUFFIX[answers.tone]}`,
    description: `${ARCHETYPE_DESCRIPTIONS[answers.archetype]} ${TONE_NOTE[answers.tone]}`,
    priorities: buildPriorities(confidence, focus),
    version: STYLE_PROFILE_VERSION,
  };
}
