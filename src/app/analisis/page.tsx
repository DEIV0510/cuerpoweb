import type { Metadata } from 'next';
import { AnalysisScreen } from '@/components/measurements/AnalysisScreen';

export const metadata: Metadata = {
  title: 'Analizar mis medidas',
  description:
    'Registra tu contorno de busto, cintura y cadera paso a paso y calcula tu silueta predominante.',
};

export default function AnalisisPage() {
  return <AnalysisScreen />;
}
