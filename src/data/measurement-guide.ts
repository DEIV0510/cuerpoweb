import type { MeasurementZone } from '@/components/measurements/MeasurementIllustration';

/** Recomendaciones generales antes de tomar cualquier medida. */
export const GENERAL_TIPS: string[] = [
  'Usa una cinta métrica flexible, de las de costura.',
  'Mide sobre ropa interior o ropa delgada y ajustada.',
  'Mantén una postura natural, de pie y con los hombros relajados.',
  'No contengas la respiración mientras mides.',
  'Apoya la cinta sin apretar: no debe marcar la piel.',
  'Mantén la cinta paralela al piso en todo el contorno.',
  'Toma cada medida dos veces para confirmarla.',
  'Si las dos mediciones se diferencian mucho, repite el proceso.',
];

/** Los tres puntos imprescindibles, para la pantalla de preparación. */
export const ESSENTIAL_TIPS: string[] = [
  'Cinta métrica flexible y ropa delgada.',
  'Postura natural, sin contener la respiración.',
  'Cinta paralela al piso y sin apretar.',
];

export interface ZoneGuide {
  id: MeasurementZone;
  label: string;
  short: string;
  /** Instrucción principal: una o dos frases. */
  instructions: string;
  /** Consejos rápidos para leer de un vistazo. */
  quickTips: string[];
  /** Error frecuente al tomar esta medida. */
  commonError: string;
  tip: string;
}

/** Instrucciones específicas de cada zona. */
export const ZONE_GUIDES: ZoneGuide[] = [
  {
    id: 'bust',
    label: 'Contorno de busto',
    short: 'Busto',
    instructions:
      'Rodea la zona de mayor volumen del busto o pecho. Mantén la cinta recta y sin apretar.',
    quickTips: [
      'La cinta pasa por la espalda a la misma altura.',
      'Brazos relajados a los lados del cuerpo.',
      'Es el contorno completo, no el ancho de hombros.',
    ],
    commonError:
      'Confundir esta medida con el ancho de hombros o dejar que la cinta suba por la espalda.',
    tip: 'Si usas sostén, mide con el que uses a diario: cambia el resultado.',
  },
  {
    id: 'waist',
    label: 'Contorno de cintura',
    short: 'Cintura',
    instructions:
      'Rodea la parte más estrecha del torso, casi siempre por encima del ombligo. Mantén el abdomen relajado.',
    quickTips: [
      'Respira con normalidad al momento de leer la medida.',
      'La cinta queda horizontal en todo el contorno.',
      'Si dudas, inclínate a un lado: el pliegue marca tu cintura.',
    ],
    commonError:
      'Meter el abdomen o contener la respiración: reduce la medida y cambia la silueta.',
    tip: 'Mide sobre la piel o sobre ropa muy delgada, nunca sobre un pantalón grueso.',
  },
  {
    id: 'hips',
    label: 'Contorno de cadera',
    short: 'Cadera',
    instructions:
      'Rodea la zona de mayor volumen de caderas y glúteos. La cinta debe quedar paralela al piso.',
    quickTips: [
      'Junta los pies para que la medida sea estable.',
      'Comprueba de perfil que la cinta no suba por detrás.',
      'Busca el punto más amplio, no la línea del hueso.',
    ],
    commonError:
      'Medir a la altura del hueso de la cadera en vez de la parte más amplia.',
    tip: 'Un espejo de cuerpo entero ayuda a confirmar que la cinta está nivelada.',
  },
];

/** Devuelve la guía de una zona concreta. */
export function getZoneGuide(id: MeasurementZone): ZoneGuide {
  const guide = ZONE_GUIDES.find((zone) => zone.id === id);
  if (!guide) throw new Error(`Zona de medición desconocida: ${id}`);
  return guide;
}
