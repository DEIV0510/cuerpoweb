import type {
  ProportionSegment,
  ProportionStrategy,
  SegmentBalance,
} from '@/lib/proportions/eight-heads';

/** Cómo se mide cada tramo de la técnica de las 8 cabezas. */
export interface SegmentField {
  id: 'head' | ProportionSegment;
  label: string;
  short: string;
  /** Instrucción de una o dos frases. */
  instruction: string;
  tips: string[];
  /** Cabezas de referencia; la cabeza es la unidad. */
  reference: number;
}

export const SEGMENT_FIELDS: SegmentField[] = [
  {
    id: 'head',
    label: 'Alto de tu cabeza',
    short: 'Cabeza',
    instruction:
      'Mide desde la coronilla hasta la punta de la quijada. Esta medida es la unidad con la que se divide todo el cuerpo.',
    tips: [
      'Apoya un libro horizontal sobre tu cabeza frente al espejo y marca la altura.',
      'No incluyas el cabello con volumen: busca el hueso del cráneo.',
      'Termina justo en la punta del mentón, no en el cuello.',
    ],
    reference: 1,
  },
  {
    id: 'torso',
    label: 'De la quijada a la cintura',
    short: 'Torso',
    instruction:
      'Mide desde la punta del mentón hasta la parte más estrecha de tu cintura. Lo proporcional son 2 cabezas.',
    tips: [
      'Mide de frente y con la cinta pegada al cuerpo, en línea recta.',
      'La cintura natural suele quedar por encima del ombligo.',
      'Mantén la cabeza erguida, mirando al frente.',
    ],
    reference: 2,
  },
  {
    id: 'rise',
    label: 'De la cintura a la entrepierna',
    short: 'Tiro',
    instruction:
      'Mide desde la cintura hasta el pliegue de la entrepierna. Lo proporcional es 1 cabeza. Este tramo decide el tiro de tus pantalones.',
    tips: [
      'De pie y con las piernas juntas.',
      'Es la misma medida que usan los pantalones para su tiro.',
      'Si te cuesta, siéntate en una silla firme: la entrepierna queda a la altura del asiento.',
    ],
    reference: 1,
  },
  {
    id: 'legs',
    label: 'De la entrepierna al piso',
    short: 'Piernas',
    instruction:
      'Mide desde el pliegue de la entrepierna hasta el piso, descalza. Lo proporcional son 4 cabezas.',
    tips: [
      'Descalza y con los pies juntos.',
      'La cinta baja recta por la cara interna de la pierna.',
      'Es la misma medida que el largo interior de un pantalón.',
    ],
    reference: 4,
  },
];

export interface SegmentGuide {
  title: string;
  /** Qué significa este resultado, en lenguaje claro. */
  insight: string;
  tips: string[];
}

/**
 * Recomendaciones por tramo y resultado.
 *
 * El lenguaje describe proporciones, nunca defectos: todas las combinaciones
 * son válidas y lo único que cambia es la estrategia de vestuario.
 */
export const SEGMENT_GUIDES: Record<
  ProportionSegment,
  Record<SegmentBalance, SegmentGuide>
