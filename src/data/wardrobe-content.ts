import type {
  Occasion,
  StyleArchetype,
} from '@/lib/wardrobe/style-profile';

/** Tipo de prenda, usado para elegir la ilustración. */
export type GarmentType =
  | 'top'
  | 'blouse'
  | 'knit'
  | 'shirt'
  | 'pants'
  | 'jeans'
  | 'wide'
  | 'skirt'
  | 'dress'
  | 'blazer'
  | 'coat'
  | 'cardigan'
  | 'denim-jacket'
  | 'flats'
  | 'heels'
  | 'sneakers'
  | 'bag'
  | 'belt'
  | 'scarf'
  | 'jewelry';

/** Categoría para agrupar el checklist. */
export type GarmentCategory =
  | 'tops'
  | 'bottoms'
  | 'dresses'
  | 'outerwear'
  | 'shoes'
  | 'accessories';

export const CATEGORY_LABELS: Record<GarmentCategory, string> = {
  tops: 'Prendas superiores',
  bottoms: 'Prendas inferiores',
  dresses: 'Vestidos',
  outerwear: 'Chaquetas y abrigos',
  shoes: 'Calzado',
  accessories: 'Accesorios',
};

/** Orden en el que se muestran las categorías. */
export const CATEGORY_ORDER: GarmentCategory[] = [
  'tops',
  'bottoms',
  'dresses',
  'outerwear',
  'shoes',
  'accessories',
];

/** Una prenda básica del armario. */
export interface WardrobeBasic {
  id: string;
  name: string;
  garment: GarmentType;
  category: GarmentCategory;
  /** Ocasiones para las que sirve. */
  occasions: Occasion[];
  /** Arquetipos para los que es imprescindible. */
  essentialFor: StyleArchetype[];
  /** Nota breve de por qué vale la pena tenerla. */
  note: string;
}

/**
 * Lista maestra de básicos de armario.
 *
 * Se filtra por las ocasiones de la persona y se marca como esencial según su
 * arquetipo de estilo. No es una lista de compras cerrada: es una referencia
 * para ver qué se tiene y qué falta.
 */
