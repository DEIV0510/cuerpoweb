import type { StyleAnswers } from '@/lib/wardrobe/style-profile';

/** Una opción de una pregunta de la encuesta. */
export interface SurveyOption {
  value: string;
  label: string;
  /** Aclaración breve opcional. */
  hint?: string;
}

/** Una pregunta de la encuesta de estilo. */
export interface SurveyQuestion {
  /** Campo de `StyleAnswers` que responde. */
  field: keyof StyleAnswers;
  title: string;
  /** Permite elegir varias opciones (solo para ocasiones). */
  multiple?: boolean;
  options: SurveyOption[];
}

/**
 * Encuesta de estilo, una pregunta por pantalla.
 *
 * El orden aquí es el orden en el que se muestran los pasos.
 */
export const STYLE_SURVEY: SurveyQuestion[] = [
  {
    field: 'satisfaction',
    title: '¿Qué tan a gusto estás con tu armario?',
    options: [
      { value: 'satisfied', label: 'A gusto, buscando nuevas ideas' },
      { value: 'could-be-better', label: 'Bien, pero podría mejorar' },
      { value: 'need-change', label: 'Con ganas de renovarlo' },
    ],
  },
  {
    field: 'occasions',
    title: '¿Para qué ocasiones necesitas outfits?',
    multiple: true,
    options: [
      { value: 'office', label: 'Oficina' },
      { value: 'daily', label: 'Ropa diaria' },
      { value: 'home', label: 'Trabajar desde casa' },
      { value: 'date', label: 'Salidas y citas' },
      { value: 'events', label: 'Fiestas o eventos' },
    ],
  },
  {
    field: 'archetype',
    title: '¿Qué estilo te llama más la atención?',
    options: [
      { value: 'classic', label: 'Elegante y clásico' },
      { value: 'minimal', label: 'Minimalista y chic' },
      { value: 'casual', label: 'Relajado y casual' },
      { value: 'eclectic', label: 'Una mezcla de todo' },
    ],
  },
  {
    field: 'tone',
    title: 'Cuando te vistes, quieres que tu estilo…',
    options: [
      { value: 'statement', label: 'Llame la atención' },
      { value: 'discreet', label: 'Transmita una elegancia discreta' },
    ],
  },
  {
    field: 'combining',
    title: '¿Te resulta fácil combinar prendas y crear outfits?',
    options: [
      { value: 'very-easy', label: 'Muy fácil' },
      { value: 'easy', label: 'Sí, bastante fácil' },
      { value: 'tricky', label: 'Es un poco complicado' },
      { value: 'hard', label: 'Me resulta muy difícil' },
    ],
  },
  {
    field: 'nothingToWear',
    title: '¿Cada cuánto sientes que «no tienes nada que ponerte»?',
    options: [
      { value: 'daily', label: 'Casi todas las mañanas' },
      { value: 'weekly', label: 'Varias veces por semana' },
      { value: 'events-only', label: 'Solo para eventos importantes' },
      { value: 'never', label: 'Casi nunca' },
    ],
  },
];
