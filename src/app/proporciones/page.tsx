import type { Metadata } from 'next';
import { ProportionsScreen } from '@/components/proportions/ProportionsScreen';

export const metadata: Metadata = {
  title: 'Técnica de las 8 cabezas',
  description:
    'Mide tu proporción vertical con la técnica de las 8 cabezas y descubre qué tiro de pantalón, largo de chaqueta y altura de zapato te acompañan mejor.',
};

export default function ProporcionesPage() {
  return <ProportionsScreen />;
}
