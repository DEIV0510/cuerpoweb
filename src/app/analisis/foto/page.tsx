import type { Metadata } from 'next';
import { PhotoFlow } from '@/components/photo/PhotoFlow';

export const metadata: Metadata = {
  title: 'Estimar mis medidas con una foto',
  description:
    'Sube una foto de cuerpo completo, marca tu estatura y el ancho de tres zonas, y obtén una estimación de tus contornos sin que la imagen salga de tu dispositivo.',
  robots: { index: false, follow: true },
};

export default function AnalisisFotoPage() {
  return <PhotoFlow />;
}
