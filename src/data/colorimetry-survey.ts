import type { ColorimetryAnswers } from '@/lib/color-analysis/season';

export interface ColorimetryOption {
  value: string;
  label: string;
  hint?: string;
}

export interface ColorimetryQuestion {
  field: keyof ColorimetryAnswers;
  title: string;
  help?: string;
  options: ColorimetryOption[];
}

/**
 * Cuestionario de colorimetría, una pregunta por pantalla.
 * Busca luz natural: junto a una ventana se aprecian mejor los tonos.
 */
export const COLORIMETRY_SURVEY: ColorimetryQuestion[] = [
  {
    field: 'veins',
    title: '¿De qué color se ven las venas de tu muñeca?',
    help: 'Mira la cara interna de tu muñeca con luz natural.',
    options: [
      { value: 'cool', label: 'Azuladas o moradas' },
      { value: 'warm', label: 'Verdosas' },
      { value: 'unsure', label: 'No lo distingo bien' },
    ],
  },
  {
    field: 'metal',
    title: 'Junto a tu rostro, ¿qué metal te ilumina más?',
    options: [
      { value: 'gold', label: 'El oro (dorado)' },
      { value: 'silver', label: 'La plata (plateado)' },
      { value: 'both', label: 'Los dos por igual' },
    ],
  },
  {
    field: 'sun',
    title: 'Cuando te da el sol, tu piel…',
    options: [
      { value: 'tan', label: 'Se broncea con facilidad' },
      { value: 'burn', label: 'Se enrojece o se quema' },
      { value: 'both', label: 'Un poco de las dos' },
    ],
  },
  {
    field: 'hair',
    title: 'Tu color de cabello natural (sin tinte) es…',
    options: [
      { value: 'light', label: 'Rubio o castaño claro' },
      { value: 'medium', label: 'Castaño medio' },
      { value: 'deep', label: 'Castaño oscuro o negro' },
      { value: 'red', label: 'Pelirrojo o cobrizo' },
    ],
  },
  {
    field: 'eyes',
    title: '¿De qué color son tus ojos?',
    options: [
      { value: 'light', label: 'Claros: azul, verde o gris' },
      { value: 'hazel', label: 'Miel o avellana' },
      { value: 'deep', label: 'Marrón oscuro o negro' },
    ],
  },
  {
    field: 'white',
    title: 'Junto a tu cara, ¿qué blanco te sienta mejor?',
    options: [
      { value: 'pure', label: 'Blanco puro y brillante' },
      { value: 'cream', label: 'Blanco crema o marfil' },
      { value: 'both', label: 'Los dos me sientan' },
    ],
  },
  {
    field: 'intensity',
    title: 'Los colores muy intensos y vivos…',
    options: [
      { value: 'bright', label: 'Me favorecen y me iluminan' },
      { value: 'soft', label: 'Me apagan; prefiero los suaves' },
      { value: 'depends', label: 'Depende del color' },
    ],
  },
];
