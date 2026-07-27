import type { ColorSwatch } from '@/lib/garment/color';
import type { Season } from '@/lib/color-analysis/season';

/** Ficha editorial de cada estación de color. */
export interface SeasonProfile {
  id: Season;
  name: string;
  tagline: string;
  description: string;
  /** Resumen de subtono, profundidad y croma. */
  summary: string;
  /** Colores que más te favorecen. */
  palette: ColorSwatch[];
  /** Neutros que mejor te sientan. */
  neutrals: ColorSwatch[];
  /** Metal que te ilumina. */
  metal: string;
  /** Colores para usar con cuidado o lejos del rostro. */
  careful: string;
  /** Consejos de uso. */
  tips: string[];
}

export const SEASON_PROFILES: Record<Season, SeasonProfile> = {
  spring: {
    id: 'spring',
    name: 'Primavera',
    tagline: 'Cálida, clara y luminosa.',
    description:
      'Tu subtono es cálido y tu colorido es claro y vivo. Te favorecen los colores frescos, luminosos y con un punto dorado, que iluminan tu rostro.',
    summary: 'Subtono cálido · colorido claro · colores vivos',
    palette: [
      { name: 'Coral', hex: '#FF7F58' },
      { name: 'Durazno', hex: '#FFB07C' },
      { name: 'Amarillo cálido', hex: '#F4C430' },
      { name: 'Verde manzana', hex: '#8DB600' },
      { name: 'Turquesa claro', hex: '#4FC3C7' },
      { name: 'Coral rosado', hex: '#F88379' },
      { name: 'Azul cielo', hex: '#7EC8E3' },
      { name: 'Verde menta', hex: '#8FD9A8' },
    ],
    neutrals: [
      { name: 'Marfil', hex: '#F4E9D8' },
      { name: 'Camel claro', hex: '#D2A679' },
      { name: 'Beige cálido', hex: '#E3C6A0' },
    ],
    metal: 'Dorado',
    careful:
      'El negro puro y los grises fríos tienden a apagarte; si los usas, mejor lejos del rostro.',
    tips: [
      'Lleva tus colores cálidos cerca de la cara: blusas, pañuelos y escotes.',
      'El dorado te ilumina más que el plateado en accesorios.',
      'Si necesitas un oscuro, prueba el marrón chocolate o el azul marino suave antes que el negro.',
    ],
  },
  summer: {
    id: 'summer',
    name: 'Verano',
    tagline: 'Fría, clara y suave.',
    description:
      'Tu subtono es frío y tu colorido es suave y luminoso. Te favorecen los tonos apagados, empolvados y con un velo frío, elegantes y serenos.',
    summary: 'Subtono frío · colorido claro · colores suaves',
    palette: [
      { name: 'Rosa palo', hex: '#E7B9C7' },
      { name: 'Azul empolvado', hex: '#8CA6C4' },
      { name: 'Lavanda', hex: '#B9A7D6' },
      { name: 'Verde salvia', hex: '#9CB4A0' },
      { name: 'Malva', hex: '#B784A7' },
      { name: 'Azul grisáceo', hex: '#6E8CA0' },
      { name: 'Rosa frambuesa suave', hex: '#C76B84' },
      { name: 'Gris perla', hex: '#C9CCD1' },
    ],
    neutrals: [
      { name: 'Gris', hex: '#9AA0A6' },
      { name: 'Azul marino suave', hex: '#3E4A63' },
      { name: 'Blanco frío', hex: '#F1F3F5' },
    ],
    metal: 'Plateado',
    careful:
      'El naranja y los amarillos cálidos te endurecen; el negro intenso suele sentar mejor como gris o azul marino.',
    tips: [
      'Prioriza los tonos empolvados y con bruma antes que los muy vivos.',
      'El plateado y el oro blanco te favorecen más que el dorado cálido.',
      'Combina tonos de valor parecido para un look armónico y suave.',
    ],
  },
  autumn: {
    id: 'autumn',
    name: 'Otoño',
    tagline: 'Cálida, profunda y terrosa.',
    description:
      'Tu subtono es cálido y tu colorido es profundo y suave. Te favorecen los tonos terrosos, especiados y con riqueza, que aportan calidez a tu rostro.',
    summary: 'Subtono cálido · colorido profundo · colores suaves',
    palette: [
      { name: 'Terracota', hex: '#B5623C' },
      { name: 'Mostaza', hex: '#C9A227' },
      { name: 'Verde oliva', hex: '#6B7A2F' },
      { name: 'Teja', hex: '#A63A24' },
      { name: 'Verde petróleo', hex: '#20655F' },
      { name: 'Caqui', hex: '#8A7B4F' },
      { name: 'Naranja quemado', hex: '#C1440E' },
      { name: 'Berenjena cálida', hex: '#5C3A3A' },
    ],
    neutrals: [
      { name: 'Chocolate', hex: '#4B3621' },
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Crema', hex: '#F0E6D2' },
    ],
    metal: 'Dorado',
    careful:
      'El fucsia frío, el negro puro y los pasteles fríos compiten con tu calidez; úsalos con cuidado.',
    tips: [
      'Los tonos especiados y terrosos son tu territorio: aprovéchalos cerca del rostro.',
      'El dorado envejecido y el bronce te sientan de maravilla.',
      'Si buscas un oscuro, el chocolate o el verde botella superan al negro.',
    ],
  },
  winter: {
    id: 'winter',
    name: 'Invierno',
    tagline: 'Fría, profunda e intensa.',
    description:
      'Tu subtono es frío y tu colorido es profundo y contrastado. Te favorecen los colores intensos, saturados y con contraste, además del blanco y el negro puros.',
    summary: 'Subtono frío · colorido profundo · colores intensos',
    palette: [
      { name: 'Fucsia', hex: '#D6207E' },
      { name: 'Azul real', hex: '#1F44B0' },
      { name: 'Rojo cereza', hex: '#B01030' },
      { name: 'Esmeralda', hex: '#1E6B52' },
      { name: 'Morado intenso', hex: '#5B2A86' },
      { name: 'Vino', hex: '#6E1E2E' },
      { name: 'Turquesa vivo', hex: '#008C99' },
      { name: 'Blanco puro', hex: '#FFFFFF' },
    ],
    neutrals: [
      { name: 'Negro', hex: '#1E1E1E' },
      { name: 'Blanco', hex: '#FFFFFF' },
      { name: 'Gris marengo', hex: '#4A4E54' },
    ],
    metal: 'Plateado',
    careful:
      'El beige y el camel cálidos, la mostaza y el naranja tienden a apagarte; llévalos lejos del rostro.',
    tips: [
      'El contraste es tu aliado: combina claros y oscuros con decisión.',
      'El blanco y el negro puros, que a muchas personas endurecen, a ti te sientan.',
      'El plateado te ilumina más que el dorado.',
    ],
  },
};

/** Lista de estaciones en orden de presentación. */
export const SEASON_LIST: SeasonProfile[] = [
  SEASON_PROFILES.spring,
  SEASON_PROFILES.summer,
  SEASON_PROFILES.autumn,
  SEASON_PROFILES.winter,
];

/** Devuelve la ficha de una estación. */
export function getSeasonProfile(season: Season): SeasonProfile {
  return SEASON_PROFILES[season];
}