export const WARDROBE_BASICS: WardrobeBasic[] = [
  // Prendas superiores
  {
    id: 'white-tee',
    name: 'Camiseta blanca',
    garment: 'top',
    category: 'tops',
    occasions: ['daily', 'home', 'date'],
    essentialFor: ['classic', 'minimal', 'casual', 'eclectic'],
    note: 'La base más versátil: combina con todo y funciona sola o bajo una chaqueta.',
  },
  {
    id: 'white-shirt',
    name: 'Camisa blanca',
    garment: 'shirt',
    category: 'tops',
    occasions: ['office', 'daily', 'events'],
    essentialFor: ['classic', 'minimal'],
    note: 'Aporta pulcritud al instante; por dentro o por fuera según tu proporción.',
  },
  {
    id: 'fine-knit',
    name: 'Suéter de punto fino',
    garment: 'knit',
    category: 'tops',
    occasions: ['office', 'daily', 'home'],
    essentialFor: ['classic', 'minimal', 'casual', 'eclectic'],
    note: 'Abriga sin volumen y se ve prolijo dentro del pantalón.',
  },
  {
    id: 'silk-blouse',
    name: 'Blusa de seda o satén',
    garment: 'blouse',
    category: 'tops',
    occasions: ['office', 'date', 'events'],
    essentialFor: ['classic', 'minimal', 'eclectic'],
    note: 'Sube el nivel de un jean o un pantalón sastre en segundos.',
  },
  {
    id: 'striped-tee',
    name: 'Camiseta de rayas',
    garment: 'top',
    category: 'tops',
    occasions: ['daily', 'home', 'date'],
    essentialFor: ['casual', 'eclectic'],
    note: 'Un clásico relajado que da interés sin esfuerzo.',
  },
  // Prendas inferiores
  {
    id: 'straight-jeans',
    name: 'Jean recto',
    garment: 'jeans',
    category: 'bottoms',
    occasions: ['daily', 'home', 'date'],
    essentialFor: ['classic', 'minimal', 'casual', 'eclectic'],
    note: 'El comodín diario; en tono oscuro sirve incluso para salir.',
  },
  {
    id: 'tailored-pants',
    name: 'Pantalón sastre',
    garment: 'pants',
    category: 'bottoms',
    occasions: ['office', 'events', 'date'],
    essentialFor: ['classic', 'minimal'],
    note: 'Estructura y caída limpia para los looks más formales.',
  },
  {
    id: 'wide-pants',
    name: 'Pantalón amplio o palazzo',
    garment: 'wide',
    category: 'bottoms',
    occasions: ['daily', 'office', 'events'],
    essentialFor: ['minimal', 'eclectic'],
    note: 'Movimiento y comodidad con aire elegante.',
  },
  {
    id: 'midi-skirt',
    name: 'Falda midi',
    garment: 'skirt',
    category: 'bottoms',
    occasions: ['office', 'daily', 'date'],
    essentialFor: ['classic', 'minimal', 'eclectic'],
    note: 'Femenina y muy combinable; el largo midi favorece a casi todo el mundo.',
  },
  // Vestidos
  {
    id: 'lbd',
    name: 'Vestido negro',
    garment: 'dress',
    category: 'dresses',
    occasions: ['date', 'events', 'office'],
    essentialFor: ['classic', 'minimal', 'eclectic'],
    note: 'Resuelve una salida o un evento sin pensarlo; cámbialo con accesorios.',
  },
  {
    id: 'print-dress',
    name: 'Vestido midi estampado',
    garment: 'dress',
    category: 'dresses',
    occasions: ['daily', 'date', 'events'],
    essentialFor: ['casual', 'eclectic'],
    note: 'Un solo gesto y estás lista; ideal para el calor y los planes de día.',
  },
  // Chaquetas y abrigos
  {
    id: 'blazer',
    name: 'Blazer',
    garment: 'blazer',
    category: 'outerwear',
    occasions: ['office', 'events', 'date'],
    essentialFor: ['classic', 'minimal', 'eclectic'],
    note: 'Convierte cualquier conjunto en algo pensado; abierto o cerrado.',
  },
  {
    id: 'trench',
    name: 'Gabardina o trench',
    garment: 'coat',
    category: 'outerwear',
    occasions: ['office', 'daily', 'date'],
    essentialFor: ['classic'],
    note: 'Abrigo de entretiempo que estiliza y nunca falla.',
  },
  {
    id: 'cardigan',
    name: 'Cárdigan largo',
    garment: 'cardigan',
    category: 'outerwear',
    occasions: ['daily', 'home', 'office'],
    essentialFor: ['minimal', 'casual'],
    note: 'La tercera prenda cómoda que suma dos líneas verticales.',
  },
  {
    id: 'denim-jacket',
    name: 'Chaqueta vaquera',
    garment: 'denim-jacket',
    category: 'outerwear',
    occasions: ['daily', 'home', 'date'],
    essentialFor: ['casual', 'eclectic'],
    note: 'Relaja un vestido y abriga los días de entretiempo.',
  },
  // Calzado
  {
    id: 'flats',
    name: 'Zapato plano',
    garment: 'flats',
    category: 'shoes',
    occasions: ['office', 'daily', 'home'],
    essentialFor: ['classic', 'minimal', 'casual', 'eclectic'],
    note: 'Comodidad sin renunciar al estilo; bailarina o mocasín.',
  },
  {
    id: 'heels',
    name: 'Tacón elegante',
    garment: 'heels',
    category: 'shoes',
    occasions: ['office', 'date', 'events'],
    essentialFor: ['classic', 'minimal', 'eclectic'],
    note: 'Un tacón cómodo alarga la pierna y eleva cualquier look.',
  },
  {
    id: 'sneakers',
    name: 'Zapatilla blanca',
    garment: 'sneakers',
    category: 'shoes',
    occasions: ['daily', 'home', 'date'],
    essentialFor: ['casual', 'minimal', 'eclectic'],
    note: 'La zapatilla limpia va con jeans, faldas y hasta vestidos.',
  },
  // Accesorios
  {
    id: 'structured-bag',
    name: 'Bolso estructurado',
    garment: 'bag',
    category: 'accessories',
    occasions: ['office', 'date', 'events'],
    essentialFor: ['classic', 'minimal', 'eclectic'],
    note: 'Ordena el look y aporta prolijidad; un tono neutro rinde más.',
  },
  {
    id: 'belt',
    name: 'Cinturón',
    garment: 'belt',
    category: 'accessories',
    occasions: ['office', 'daily', 'date', 'events'],
    essentialFor: ['classic', 'minimal', 'casual', 'eclectic'],
    note: 'Marca la cintura y define dónde empieza la pierna.',
  },
  {
    id: 'scarf',
    name: 'Pañuelo o foulard',
    garment: 'scarf',
    category: 'accessories',
    occasions: ['office', 'daily', 'date'],
    essentialFor: ['classic', 'eclectic'],
    note: 'Un punto de color cerca del rostro que cambia todo el conjunto.',
  },
  {
    id: 'jewelry',
    name: 'Juego de aretes y collar',
    garment: 'jewelry',
    category: 'accessories',
    occasions: ['office', 'daily', 'date', 'events'],
    essentialFor: ['classic', 'minimal', 'casual', 'eclectic'],
    note: 'El detalle final; unos aretes discretos y un collar versátil bastan.',
  },
];

/** Pieza de una cápsula. */
export interface CapsulePiece {
  garment: GarmentType;
  label: string;
}

/** Una cápsula: un outfit completo listo para replicar. */
export interface Capsule {
  id: string;
  name: string;
  occasion: Occasion;
  /** Arquetipos a los que pertenece. */
  styles: StyleArchetype[];
  tone: 'statement' | 'discreet' | 'both';
  pieces: CapsulePiece[];
  why: string;
}

/**
 * Cápsulas de outfits.
 *
 * Cada una es una combinación ya resuelta, etiquetada por estilo, ocasión y
 * tono. Se filtran según el perfil de la persona.
 */