> = {
  torso: {
    short: {
      title: 'Torso corto',
      insight:
        'De tu quijada a tu cintura hay menos de dos cabezas: tu cintura queda alta y tus piernas ganan protagonismo en la vertical.',
      tips: [
        'Blusas y camisetas por fuera, sobre todo si pasan un poco la cadera.',
        'Escotes en V, en U y cuellos abiertos: alargan la línea del torso.',
        'Tiro medio antes que tiro extra alto, que acorta aún más esa zona.',
        'Blazers y abrigos largos, abiertos, que dibujen dos líneas verticales.',
        'Collares largos o en V en lugar de gargantillas.',
        'Cinturones finos y del mismo tono de la prenda, o directamente sin cinturón.',
        'Chaquetas por debajo de la cadera antes que chaquetas muy cortas.',
      ],
    },
    balanced: {
      title: 'Torso en proporción',
      insight:
        'Tu torso mide cerca de dos cabezas, la referencia clásica de la técnica.',
      tips: [
        'Puedes llevar las blusas por dentro o por fuera con la misma facilidad.',
        'Tiro alto, medio o bajo te funcionan: elige por comodidad y por el look.',
        'Chaquetas cortas y largas te sientan bien; decide según el resto del conjunto.',
        'Marca la cintura cuando quieras crear un punto focal, no por obligación.',
      ],
    },
    long: {
      title: 'Torso largo',
      insight:
        'De tu quijada a tu cintura hay más de dos cabezas: tu cintura queda más baja y el torso lidera la vertical.',
      tips: [
        'Pantalones y faldas de tiro alto: suben la línea de la cintura al instante.',
        'Blusas por dentro, o solo el frente por dentro si prefieres algo más relajado.',
        'Chaquetas cortas: vaquera, bomber o blazer que termine en la cintura.',
        'Cinturones anchos o en contraste a la altura de tu cintura natural.',
        'Tops y bodies cortos bajo prendas abiertas.',
        'Evita blusas muy largas sobre pantalón de tiro bajo: estiran más el torso.',
      ],
    },
  },

  rise: {
    short: {
      title: 'Tiro corto',
      insight:
        'De tu cintura a la entrepierna hay menos de una cabeza: los pantalones de tiro muy alto tienden a sobrarte por arriba.',
      tips: [
        'Busca pantalones de tiro medio o «regular rise».',
        'En jeans, revisa la etiqueta: el tiro suele venir indicado en centímetros.',
        'Si un pantalón de tiro alto te encanta, un ajuste de costurería en la pretina lo resuelve.',
        'Las pretinas muy anchas o el paper bag muy pronunciado te quedarán holgados.',
      ],
    },
    balanced: {
      title: 'Tiro en proporción',
      insight:
        'De tu cintura a la entrepierna hay cerca de una cabeza: la mayoría de pantalones te quedan como el fabricante los pensó.',
      tips: [
        'El tiro estándar de las marcas suele sentarte bien.',
        'Puedes elegir el tiro según el efecto que busques, no por necesidad.',
        'Aprovecha esa libertad para jugar con pretinas, cinturones y pinzas.',
      ],
    },
    long: {
      title: 'Tiro largo',
      insight:
        'De tu cintura a la entrepierna hay más de una cabeza: necesitas pantalones con buen tiro para no sentir tirantez.',
      tips: [
        'Pantalones «high rise»: te quedan cómodos y además estilizan.',
        'El tiro bajo suele quedarte tirante y bajar la línea de la cintura.',
        'Faldas y pantalones con pretina ancha aprovechan bien ese tramo.',
        'En el probador, revisa que la pretina llegue a tu cintura natural sin forzar.',
      ],
    },
  },

  legs: {
    short: {
      title: 'Piernas cortas respecto al torso',
      insight:
        'De tu entrepierna al piso hay menos de cuatro cabezas: la vertical se concentra en la parte alta del cuerpo.',
      tips: [
        'Zapatos en un tono cercano al de tu piel o al del pantalón: continúan la línea de la pierna.',
        'Algo de altura ayuda, aunque sean 3 cm de plataforma o suela.',
        'Pantalones que rocen el piso, sin dobladillo ancho ni exceso de tela.',
        'Monocromía de la cintura al zapato: un solo tono alarga.',
        'Cuidado con los botines de caña a media pantorrilla: cortan la pierna en su punto más ancho.',
        'Faldas y vestidos por encima o justo debajo de la rodilla.',
      ],
    },
    balanced: {
      title: 'Piernas en proporción',
      insight:
        'De tu entrepierna al piso hay cerca de cuatro cabezas: la relación con tu torso es la de referencia.',
      tips: [
        'Zapatos planos y con tacón te funcionan por igual.',
        'Puedes usar largos midi, cropped o al piso sin perder proporción.',
        'Elige el calzado por la ocasión y por comodidad.',
      ],
    },
    long: {
      title: 'Piernas largas respecto al torso',
      insight:
        'De tu entrepierna al piso hay más de cuatro cabezas: tus piernas lideran la vertical.',
      tips: [
        'Los zapatos planos te sientan perfectamente: no necesitas altura extra.',
        'Botines y botas a media pantorrilla te quedan muy bien.',
        'Pantalones culotte, cropped o con dobladillo visible: acortan a favor.',
        'Puedes contrastar el color del zapato con el del pantalón.',
        'Faldas midi y largas equilibran muy bien tu figura.',
      ],
    },
  },
};

export interface StrategyGuide {
  title: string;
  description: string;
  quickWins: string[];
}

/** Estrategia general según hacia dónde se inclina la vertical. */
export const STRATEGY_GUIDES: Record<ProportionStrategy, StrategyGuide> = {
  'raise-waist': {
    title: 'Sube la línea de tu cintura',
    description:
      'Tu torso pesa un poco más que tus piernas en el reparto vertical. Todo lo que eleve la cintura alarga la pierna al instante.',
    quickWins: [
      'Pantalón de tiro alto con la blusa por dentro.',
      'Chaqueta corta que termine justo en la cintura.',
      'Zapato del mismo tono que el pantalón o cercano a tu piel.',
      'Cinturón a la cintura natural para marcar dónde empieza la pierna.',
    ],
  },
  'lengthen-torso': {
    title: 'Alarga la línea de tu torso',
    description:
      'Tus piernas pesan un poco más que tu torso en el reparto vertical. Lo que alargue la parte alta devuelve el equilibrio.',
    quickWins: [
      'Blusa por fuera, un poco más larga que la cadera.',
      'Escote en V o cuello abierto para estirar la vertical del torso.',
      'Chaqueta o cárdigan largo y abierto.',
      'Tiro medio en lugar de tiro extra alto.',
    ],
  },
  balanced: {
    title: 'Tu vertical ya está equilibrada',
    description:
      'Tus tramos se acercan a la referencia de las ocho cabezas, así que el vestuario no necesita corregir nada: puedes elegir por gusto.',
    quickWins: [
      'Prueba largos y tiros distintos según el efecto que quieras ese día.',
      'Usa la cintura como punto focal cuando quieras destacarla.',
      'Aprovecha para experimentar con siluetas más arriesgadas.',
    ],
  },
};

/** Etiquetas cortas de cada tramo, para gráficos y resúmenes. */
export const SEGMENT_SHORT_LABELS: Record<ProportionSegment | 'head', string> = {
  head: 'Cabeza',
  torso: 'Quijada a cintura',
  rise: 'Cintura a entrepierna',
  legs: 'Entrepierna a los pies',
};
