import type { ColorFamily, ColorSwatch } from '@/lib/garment/color';

/** Tipo de prenda que la persona sube. */
export type GarmentKind = 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory';

export const GARMENT_KINDS: Array<{ kind: GarmentKind; label: string; hint: string }> = [
  { kind: 'top', label: 'Prenda superior', hint: 'Blusa, camiseta, camisa, suéter' },
  { kind: 'bottom', label: 'Prenda inferior', hint: 'Pantalón, jean, falda' },
  { kind: 'dress', label: 'Vestido', hint: 'Vestido o enterizo' },
  { kind: 'outerwear', label: 'Chaqueta o abrigo', hint: 'Blazer, cárdigan, gabardina' },
  { kind: 'shoes', label: 'Calzado', hint: 'Zapatos, botas, sandalias' },
  { kind: 'accessory', label: 'Accesorio', hint: 'Bolso, cinturón, pañuelo' },
];

/** Neutros que combinan con casi todo. */
export const NEUTRAL_SWATCHES: ColorSwatch[] = [
  { name: 'Blanco', hex: '#F4F1EC' },
  { name: 'Negro', hex: '#1E1E1E' },
  { name: 'Gris', hex: '#9AA0A6' },
  { name: 'Beige', hex: '#D9C3A9' },
  { name: 'Azul índigo', hex: '#3A4A6B' },
];

/** Acentos curados que combinan con cada familia de color. */
export const ACCENT_SWATCHES: Record<ColorFamily, ColorSwatch[]> = {
  black: [
    { name: 'Blanco', hex: '#F4F1EC' },
    { name: 'Camel', hex: '#C19A6B' },
    { name: 'Rojo', hex: '#C0392B' },
  ],
  white: [
    { name: 'Azul marino', hex: '#2A3A5B' },
    { name: 'Camel', hex: '#C19A6B' },
    { name: 'Verde oliva', hex: '#6B7A4F' },
  ],
  gray: [
    { name: 'Rosa', hex: '#E38FB0' },
    { name: 'Burdeos', hex: '#6E1E2E' },
    { name: 'Azul', hex: '#3A5B9B' },
  ],
  beige: [
    { name: 'Blanco', hex: '#F4F1EC' },
    { name: 'Verde oliva', hex: '#6B7A4F' },
    { name: 'Azul marino', hex: '#2A3A5B' },
  ],
  red: [
    { name: 'Azul índigo', hex: '#3A4A6B' },
    { name: 'Rosa palo', hex: '#E7C4CC' },
    { name: 'Camel', hex: '#C19A6B' },
  ],
  coral: [
    { name: 'Blanco', hex: '#F4F1EC' },
    { name: 'Azul', hex: '#3A5B9B' },
    { name: 'Denim', hex: '#3A4A6B' },
  ],
  yellow: [
    { name: 'Azul marino', hex: '#2A3A5B' },
    { name: 'Blanco', hex: '#F4F1EC' },
    { name: 'Gris', hex: '#9AA0A6' },
  ],
  green: [
    { name: 'Beige', hex: '#D9C3A9' },
    { name: 'Mostaza', hex: '#C9A227' },
    { name: 'Terracota', hex: '#B5623C' },
  ],
  teal: [
    { name: 'Blanco', hex: '#F4F1EC' },
    { name: 'Coral', hex: '#E8896B' },
    { name: 'Beige', hex: '#D9C3A9' },
  ],
  blue: [
    { name: 'Blanco', hex: '#F4F1EC' },
    { name: 'Camel', hex: '#C19A6B' },
    { name: 'Coral', hex: '#E8896B' },
  ],
  purple: [
    { name: 'Gris', hex: '#9AA0A6' },
    { name: 'Blanco', hex: '#F4F1EC' },
    { name: 'Verde salvia', hex: '#8AA07C' },
  ],
  pink: [
    { name: 'Gris', hex: '#9AA0A6' },
    { name: 'Denim', hex: '#3A4A6B' },
    { name: 'Verde oliva', hex: '#6B7A4F' },
  ],
};

/** Nota de combinación de color por familia. */
export const COLOR_NOTE: Record<'neutral' | 'color', string> = {
  neutral:
    'Es un neutro: combina con casi todo, así que puedes atreverte con el color en el resto del look.',
  color:
    'Apóyalo en neutros para un look seguro, o súmale uno de los acentos para darle intención.',
};

/** Qué categorías conviene combinar con cada tipo de prenda. */
export const PAIR_TARGETS: Record<GarmentKind, GarmentKind[]> = {
  top: ['bottom', 'outerwear', 'shoes'],
  bottom: ['top', 'outerwear', 'shoes'],
  dress: ['outerwear', 'shoes', 'accessory'],
  outerwear: ['top', 'bottom', 'shoes'],
  shoes: ['top', 'bottom', 'dress'],
  accessory: ['top', 'dress', 'outerwear'],
};

/** Etiqueta de cada categoría cuando aparece como "combínalo con…". */
export const TARGET_LABELS: Record<GarmentKind, string> = {
  top: 'Una prenda superior',
  bottom: 'Una prenda inferior',
  dress: 'Un vestido',
  outerwear: 'Una chaqueta o abrigo',
  shoes: 'Un calzado',
  accessory: 'Un accesorio',
};

/** Sugerencia genérica por categoría, cuando no hay silueta guardada. */
export const GENERIC_SUGGESTIONS: Record<GarmentKind, string> = {
  top: 'Una blusa o camiseta de línea limpia en un tono neutro.',
  bottom: 'Un pantalón recto o una falda midi en un tono que combine.',
  dress: 'Un vestido sencillo que puedas transformar con capas.',
  outerwear: 'Un blazer o cárdigan abierto que sume una línea vertical.',
  shoes: 'Un zapato plano o de tacón cómodo en tono neutro.',
  accessory: 'Un bolso estructurado y un cinturón para marcar la cintura.',
};
