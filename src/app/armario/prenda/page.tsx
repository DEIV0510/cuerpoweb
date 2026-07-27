import type { Metadata } from 'next';
import { GarmentFlow } from '@/components/garment/GarmentFlow';

export const metadata: Metadata = {
  title: 'Combinar una prenda',
  description:
    'Sube la foto de una prenda, toma su color y descubre con qué colores y prendas combinarla, según tu silueta.',
  robots: { index: false, follow: true },
};

export default function ArmarioPrendaPage() {
  return <GarmentFlow />;
}
