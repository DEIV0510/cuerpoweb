import type { Metadata } from 'next';
import { ResultView } from '@/components/results/ResultView';

export const metadata: Metadata = {
  title: 'Mi resultado',
  description:
    'Consulta tu silueta predominante, la explicación del cálculo y las recomendaciones de vestuario.',
  robots: { index: false, follow: true },
};

export default function ResultadoPage() {
  return <ResultView />;
}
