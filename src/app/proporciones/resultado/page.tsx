import type { Metadata } from 'next';
import { ProportionsResultView } from '@/components/proportions/ProportionsResultView';

export const metadata: Metadata = {
  title: 'Mi proporción vertical',
  description:
    'Resultado de la técnica de las 8 cabezas: torso, tiro y piernas, con las prendas que mejor acompañan tu proporción.',
  robots: { index: false, follow: true },
};

export default function ProporcionesResultadoPage() {
  return <ProportionsResultView />;
}
