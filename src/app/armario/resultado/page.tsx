import type { Metadata } from 'next';
import { WardrobeResultView } from '@/components/wardrobe/WardrobeResultView';

export const metadata: Metadata = {
  title: 'Mi armario',
  description:
    'Tu perfil de estilo, el checklist de básicos que te faltan y tus cápsulas de outfits.',
  robots: { index: false, follow: true },
};

export default function ArmarioResultadoPage() {
  return <WardrobeResultView />;
}
