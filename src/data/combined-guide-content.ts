import type { BodyShapeType } from '@/types/body-shape';
import type { ProportionStrategy } from '@/lib/proportions/eight-heads';

/**
 * Contenido editorial de la guía combinada.
 *
 * `SHAPE_STYLE` describe qué pide cada silueta por sí sola; `COMBO_INSIGHTS`
 * escribe el cruce concreto con cada estrategia vertical.
 */

export interface ShapeStyle {
  /** Escote que pide la silueta. */
  neckline: string;
  /** Alternativa vertical cuando el torso es corto. */
  verticalNeckline: string;
  necklineReason: string;
  /** Zona donde conviene poner el punto focal. */
  focus: string;
  focusReason: string;
  /** La prenda que mejor resume la silueta. */
  signature: string;
}

export const SHAPE_STYLE: Record<BodyShapeType, ShapeStyle> = {
  hourglass: {
    neckline: 'Escote en V suave o corazón',
    verticalNeckline: 'Escote en V profundo',
    necklineReason:
      'Acompaña la curva natural del torso sin competir con la cintura, que ya se lee sola.',
    focus: 'La cintura',
    focusReason:
      'Es tu punto de equilibrio: marcarla una sola vez por look es suficiente.',
    signature: 'El vestido cruzado (wrap)',
  },
  rectangle: {
    neckline: 'Escote barco o cuadrado con detalle',
    verticalNeckline: 'Escote en V con detalle',
    necklineReason:
      'Un escote con presencia crea el punto de interés que tu línea continua agradece.',
    focus: 'El centro de la figura',
    focusReason:
      'Crear una cintura visible con cinturón, peplum o prenda cruzada es lo que más cambia el conjunto.',
    signature: 'La prenda con cinturón o el peplum',
  },
  triangle: {
    neckline: 'Escote barco o cuadrado',
    verticalNeckline: 'Escote cuadrado amplio',
    necklineReason:
      'Amplía la línea del hombro y lleva la atención a la parte superior, equilibrando la cadera.',
    focus: 'Hombros y escote',
    focusReason:
      'Poner color, textura o detalle arriba reparte la atención hacia el rostro.',
    signature: 'La blusa con manga con volumen',
  },
  'inverted-triangle': {
    neckline: 'Escote en V',
    verticalNeckline: 'Escote en V profundo',
    necklineReason:
      'Alarga el torso y suaviza la línea del hombro sin sumar volumen arriba.',
    focus: 'Cadera y piernas',
    focusReason:
      'Llevar movimiento, textura o amplitud a la parte baja equilibra la presencia del torso.',
    signature: 'El pantalón wide leg o la falda plisada',
  },
  oval: {
    neckline: 'Escote en V o en U',
    verticalNeckline: 'Escote en V alargado',
    necklineReason:
      'Abre una vertical desde el rostro y continúa la línea central de la figura.',
    focus: 'Rostro, escote y línea vertical',
    focusReason:
      'La continuidad vertical y los puntos focales altos son lo que más estiliza esta silueta.',
    signature: 'La tercera prenda larga y abierta',
  },
};

export interface ComboInsight {
  /** Explicación del cruce, en una o dos frases. */
  summary: string;
  /** Reglas concretas que nacen de combinar los dos análisis. */
  tips: string[];
}

/** Cruce entre cada silueta y cada estrategia de proporción vertical. */
export const COMBO_INSIGHTS: Record<
  BodyShapeType,
  Record<ProportionStrategy, ComboInsight>
