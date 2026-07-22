import type { MeasurementZone } from '@/components/measurements/MeasurementIllustration';

/** Recomendaciones generales antes de tomar cualquier medida. */
export const GENERAL_TIPS: string[] = [
  'Utiliza una cinta métrica flexible, de las que se usan en costura.',
  'Toma las medidas sobre ropa interior o ropa delgada y ajustada.',
  'Mantén una postura natural, de pie y con los hombros relajados.',
  'No contengas la respiración mientras mides.',
  'No aprietes la cinta contra la piel: debe apoyarse sin marcar.',
  'Mantén la cinta paralela al piso en todo el contorno.',
  'Toma cada medida dos veces para confirmarla.',
  'Si las dos mediciones tienen una diferencia importante, repite el proceso.',
];

export interface ZoneGuide {
  id: MeasurementZone;
  label: string;
  short: string;
  instructions: string;
  tip: string;
}

/** Instrucciones específicas de cada zona. */
export const ZONE_GUIDES: ZoneGuide[] = [
  {
    id: 'bust',
    label: 'Contorno de busto',
    short: 'Busto',
    instructions:
      'Mide alrededor de la zona de mayor volumen del busto o pecho. La cinta debe pasar por la espalda y mantenerse horizontal, sin comprimir.',
    tip: 'No confundas esta medida con el ancho de hombros: aquí se mide el contorno completo del torso a la altura del busto.',
  },
  {
    id: 'waist',
    label: 'Contorno de cintura',
    short: 'Cintura',
    instructions:
      'Mide alrededor de la parte más estrecha del torso. Generalmente se encuentra por encima del ombligo. Mantén el abdomen relajado.',
    tip: 'Si no identificas la parte más estrecha, inclínate un poco hacia un lado: el pliegue que se forma señala la altura de tu cintura natural.',
  },
  {
    id: 'hips',
    label: 'Contorno de cadera',
    short: 'Cadera',
    instructions:
      'Mide alrededor de la zona de mayor volumen de las caderas y los glúteos. La cinta debe permanecer paralela al piso.',
    tip: 'Muévete alrededor con un espejo o pide ayuda para comprobar que la cinta no queda más alta por detrás.',
  },
];

/** Devuelve la guía de una zona concreta. */
export function getZoneGuide(id: MeasurementZone): ZoneGuide {
  const guide = ZONE_GUIDES.find((zone) => zone.id === id);
  if (!guide) throw new Error(`Zona de medición desconocida: ${id}`);
  return guide;
}
