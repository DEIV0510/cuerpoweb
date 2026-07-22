import type { MetadataRoute } from 'next';

/** Manifiesto PWA: permite instalar la aplicación desde el navegador. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Alma e Imagen · Analizador de silueta',
    short_name: 'Mi silueta',
    description:
      'Descubre tu silueta predominante con tres medidas y recibe una guía de prendas que crean equilibrio visual.',
    lang: 'es',
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#FFF6FA',
    theme_color: '#ED2A8C',
    categories: ['lifestyle', 'shopping', 'education'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Analizar mis medidas',
        short_name: 'Analizar',
        url: '/analisis',
      },
      {
        name: 'Cómo medirse',
        short_name: 'Medirme',
        url: '/como-medirse',
      },
    ],
  };
}