> = {
  hourglass: {
    'raise-waist': {
      summary:
        'Tu cintura ya está definida y además conviene subirla: es la combinación más directa. Todo lo que marque y eleve la cintura trabaja doble a tu favor.',
      tips: [
        'Vestido cruzado o falda de tiro alto con la blusa por dentro: marcas y elevas en un solo gesto.',
        'Cinturón ancho a la cintura natural, nunca a la cadera.',
      ],
    },
    'lengthen-torso': {
      summary:
        'Tu cintura está definida pero tu torso es más corto en relación con tus piernas: la clave es marcarla sin comprimirla y dejar que la parte alta respire.',
      tips: [
        'Blusa por fuera y ligeramente entallada con escote en V: conserva la curva y alarga el torso.',
        'Vestidos con costura en la cintura antes que cinturones anchos, que te restan centímetros arriba.',
      ],
    },
    balanced: {
      summary:
        'Proporción equilibrada en los dos ejes: contornos armónicos y alturas en su sitio. Puedes elegir casi cualquier corte y funcionará.',
      tips: [
        'Aprovecha para jugar con largos y tiros distintos según el día.',
        'Un solo punto focal por look es suficiente: tu cintura ya se lee sola.',
      ],
    },
  },

  rectangle: {
    'raise-waist': {
      summary:
        'Tu figura dibuja una línea continua y tu torso pesa más que tus piernas: hay que crear la cintura y, además, ponerla alta.',
      tips: [
        'Pantalón de tiro alto con cinturón visible: creas la cintura justo donde quieres que se vea.',
        'Chaqueta corta o peplum que termine en la cintura para reforzar esa línea.',
      ],
    },
    'lengthen-torso': {
      summary:
        'Tu figura es continua y tu torso es más corto en relación con tus piernas: crea la cintura un poco más abajo y alarga la vertical de la parte alta.',
      tips: [
        'Blusa por fuera con un nudo lateral suave: sugiere cintura sin acortar el torso.',
        'Cárdigan largo abierto sobre pantalón de tiro medio.',
      ],
    },
    balanced: {
      summary:
        'Línea continua con vertical equilibrada: tu trabajo no es corregir alturas, sino crear puntos de interés donde tú decidas.',
      tips: [
        'Cinturones, peplums y prendas cruzadas a la altura que prefieras.',
        'Combina dos texturas distintas arriba y abajo para sumar dimensión.',
      ],
    },
  },

  triangle: {
    'raise-waist': {
      summary:
        'Tu volumen está en la cadera y además conviene subir la cintura: la parte alta gana protagonismo y la pierna se alarga al mismo tiempo.',
      tips: [
        'Blusa clara o estampada por dentro de un pantalón de tiro alto.',
        'Chaqueta corta con hombro ligeramente estructurado: sube el peso visual.',
      ],
    },
    'lengthen-torso': {
      summary:
        'Tu volumen está en la cadera y tu torso es más corto en relación con tus piernas: alarga la parte alta sin sumar volumen en la baja.',
      tips: [
        'Blusa por fuera, en tono claro y con escote amplio pero vertical.',
        'Pantalón recto de tiro medio en tono profundo, sin bolsillos marcados.',
      ],
    },
    balanced: {
      summary:
        'Volumen en la cadera con vertical equilibrada: basta con repartir la atención hacia la parte superior.',
      tips: [
        'Detalle, color o textura de la cintura para arriba; abajo, líneas limpias.',
        'Zapato y pantalón en tonos cercanos para continuar la pierna.',
      ],
    },
  },

  'inverted-triangle': {
    'raise-waist': {
      summary:
        'Tu volumen está arriba y tu torso pesa en la vertical: conviene bajar el punto focal y subir la cintura a la vez.',
      tips: [
        'Pantalón amplio de tiro alto con blusa lisa por dentro.',
        'Falda plisada de tiro alto: suma movimiento abajo y eleva la cintura.',
      ],
    },
    'lengthen-torso': {
      summary:
        'Tu volumen está arriba y tu torso es más corto en relación con tus piernas: usa verticales que alarguen la parte alta y lleva el interés hacia abajo.',
      tips: [
        'Escote en V profundo con blusa por fuera y pantalón wide leg.',
        'Cárdigan largo abierto: dos líneas verticales que alargan el torso.',
      ],
    },
    balanced: {
      summary:
        'Volumen arriba con vertical equilibrada: el trabajo es sumar presencia en la parte baja, sin tocar las alturas.',
      tips: [
        'Estampado, textura o volumen de la cintura para abajo.',
        'Zapato con color o detalle: cierra el look llevando la mirada al piso.',
      ],
    },
  },

  oval: {
    'raise-waist': {
      summary:
        'Tu zona media es protagonista y tu torso pesa en la vertical: busca continuidad vertical y sube la línea de la pierna sin ceñir la cintura.',
      tips: [
        'Tercera prenda larga y abierta sobre pantalón de tiro alto cómodo.',
        'Look monocromático de la cintura al zapato para alargar la pierna.',
      ],
    },
    'lengthen-torso': {
      summary:
        'Tu zona media es protagonista y tu torso es más corto en relación con tus piernas: prioriza la fluidez y las líneas verticales largas.',
      tips: [
        'Blusa fluida por fuera, con escote en V y largo por debajo de la cadera.',
        'Pantalón recto de tiro medio, sin presión en la cintura.',
      ],
    },
    balanced: {
      summary:
        'Zona media protagonista con vertical equilibrada: la fluidez y la línea vertical continua hacen todo el trabajo.',
      tips: [
        'Monocromía con distintas texturas para sumar interés sin volumen.',
        'Puntos focales en rostro, muñecas y calzado.',
      ],
    },
  },
};
