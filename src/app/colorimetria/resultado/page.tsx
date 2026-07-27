import type { Metadata } from 'next';
import { ColorimetryResultView } from '@/components/colorimetry/ColorimetryResultView';

export const metadata: Metadata = {
  title: 'Mi colorimetría',
  description: 'Tu estación de color, tu paleta, tus neutros y el metal que te favorece.',
  robots: { index: false, follow: true },
};

export default function ColorimetriaResultadoPage() {
  return <ColorimetryResultView />;
}
