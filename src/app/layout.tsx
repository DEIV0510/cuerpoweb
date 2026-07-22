import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SITE } from '@/data/navigation';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.product} · ${SITE.brand}`,
    template: `%s · ${SITE.brand}`,
  },
  description: SITE.description,
  applicationName: `${SITE.product} · ${SITE.brand}`,
  authors: [{ name: SITE.brand }],
  keywords: [
    'silueta corporal',
    'tipo de cuerpo',
    'asesoría de imagen',
    'busto cintura cadera',
    'Alma e Imagen',
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    title: `${SITE.product} · ${SITE.brand}`,
    description: SITE.description,
    siteName: SITE.brand,
  },
};

export const viewport: Viewport = {
  themeColor: '#f8f5f1',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${cormorant.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand focus:px-5 focus:py-3 focus:text-white"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
