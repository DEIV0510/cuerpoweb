import type { Metadata } from 'next';
import { ColorimetrySurveyScreen } from '@/components/colorimetry/ColorimetrySurveyScreen';

export const metadata: Metadata = {
  title: 'Colorimetría',
  description:
    'Descubre tu estación de color (primavera, verano, otoño o invierno) y la paleta que más te favorece, con un cuestionario guiado.',
};

export default function ColorimetriaPage() {
  return <ColorimetrySurveyScreen />;
}
