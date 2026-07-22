import type {
  BodyShapeRecommendation,
  BodyShapeType,
} from '@/types/body-shape';

/**
 * Recomendaciones de vestuario por silueta.
 *
 * Todo el contenido vive aquí, fuera de los componentes visuales, para poder
 * ampliarlo o traducirlo sin tocar la interfaz.
 *
 * Criterio editorial: lenguaje positivo, orientado a equilibrio visual y a
 * potenciar las proporciones naturales. Nunca se habla de corregir, disimular
 * ni ocultar el cuerpo.
 */
export const RECOMMENDATIONS: Record<BodyShapeType, BodyShapeRecommendation> = {
  hourglass: {
    id: 'hourglass',
    name: 'Reloj de arena',
    description:
      'Los contornos de busto y cadera son similares y la cintura se encuentra notablemente definida. La figura ya tiene un punto de equilibrio muy claro en el centro.',
    visualObjective:
      'Mantener el equilibrio natural y conservar la definición de la cintura.',
    tops: [
      'Blusas cruzadas que siguen la línea del torso.',
      'Tops entallados en tejidos con algo de elasticidad.',
      'Camisas que puedan ajustarse o anudarse en la cintura.',
      'Prendas de punto fino con buena caída.',
      'Bodies y tops de corte limpio para usar dentro del pantalón.',
    ],
    necklines: [
      'Escote en V suave.',
      'Escote corazón.',
      'Escote cruzado o cache-cœur.',
      'Cuello redondo abierto que acompañe la forma natural del torso.',
    ],
    pants: [
      'Tiro alto que respete la línea de la cintura.',
      'Corte recto de pierna limpia.',
      'Pantalón sastre con caída fluida.',
      'Jean recto o slim sin exceso de bolsillos.',
    ],
    skirts: [
      'Falda tubo.',
      'Corte A moderado.',
      'Falda cruzada o pareo.',
      'Diseños de tiro alto que continúan la línea de la cintura.',
    ],
    dresses: [
      'Wrap dress (vestido cruzado).',
      'Vestido entallado de punto.',
      'Vestidos con cintura marcada o con costura en la cintura.',
      'Corte sirena moderado.',
      'Corte fit and flare.',
    ],
    jackets: [
      'Blazer entallado con pinzas.',
      'Chaquetas con definición en la cintura.',
      'Trench con cinturón integrado.',
      'Chaquetas cortas que terminan justo en la cintura.',
    ],
    fabrics: [
      'Telas fluidas como viscosa, crepé o seda lavada.',
      'Punto fino que acompaña las curvas sin comprimir.',
      'Denim con un poco de elastano para libertad de movimiento.',
      'Es preferible evitar volumen simultáneo en torso y cadera cuando el objetivo sea conservar la proporción.',
    ],
    prints: [
      'Estampados de escala media, distribuidos de forma pareja.',
      'Rayas diagonales suaves que siguen la curva.',
      'Florales medianos.',
      'Bloques de color que respetan la línea de la cintura.',
    ],
    accessories: [
      'Cinturones finos o medianos a la altura natural de la cintura.',
      'Bolsos de tamaño medio con estructura.',
      'Collares medianos que no compiten con el escote.',
      'Zapatos de línea limpia que continúan la vertical de la pierna.',
    ],
    stylingTips: [
      'Cuando una prenda queda amplia en la cintura, un cinturón o un ajuste de costurería devuelve la proporción.',
      'Marcar la cintura una sola vez por look suele ser suficiente: el resto puede ser sencillo.',
      'Meter la blusa dentro del pantalón, aunque sea solo por delante, define el centro de la figura.',
      'Los conjuntos monocromáticos con cinturón en contraste funcionan muy bien.',
    ],
    outfitExamples: [
      {
        name: 'Fin de semana sereno',
        occasion: 'Casual',
        top: 'Camiseta de punto fino metida por delante en el pantalón.',
        bottom: 'Jean recto de tiro alto.',
        layer: 'Camisa de algodón abierta como tercera prenda.',
        shoes: 'Zapatillas blancas o mocasines planos.',
        accessories: 'Cinturón fino de cuero y aretes pequeños.',
        why: 'El tiro alto y el gesto de meter la camiseta mantienen visible la línea de la cintura sin renunciar a la comodidad.',
      },
      {
        name: 'Reunión de trabajo',
        occasion: 'Profesional',
        top: 'Blusa cruzada de crepé en tono neutro.',
        bottom: 'Pantalón sastre recto de tiro alto.',
        layer: 'Blazer entallado con una pinza en la cintura.',
        shoes: 'Zapato cerrado de tacón medio o mocasín pulido.',
        accessories: 'Bolso estructurado mediano y reloj clásico.',
        why: 'El cruce de la blusa y el blazer con pinza acompañan la curva natural del torso y mantienen la proporción equilibrada.',
      },
      {
        name: 'Noche especial',
        occasion: 'Evento o salida especial',
        top: 'Vestido wrap midi en tela con caída.',
        bottom: 'Incluido en el vestido.',
        layer: 'Chaqueta corta de terciopelo o pashmina fina.',
        shoes: 'Sandalia de tacón con tira delgada.',
        accessories: 'Aretes largos, clutch pequeño y pulsera fina.',
        why: 'El vestido cruzado define la cintura en un solo gesto y la tela con caída conserva la continuidad de la figura.',
      },
    ],
  },

  rectangle: {
    id: 'rectangle',
    name: 'Rectángulo',
    description:
      'Busto y cadera son similares, con una cintura de definición suave. La figura tiene una línea vertical continua y muy versátil.',
    visualObjective:
      'Crear puntos de interés y una sensación de mayor definición en el centro de la figura.',
    tops: [
      'Tops con detalles: frunces, botones decorativos o pliegues.',
      'Cuellos y mangas llamativas (farol, abullonada, campana).',
      'Peplum que genera volumen justo debajo de la cintura.',
      'Prendas cruzadas o con nudo lateral.',
      'Capas moderadas: chaleco abierto sobre camisa.',
      'Diseños con contraste de color o textura a la altura de la cintura.',
    ],
    necklines: [
      'Escote en V para alargar el torso.',
      'Escote barco cuando se busca ampliar la línea del hombro.',
      'Cuello camisero abierto.',
      'Escote cuadrado con detalle en los tirantes.',
    ],
    pants: [
      'Tiro medio o alto.',
      'Paper bag con cintura fruncida y cinturón.',
      'Pantalones con detalles en la zona de la cadera (bolsillos, pinzas marcadas).',
      'Cortes rectos o ligeramente amplios.',
    ],
    skirts: [
      'Corte A.',
      'Faldas con vuelo.',
      'Plisadas.',
      'Diseños con volumen controlado y tiro alto.',
    ],
    dresses: [
      'Vestidos con cinturón incorporado.',
      'Corte imperio.',
      'Fit and flare.',
      'Diseños con bloques de color que sugieren curva.',
      'Vestidos cruzados.',
    ],
    jackets: [
      'Blazer con cinturón o con lazada.',
      'Chaquetas cortas tipo bomber que terminan en la cintura.',
      'Trench con el cinturón anudado.',
      'Chalecos largos abiertos para sumar líneas verticales.',
    ],
    fabrics: [
      'Tejidos con cuerpo que sostienen la forma: sarga, denim firme, piqué.',
      'Texturas con relieve como el punto trenzado o el bouclé.',
      'Mezcla de una prenda estructurada con otra fluida.',
      'Telas con caída para las prendas inferiores con vuelo.',
    ],
    prints: [
      'Bloques de color horizontal y vertical combinados.',
      'Estampados concentrados en una sola zona del look.',
      'Rayas verticales en la prenda que se quiere alargar.',
      'Cuadros medianos en faldas y pantalones.',
    ],
    accessories: [
      'Cinturones anchos o medianos como pieza protagonista.',
      'Accesorios que creen puntos focales: pañuelos, broches, collares en capas.',
      'Bolsos que aporten interés a la zona elegida.',
      'Sombreros y bufandas para sumar volumen en la parte superior.',
    ],
    stylingTips: [
      'Un cinturón sobre una prenda suelta crea de inmediato una cintura visible.',
      'Combinar dos texturas distintas arriba y abajo suma dimensión a la figura.',
      'Las capas cortas sobre prendas largas dividen la vertical y generan proporción.',
      'Elegir una sola zona protagonista por look evita que el conjunto compita consigo mismo.',
    ],
    outfitExamples: [
      {
        name: 'Día de recorrido urbano',
        occasion: 'Casual',
        top: 'Camisa oversize anudada en la cintura.',
        bottom: 'Jean recto de tiro alto.',
        layer: 'Chaleco de punto corto.',
        shoes: 'Zapatillas de silueta limpia.',
        accessories: 'Cinturón visible y bolso cruzado pequeño.',
        why: 'El nudo de la camisa y el cinturón marcan el centro de la figura y el chaleco corto aporta un punto de interés en la parte alta.',
      },
      {
        name: 'Oficina con carácter',
        occasion: 'Profesional',
        top: 'Blusa peplum en tono claro.',
        bottom: 'Pantalón paper bag con cinturón a tono.',
        layer: 'Blazer recto abierto.',
        shoes: 'Zapato de tacón bajo o mocasín.',
        accessories: 'Aretes geométricos y bolso estructurado.',
        why: 'El peplum y la cintura fruncida del pantalón generan una curva suave donde la figura es más recta.',
      },
      {
        name: 'Celebración de tarde',
        occasion: 'Evento o salida especial',
        top: 'Vestido fit and flare con cinturón en contraste.',
        bottom: 'Incluido en el vestido.',
        layer: 'Chaqueta corta estructurada.',
        shoes: 'Sandalia de tacón medio.',
        accessories: 'Collar en capas y clutch con textura.',
        why: 'El vuelo de la falda y el cinturón en contraste crean definición central sin recurrir a prendas ajustadas.',
      },
    ],
  },

  triangle: {
    id: 'triangle',
    name: 'Triángulo',
    alternativeName: 'Pera',
    description:
      'La cadera tiene mayor presencia que el busto o el torso superior. La parte inferior es la zona de mayor volumen de la figura.',
    visualObjective:
      'Llevar parte de la atención hacia la zona superior para generar equilibrio visual.',
    tops: [
      'Colores claros y luminosos en la parte superior.',
      'Estampados en blusas y camisetas.',
      'Mangas con volumen: farol, abullonada o globo.',
      'Hombros estructurados de forma moderada.',
      'Detalles en escote y busto: frunces, botones, bordados.',
      'Blusas con textura visible.',
    ],
    necklines: [
      'Escote barco.',
      'Escote cuadrado.',
      'Escote redondo amplio.',
      'Escotes horizontales moderados que amplían la línea del hombro.',
    ],
    pants: [
      'Corte recto.',
      'Bootcut que equilibra la línea de la pierna.',
      'Líneas limpias, sin adornos en la cadera.',
      'Colores lisos en tonos medios u oscuros.',
      'Bolsillos discretos o sin bolsillos traseros marcados.',
    ],
    skirts: [
      'Corte A.',
      'Diseños con buena caída.',
      'Faldas rectas sin volumen lateral.',
      'Largo midi que continúa la línea de la pierna.',
    ],
    dresses: [
      'Corte A.',
      'Fit and flare.',
      'Vestidos con detalle superior: hombros, escote o mangas.',
      'Diseños que definen suavemente la cintura.',
      'Vestidos con la parte superior estampada y la inferior lisa.',
    ],
    jackets: [
      'Chaquetas que terminan en la cintura o justo encima de la cadera.',
      'Blazer con hombro ligeramente estructurado.',
      'Chaquetas con solapas amplias.',
      'Prendas superiores con textura o color de contraste.',
    ],
    fabrics: [
      'Texturas y relieve en la parte superior: punto trenzado, lino, bouclé.',
      'Telas con caída en la parte inferior: crepé, viscosa, gabardina fluida.',
      'Denim firme y liso para pantalones.',
      'Evitar acumular volumen en la zona de la cadera cuando el objetivo sea equilibrar.',
    ],
    prints: [
      'Estampados en la parte superior.',
      'Rayas horizontales suaves en blusas.',
      'Colores lisos y profundos en la parte inferior.',
      'Bloques de color con la zona clara arriba.',
    ],
    accessories: [
      'Collares llamativos.',
      'Aretes largos o con volumen.',
      'Pañuelos al cuello.',
      'Elementos visuales cerca del rostro y los hombros.',
      'Bolsos que se llevan a la altura del torso.',
    ],
    stylingTips: [
      'Ubicar el color más claro o el estampado arriba dirige la mirada hacia el rostro.',
      'Una chaqueta que termina en la cintura mantiene la proporción entre torso y cadera.',
      'El zapato en un tono cercano al de la piel o del pantalón continúa la línea de la pierna.',
      'Los tejidos con caída en la parte inferior acompañan la forma sin sumar volumen.',
    ],
    outfitExamples: [
      {
        name: 'Plan de día luminoso',
        occasion: 'Casual',
        top: 'Blusa clara con manga farol.',
        bottom: 'Jean recto en tono índigo profundo.',
        layer: 'Chaqueta corta de denim claro.',
        shoes: 'Zapatilla o sandalia plana de línea limpia.',
        accessories: 'Aretes con volumen y bolso pequeño al hombro.',
        why: 'La manga con volumen y el tono claro arriba equilibran la presencia de la zona inferior.',
      },
      {
        name: 'Jornada profesional',
        occasion: 'Profesional',
        top: 'Camisa con escote barco y textura fina.',
        bottom: 'Pantalón sastre recto en tono oscuro.',
        layer: 'Blazer con hombro ligeramente estructurado, largo a la cintura.',
        shoes: 'Zapato cerrado de tacón medio.',
        accessories: 'Collar mediano y bolso estructurado.',
        why: 'El escote barco amplía la línea del hombro y el largo del blazer respeta la proporción entre torso y cadera.',
      },
      {
        name: 'Cena especial',
        occasion: 'Evento o salida especial',
        top: 'Vestido corte A con parte superior bordada.',
        bottom: 'Incluido en el vestido.',
        layer: 'Chaqueta corta o bolero fino.',
        shoes: 'Sandalia de tacón en tono cercano al de la piel.',
        accessories: 'Aretes largos y clutch pequeño.',
        why: 'El detalle bordado atrae la mirada hacia el rostro y la falda con corte A acompaña la cadera con fluidez.',
      },
    ],
  },

  'inverted-triangle': {
    id: 'inverted-triangle',
    name: 'Triángulo invertido',
    alternativeName: 'Triángulo superior',
    description:
      'El busto o el torso superior tiene mayor presencia que la cadera. La parte alta concentra el volumen de la figura.',
    visualObjective:
      'Agregar movimiento, textura o amplitud visual en la parte inferior.',
    tops: [
      'Diseños de líneas limpias y corte sencillo.',
      'Colores neutros o lisos en la parte superior.',
      'Telas con caída que no suman volumen.',
      'Detalles verticales: aberturas, botonaduras, costuras longitudinales.',
      'Mangas rectas o tipo raglán.',
      'Es preferible evitar volumen adicional en hombros cuando el objetivo sea equilibrar.',
    ],
    necklines: [
      'Escote en V.',
      'Escote en U profundo moderado.',
      'Escotes verticales y alargados.',
      'Diseños asimétricos usados con criterio.',
    ],
    pants: [
      'Palazzo.',
      'Wide leg.',
      'Cargo moderado.',
      'Pantalones con pinzas al frente.',
      'Diseños con bolsillos laterales.',
      'Estampados en la zona inferior.',
    ],
    skirts: [
      'Plisadas.',
      'Corte A.',
      'Faldas con vuelo o con capas.',
      'Diseños con textura o estampado.',
    ],
    dresses: [
      'Corte A.',
      'Vestidos con volumen en la falda.',
      'Diseños con escote en V.',
      'Vestidos con detalles, capas o bordados en la parte inferior.',
    ],
    jackets: [
      'Blazer de hombro natural, sin hombreras marcadas.',
      'Chaquetas abiertas que forman dos líneas verticales.',
      'Cárdigan largo de tejido fluido.',
      'Chaquetas con largo por debajo de la cadera.',
    ],
    fabrics: [
      'Telas con caída en la parte superior: viscosa, modal, crepé.',
      'Tejidos con cuerpo y movimiento en la parte inferior: plisado, popelina, gabardina.',
      'Denim firme para pantalones amplios.',
      'Punto fino arriba en lugar de punto grueso.',
    ],
    prints: [
      'Estampados en pantalones y faldas.',
      'Colores lisos y profundos en la parte superior.',
      'Rayas verticales en blusas.',
      'Bloques de color con la zona clara abajo.',
    ],
    accessories: [
      'Collares largos que alargan el torso.',
      'Cinturones a la cadera para desplazar el punto focal hacia abajo.',
      'Bolsos que se llevan a la altura de la cadera.',
      'Zapatos con detalle, color o textura.',
    ],
    stylingTips: [
      'Un escote en V alarga visualmente el torso y suaviza la línea del hombro.',
      'Los pantalones amplios equilibran la parte superior sin necesidad de ocultar nada.',
      'Llevar el estampado abajo reparte la atención a lo largo de toda la figura.',
      'Las chaquetas abiertas y largas crean dos líneas verticales muy favorecedoras.',
    ],
    outfitExamples: [
      {
        name: 'Domingo con movimiento',
        occasion: 'Casual',
        top: 'Camiseta de escote en V en tono liso.',
        bottom: 'Pantalón wide leg de denim claro.',
        layer: 'Cárdigan largo abierto.',
        shoes: 'Zapatilla plana o sandalia con plataforma discreta.',
        accessories: 'Collar largo y bolso de mano mediano.',
        why: 'El pantalón amplio suma presencia abajo y el escote en V alarga el torso.',
      },
      {
        name: 'Presentación de trabajo',
        occasion: 'Profesional',
        top: 'Blusa de crepé con escote en V y manga recta.',
        bottom: 'Falda plisada midi.',
        layer: 'Blazer de hombro natural, largo por debajo de la cadera.',
        shoes: 'Zapato de tacón medio en tono neutro.',
        accessories: 'Aretes discretos y bolso estructurado a la cadera.',
        why: 'El plisado aporta movimiento en la zona inferior y el blazer sin hombreras mantiene la línea del hombro serena.',
      },
      {
        name: 'Evento de noche',
        occasion: 'Evento o salida especial',
        top: 'Vestido con escote en V y falda con capas.',
        bottom: 'Incluido en el vestido.',
        layer: 'Estola fina o chaqueta larga abierta.',
        shoes: 'Sandalia de tacón con detalle metalizado.',
        accessories: 'Pendientes discretos y clutch alargado.',
        why: 'El volumen de la falda equilibra la parte superior y el escote en V mantiene la vertical del torso.',
      },
    ],
  },

  oval: {
    id: 'oval',
    name: 'Óvalo',
    alternativeName: 'Redondeada',
    description:
      'La zona media tiene una presencia visual similar o superior a la de busto y cadera, con transiciones muy suaves entre las tres medidas.',
    visualObjective:
      'Crear continuidad vertical, fluidez y puntos focales en rostro, escote, brazos o piernas.',
    tops: [
      'Blusas de caída fluida que no comprimen la zona media.',
      'Diseños con líneas verticales: botonaduras, costuras, plisados finos.',
      'Prendas de largo medio que crean continuidad visual.',
      'Chaquetas y camisas abiertas usadas como tercera prenda.',
      'Túnicas de corte limpio.',
    ],
    necklines: [
      'Escote en V.',
      'Escote en U.',
      'Escotes verticales y alargados.',
      'Cuellos abiertos tipo camisero.',
    ],
    pants: [
      'Corte recto.',
      'Tiro medio o alto cómodo, sin presión en la cintura.',
      'Telas con estructura suave que sostienen la línea.',
      'Diseños de frente limpio, sin pinzas ni bolsillos abultados.',
    ],
    skirts: [
      'Faldas rectas con caída.',
      'Corte A suave.',
      'Largo midi en tejido fluido.',
      'Diseños de cintura elástica plana.',
    ],
    dresses: [
      'Vestidos fluidos de una sola línea.',
      'Corte imperio moderado.',
      'Diseños cruzados con caída.',
      'Vestidos con líneas verticales.',
      'Propuestas monocromáticas.',
    ],
    jackets: [
      'Blazer abierto de largo medio.',
      'Cárdigan largo.',
      'Chaquetas que crean dos líneas verticales a los lados.',
      'Abrigos rectos sin cinturón ajustado.',
    ],
    fabrics: [
      'Telas fluidas con buena caída: viscosa, modal, crepé.',
      'Tejidos ligeramente estructurados que no se adhieren al cuerpo.',
      'Punto fino en lugar de punto muy grueso en la zona media.',
      'Forros suaves que permiten que la prenda caiga limpia.',
    ],
    prints: [
      'Estampados de escala media en tejidos con caída.',
      'Rayas verticales.',
      'Propuestas monocromáticas con distintas texturas.',
      'Estampados ubicados cerca del rostro o en la parte inferior.',
    ],
    accessories: [
      'Collares largos o en forma de V.',
      'Aretes que llevan la atención al rostro.',
      'Pulseras y relojes que destacan las muñecas.',
      'Bufandas y pañuelos en caída vertical.',
      'Zapatos con un poco de altura para alargar la línea de la pierna.',
    ],
    stylingTips: [
      'Un look monocromático genera una vertical continua muy elegante.',
      'La tercera prenda abierta y larga es la aliada más versátil de esta silueta.',
      'Dejar que la tela caiga sin ajustar la zona media resulta más favorecedor que ceñir.',
      'Los puntos focales en rostro, muñecas y calzado reparten la atención a lo largo de toda la figura.',
    ],
    outfitExamples: [
      {
        name: 'Rutina cómoda',
        occasion: 'Casual',
        top: 'Camiseta fluida de escote en V, largo hasta la cadera.',
        bottom: 'Pantalón recto de cintura elástica plana.',
        layer: 'Camisa larga abierta.',
        shoes: 'Zapatilla de suela limpia.',
        accessories: 'Collar largo y reloj visible.',
        why: 'La camisa abierta forma dos líneas verticales y el escote en V continúa esa dirección hacia el rostro.',
      },
      {
        name: 'Día de oficina',
        occasion: 'Profesional',
        top: 'Blusa de crepé con botonadura y caída suelta.',
        bottom: 'Pantalón sastre recto en el mismo tono.',
        layer: 'Blazer abierto de largo medio.',
        shoes: 'Zapato de tacón bajo estable.',
        accessories: 'Aretes medianos y bolso vertical.',
        why: 'El conjunto en un solo tono más el blazer abierto crean una línea vertical continua y serena.',
      },
      {
        name: 'Ocasión especial',
        occasion: 'Evento o salida especial',
        top: 'Vestido cruzado fluido de largo midi.',
        bottom: 'Incluido en el vestido.',
        layer: 'Chaqueta larga abierta en tejido ligero.',
        shoes: 'Sandalia de tacón medio.',
        accessories: 'Aretes con brillo y clutch alargado.',
        why: 'El cruce y la caída del tejido acompañan la figura sin comprimir la zona media, y el largo midi alarga la silueta.',
      },
    ],
  },
};

