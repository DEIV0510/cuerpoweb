import type { BodyShapeProfile, BodyShapeType } from '@/types/body-shape';

/**
 * Contenido editorial de cada silueta.
 *
 * Ninguna silueta es mejor ni peor que otra: son categorías orientativas que
 * ayudan a elegir prendas con criterio.
 */
export const BODY_SHAPE_PROFILES: Record<BodyShapeType, BodyShapeProfile> = {
  hourglass: {
    id: 'hourglass',
    name: 'Reloj de arena',
    shortName: 'Reloj',
    tagline: 'Proporción equilibrada con cintura muy definida.',
    description:
      'Los contornos de busto y cadera son similares entre sí y la cintura se encuentra notablemente definida respecto a ambos.',
    ruleSummary:
      'Busto y cadera con una diferencia de 5 cm o menos, y una cintura al menos 20 cm menor que ambas medidas.',
    visualObjective:
      'Mantener el equilibrio natural entre la parte superior e inferior y conservar la definición de la cintura.',
    illustration: { bust: 23, waist: 15, hips: 23 },
  },
  rectangle: {
    id: 'rectangle',
    name: 'Rectángulo',
    shortName: 'Rectángulo',
    tagline: 'Línea corporal continua y armónica.',
    description:
      'Busto y cadera son similares entre sí y la cintura tiene una definición suave, lo que genera una línea vertical continua.',
    ruleSummary:
      'Busto y cadera con una diferencia de 5 cm o menos, y una cintura que no llega a ser 20 cm menor que ambas.',
    visualObjective:
      'Crear puntos de interés y una sensación de mayor definición en el centro de la figura.',
    illustration: { bust: 21, waist: 18, hips: 21 },
  },
  triangle: {
    id: 'triangle',
    name: 'Triángulo',
    alternativeName: 'Pera',
    shortName: 'Triángulo',
    tagline: 'Mayor presencia visual en la zona inferior.',
    description:
      'La cadera tiene mayor presencia que el busto o el torso superior, lo que concentra el volumen en la parte baja de la figura.',
    ruleSummary: 'La cadera supera al busto en más de 5 cm.',
    visualObjective:
      'Llevar parte de la atención hacia la zona superior para generar equilibrio visual.',
    illustration: { bust: 18, waist: 15, hips: 25 },
  },
  'inverted-triangle': {
    id: 'inverted-triangle',
    name: 'Triángulo invertido',
    alternativeName: 'Triángulo superior',
    shortName: 'T. invertido',
    tagline: 'Mayor presencia visual en la zona superior.',
    description:
      'El busto o el torso superior tiene mayor presencia que la cadera, lo que concentra el volumen en la parte alta de la figura.',
    ruleSummary: 'El busto supera a la cadera en más de 5 cm.',
    visualObjective:
      'Agregar movimiento, textura o amplitud visual en la parte inferior para equilibrar la figura.',
    illustration: { bust: 25, waist: 17, hips: 19 },
  },
  oval: {
    id: 'oval',
    name: 'Óvalo',
    alternativeName: 'Redondeada',
    shortName: 'Óvalo',
    tagline: 'Zona media con presencia visual predominante.',
    description:
      'La zona media tiene una presencia visual similar o superior a la de busto y cadera, con una transición muy suave entre las tres medidas.',
    ruleSummary:
      'La cintura iguala o supera a busto y cadera, o bien está a menos de 10 cm de ambas.',
    visualObjective:
      'Crear continuidad vertical, fluidez y puntos focales en rostro, escote, brazos o piernas.',
    illustration: { bust: 22, waist: 23, hips: 21 },
  },
};

/** Orden en el que se presentan las siluetas en la interfaz. */
export const BODY_SHAPE_ORDER: BodyShapeType[] = [
  'hourglass',
  'rectangle',
  'triangle',
  'inverted-triangle',
  'oval',
];

/** Lista de perfiles en el orden de presentación. */
export const BODY_SHAPE_LIST: BodyShapeProfile[] = BODY_SHAPE_ORDER.map(
  (id) => BODY_SHAPE_PROFILES[id],
);

/** Devuelve el perfil de una silueta. */
export function getBodyShapeProfile(id: BodyShapeType): BodyShapeProfile {
  return BODY_SHAPE_PROFILES[id];
}
