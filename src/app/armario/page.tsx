import type { Metadata } from 'next';
import { WardrobeSurveyScreen } from '@/components/wardrobe/WardrobeSurveyScreen';

export const metadata: Metadata = {
  title: 'Mi armario',
  description:
    'Responde una encuesta corta de estilo y arma tu perfil, tu checklist de básicos y tus cápsulas de outfits.',
};

export default function ArmarioPage() {
  return <WardrobeSurveyScreen />;
}
