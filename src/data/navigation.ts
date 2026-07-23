/** Datos generales del sitio. */
export const SITE = {
  brand: 'Alma e Imagen',
  product: 'Analizador de silueta',
  description:
    'Descubre tu silueta predominante a partir de tres medidas y recibe una guía de prendas, cortes y detalles que crean equilibrio visual.',
  disclaimer:
    'Este análisis es una orientación de imagen y vestuario. No es una evaluación médica ni una valoración de salud.',
} as const;

export interface NavLink {
  href: string;
  label: string;
}

/** Enlaces principales del encabezado. */
export const MAIN_NAV: NavLink[] = [
  { href: '/', label: 'Inicio' },
  { href: '/como-medirse', label: 'Cómo medirse' },
  { href: '/analisis', label: 'Analizar' },
  { href: '/proporciones', label: '8 cabezas' },
  { href: '/metodologia', label: 'Metodología' },
  { href: '/privacidad', label: 'Privacidad' },
];

/** Enlaces del pie de página. */
export const FOOTER_NAV: NavLink[] = [
  { href: '/como-medirse', label: 'Cómo medirse' },
  { href: '/analisis', label: 'Realizar el análisis' },
  { href: '/resultado', label: 'Mi resultado' },
  { href: '/proporciones', label: 'Técnica de las 8 cabezas' },
  { href: '/metodologia', label: 'Metodología' },
  { href: '/privacidad', label: 'Privacidad y datos' },
];