/** Devuelve el bloque de recomendaciones de una silueta. */
export function getRecommendations(id: BodyShapeType): BodyShapeRecommendation {
  return RECOMMENDATIONS[id];
}

/** Secciones de recomendaciones que se muestran en pestañas. */
export const RECOMMENDATION_SECTIONS = [
  { key: 'tops', label: 'Prendas superiores' },
  { key: 'necklines', label: 'Escotes' },
  { key: 'pants', label: 'Pantalones' },
  { key: 'skirts', label: 'Faldas' },
  { key: 'dresses', label: 'Vestidos' },
  { key: 'jackets', label: 'Chaquetas y abrigos' },
  { key: 'fabrics', label: 'Texturas y telas' },
  { key: 'prints', label: 'Estampados' },
  { key: 'accessories', label: 'Accesorios' },
  { key: 'stylingTips', label: 'Consejos de estilo' },
] as const satisfies ReadonlyArray<{
  key: keyof Pick<
    BodyShapeRecommendation,
    | 'tops'
    | 'necklines'
    | 'pants'
    | 'skirts'
    | 'dresses'
    | 'jackets'
    | 'fabrics'
    | 'prints'
    | 'accessories'
    | 'stylingTips'
  >;
  label: string;
}>;

export type RecommendationSectionKey =
  (typeof RECOMMENDATION_SECTIONS)[number]['key'];