export const CAPSULES: Capsule[] = [
  {
    id: 'office-classic',
    name: 'Oficina impecable',
    occasion: 'office',
    styles: ['classic', 'minimal'],
    tone: 'discreet',
    pieces: [
      { garment: 'blazer', label: 'Blazer estructurado' },
      { garment: 'blouse', label: 'Blusa de seda' },
      { garment: 'pants', label: 'Pantalón sastre' },
      { garment: 'heels', label: 'Tacón cómodo' },
      { garment: 'bag', label: 'Bolso estructurado' },
    ],
    why: 'Estructura y caída limpia: transmite seriedad sin esfuerzo.',
  },
  {
    id: 'office-eclectic',
    name: 'Oficina con carácter',
    occasion: 'office',
    styles: ['eclectic', 'classic'],
    tone: 'statement',
    pieces: [
      { garment: 'blazer', label: 'Blazer en color' },
      { garment: 'knit', label: 'Punto fino por dentro' },
      { garment: 'wide', label: 'Pantalón amplio' },
      { garment: 'heels', label: 'Tacón con detalle' },
      { garment: 'scarf', label: 'Pañuelo al cuello' },
    ],
    why: 'Un color o un pañuelo dan personalidad manteniendo la elegancia.',
  },
  {
    id: 'daily-minimal',
    name: 'Día a día depurado',
    occasion: 'daily',
    styles: ['minimal', 'classic'],
    tone: 'discreet',
    pieces: [
      { garment: 'knit', label: 'Punto fino' },
      { garment: 'jeans', label: 'Jean recto' },
      { garment: 'flats', label: 'Mocasín o bailarina' },
      { garment: 'bag', label: 'Bolso mediano' },
    ],
    why: 'Pocas piezas bien elegidas: cómodo y siempre correcto.',
  },
  {
    id: 'daily-casual',
    name: 'Día relajado',
    occasion: 'daily',
    styles: ['casual', 'eclectic'],
    tone: 'both',
    pieces: [
      { garment: 'top', label: 'Camiseta de rayas' },
      { garment: 'jeans', label: 'Jean recto' },
      { garment: 'denim-jacket', label: 'Chaqueta vaquera' },
      { garment: 'sneakers', label: 'Zapatilla blanca' },
    ],
    why: 'Comodidad total con un toque de estilo sin pensarlo.',
  },
  {
    id: 'home-comfort',
    name: 'Trabajar desde casa',
    occasion: 'home',
    styles: ['casual', 'minimal'],
    tone: 'discreet',
    pieces: [
      { garment: 'knit', label: 'Punto suave' },
      { garment: 'wide', label: 'Pantalón cómodo' },
      { garment: 'cardigan', label: 'Cárdigan largo' },
      { garment: 'flats', label: 'Zapato plano' },
    ],
    why: 'Cómodo para el día pero listo para una videollamada.',
  },
  {
    id: 'date-classic',
    name: 'Cita elegante',
    occasion: 'date',
    styles: ['classic', 'minimal'],
    tone: 'discreet',
    pieces: [
      { garment: 'dress', label: 'Vestido negro' },
      { garment: 'blazer', label: 'Blazer o chaqueta corta' },
      { garment: 'heels', label: 'Tacón fino' },
      { garment: 'jewelry', label: 'Aretes con brillo' },
    ],
    why: 'El vestido negro resuelve; los accesorios le dan el tono.',
  },
  {
    id: 'date-eclectic',
    name: 'Salida con actitud',
    occasion: 'date',
    styles: ['eclectic', 'casual'],
    tone: 'statement',
    pieces: [
      { garment: 'dress', label: 'Vestido estampado' },
      { garment: 'denim-jacket', label: 'Chaqueta vaquera' },
      { garment: 'heels', label: 'Sandalia de tacón' },
      { garment: 'jewelry', label: 'Aretes llamativos' },
    ],
    why: 'Un estampado y un accesorio con presencia llevan la atención a ti.',
  },
  {
    id: 'events-classic',
    name: 'Evento de noche',
    occasion: 'events',
    styles: ['classic', 'minimal', 'eclectic'],
    tone: 'both',
    pieces: [
      { garment: 'dress', label: 'Vestido de evento' },
      { garment: 'heels', label: 'Sandalia de tacón' },
      { garment: 'bag', label: 'Clutch' },
      { garment: 'jewelry', label: 'Aretes de fiesta' },
    ],
    why: 'Un vestido cuidado y buenos accesorios: listo para brillar.',
  },
  {
    id: 'events-eclectic',
    name: 'Fiesta con estilo propio',
    occasion: 'events',
    styles: ['eclectic'],
    tone: 'statement',
    pieces: [
      { garment: 'blouse', label: 'Top satinado' },
      { garment: 'wide', label: 'Pantalón fluido' },
      { garment: 'heels', label: 'Tacón statement' },
      { garment: 'jewelry', label: 'Accesorio protagonista' },
    ],
    why: 'Un conjunto de dos piezas con un accesorio fuerte destaca sin vestido.',
  },
];
