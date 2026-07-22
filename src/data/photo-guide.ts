import type { PhotoZone } from '@/lib/photo/photo-estimation';

/** Cómo tomar la foto para que la estimación sea razonable. */
export const PHOTO_TIPS: string[] = [
  'De cuerpo completo y de frente: deben verse la cabeza y los pies.',
  'Ropa ajustada o ropa interior; la ropa suelta agranda el contorno.',
  'Brazos ligeramente separados del cuerpo, para que se vea la cintura.',
  'Cámara a la altura de tu cadera y en posición vertical.',
  'Aléjate unos dos metros y evita el zoom: deforma las proporciones.',
  'Fondo liso y buena luz, de frente y sin sombras marcadas.',
  'Pies juntos y postura natural, sin inclinarte hacia un lado.',
];

export interface PhotoZoneStep {
  zone: PhotoZone;
  label: string;
  instruction: string;
  tip: string;
}

/** Instrucciones de cada zona que se marca sobre la foto. */
export const PHOTO_ZONE_STEPS: PhotoZoneStep[] = [
  {
    zone: 'bust',
    label: 'Ancho del busto',
    instruction:
      'Sube o baja los puntos hasta la zona de mayor volumen del busto y llévalos a cada borde del cuerpo.',
    tip: 'Los dos puntos deben quedar a la misma altura y tocar el contorno, no la ropa suelta.',
  },
  {
    zone: 'waist',
    label: 'Ancho de la cintura',
    instruction:
      'Coloca los puntos en la parte más estrecha del torso, normalmente por encima del ombligo.',
    tip: 'Si no distingues la cintura, ubícala a media distancia entre el busto y la cadera.',
  },
  {
    zone: 'hips',
    label: 'Ancho de la cadera',
    instruction:
      'Lleva los puntos a la zona más amplia de caderas y glúteos.',
    tip: 'Busca el punto más ancho de la silueta, que suele estar bajo el hueso de la cadera.',
  },
];
